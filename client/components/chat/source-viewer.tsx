'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Hash, Check, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SourceViewerProps {
  selectedDocs: any[] | null;
  onClose: () => void;
  activeDocIndex: number;
  setActiveDocIndex: (index: number) => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
}

export const SourceViewer: React.FC<SourceViewerProps> = ({
  selectedDocs,
  onClose,
  activeDocIndex,
  setActiveDocIndex,
  copyToClipboard,
  copied,
}) => {
  return (
    <Dialog 
      open={!!selectedDocs} 
      onOpenChange={(open) => {
        if (!open) onClose();
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
  );
};
