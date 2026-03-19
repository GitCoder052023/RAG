'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, ChevronRight, Copy, Check, Hash, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { chatWithPDF } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { ModeToggle } from '@/components/mode-toggle';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  docs?: any[];
}

interface ChatPanelProps {
  hasUploadedFiles: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ hasUploadedFiles }) => {
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
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

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
                                  onClick={() => {
                                    setSelectedDocs(message.docs || []);
                                    setActiveDocIndex(i);
                                  }}
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
      </CardFooter>

      {/* Source Viewer Dialog */}
      <Dialog 
        open={!!selectedDocs} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDocs(null);
            setActiveDocIndex(0);
          }
        }}
      >
        <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[85vh] p-0 gap-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-md flex flex-col">
          <DialogTitle className="sr-only">Source Context Viewer</DialogTitle>
          <div className="flex h-full min-h-[500px] w-full overflow-hidden">
            {/* Sidebar with Snippet Selection */}
            <div className="w-[260px] border-r border-border/50 bg-muted/20 flex flex-col shrink-0 hidden sm:flex">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                    <Bookmark className="size-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg tracking-tight">Sources</h3>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {selectedDocs?.length || 0} snippets referenced
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-3 flex flex-col gap-2">
                  {selectedDocs?.map((doc, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDocIndex(i)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden
                        ${activeDocIndex === i 
                          ? 'bg-card shadow-sm border border-border/50 translate-x-1' 
                          : 'hover:bg-muted/50 border border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      {activeDocIndex === i && (
                        <motion.div 
                          layoutId="activeSnippet"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                        />
                      )}
                      <div className="flex flex-col gap-1.5 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider
                            ${activeDocIndex === i ? 'text-primary' : 'text-muted-foreground'}`}>
                            Snippet {i + 1}
                          </span>
                          {doc.metadata?.page && (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              Page {doc.metadata.page}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-medium line-clamp-2 leading-relaxed
                          ${activeDocIndex === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {doc.pageContent || doc.content || "Source snippet content..."}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background relative">
              {/* Subtle background texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
              />

              {selectedDocs && selectedDocs[activeDocIndex] && (
                <>
                  <div className="p-6 border-b border-border/50 flex items-center justify-between relative z-10 bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Hash className="size-3.5 text-primary/60" />
                          <h4 className="font-bold text-sm tracking-tight">Document Context</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold py-0 bg-primary/5 text-primary/80 border-primary/20">
                            Source #{activeDocIndex + 1}
                          </Badge>
                          {selectedDocs[activeDocIndex].metadata?.source && (
                            <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">
                              {selectedDocs[activeDocIndex].metadata.source}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pr-8 sm:pr-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-[11px] font-bold rounded-lg gap-2 bg-background border-border/50 hover:bg-muted"
                        onClick={() => copyToClipboard(selectedDocs[activeDocIndex].pageContent || selectedDocs[activeDocIndex].content)}
                      >
                        {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
                    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
                      <div className="relative pb-10">
                        <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/5 to-transparent" />
                        <div className="text-sm sm:text-base text-foreground leading-relaxed font-medium whitespace-pre-wrap selection:bg-primary/20">
                          {selectedDocs[activeDocIndex].pageContent || selectedDocs[activeDocIndex].content || "No snippet content available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
