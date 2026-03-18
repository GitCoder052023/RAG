import { generateChatResponse } from '../services/chat-service.js';

export const chatWithPDF = async (req, res) => {
  try {
    const userQuery = req.query.message;
    if (!userQuery) {
      return res.status(400).json({ error: 'Message query parameter is required' });
    }

    const { message, docs } = await generateChatResponse(userQuery);

    return res.json({ message, docs });
  } catch (error) {
    console.error('Error in chatWithPDF controller:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
