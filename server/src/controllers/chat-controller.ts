import { Request, Response } from 'express';
import { generateChatResponse, generateChatStream } from '@/services/chat-service';

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

export const chatWithPDFStream = async (req: Request, res: Response) => {
  const userQuery = req.query.message as string;
  if (!userQuery) {
    return res.status(400).json({ error: 'Message query parameter is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    await generateChatStream(
      userQuery,
      (docs) => {
        res.write(`data: ${JSON.stringify({ docs })}\n\n`);
      },
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error in chatWithPDFStream controller:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`);
      res.end();
    }
  }
};
