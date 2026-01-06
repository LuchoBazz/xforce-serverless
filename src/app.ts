import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { englishGrammarController } from './about-me/controllers/languages';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/languages/english/grammar', englishGrammarController);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'XForce Serverless API is running' });
});

export default app;
