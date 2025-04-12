import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RecentEventsSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <Skeleton className='h-6 w-[140px]' /> {/* CardTitle */}
        <Skeleton className='h-4 w-[180px]' /> {/* CardDescription */}
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-start space-x-4'>
              <Skeleton className='h-8 w-8 rounded-full' /> {/* Icon */}
              <div className='flex-1 space-y-2'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-[140px]' /> {/* Title */}
                  <Skeleton className='h-3 w-[60px]' /> {/* Timestamp */}
                </div>
                <Skeleton className='h-4 w-[200px]' /> {/* Description */}
                <div className='flex items-center space-x-2'>
                  <Skeleton className='h-5 w-[100px] rounded-full' /> {/* Node Badge */}
                  <Skeleton className='h-5 w-[60px] rounded-full' /> {/* Severity Badge */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
