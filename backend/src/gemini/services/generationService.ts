import { HttpError } from '../../shared/http/errors';
import { FaqArticle } from '../../shared/models';
import { Message } from '../../shared/types';
import { sendPromptToGemini } from './geminiClient';
import { buildCompanyKnowledgePrompt } from './promptBuilder';

interface GeneratePayload {
  prompt?: unknown;
  messages?: unknown;
}

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const message = value as Partial<Message>;
  return (
    typeof message.content === 'string' &&
    message.content.trim().length > 0 &&
    (message.role === 'user' || message.role === 'assistant')
  );
}

function normalizeMessages(payload: GeneratePayload): Message[] {
  if (typeof payload.prompt === 'string' && payload.prompt.trim().length > 0) {
    return [
      {
        id: 'prompt',
        sessionId: 'prompt',
        role: 'user',
        content: payload.prompt.trim(),
        metadata: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    throw new HttpError(400, 'Please provide prompt or messages array');
  }

  if (!payload.messages.every(isMessage)) {
    throw new HttpError(400, 'messages must contain role and content fields');
  }

  return payload.messages;
}

async function getActiveFaqArticles() {
  return FaqArticle.findAll({
    where: { isActive: true },
    order: [
      ['category', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  });
}

export async function generateCompanyPolicyText(payload: GeneratePayload) {
  const messages = normalizeMessages(payload);
  const faqArticles = await getActiveFaqArticles();
  const prompt = buildCompanyKnowledgePrompt(
    messages,
    faqArticles.map((article) => ({
      category: article.category,
      question: article.question,
      answer: article.answer,
    }))
  );
  console.log('Generated prompt:', prompt)
  return sendPromptToGemini(prompt);
}

export async function generateText(payload: GeneratePayload) {
  return generateCompanyPolicyText(payload);
}
