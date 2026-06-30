import { HttpError } from '../../shared/http/errors';
import { Message } from '../../shared/types';
import { getGeminiServiceUrl } from '../config';

interface GeminiGenerateResponse {
  text?: unknown;
}

export async function generateAssistantReply(messages: Message[]): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${getGeminiServiceUrl()}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  } catch (error) {
    console.error('Error calling Gemini service:', error);
    throw new HttpError(502, 'Gemini service is unavailable');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini service error response:', errorText);
    throw new HttpError(502, 'Gemini service returned an error');
  }

  const result = (await response.json()) as GeminiGenerateResponse;
  if (typeof result.text !== 'string' || result.text.trim().length === 0) {
    throw new HttpError(502, 'Gemini service returned an invalid response');
  }

  return result.text.trim();
}
