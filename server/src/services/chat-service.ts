import { model } from '@/config/google';
import { getRetriever } from '@/services/vector-service';

export const generateChatStream = async (
  userQuery: string,
  onDocs: (docs: any) => void,
  onChunk: (chunk: string) => void
) => {
  const retriever = await getRetriever(2);
  const relevantDocs = await retriever.invoke(userQuery);

  onDocs(relevantDocs);

  const systemPrompt = `
  You are an AI assistant that answers questions using only the provided context extracted from PDF documents. 
Follow these rules:
1. Use the retrieved context to answer as accurately as possible.
2. If the answer is not in the provided context, say: "I could not find that information in the document."
3. Do not make up facts or speculate beyond the given context.
4. Keep responses clear, and relevant to the query.
5. If the question is ambiguous, ask for clarification before answering.
6. Maintain a professional, helpful, and neutral tone.
7. When possible, reference the section or heading from the document where the answer was found.

  Context:
  ${JSON.stringify(relevantDocs)}
  `;

  const stream = await model.stream([
    ["system", systemPrompt],
    ["human", userQuery],
  ]);

  for await (const chunk of stream) {
    if (chunk.content) {
      onChunk(chunk.content.toString());
    }
  }
};
