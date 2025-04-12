'use client'
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setIsUploading(true);
    setProgress(10); // Initial progress

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30); // File validation started
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(60); // Upload completed, processing started
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100); // Processing completed
      toast.success(`Successfully processed ${data.recordsProcessed} records`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle size={16} />
        <span>Upload a JSON file containing security events data (Max size: 10MB)</span>
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${isUploading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-4">
            <p>Uploading and processing...</p>
            <Progress value={progress} className="w-full" />
          </div>
        ) : isDragActive ? (
          <p>Drop the file here</p>
        ) : (
          <div className="space-y-4">
            <p>Drag and drop a JSON file here, or click to select</p>
            <Button variant="outline" disabled={isUploading}>
              Select File
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
