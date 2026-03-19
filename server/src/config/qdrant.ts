import { env } from "./env";

export const qdrantConfig = {
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
  collectionName: env.QDRANT_COLLECTION,
};
