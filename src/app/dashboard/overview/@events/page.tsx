import { delay } from '@/constants/mock-api';
import { RecentEvents } from '@/features/overview/components/recent-events';

export default async function Events() {
  await delay(3000);
  return <RecentEvents />;
}
