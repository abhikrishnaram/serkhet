// ts-nocheck
import { PieGraph } from '@/features/overview/components/pie-graph';
import { db, schema } from '@/db';
import { sql } from 'drizzle-orm';

// Helper function to create an array of the specified length
// function createArrayWithLength(length: number): any[] {
//   return Array(length).fill({});
// }

const eventTypeMapping = {
  // File access events
  file_access: 'fileAccess',
  sensitive_file_access: 'fileAccess',
  
  // Module load events
  module_load: 'moduleLoad',
  insmod_event: 'moduleLoad',
  
  // Ransomware events
  ransomware_event: 'ransomware',
  ransomware: 'ransomware',
  
  // Privilege escalation events
  privilege_escalation: 'privilegeEscalation',
  usermod_event: 'privilegeEscalation',
  
  // User management events
  user_management: 'userManagement',
  setuid_event: 'userManagement',
  setuid: 'userManagement',
  setgid: 'userManagement'
};



export default async function Stats() {
  // Query the database to get counts of events by type
const eventCounts = await db
  .select({
    eventType: schema.events.event_type,
    count: sql`count(*)`,
  })
  .from(schema.events)
  .groupBy(schema.events.event_type);

  // console.log('Event Counts:', eventCounts);

  const counts = {
  fileAccess: 0,
  moduleLoad: 0,
  ransomware: 0,
  privilegeEscalation: 0,
  userManagement: 0
};

// Process events
for (const event of eventCounts) {
  // Ensure count is a number and default to 0 if falsy
  const count = Number(event.count) || 0;
  
  // Look up the category for this event type
  const category = eventTypeMapping[event.eventType];
  
  // If we have a mapping for this event type, increment the appropriate counter
  if (category) {
    counts[category] += count;
  }
}

  // Now you can access the counts
  const { fileAccess: fileAccessCount, moduleLoad: moduleLoadCount, 
        ransomware: ransomwareCount, privilegeEscalation: privilegeEscalationCount, 
        userManagement: userManagementCount } = counts;
  
  return <PieGraph data={{
    file_access: fileAccessCount,
    module_load: moduleLoadCount,
    ransomware: ransomwareCount,
    privilege_escalation: privilegeEscalationCount,
    user_management: userManagementCount
  }} />;
}
