import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

export const culturalExplorerController = async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).send('GEMINI_API_KEY is not set');
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const { countryName, language } = req.body;

    const prompt = `Act as an expert and charismatic tour guide. Give me one (1) curious, cultural, and little-known fact about ${countryName}. 
    The fact must be fascinating and specific to its culture, history, or traditions. 
    Respond in ${language || 'English'}. Maximum 2 or 3 sentences. Do not use markdown formatting, just plain text.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const data = response.data;
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      res.status(200).json({ data: generatedText });
    } else {
      res.status(200).json({ data: "Sorry, I couldn't find a fun fact at this moment." });
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axios.isAxiosError(error)) {
      const status = axiosError.response?.status;
      
      if (status === 429 || (status && status >= 500)) {
        console.error(`Server error: ${status}`);
        return res.status(status || 500).json({ 
          errors: [{ message: `Server error: ${status}` }] 
        });
      }
      
      console.error('Error in Gemini request:', axiosError.message);
      return res.status(status || 500).json({ 
        errors: [{ message: 'Error in Gemini request' }] 
      });
    }
    
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      errors: [{ message: 'There was a problem connecting with the virtual guide. Please try again.' }] 
    });
  }
};