import { openaiClient } from '../config/openai.js';
import { getRetriever } from './vector-service.js';

export const generateChatResponse = async (userQuery) => {
  const retriever = await getRetriever(2);
  const relevantDocs = await retriever.invoke(userQuery);

  const systemPrompt = `
  You are an AI assistant that answers questions using only the provided context extracted from PDF documents. 
Follow these rules:
1. Use the retrieved context to answer as accurately as possible.
2. If the answer is not in the provided context, say: "I could not find that information in the document."
3. Do not make up facts or speculate beyond the given context.
4. Keep responses clear, concise, and relevant to the query.
5. If the question is ambiguous, ask for clarification before answering.
6. Maintain a professional, helpful, and neutral tone.
7. When possible, reference the section or heading from the document where the answer was found.

  Context:
  ${JSON.stringify(relevantDocs)}
  `;

  const chatResult = await openaiClient.chat.completions.create({
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery },
    ],
  });

  return {
    message: chatResult.choices[0].message.content,
    docs: relevantDocs,
  };
};
