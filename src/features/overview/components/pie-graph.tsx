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

const chartData = [
  { browser: 'chrome', visitors: 275, fill: '#4F46E5' }, // Indigo
  { browser: 'safari', visitors: 200, fill: '#06B6D4' }, // Cyan
  { browser: 'firefox', visitors: 287, fill: '#8B5CF6' }, // Violet
  { browser: 'edge', visitors: 173, fill: '#0EA5E9' }, // Sky
  { browser: 'other', visitors: 190, fill: '#6366F1' } // Indigo (lighter)
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: '#4F46E5' // Indigo
  },
  safari: {
    label: 'Safari',
    color: '#06B6D4' // Cyan
  },
  firefox: {
    label: 'Firefox',
    color: '#8B5CF6' // Violet
  },
  edge: {
    label: 'Edge',
    color: '#0EA5E9' // Sky
  },
  other: {
    label: 'Other',
    color: '#6366F1' // Indigo (lighter)
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Total visitors by browser for the last 6 months
          </span>
          <span className='@[540px]/card:hidden'>Browser distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              <linearGradient id="fillchrome" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#4F46E5' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#4F46E5' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillsafari" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#06B6D4' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#06B6D4' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillfirefox" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#8B5CF6' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#8B5CF6' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="filledge" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#0EA5E9' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#0EA5E9' stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="fillother" x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#6366F1' stopOpacity={0.9} />
                <stop offset='100%' stopColor='#6366F1' stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.browser})`
              }))}
              dataKey='visitors'
              nameKey='browser'
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Visitors
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
          Chrome leads with{' '}
          {((chartData[0].visitors / totalVisitors) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
