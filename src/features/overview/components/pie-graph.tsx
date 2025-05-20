'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

interface ChartDataPoint {
  event: string;
  count: number;
  fill: string;
}

const chartData: ChartDataPoint[] = [
  { event: 'file_access', count: 0, fill: '#4F46E5' }, // Indigo
  { event: 'module_load', count: 0, fill: '#06B6D4' }, // Cyan
  { event: 'ransomware', count: 0, fill: '#DC2626' }, // Red
  { event: 'privilege_escalation', count: 0, fill: '#F59E0B' }, // Amber
  { event: 'user_management', count: 0, fill: '#10B981' } // Emerald
];

const chartConfig = {
  count: {
    label: 'Count'
  },
  file_access: {
    label: 'File Access',
    color: '#4F46E5' // Indigo
  },
  module_load: {
    label: 'Module Load',
    color: '#06B6D4' // Cyan
  },
  ransomware: {
    label: 'Ransomware',
    color: '#DC2626' // Red
  },
  privilege_escalation: {
    label: 'Privilege Escalation',
    color: '#F59E0B' // Amber
  },
  user_management: {
    label: 'User Management',
    color: '#10B981' // Emerald
  }
} satisfies ChartConfig;

interface PieGraphProps {
  data?: {
    file_access: number;
    module_load: number;
    ransomware: number;
    privilege_escalation: number;
    user_management: number;
  };
}

export function PieGraph({ data }: PieGraphProps) {
  const processedData = React.useMemo(() => {
    if (!data) return chartData;
    
    return chartData.map(item => ({
      ...item,
      count: data[item.event as keyof typeof data] || 0,
    }));
  }, [data]);

  const totalEvents = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.count, 0);
  }, [processedData]);

  // Find the event with highest count
  const topEvent = React.useMemo(() => {
    return processedData.reduce((max, curr) => 
      curr.count > max.count ? curr : max
    , processedData[0]);
  }, [processedData]);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Security Events Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Distribution of security events by type
          </span>
          <span className='@[540px]/card:hidden'>Event distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-2'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              <linearGradient id="fillfile_access" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#4F46E5' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#4F46E5' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillmodule_load" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#06B6D4' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#06B6D4' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillransomware" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#DC2626' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#DC2626' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillprivilege_escalation" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#F59E0B' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#F59E0B' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="filluser_management" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#10B981' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#10B981' stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={processedData.map((item) => ({
                ...item,
                fill: `url(#fill${item.event})`
              }))}
              dataKey='count'
              nameKey='event'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalEvents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Events
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {chartConfig[topEvent.event as keyof typeof chartConfig].label} leads with{' '}
          {((topEvent.count / totalEvents) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on current security event data
        </div>
      </CardFooter>
    </Card>
  );
}
