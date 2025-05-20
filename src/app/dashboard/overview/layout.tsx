import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';

export default function OverViewLayout({
  events,
  stats,
  pie_stats,
  bar_stats,
  area_stats,
  upload,
  children
}: {
  events: React.ReactNode;
  stats: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  upload: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Serkhet - Security Dashboard
          </h2>
        </div>
        {stats}
        {/* {children} */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{events}</div>
          {/* <div className='col-span-4 md:col-span-3'>{upload}</div> */}
        </div>
      </div>
    </PageContainer>
  );
}