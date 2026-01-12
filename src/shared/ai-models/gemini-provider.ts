import axios from 'axios';
import * as dotenv from 'dotenv';
import { AIProvider } from './ai-provider.interface';

dotenv.config();

export class GeminiProvider implements AIProvider {
  public name = 'Google Gemini';
  private apiKey: string;
  private model: string;

  constructor(model: string = 'gemini-1.5-flash') {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = model;

    if (!this.apiKey) {
      console.warn('[GeminiProvider] Warning: GEMINI_API_KEY is not defined in the environment variables.');
    }
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('Gemini returned no candidates (Potential safety filter trigger).');
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('[GeminiProvider] Error generating text:', error);
      throw error;
    }
  }
}
