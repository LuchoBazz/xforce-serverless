import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/grammar', async (req: Request, res: Response) => {
  try {
    const { level, concept, description, example } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).send('GEMINI_API_KEY is not set');
    }

    const topic = {
      level: level || 'B1',
      concept: concept || 'Grammar',
      description: description || 'No description provided',
      example: example || 'No example provided'
    };

    const prompt = `Act as a professional English teacher. Provide a detailed, easy-to-understand grammar explanation in English for:
- Level: ${topic.level}
- Concept: ${topic.concept}
- Description: ${topic.description}
- Example: ${topic.example}

Give your answer in B1/B2 English.

IMPORTANT: Please provide the response in valid, semantic HTML format with Tailwind classes (without \`\`\`html code blocks or markdown). 
Do NOT use markdown symbols like **, ##, or -.`;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
       const errorData = await response.text();
       console.error('Gemini API Error:', errorData);
       return res.status(response.status).send(`Error from Gemini API: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate an explanation at this moment.";
    
    // Basic formatting: replace double newlines with <br/><br/> and **bold** with <b>
    // Although the prompt asks for no markdown, the fallback logic is requested by the user.
    const formattedText = text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    res.send(formattedText);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Health check
app.get('/', (req: Request, res: Response) => {
    res.send('XForce Serverless API is running');
});

export default app;
