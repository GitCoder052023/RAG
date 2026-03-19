'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './types';
import { MessageItem, LoadingMessage } from './message-item';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onSelectDoc: (docs: any[], index: number) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  onSelectDoc, 
  scrollAreaRef 
}) => {
  const showLoading = isLoading && messages[messages.length - 1]?.role === 'user';

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full px-6 py-4">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isStreaming = isLoading && isLastMessage && message.role === 'bot';

            return (
              <MessageItem 
                key={message.id} 
                message={message} 
                isStreaming={isStreaming}
                onSelectDoc={onSelectDoc} 
              />
            );
          })}
        </AnimatePresence>
        
        {showLoading && <LoadingMessage />}
      </div>
    </ScrollArea>
  );
};
