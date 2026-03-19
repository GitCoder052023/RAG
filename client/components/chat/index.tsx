'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { ChatPanelProps } from './types';
import { useChat } from './use-chat';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { SourceViewer } from './source-viewer';

export const ChatPanel: React.FC<ChatPanelProps> = ({ hasUploadedFiles }) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    selectedDocs,
    setSelectedDocs,
    activeDocIndex,
    setActiveDocIndex,
    copied,
    scrollAreaRef,
    copyToClipboard,
    handleSendMessage,
  } = useChat(hasUploadedFiles);

  return (
    <Card className="h-full border-none bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-xl">
      <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            Chat with AI
          </CardTitle>
          <CardDescription>
            Ask anything about your document
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          onSelectDoc={(docs, index) => {
            setSelectedDocs(docs);
            setActiveDocIndex(index);
          }}
          scrollAreaRef={scrollAreaRef}
        />
      </CardContent>

      <CardFooter className="p-6 pt-2 border-t bg-background/50 backdrop-blur-md">
        <ChatInput 
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          hasUploadedFiles={hasUploadedFiles}
          onSendMessage={handleSendMessage}
        />
      </CardFooter>

      <SourceViewer 
        selectedDocs={selectedDocs}
        onClose={() => {
          setSelectedDocs(null);
          setActiveDocIndex(0);
        }}
        activeDocIndex={activeDocIndex}
        setActiveDocIndex={setActiveDocIndex}
        copyToClipboard={copyToClipboard}
        copied={copied}
      />
    </Card>
  );
};
