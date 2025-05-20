import { TimelineGraph } from '@/features/overview/components/timeline-graph';
import { db, schema } from '@/db';
import { desc } from 'drizzle-orm';

export default async function AreaStats() {
  // Fetch events from the database
  const events = await db
    .select()
    .from(schema.events)
    .orderBy(desc(schema.events.timestamp));

  return <TimelineGraph events={events} />;
}
