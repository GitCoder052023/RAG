export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  docs?: any[];
}

export interface ChatPanelProps {
  hasUploadedFiles: boolean;
}
