import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { schema } from '@/db';
import { eq } from 'drizzle-orm';

// Helper to parse the uploaded file
async function parseUploadedFile(file: File): Promise<any[]> {
  const text = await file.text();
  return JSON.parse(text);
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

    // Prepare event data
    const eventData = {
      event_type: item.event,
      timestamp: new Date(),
      pid: item.pid || 0,
      process: item.process || '',
      process_path: item.process_path || '',
      node_id: item.node_id || 'unknown',
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
        .onConflictDoUpdate({
          target: schema.nodes.id,
          set: {
            last_seen: new Date(),
            status: 'online'
          }
        });
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
    const [uploadRecord] = await db
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
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
