import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { englishGrammarController, englishPhrasalVerbMasterController } from './about-me/controllers/languages';
import { healthCheckController } from './shared/controllers';
import { culturalExplorerController } from './about-me/controllers/apps';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/languages/english/grammar', englishGrammarController);
app.post('/api/languages/english/phrasal-verb-master', englishPhrasalVerbMasterController);
app.post('/api/apps/cultural-explorer', culturalExplorerController);


// Health check
app.get('/', healthCheckController);

export default app;
