'use client';

import { format, parseISO, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { IconClock } from '@tabler/icons-react';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Bar,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
  Cell
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

// Define the event types we want to display
const EVENT_TYPES = [
  'file_access',
  'module_load',
  'ransomware',
  'privilege_escalation',
  'user_management'
];

// Define colors for each event type (matching bar and pie charts)
const EVENT_COLORS = {
  file_access: '#4F46E5', // Indigo
  module_load: '#06B6D4', // Cyan
  ransomware: '#DC2626', // Red
  privilege_escalation: '#F59E0B', // Amber
  user_management: '#10B981' // Emerald
};

// Define a type for our timeline data
type TimelineEvent = {
  timestamp: string;
  event: string;
  node_name: string;
  process: string;
  details: string;
  timestampNum: number;
  value: number;
  [key: string]: any;
};

// Define a type for database events
type DbEvent = {
  id: number;
  event_type: string;
  timestamp: Date;
  pid: number;
  process: string;
  process_path: string;
  node_id: string;
  raw_data: any;
};

// Transform database events to timeline format
const transformDbEventsForTimeline = (events: DbEvent[]): any[] => {
  if (!events || events.length === 0) {
    return [];
  }
  
  // Helper function to categorize and add events
  const categorizeEvent = (event: DbEvent): { eventType: string, details: string } => {
    let eventType: string;
    let details = '';
    
    // Categorize events based on event_type
    switch (event.event_type) {
      case 'file_access':
      case 'sensitive_file_access':
        eventType = 'file_access';
        details = `Accessed ${event.raw_data?.file || 'unknown file'}`;
        break;
      
      case 'module_load':
      case 'insmod_event':
        eventType = 'module_load';
        details = `Loaded ${Array.isArray(event.raw_data?.args) ? event.raw_data.args.join(' ') : 'module'}`;
        break;
      
      case 'ransomware':
      case 'ransomware_event':
        eventType = 'ransomware';
        details = `Encrypted ${event.raw_data?.file || 'files'}${event.raw_data?.elevated ? ' (elevated)' : ''}`;
        break;

      case 'privilege_escalation':
      case 'usermod_event':
        eventType = 'privilege_escalation';
        details = event.raw_data?.uid === 0 ? 'Escalated to root (uid=0)' : `Privilege change: ${event.raw_data?.event || 'unknown'}`;
        break;

      case 'user_management':
      case 'setgid':
      case 'setuid':
      case 'setuid_event':
      case 'setgid_event':
        eventType = 'user_management';
        details = Array.isArray(event.raw_data?.args) ? event.raw_data.args.join(' ') : 'user management action';
        break;

      default:
        // Try to infer the event type from raw_data
        if (event.raw_data?.file) {
          eventType = 'file_access';
          details = `Accessed ${event.raw_data.file}`;
        } else if (event.raw_data?.args && Array.isArray(event.raw_data.args)) {
          if (event.raw_data.binary?.includes('insmod') || event.raw_data.binary?.includes('modprobe')) {
            eventType = 'module_load';
            details = `Loaded ${event.raw_data.args.join(' ')}`;
          } else if (event.raw_data.binary?.includes('user')) {
            eventType = 'user_management';
            details = `${event.raw_data.args.join(' ')}`;
          } else {
            eventType = 'file_access'; // Default
            details = `Event: ${event.event_type}`;
          }
        } else if (event.raw_data?.elevated !== undefined) {
          eventType = 'ransomware';
          details = `Encrypted ${event.raw_data.file || 'files'}${event.raw_data.elevated ? ' (elevated)' : ''}`;
        } else if (event.raw_data?.uid === 0 || event.raw_data?.gid === 0) {
          eventType = 'privilege_escalation';
          details = event.raw_data.uid === 0 ? 'Escalated to root (uid=0)' : `Privilege change: ${event.raw_data.event || 'unknown'}`;
        } else {
          // Default fallback
          eventType = 'file_access';
          details = `Event: ${event.event_type}`;
          console.warn(`Unknown event type: ${event.event_type}`);
        }
    }
    
    return { eventType, details };
  };
  
  // Process events to categorize them
  const processedEvents = events.map(event => {
    // Extract node_name from raw_data if available
    const node_name = event.raw_data?.node_name || event.node_id;
    
    // Categorize the event
    const { eventType, details } = categorizeEvent(event);
    
    // Format the timestamp as ISO string if it's a Date object
    const timestamp = event.timestamp instanceof Date 
      ? event.timestamp.toISOString() 
      : typeof event.timestamp === 'string' 
        ? event.timestamp 
        : new Date().toISOString();
    
    return {
      timestamp,
      event: eventType,
      node_name,
      process: event.process,
      details,
      timestampNum: new Date(timestamp).getTime(),
      date: format(new Date(timestamp), 'yyyy-MM-dd'),
      ...event.raw_data
    };
  });
  
  // Sort all events by timestamp
  const sortedEvents = processedEvents.sort((a, b) => a.timestampNum - b.timestampNum);
  
  // Get date range
  const startDate = startOfDay(new Date(sortedEvents[0].timestamp));
  const endDate = endOfDay(new Date(sortedEvents[sortedEvents.length - 1].timestamp));
  
  // Generate all days in the range
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Create a map to count events by date and type
  const eventsByDate = allDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayEvents = sortedEvents.filter(event => event.date === dateStr);
    
    // Count events by type
    const counts = EVENT_TYPES.reduce((acc, type) => {
      acc[type] = dayEvents.filter(event => event.event === type).length;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      date: dateStr,
      displayDate: format(day, 'MMM dd'),
      ...counts,
      // Store all events for this day for tooltip access
      _events: dayEvents
    };
  });
  
  return eventsByDate;
};

// Create chart config for Recharts
const chartConfig = {
  timeline: {
    label: 'Security Events Timeline'
  },
  ...EVENT_TYPES.reduce((acc, eventType) => {
    acc[eventType] = {
      label: eventType.split('_').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      color: EVENT_COLORS[eventType as keyof typeof EVENT_COLORS]
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>)
} satisfies ChartConfig;

// Enhanced tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = data.displayDate;
    
    // Get all events for this day
    const dayEvents = data._events || [];
    
    // Count events by type
    const eventCounts = EVENT_TYPES.reduce((acc, type) => {
      acc[type] = dayEvents.filter((event: TimelineEvent) => event.event === type).length;
      return acc;
    }, {} as Record<string, number>);
    
    // Get total events for this day
    const totalEvents = dayEvents.length;
    
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <p className="font-medium">{date}</p>
        <div className="mt-2">
          <p className="font-medium">Total Events: {totalEvents}</p>
          {EVENT_TYPES.map(type => (
            eventCounts[type] > 0 && (
              <div key={type} className="flex items-center justify-between mt-1">
                <span style={{ color: EVENT_COLORS[type as keyof typeof EVENT_COLORS] }}>
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                </span>
                <span className="ml-2 font-medium">{eventCounts[type]}</span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TimelineGraph({ events }: { events: DbEvent[] }) {
  // Transform database events to timeline format
  const timelineData = transformDbEventsForTimeline(events);
  console.log(timelineData)
  // Get total events count
  const totalEvents = events.length;
  
  // Get date range for display
  const dateRange = timelineData.length > 0 ? {
    start: format(new Date(timelineData[0].date), 'MMM d, yyyy'),
    end: format(new Date(timelineData[timelineData.length - 1].date), 'MMM d, yyyy')
  } : { start: '', end: '' };

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Security Events Timeline</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Chronological view of security events across all systems
            </span>
            <span className='@[540px]/card:hidden'>Event timeline</span>
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>
              Total Events
            </span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {totalEvents}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-6 sm:px-6'>
        {timelineData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[500px] w-full'
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={timelineData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 60,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis 
                  dataKey="displayDate"
                  scale="band"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Event Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                
                {EVENT_TYPES.map(eventType => (
                  <Bar 
                    key={eventType}
                    dataKey={eventType}
                    name={eventType.split('_').map((word: string) => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                    stackId="a"
                    fill={EVENT_COLORS[eventType as keyof typeof EVENT_COLORS]}
                  />
                ))}
                
                {/* Add a line for total events per day */}
                <Line
                  type="monotone"
                  dataKey={(data) => {
                    return EVENT_TYPES.reduce((sum, type) => sum + (data[type] || 0), 0);
                  }}
                  name="Total Events"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[500px] items-center justify-center">
            <p className="text-muted-foreground">No events data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {timelineData.length > 0 ? (
                dateRange.start === dateRange.end ? 
                  `Events from ${dateRange.start}` : 
                  `Events from ${dateRange.start} to ${dateRange.end}`
              ) : (
                'No events data'
              )}
              <IconClock className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {totalEvents} security events tracked
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
