import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { englishGrammarController } from './about-me/controllers/languages';
import { healthCheckController } from './shared/controllers';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/languages/english/grammar', englishGrammarController);

// Health check
app.get('/', healthCheckController);

export default app;
