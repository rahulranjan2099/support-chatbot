import { GoogleGenAI } from '@google/genai';
import { getGeminiConfig } from '../config';
import { HttpError } from '../../shared/http/errors';

interface GeminiResult {
  text: string;
  raw: unknown;
}

export async function sendPromptToGemini(prompt: string): Promise<GeminiResult> {
  const { apiKey, model } = getGeminiConfig();

  if (!apiKey) {
    throw new HttpError(500, 'Gemini service is not configured');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        candidateCount: 1,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new HttpError(502, 'Gemini API response did not contain a valid text output');
    }

    return { text, raw: response };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    console.error('Gemini SDK request failed:', error);
    throw new HttpError(502, 'Gemini API request failed');
  }
}
