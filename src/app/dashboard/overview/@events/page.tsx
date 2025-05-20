import { db, schema } from '@/db';
import { desc } from 'drizzle-orm';
import { RecentEvents } from '@/features/overview/components/recent-events';

export default async function Events() {
  const data = await db
  .select()
  .from(schema.events)
  .orderBy(desc(schema.events.timestamp)) // Assuming there's a timestamp field
  .limit(10);
  return <RecentEvents data={data} />;
}
