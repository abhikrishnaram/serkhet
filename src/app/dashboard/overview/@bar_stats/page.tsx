import { BarGraph } from '@/features/overview/components/bar-graph';
import { promises as fs } from 'fs';
import path from 'path';

export default async function BarStats() {
  // Read and parse the sample data
  const sampleDataPath = path.join(process.cwd(), 'sample_data.json');
  const rawData = await fs.readFile(sampleDataPath, 'utf8');
  const data = JSON.parse(rawData);

  // Process data to get counts by date
  const eventsByDate = new Map();

  // Helper function to add event to the map
  const addEvent = (date: string, type: string) => {
    const key = date.split('T')[0]; // Get just the date part
    if (!eventsByDate.has(key)) {
      eventsByDate.set(key, {
        date: key,
        file_access: 0,
        module_load: 0,
        ransomware: 0,
        privilege_escalation: 0,
        user_management: 0
      });
    }
    const counts = eventsByDate.get(key);
    counts[type] += 1;
  };

  // Count events by type and date
  data.events.forEach((event: any) => {
    switch (event.event) {
      case 'file_access':
        addEvent(event.timestamp, 'file_access');
        break;
      case 'module_load':
        addEvent(event.timestamp, 'module_load');
        break;
      case 'ransomware':
        addEvent(event.timestamp, 'ransomware');
        break;
      case 'privilege_escalation':
        addEvent(event.timestamp, 'privilege_escalation');
        break;
      case 'user_management':
        addEvent(event.timestamp, 'user_management');
        break;
      default:
        console.warn(`Unknown event type: ${event.event}`);
    }
  });
  
  // Convert map to array and sort by date
  const chartData = Array.from(eventsByDate.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return <BarGraph data={chartData} />;
}
