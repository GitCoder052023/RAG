import { env } from './src/config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import router from './src/routes/index';
import { errorHandler } from './src/middlewares/error-handler';

const app = express();
const PORT = env.PORT;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(limiter);
app.use(express.json());

// Routes
app.use('/', router);

// Error Handling Middleware (must be after routes)
app.use(errorHandler as any);

app.listen(PORT, () => console.log(`Server started on PORT:${PORT} in ${env.NODE_ENV} mode`));
