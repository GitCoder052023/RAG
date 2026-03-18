import { Request, Response } from 'express';
import { loadPDF } from '@/services/pdf-service';
import { addDocumentsToStore } from '@/services/vector-service';

export const uploadPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = req.file.path;

    // Load the PDF
    const docs = await loadPDF(filePath);

    // Add to vector store
    await addDocumentsToStore(docs);

    return res.json({ message: 'uploaded and processed' });
  } catch (error) {
    console.error('Error in uploadPDF controller:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
