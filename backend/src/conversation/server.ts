import dotenv from 'dotenv';
import { initDb } from '../shared/db';
import { createConversationApp } from './app';

dotenv.config();

// const port = Number(process.env.PORT || 5000);
const conversationPort = Number(process.env.PORT || process.env.CONVERSATION_PORT || 5000);

async function main() {
  await initDb();
  const app = createConversationApp();
  app.listen(conversationPort, () => {
    console.log(`Conversation service listening on ${conversationPort}`);
  });
}

main().catch((error) => {
  console.error('Failed to start conversation service:', error);
  process.exit(1);
});
