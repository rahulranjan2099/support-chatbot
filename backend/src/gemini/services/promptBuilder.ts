import { Message } from '../../shared/types';

interface CompanyKnowledge {
  category: string;
  question: string;
  answer: string;
}

export function buildCompanyKnowledgePrompt(messages: Message[], knowledge: CompanyKnowledge[]): string {
  const knowledgeText =
    knowledge.length > 0
      ? knowledge
          .map(
            (article) =>
              `Category: ${article.category}\nQuestion: ${article.question}\nAnswer: ${article.answer}`
          )
          .join('\n\n')
      : 'No company FAQ articles are currently available.';

  const conversation =
    messages.length > 0
      ? messages
          .map((message) => {
            const speaker = message.role === 'user' ? 'Customer' : 'Assistant';
            return `${speaker}: ${message.content}`;
          })
          .join('\n')
      : 'Customer: Hello';

  return `You are a helpful customer support assistant for SpurCart.

Use only the company FAQ knowledge below when answering questions about company policies, shipping, returns, refunds, support hours, orders, and store operations.
If the answer is not present in the company FAQ knowledge, say: "I don't have that information right now. Please contact support."
Keep answers concise, friendly, and practical.

Company FAQ knowledge:
${knowledgeText}

Conversation:
${conversation}
Assistant:`;
}
