import { Request, Response, NextFunction } from 'express';
import { generateChatStream } from '@/services/chat-service';

export const streamChat = async (req: Request, res: Response, next: NextFunction) => {
  const userQuery = req.query.message as string;

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
    if (!res.headersSent) {
      return next(error);
    } else {
      console.error('Error during chat stream:', error);
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`);
      res.end();
    }
  }
};
