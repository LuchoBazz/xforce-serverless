/** Base contract for AI text providers. */
export interface AIProvider {
  /** The display name of the provider (e.g., "Google Gemini"). */
  name: string;

  /**
   * Generates text based on the provided prompt.
   * @param prompt The input text/query.
   * @returns A promise resolving to the generated text.
   */
  generateText(prompt: string): Promise<string>;
}
