import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { env } from "./env";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: env.GOOGLE_API_KEY,
  temperature: 0,
  maxRetries: 3
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});
