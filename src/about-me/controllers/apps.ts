import { Request, Response } from 'express';
import { aiClient } from '../../shared/ai-models/ai-client';

export const culturalExplorerController = async (req: Request, res: Response) => {
  try {
    const { countryName, language } = req.body;

    const prompt = `Act as an expert and charismatic tour guide. Give me one (1) curious, cultural, and little-known fact about ${countryName}. 
    The fact must be fascinating and specific to its culture, history, or traditions. 
    Respond in ${language || 'English'}. Maximum 2 or 3 sentences. Do not use markdown formatting, just plain text.`;

    const { text } = await aiClient.ask(prompt);
    const generatedText = text || '';

    if (generatedText) {
      res.status(200).json({ data: generatedText });
    } else {
      res.status(200).json({ data: "Sorry, I couldn't find a fun fact at this moment." });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      errors: [{ message: 'There was a problem connecting with the virtual guide. Please try again.' }] 
    });
  }
};