import OpenAI from 'openai';
import { OpenAIEmbeddings } from '@langchain/openai';

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  apiKey: process.env.OPENAI_API_KEY,
});
