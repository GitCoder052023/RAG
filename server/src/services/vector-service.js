import { QdrantVectorStore } from '@langchain/qdrant';
import { embeddings } from '../config/openai.js';
import { qdrantConfig } from '../config/qdrant.js';

export const getVectorStore = async () => {
  return await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: qdrantConfig.url,
    collectionName: qdrantConfig.collectionName,
  });
};

export const addDocumentsToStore = async (docs) => {
  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(docs);
  console.log(`All docs are added to vector store`);
};

export const getRetriever = async (k = 2) => {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({ k });
};
