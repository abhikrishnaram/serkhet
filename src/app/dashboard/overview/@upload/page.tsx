import { FileUpload } from '@/components/file-upload';

export default function UploadPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Upload Events</h2>
      <p className="text-muted-foreground">
        Upload JSON files containing security events data to process and analyze.
      </p>
      <FileUpload />
    </div>
  );
}
