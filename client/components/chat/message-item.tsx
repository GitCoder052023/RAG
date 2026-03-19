'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
  onSelectDoc: (docs: any[], index: number) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onSelectDoc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'bot' && (
        <Avatar className="size-9 ring-2 ring-primary/10 ring-offset-2 shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AI</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3 rounded-2xl shadow-sm border ${
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted/50 text-foreground border-border/50 rounded-tl-none backdrop-blur-md'
        }`}>
          <div className="prose prose-sm dark:prose-invert max-w-none text-inherit leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        
        {message.docs && message.docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 block w-full">References</span>
            {message.docs.map((doc, i) => (
              <Tooltip key={i}>
                <TooltipTrigger
                  asChild
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2.5 text-[11px] font-semibold border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                    onClick={() => {
                      onSelectDoc(message.docs || [], i);
                    }}
                  >
                    Source {i + 1}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View context from source {i + 1}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <Avatar className="size-9 ring-2 ring-secondary/10 ring-offset-2 shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">ME</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export const LoadingMessage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-4 justify-start"
  >
    <Avatar className="size-9 ring-2 ring-primary/10 ring-offset-2 shrink-0">
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AI</AvatarFallback>
    </Avatar>
    <div className="px-5 py-3 rounded-2xl bg-muted/50 border border-border/50 rounded-tl-none flex items-center gap-3">
      <Loader2 className="size-4 animate-spin text-primary" />
      <span className="text-sm font-medium animate-pulse">Thinking...</span>
    </div>
  </motion.div>
);
