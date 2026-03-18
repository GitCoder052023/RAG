import { Request, Response } from 'express';
import { generateChatResponse } from '@/services/chat-service';

export const chatWithPDF = async (req: Request, res: Response) => {
  try {
    const userQuery = req.query.message as string;
    if (!userQuery) {
      return res.status(400).json({ error: 'Message query parameter is required' });
    }

    const { message, docs } = await generateChatResponse(userQuery);

    return res.json({ message, docs });
  } catch (error) {
    console.error('Error in chatWithPDF controller:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
