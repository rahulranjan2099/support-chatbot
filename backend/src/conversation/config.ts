import dotenv from 'dotenv';

dotenv.config();

export function getGeminiServiceUrl(): string {
  const geminiServicePort = Number(process.env.GEMINI_PORT || 5001);
  return process.env.GEMINI_SERVICE_URL || `http://localhost:${geminiServicePort}`;
}
