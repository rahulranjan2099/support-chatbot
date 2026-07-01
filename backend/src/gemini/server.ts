import dotenv from 'dotenv';
import { initDb } from '../shared/db';
import { createGeminiApp } from './app';

dotenv.config();

const geminiPort = Number(process.env.PORT || process.env.GEMINI_PORT || 5001);

async function main() {
  await initDb();
  const app = createGeminiApp();
  app.listen(geminiPort, () => {
    console.log(`Gemini service listening on port ${geminiPort}`);
  });
}

main().catch((error) => {
  console.error('Failed to start Gemini service:', error);
  process.exit(1);
});
