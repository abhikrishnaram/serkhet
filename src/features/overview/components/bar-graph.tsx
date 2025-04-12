'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

interface ChartDataPoint {
  date: string;
  file_access: number;
  module_load: number;
  ransomware: number;
  privilege_escalation: number;
  user_management: number;
}

interface BarGraphProps {
  data: ChartDataPoint[];
}

const chartConfig = {
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

export function BarGraph({ data: chartData }: BarGraphProps) {
  // Calculate totals and find top 2 events
  const totals = React.useMemo(
    () => ({
      file_access: chartData.reduce((acc, curr) => acc + curr.file_access, 0),
      module_load: chartData.reduce((acc, curr) => acc + curr.module_load, 0),
      ransomware: chartData.reduce((acc, curr) => acc + curr.ransomware, 0),
      privilege_escalation: chartData.reduce((acc, curr) => acc + curr.privilege_escalation, 0),
      user_management: chartData.reduce((acc, curr) => acc + curr.user_management, 0)
    }),
    [chartData]
  );

  const topEvents = React.useMemo(() => {
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => key as keyof typeof chartConfig);
  }, [totals]);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Security Event Trends</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Event frequency comparison over time
            </span>
            <span className='@[540px]/card:hidden'>Event frequency</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {topEvents.map((key) => (
            <div
              key={key}
              className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
            >
              <span className='text-muted-foreground text-xs'>
                {chartConfig[key].label}
              </span>
              <span className='text-lg leading-none font-bold sm:text-3xl'>
                {totals[key]?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              {Object.entries(chartConfig).map(([key, config]) => (
                <linearGradient key={key} id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}Bar`} x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='0%'
                    stopColor={config.color}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset='100%'
                    stopColor={config.color}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Legend />
            <ChartTooltip
              cursor={{ opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[200px]'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={chartConfig[key as keyof typeof chartConfig].label}
                fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)}Bar)`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
