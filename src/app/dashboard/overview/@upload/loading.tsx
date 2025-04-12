import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function UploadLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
        </div>
      </Card>
    </div>
  );
}
