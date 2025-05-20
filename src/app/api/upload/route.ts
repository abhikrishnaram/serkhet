import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { schema } from '@/db';
import { eq } from 'drizzle-orm';

// Helper to parse the uploaded file
// async function parseUploadedFile(file: File): Promise<any[]> {
//   const text = await file.text();
//   console.log('File content:', text);
//   const data = JSON.parse(text);
  
//   // Validate the data structure
//   if (!data.events || !Array.isArray(data.events)) {
//     throw new Error('Invalid file format: Missing events array');
//   }

//   // Validate each event
//   data.events.forEach((event: any, index: number) => {
//     const requiredFields = ['event', 'pid', 'process', 'process_path', 'node_id'];
//     const missingFields = requiredFields.filter(field => !event[field]);
    
//     if (missingFields.length > 0) {
//       throw new Error(`Event at index ${index} is missing required fields: ${missingFields.join(', ')}`);
//     }
//   });

//   return data.events;
// }

async function parseUploadedFile(file: File): Promise<any[]> {
  // This implementation requires the CompressionStream API which is not available in all browsers
  
  const events: any[] = [];
  
  try {
    // Create a readable stream from the file
    const fileStream = file.stream();
    
    // Decompress the stream
    const decompressedStream = fileStream.pipeThrough(new DecompressionStream('gzip'));
    
    // Read the stream as text
    const reader = decompressedStream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Process any remaining data in the buffer
        if (buffer.trim()) {
          try {
            const lineData = JSON.parse(buffer);
            events.push(lineData);
          } catch (error) {
            console.error(`Error parsing final JSON: ${error}`);
          }
        }
        break;
      }
      
      // Decode the chunk and add it to our buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      
      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() || '';
      
      // Process each complete line
      for (const line of lines) {
        if (line.trim()) {
          try {
            const lineData = JSON.parse(line.replaceAll(/\\u0000/g, ''));
            
            // Validate each event
            const requiredFields = ['event', 'pid', 'timestamp', 'tactic_name'];
            const missingFields = requiredFields.filter(field => !lineData[field]);
            
            if (missingFields.length === 0) {
              events.push(lineData);
            } else {
              console.warn(`Event is missing required fields: ${missingFields.join(', ')}`);
            }
          } catch (error) {
            console.error(`Error parsing JSON: ${error}`);
          }
        }
      }
    }
    
    if (events.length === 0) {
      throw new Error('No valid events found in the file');
    }
    
    return events;
  } catch (error) {
    throw new Error(`Failed to process file: ${error}`);
  }
}

// Helper to process and store events
async function processEvents(data: any[], uploadId: number) {
  const events: Array<{
    event_type: string;
    timestamp: Date;
    pid: number;
    process: string;
    process_path: string;
    node_id: string;
    raw_data: any;
  }> = [];
  const nodes = new Set<{
    id: string;
    name: string;
    ip: string;
    status: string;
    last_seen: Date;
    metrics: {
      cpu: number;
      memory: number;
      events: number;
    };
  }>();

  for (const item of data) {
    // Extract node information if present
    if (item.node_id) {
      nodes.add({
        id: item.node_id,
        name: item.node_name || `Node-${item.node_id}`,
        ip: item.node_ip || '0.0.0.0',
        status: 'online',
        last_seen: new Date(),
        metrics: {
          cpu: 0,
          memory: 0,
          events: 0
        }
      });
    }


    const timestampNumber = Number(item?.timestamp) || null;
    if (timestampNumber !== null && !isNaN(timestampNumber)) {
      // If timestamp is in seconds (typically 10 digits), convert to milliseconds
      if (timestampNumber < 10000000000) {
        item.timestamp = new Date(timestampNumber * 1000);
      } else {
        // Already in milliseconds
        item.timestamp = new Date(timestampNumber);
      }
    }

    // Prepare event data
    const eventData = {
      event_type: item.event,
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
      pid: item.pid,
      process: item?.process || item?.comm || "insmod",
      process_path: item?.process_path || item?.path || "unknown",
      node_id: item?.node_id || "node-1",
      raw_data: item
    };

    events.push(eventData);
  }

  // Begin transaction
  return await db.transaction(async (tx) => {
    // Insert nodes
    if (nodes.size > 0) {
      await tx
        .insert(schema.nodes)
        .values(Array.from(nodes) as any[])
        .onConflictDoNothing({});
    }

    // Insert events in batches
    const batchSize = 100;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await tx.insert(schema.events).values(batch);
    }

    // Update upload status
    await tx
      .update(schema.fileUploads)
      .set({
        status: 'completed',
        records_processed: events.length
      })
      .where(eq(schema.fileUploads.id, uploadId));

    return events.length;
  });
}

export async function POST(request: NextRequest) {
  let uploadRecord: { id: number } | undefined;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create upload record
    [uploadRecord] = await db
      .insert(schema.fileUploads)
      .values({
        filename: file.name,
        status: 'processing',
        upload_time: new Date()
      })
      .returning();

    // Parse and process the file
    const data = await parseUploadedFile(file);
    const recordsProcessed = await processEvents(data, uploadRecord.id);

    return NextResponse.json({
      message: 'Upload successful',
      recordsProcessed,
      uploadId: uploadRecord.id
    });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update upload record status to failed
      if (uploadRecord) {
        await db
          .update(schema.fileUploads)
          .set({
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          .where(eq(schema.fileUploads.id, uploadRecord.id));
      }

      // Return appropriate error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to process upload';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
  }
}
