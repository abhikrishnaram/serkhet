import { db } from '@/db';
import { events } from '@/db/schema';
import { BarGraph } from '@/features/overview/components/bar-graph';
import { desc } from 'drizzle-orm';

export default async function BarStats() {
  // Fetch data from the db using your schema
  const eventData = await db
    .select({
      id: events.id,
      event_type: events.event_type,
      timestamp: events.timestamp,
    })
    .from(events)
    .orderBy(desc(events.timestamp));

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
  eventData.forEach((event) => {
    switch (event.event_type) {
      case 'file_access':
      case 'sensitive_file_access':
        addEvent(event.timestamp.toISOString(), 'file_access');
        break;
      
      case 'module_load':
      case 'insmod_event':
        addEvent(event.timestamp.toISOString(), 'module_load');
        break;
      
      case 'ransomware':
      case 'ransomware_event':
        addEvent(event.timestamp.toISOString(), 'ransomware');
        break;

      case 'privilege_escalation':
      case 'usermod_event':
        addEvent(event.timestamp.toISOString(), 'privilege_escalation');
        break;

      case 'user_management':
      case 'setgid':
      case 'setuid':
      case 'setuid_event':
      case 'setgid_event':
        addEvent(event.timestamp.toISOString(), 'user_management');
        break;

      default:
        console.warn(`Unknown event type: ${event.event_type}`);
    }
  });

  // Convert map to array and sort by date
  const chartData = Array.from(eventsByDate.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log('Chart Data:', chartData);

  return <BarGraph data={chartData} />;
}