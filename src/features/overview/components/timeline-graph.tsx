'use client';

import { format, parseISO } from 'date-fns';
import { IconClock } from '@tabler/icons-react';
import {
  CartesianGrid,
  ScatterChart,
  Legend,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
  ZAxis
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
  [key: string]: any;
};

// Sample data transformation function
const transformDataForTimeline = (data: any): TimelineEvent[] => {
  const allEvents: TimelineEvent[] = [];
  
  // Process file_access events
  if (data.events) {
    data.events.forEach((event: any) => {
      allEvents.push({
        timestamp: event.timestamp,
        event: 'file_access',
        node_name: event.node_name,
        process: event.process,
        details: `Accessed ${event.file}`,
        ...event
      });
    });
  }
  
  // Process module_load events
  if (data.module_load) {
    data.module_load.forEach((event: any) => {
      allEvents.push({
        timestamp: event.timestamp,
        event: 'module_load',
        node_name: event.node_name,
        process: event.process,
        details: `Loaded ${event.args.join(' ')}`,
        ...event
      });
    });
  }
  
  // Process ransomware events
  if (data.ransomware) {
    data.ransomware.forEach((event: any) => {
      allEvents.push({
        timestamp: event.timestamp,
        event: 'ransomware',
        node_name: event.node_name,
        process: event.process,
        details: `Encrypted ${event.file}${event.elevated ? ' (elevated)' : ''}`,
        ...event
      });
    });
  }
  
  // Process privilege_escalation events
  if (data.privilege_escalation) {
    data.privilege_escalation.forEach((event: any) => {
      allEvents.push({
        timestamp: event.timestamp,
        event: 'privilege_escalation',
        node_name: event.node_name,
        process: event.process,
        details: event.uid === 0 ? 'Escalated to root (uid=0)' : `Privilege change: ${event.event}`,
        ...event
      });
    });
  }
  
  // Process user_management events
  if (data.user_management) {
    data.user_management.forEach((event: any) => {
      allEvents.push({
        timestamp: event.timestamp,
        event: 'user_management',
        node_name: event.node_name,
        process: event.process,
        details: `${event.args.join(' ')}`,
        ...event
      });
    });
  }
  
  // Sort all events by timestamp and convert timestamps to numbers
  return allEvents.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ).map(event => ({
    ...event,
    timestampNum: new Date(event.timestamp).getTime(),
    value: EVENT_TYPES.indexOf(event.event) + 1 // Add value for Y-axis positioning
  }));
};

// Import sample data
import sampleData from '../../../../sample_data.json';
const timelineData = transformDataForTimeline(sampleData);

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

// Custom tooltip component for the scatter chart
const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
        <p className="font-medium">{format(parseISO(data.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
        <p className="text-muted-foreground">{data.node_name}</p>
        <div className="mt-2">
          <p><span className="font-medium">Process:</span> {data.process}</p>
          <p><span className="font-medium">Event:</span> {data.event.split('_').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}</p>
          <p><span className="font-medium">Details:</span> {data.details}</p>
        </div>
      </div>
    );
  }
  return null;
};

export function TimelineGraph() {
  // Group events by date for x-axis
  const dateGroups = timelineData.reduce((acc, event) => {
    const date = format(parseISO(event.timestamp), 'yyyy-MM-dd');
    if (!acc.includes(date)) {
      acc.push(date);
    }
    return acc;
  }, [] as string[]);

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
              {24}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-6 sm:px-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[500px] w-full'
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={timelineData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <defs>
                {EVENT_TYPES.map(eventType => (
                  <linearGradient
                    key={eventType}
                    id={`gradient-${eventType}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={EVENT_COLORS[eventType as keyof typeof EVENT_COLORS]}
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="95%"
                      stopColor={EVENT_COLORS[eventType as keyof typeof EVENT_COLORS]}
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis 
                dataKey="timestampNum"
                type="number"
                name="Time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => {
                  try {
                    return format(new Date(value), 'MM/dd HH:mm');
                  } catch {
                    return value;
                  }
                }}
                scale="time"
              />
              <YAxis 
                dataKey="event"
                type="category"
                name="Event Type"
                ticks={EVENT_TYPES}
                tickFormatter={(value: string) => value.split('_').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              />
              <ZAxis range={[100, 100]} />
              <ChartTooltip
                cursor={{ opacity: 0.1 }}
                content={
                  <ChartTooltipContent
                    className='w-[250px]'
                    labelFormatter={(value) => {
                      if (typeof value === 'number') {
                        return format(new Date(value), 'MMM d, yyyy HH:mm:ss');
                      }
                      return value;
                    }}
                  />
                }
              />
              <Legend />
              {EVENT_TYPES.map(eventType => (
                <Scatter
                  key={eventType}
                  name={eventType.split('_').map((word: string) => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                  data={timelineData.filter(event => event.event === eventType)}
                  dataKey="timestampNum"
                  fill={`url(#gradient-${eventType})`}
                  shape={(props: { cx?: number; cy?: number }) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={8}
                      fill={`url(#gradient-${eventType})`}
                      stroke={EVENT_COLORS[eventType as keyof typeof EVENT_COLORS]}
                      strokeWidth={2}
                      opacity={0.9}
                    />
                  )}
                  legendType="circle"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Events from April 8-10, 2025
              <IconClock className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              {timelineData.length} security events tracked
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
