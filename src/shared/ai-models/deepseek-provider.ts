import axios from 'axios';
import * as dotenv from 'dotenv';
import { AIProvider } from './ai-provider.interface';

dotenv.config();

export class DeepSeekProvider implements AIProvider {
  public name = 'DeepSeek';
  private apiKey: string;
  private model: string;
  private baseURL = 'https://api.deepseek.com';

  constructor(model: string = 'deepseek-chat') {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.model = model;

    if (!this.apiKey) {
      console.warn('[DeepSeekProvider] Warning: DEEPSEEK_API_KEY is not defined in the environment variables.');
    }
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API Key is missing.');
    }

    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  }
}
