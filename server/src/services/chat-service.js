import { openaiClient } from '../config/openai.js';
import { getRetriever } from './vector-service.js';

export const generateChatResponse = async (userQuery) => {
  const retriever = await getRetriever(2);
  const relevantDocs = await retriever.invoke(userQuery);

  const systemPrompt = `
  You are helfull AI Assistant who answeres the user query based on the available context from PDF File.
  Context:
  ${JSON.stringify(relevantDocs)}
  `;

  const chatResult = await openaiClient.chat.completions.create({
    model: 'gpt-4o', // Changed from gpt-4.1 to gpt-4o as gpt-4.1 doesn't exist.
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
