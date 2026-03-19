'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FileText, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { uploadPDF } from '@/lib/api';

interface UploadPanelProps {
  onUploadSuccess: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadPDF(file);
      toast.success('File uploaded successfully!');
      onUploadSuccess();
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="h-full border-none bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload your PDF to start chatting with your data.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 pt-0 flex flex-col gap-4">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 group
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50 hover:bg-muted/50'}`}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={{ y: isDragActive ? -10 : 0 }}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className={`size-16 rounded-full flex items-center justify-center transition-colors duration-300
              ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
              <CloudUpload className="size-8" />
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-lg">
                {isDragActive ? 'Drop PDF here' : 'Click or drag PDF to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                Only PDF files are supported
              </p>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-4 overflow-hidden"
            >
              <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          disabled={!file || isUploading}
          onClick={handleUpload}
          className="w-full mt-auto py-6 text-lg font-semibold group relative overflow-hidden"
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Process Document
              <motion.div
                className="absolute inset-0 bg-primary-foreground/10 translate-x-[-100%]"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
