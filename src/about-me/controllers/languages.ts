import { Request, Response } from 'express';
import axios from 'axios';

export const englishGrammarController = async (req: Request, res: Response) => {
  try {
    const { level, concept, description, example, theme } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).send('GEMINI_API_KEY is not set');
    }

    const topic = {
      level: level || 'B1',
      concept: concept || 'Grammar',
      description: description || 'No description provided',
      example: example || 'No example provided',
      theme: theme || "light",
    };

    const prompt = `Act as a professional English teacher. Provide a detailed, easy-to-understand grammar explanation in English for:
- Level: ${topic.level}
- Concept: ${topic.concept}
- Description: ${topic.description}
- Example: ${topic.example}

Give your answer in B1/B2 English.

IMPORTANT: Please provide the response in valid, semantic HTML format with Tailwind classes with the theme ${topic.theme} (without \`\`\`html code blocks or markdown). 
Do NOT use markdown symbols like **, ##, or -.`;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`, {
      contents: [{parts: [{ text: prompt }]}]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = response.data;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate an explanation at this moment.";

    // Basic formatting: replace double newlines with <br/><br/> and **bold** with <b>
    // Although the prompt asks for no markdown, the fallback logic is requested by the user.
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    res.status(200).json({ data: formattedText });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({ errors: [{ message: 'Internal server error' }] });
  }
};
