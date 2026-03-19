import { z } from 'zod';

export const chatQuerySchema = z.object({
  query: z.object({
    message: z.string().min(1, "Message query parameter is required"),
  }),
});
