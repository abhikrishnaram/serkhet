import { delay } from '@/constants/mock-api';
import { PieGraph } from '@/features/overview/components/pie-graph';

// Import sample data
import sampleData from '../../../../../sample_data.json';

// Use the actual data structure from sample_data.json
const mockData = {
  file_access: sampleData.events.filter(e => e.event === "file_access") || [],
  module_load: sampleData.events.filter(e => e.event === "module_load") || [],
  ransomware: sampleData.events.filter(e => e.event === "ransomware") || [],
  privilege_escalation: sampleData.events.filter(e => e.event === "privilege_escalation") || [],
  user_management: sampleData.events.filter(e => e.event === "user_management") || [],
};

export default async function Stats() {
  await delay(1000);
  return <PieGraph data={mockData} />;
}
