'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UploadError() {
  const router = useRouter();

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p>There was a problem loading the upload interface.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
          className="w-fit"
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
