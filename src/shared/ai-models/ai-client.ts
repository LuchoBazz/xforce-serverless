import { MultiModelClient } from './multi-model-client';
import { GeminiProvider } from './gemini-provider';
import { DeepSeekProvider } from './deepseek-provider';

/** Shared multi-model AI client with prioritized providers. */
export const aiClient = new MultiModelClient([
  new GeminiProvider('gemini-2.5-flash-lite'),
  new DeepSeekProvider('deepseek-chat'),
  new GeminiProvider('gemini-2.5-flash'),
  new GeminiProvider('gemini-1.5-flash'),
]);
