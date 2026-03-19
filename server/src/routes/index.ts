import { Router } from 'express';
import { uploadDocument } from '@/controllers/pdf-controller';
import { streamChat } from '@/controllers/chat-controller';
import { upload } from '@/middlewares/upload';
import { validate } from '@/middlewares/validate';
import { chatQuerySchema } from '@/schemas/chat.schema';

const router = Router();

router.post('/api/docs/upload', upload.single('pdf'), uploadDocument as any);
router.get('/api/chat/stream', validate(chatQuerySchema), streamChat as any);
router.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
