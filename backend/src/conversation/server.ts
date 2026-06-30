import dotenv from 'dotenv';
import { initDb } from '../shared/db';
import { createConversationApp } from './app';

dotenv.config();

const port = Number(process.env.PORT || 5000);

async function main() {
  await initDb();
  const app = createConversationApp();
  app.listen(port, () => {
    console.log(`Conversation service listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Failed to start conversation service:', error);
  process.exit(1);
});
