'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithDocument } from '@/lib/api';
import { toast } from 'sonner';
import { Message } from './types';

export const useChat = (hasUploadedFiles: boolean) => {
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

  const handleSendMessage = () => {
    if (!input.trim() || isLoading || !hasUploadedFiles) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const botMessageId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let isBotMessageAdded = false;

    const addBotMessageIfNeeded = () => {
      if (!isBotMessageAdded) {
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            role: 'bot',
            content: '',
          },
        ]);
        isBotMessageAdded = true;
      }
    };

    chatWithDocument(
      input,
      (docs) => {
        addBotMessageIfNeeded();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, docs } : msg
          )
        );
      },
      (chunk) => {
        addBotMessageIfNeeded();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      },
      () => {
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        if (!isBotMessageAdded) {
          addBotMessageIfNeeded();
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
                : msg
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content === '' ? 'Sorry, I encountered an error. Please try again.' : msg.content + '\n\n*(Error: Stream interrupted)*' }
                : msg
            )
          );
        }
        setIsLoading(false);
      }
    );
  };

  return {
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
  };
};
