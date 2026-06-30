import { ChatMessage } from './chatMessage';
import { ChatSession } from './chatSession';
import { FaqArticle } from './faqArticle';

ChatSession.hasMany(ChatMessage, {
  as: 'messages',
  foreignKey: 'sessionId',
  onDelete: 'CASCADE',
});

ChatMessage.belongsTo(ChatSession, {
  as: 'session',
  foreignKey: 'sessionId',
});

export { ChatMessage, ChatSession, FaqArticle };
