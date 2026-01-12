import { AIProvider } from './ai-provider.interface';

export class MultiModelClient {
  private providers: AIProvider[] = [];

  constructor(providers: AIProvider[]) {
    this.providers = providers;
  }

  async ask(prompt: string): Promise<{ text: string; providerUsed: string }> {
    const errorLog: string[] = [];

    for (const provider of this.providers) {
      try {
        console.info(`[MultiModelClient] Attempting request with: ${provider.name}...`);
        const text = await provider.generateText(prompt);
        return { text, providerUsed: provider.name };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown Error';

        console.warn(`[MultiModelClient] Failed with ${provider.name}: ${errorMessage}`);
        errorLog.push(`${provider.name}: ${errorMessage}`);
      }
    }
    throw new Error(`All AI providers failed. Error Log:\n${errorLog.join('\n')}`);
  }
}
