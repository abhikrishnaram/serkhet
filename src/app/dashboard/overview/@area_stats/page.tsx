import { delay } from '@/constants/mock-api';
import { TimelineGraph } from '@/features/overview/components/timeline-graph';

export default async function AreaStats() {
  await delay(2000);
  return <TimelineGraph />;
}
