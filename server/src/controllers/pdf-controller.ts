import { Request, Response, NextFunction } from 'express';
import { loadPDF } from '@/services/pdf-service';
import { addDocumentsToStore } from '@/services/vector-service';
import { AppError } from '@/middlewares/error-handler';

export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file uploaded');
    }
    const filePath = req.file.path;

    // Load the PDF
    const docs = await loadPDF(filePath);

    // Add to vector store
    await addDocumentsToStore(docs);

    return res.json({ 
      message: 'Document uploaded and successfully processed',
      filename: req.file.originalname 
    });
  } catch (error) {
    next(error);
  }
};
