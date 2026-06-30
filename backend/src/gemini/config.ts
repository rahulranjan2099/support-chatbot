import dotenv from 'dotenv';

dotenv.config();

export interface GeminiConfig {
  apiKey: string | undefined;
  model: string;
}

export function getGeminiConfig(): GeminiConfig {
  return {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  };
}
