import { Request, Response } from 'express';
import { HttpError } from '../../shared/http/errors';
import { ChatMessage, ChatSession } from '../../shared/models';
import { Message } from '../../shared/types';
import { generateAssistantReply } from '../services/geminiClient';

function serializeMessage(message: ChatMessage): Message {
  return {
    id: message.id,
    sessionId: message.sessionId,
    role: message.role,
    content: message.content,
    metadata: message.metadata ?? null,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

async function getSessionMessages(sessionId: string): Promise<Message[]> {
  const messages = await ChatMessage.findAll({
    where: { sessionId },
    order: [['createdAt', 'ASC']],
  });

  return messages.map(serializeMessage);
}

export async function listMessagesController(req: Request, res: Response): Promise<void> {
  const messages = await getSessionMessages(req.params.sessionId);
  res.json(messages);
}

export async function createMessageController(req: Request, res: Response): Promise<void> {
  const sessionId = req.params.sessionId;
  const content = req.body.content;

  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new HttpError(400, 'content is required');
  }

  const session = await ChatSession.findByPk(sessionId);
  if (!session) {
    throw new HttpError(404, 'Session not found');
  }

  const userMessageRecord = await ChatMessage.create({
    sessionId,
    role: 'user',
    content: content.trim(),
  });
  const messages = await getSessionMessages(sessionId);
  const assistantReply = await generateAssistantReply(messages);
  const aiMessageRecord = await ChatMessage.create({
    sessionId,
    role: 'assistant',
    content: assistantReply,
  });

  res.status(201).json({
    userMessage: serializeMessage(userMessageRecord),
    aiMessage: serializeMessage(aiMessageRecord),
  });
}
