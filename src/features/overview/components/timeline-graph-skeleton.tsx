import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TimelineGraphSkeleton() {
  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>
            <Skeleton className='h-6 w-[220px]' />
          </CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              <Skeleton className='h-4 w-[300px]' />
            </span>
            <span className='@[540px]/card:hidden'>
              <Skeleton className='h-4 w-[120px]' />
            </span>
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>
              <Skeleton className='h-3 w-[80px]' />
            </span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              <Skeleton className='h-8 w-[100px]' />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-6 sm:px-6'>
        {/* Timeline-like shape */}
        <div className='relative aspect-auto h-[500px] w-full'>
          <div className='from-primary/5 to-primary/20 absolute inset-0 rounded-lg bg-gradient-to-t' />
          
          {/* X-axis */}
          <Skeleton className='absolute right-[20px] bottom-[20px] left-[140px] h-[1px]' />
          
          {/* Y-axis */}
          <Skeleton className='absolute top-[20px] bottom-[20px] left-[140px] w-[1px]' />
          
          {/* Y-axis labels */}
          <div className='absolute top-[20px] bottom-[20px] left-0 w-[120px] flex flex-col justify-between py-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-4 w-[100px]' />
            ))}
          </div>
          
          {/* Event dots */}
          <div className='absolute inset-[20px] left-[160px] flex flex-col justify-between'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex justify-between'>
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className='h-4 w-4 rounded-full' />
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className='absolute bottom-0 left-[140px] right-[20px] flex justify-center gap-4 py-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center gap-2'>
                <Skeleton className='h-3 w-3 rounded-full' />
                <Skeleton className='h-3 w-16' />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none'>
              <Skeleton className='h-4 w-[180px]' />
              <Skeleton className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none'>
              <Skeleton className='h-4 w-[150px]' />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
