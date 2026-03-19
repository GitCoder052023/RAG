'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, FileText, Info, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export const Navbar = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Bot className="size-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">RAG Pipeline</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-6">
          <Button variant="ghost" className="text-sm font-medium hover:bg-muted/80">Dashboard</Button>
          <Button variant="ghost" className="text-sm font-medium hover:bg-muted/80">Documentation</Button>
          <Button variant="ghost" className="text-sm font-medium hover:bg-muted/80">Pricing</Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="size-5" />
            </a>
          </Button>
          <ModeToggle />
          <Button className="rounded-xl shadow-lg shadow-primary/20 px-6 hidden sm:flex">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
