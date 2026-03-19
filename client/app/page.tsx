'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadPanel } from '@/components/upload-panel';
import { ChatPanel } from '@/components/chat-panel';
import { Toaster } from '@/components/ui/sonner';
import { Files, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onUploadSuccess = () => {
    // Optional: add any logic after successful upload
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        
        <div className="flex flex-1 overflow-hidden p-4 gap-4 max-w-[1600px] mx-auto w-full">
          {/* Left Sidebar - Hidden on mobile, controlled by button */}
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50, width: 0 }}
                animate={{ opacity: 1, x: 0, width: '380px' }}
                exit={{ opacity: 0, x: -50, width: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden lg:block h-full shrink-0 overflow-hidden"
              >
                <UploadPanel onUploadSuccess={onUploadSuccess} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex-1 h-full flex flex-col gap-4 relative min-w-0">
            {/* Sidebar toggle button for desktop */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`absolute top-1/2 -left-3 -translate-y-1/2 z-50 size-7 rounded-full bg-background border shadow-md hover:bg-muted transition-transform duration-300 hidden lg:flex
                ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              <ChevronRight className="size-4" />
            </Button>

            <div className="lg:hidden flex items-center gap-2 mb-2 px-2">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={() => {/* Trigger mobile drawer for upload */}}
              >
                <Files className="size-4" />
                Upload PDF
              </Button>
            </div>

            <ChatPanel />
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </main>
  );
}
