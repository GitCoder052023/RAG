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
  isStreaming?: boolean;
  onSelectDoc: (docs: any[], index: number) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming, onSelectDoc }) => {
  // If it's a bot message and actively streaming, append a blinking block cursor
  const contentToRender = message.role === 'bot' && isStreaming 
    ? message.content + ' ▍' 
    : message.content;

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
        <div className={`px-5 rounded-2xl shadow-sm border ${
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground rounded-tr-none py-3' 
            : `bg-muted/50 text-foreground border-border/50 rounded-tl-none backdrop-blur-md ${
                message.content === '' && isStreaming ? 'py-4 h-[42px] flex items-center' : 'py-3'
              }`
        }`}>
          
          {message.role === 'bot' && message.content === '' && isStreaming ? (
            <div className="flex items-center gap-1.5 w-fit">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-foreground/60"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ ...dotTransition, delay: 0 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-foreground/60"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ ...dotTransition, delay: 0.2 }}
              />
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-foreground/60"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ ...dotTransition, delay: 0.4 }}
              />
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none text-inherit leading-relaxed">
              <ReactMarkdown>{contentToRender}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {message.docs && message.docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1 block w-full">References</span>
            {message.docs.map((doc, i) => (
              <Tooltip key={i}>
                <TooltipTrigger
                  render={
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
                  }
                />
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

const dotVariants = {
  initial: { opacity: 0.3, scale: 0.8 },
  animate: { opacity: 1, scale: 1.1 },
};

const dotTransition = {
  repeat: Infinity,
  repeatType: "reverse" as const,
  duration: 0.6,
  ease: "easeInOut" as const
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
    <div className="px-5 py-4 rounded-2xl bg-muted/50 border border-border/50 rounded-tl-none flex items-center gap-1.5 w-fit h-[42px]">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-foreground/60"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-foreground/60"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-foreground/60"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
      />
    </div>
  </motion.div>
);
