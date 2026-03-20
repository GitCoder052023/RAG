import { QdrantVectorStore } from '@langchain/qdrant';
import { embeddings } from '@/config/google';
import { qdrantConfig } from '@/config/qdrant';
import { Document } from '@langchain/core/documents';

let vectorStoreInstance: QdrantVectorStore | null = null;
let initializationPromise: Promise<QdrantVectorStore> | null = null;

export const getVectorStore = async () => {
  if (vectorStoreInstance) return vectorStoreInstance;

  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      const store = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: qdrantConfig.url!,
        collectionName: qdrantConfig.collectionName!,
      });
      vectorStoreInstance = store;
      return store;
    } catch (error) {
      initializationPromise = null; // Reset on failure
      throw error;
    }
  })();

  return initializationPromise;
};

export const addDocumentsToStore = async (docs: Document[]) => {
  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(docs);
  console.log(`All docs are added to vector store`);
};

export const getRetriever = async (k: number = 20) => {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({ k });
};
