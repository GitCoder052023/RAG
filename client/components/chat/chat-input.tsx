'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  hasUploadedFiles: boolean;
  onSendMessage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  hasUploadedFiles,
  onSendMessage,
}) => {
  return (
    <form 
      className="flex w-full items-center gap-3 max-w-4xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onSendMessage();
      }}
    >
      <div className="relative flex-1 group">
        <Input
          placeholder={hasUploadedFiles ? "Ask a question about your document..." : "Please upload a document to start chatting"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="pr-12 py-6 rounded-2xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
          disabled={isLoading || !hasUploadedFiles}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {hasUploadedFiles && (
            <span className="text-[10px] font-bold text-muted-foreground/50 border border-muted-foreground/20 px-1.5 py-0.5 rounded uppercase pointer-events-none hidden sm:inline-block">Enter</span>
          )}
        </div>
      </div>
      <Button 
        type="submit" 
        size="icon" 
        className="size-12 rounded-2xl shadow-lg shadow-primary/20 shrink-0 transition-transform active:scale-95"
        disabled={!input.trim() || isLoading || !hasUploadedFiles}
      >
        <Send className="size-5" />
      </Button>
    </form>
  );
};
