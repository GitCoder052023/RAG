import { Router, Request, Response } from 'express';
import { uploadPDF } from '@/controllers/pdf-controller';
import { chatWithPDF } from '@/controllers/chat-controller';
import { upload } from '@/middlewares/upload';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({ status: 'Server running....' });
});

router.post('/upload/pdf', upload.single('pdf'), uploadPDF as any);
router.get('/chat', chatWithPDF as any);

export default router;
