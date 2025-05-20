import { db } from "@/db";
import { StatCard } from "./card"
import { gt, sql } from "drizzle-orm";
import { nodes } from "@/db/schema";

// Mock event data structure similar to recent-events.tsx
const mockEventsData = [
  {
    title: 'Unauthorized Access Attempt',
    description: 'Multiple failed login attempts detected',
    timestamp: '2 minutes ago',
    severity: 'high',
    node: 'Gateway-Node-01',
    event_type: 'usermod_event',
    node_id: 'node-001',
    pid: 1234
  },
  {
    title: 'System Update Completed',
    description: 'Security patches successfully installed',
    timestamp: '15 minutes ago',
    severity: 'info',
    node: 'Server-Node-03',
    event_type: 'update_event',
    node_id: 'node-003',
    pid: 2345
  },
  {
    title: 'New Device Connected',
    description: 'IoT device authenticated to network',
    timestamp: '1 hour ago',
    severity: 'info',
    node: 'Edge-Node-05',
    event_type: 'connect_event',
    node_id: 'node-005',
    pid: 3456
  },
  {
    title: 'Anomaly Detected',
    description: 'Unusual traffic pattern identified',
    timestamp: '2 hours ago',
    severity: 'medium',
    node: 'Sensor-Node-02',
    event_type: 'anomaly_event',
    node_id: 'node-002',
    pid: 4567
  },
  {
    title: 'Privilege Escalation',
    description: 'User attempted to gain admin privileges',
    timestamp: '3 hours ago',
    severity: 'high',
    node: 'Workstation-Node-07',
    event_type: 'usermod_event',
    node_id: 'node-007',
    pid: 5678
  },
  {
    title: 'Malware Detected',
    description: 'Potential malicious software identified',
    timestamp: '4 hours ago',
    severity: 'high',
    node: 'Server-Node-04',
    event_type: 'insmod_event',
    node_id: 'node-004',
    pid: 6789
  }
];

// Define critical event types that represent high-priority security incidents
const criticalEventTypes = ['usermod_event', 'insmod_event'];

// Calculate threat score based on event types and their severity
function calculateThreatScore(
  totalEvents: number,
  criticalEvents: number
): { score: number, maxScore: 10 } {
  if (totalEvents === 0) return { score: 0, maxScore: 10 };
  
  // Base score calculation - higher percentage of critical events means higher score
  const criticalRatio = criticalEvents / totalEvents;
  const baseScore = criticalRatio * 10;
  
  // Apply scaling factor based on total events
  let scaleFactor = 1;
  if (totalEvents > 100) scaleFactor = 1.2;
  if (totalEvents > 500) scaleFactor = 1.5;
  
  const finalScore = Math.min(baseScore * scaleFactor, 10);
  return { score: parseFloat(finalScore.toFixed(1)), maxScore: 10 };
}

async function getStatsData() {
  // Use the mock data instead of database queries
  const events = await db.query.events.findMany()
  const totalEvents = events.length;

  // Count critical events based on event_type
  const criticalEvents = events.filter(event =>
    criticalEventTypes.includes(event.event_type)
  ).length;
  
  // Count unique active devices (nodes) based on node_id
  const uniqueNodeIds = new Set(events.map(event => event.node_id));
  const fiveMinutesAgo = sql`now() - interval '5 minutes'`;
  const recentNodesCount = await db
  .select({ count: sql<number>`count(*)` })
  .from(nodes)
  .where(gt(nodes.last_seen, fiveMinutesAgo));

  const activeDevices = recentNodesCount[0].count;

  // Calculate threat score
  const threatScore = calculateThreatScore(totalEvents, criticalEvents);

  return [
    {
      title: "Total Events",
      subtext: "All security events",
      description: "Security events detected",
      value: totalEvents.toString(),
    },
    {
      title: "Critical Alerts",
      subtext: "High priority security incidents",
      description: "Requires immediate attention",
      value: criticalEvents.toString(),
    },
    {
      title: "Active Devices",
      subtext: "Unique devices in network",
      description: "Devices reporting events",
      value: "1",
    },
    {
      title: "Threat Score",
      subtext: "Overall security risk assessment",
      description: "Based on event severity",
      value: `${threatScore.score}/${threatScore.maxScore}`,
    }
  ];
}

export default async function StatsCards() {
  const statsData = await getStatsData();

  return (
    <div className='*:data-[slot=card]:from-primary/5 mb-4 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          subtext={stat.subtext}
          description={stat.description}
          value={stat.value}
          // We're not providing trend information as requested
        />
      ))}
    </div>
  );
}
