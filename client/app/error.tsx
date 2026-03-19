'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertCircle className="size-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
      </div>
      <Button 
        onClick={() => reset()} 
        className="gap-2 px-8 py-6 rounded-2xl shadow-lg shadow-primary/20"
      >
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
