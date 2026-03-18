import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './src/routes/index';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', router);

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));
