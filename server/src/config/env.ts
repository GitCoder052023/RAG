import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.string().default('8000').transform(Number),
  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
  QDRANT_URL: z.string().url("QDRANT_URL must be a valid URL"),
  QDRANT_COLLECTION: z.string().min(1, "QDRANT_COLLECTION is required"),
  QDRANT_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().default('*').transform((val) => val.split(',')),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(envParse.error.format(), null, 2));
  process.exit(1);
}

export const env = envParse.data;
