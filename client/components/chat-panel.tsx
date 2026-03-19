'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Info, ChevronRight, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { chatWithPDF } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { ModeToggle } from '@/components/mode-toggle';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  docs?: any[];
}

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! Please upload a PDF to start our conversation. I can answer questions about the content of your document.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<any[] | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithPDF(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.message,
        docs: response.docs,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Info className="size-4" />
            Sources
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea ref={scrollAreaRef} className="h-full px-6 py-4">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
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
                              render={
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 px-2.5 text-[11px] font-semibold border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                                  onClick={() => setSelectedDocs(message.docs || [])}
                                />
                              }
                            >
                              Source {i + 1}
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
              ))}
            </AnimatePresence>
            
            {isLoading && (
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
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-6 pt-2 border-t bg-background/50 backdrop-blur-md">
        <form 
          className="flex w-full items-center gap-3 max-w-4xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <div className="relative flex-1 group">
            <Input
              placeholder="Ask a question about your document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-12 py-6 rounded-2xl bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground/50 border border-muted-foreground/20 px-1.5 py-0.5 rounded uppercase pointer-events-none hidden sm:inline-block">Enter</span>
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="size-12 rounded-2xl shadow-lg shadow-primary/20 shrink-0 transition-transform active:scale-95"
            disabled={!input.trim() || isLoading}
          >
            <Send className="size-5" />
          </Button>
        </form>
      </CardFooter>

      {/* Source Viewer Dialog */}
      <Dialog open={!!selectedDocs} onOpenChange={(open) => !open && setSelectedDocs(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-primary-foreground border-b border-primary-foreground/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Files className="size-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Referenced Context</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Sources used to generate this response
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 bg-muted/30">
            <div className="flex flex-col gap-6">
              {selectedDocs?.map((doc, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">Snippet {i + 1}</Badge>
                  </div>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary/80">
                    <Info className="size-4" />
                    Source Snippet
                  </h4>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                    {doc.pageContent || doc.content || "No snippet content available"}
                  </div>
                  {doc.metadata && (
                    <div className="mt-4 pt-4 border-t border-border/30 flex flex-wrap gap-2">
                      {Object.entries(doc.metadata).map(([key, value]: [string, any]) => (
                        <Badge key={key} variant="outline" className="text-[10px] font-bold py-0.5 bg-muted/50">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
