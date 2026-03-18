import { Router } from 'express';
import { uploadPDF } from '../controllers/pdf-controller.js';
import { chatWithPDF } from '../controllers/chat-controller.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ status: 'All Good!' });
});

router.post('/upload/pdf', upload.single('pdf'), uploadPDF);
router.get('/chat', chatWithPDF);

export default router;
