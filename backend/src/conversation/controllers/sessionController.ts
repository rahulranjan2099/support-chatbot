import { Request, Response } from 'express';
import { HttpError } from '../../shared/http/errors';
import { ChatMessage, ChatSession } from '../../shared/models';
import { Message, Role, Session } from '../../shared/types';
import { generateAssistantReply } from '../services/geminiClient';

const defaultSessionTitle = 'Customer support conversation';

function serializeSession(session: ChatSession): Session {
  return {
    id: session.id,
    title: session.title,
    status: session.status,
    customerName: session.customerName ?? null,
    customerEmail: session.customerEmail ?? null,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

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

function parseIncomingMessage(value: unknown): { role: Role; content: string; metadata: Record<string, unknown> | null } {
  if (!value || typeof value !== 'object') {
    throw new HttpError(400, 'messages must contain role and content fields');
  }

  const message = value as Partial<Message>;
  if (message.role !== 'user' && message.role !== 'assistant') {
    throw new HttpError(400, 'message role must be user or assistant');
  }

  if (typeof message.content !== 'string' || message.content.trim().length === 0) {
    throw new HttpError(400, 'message content is required');
  }

  const metadata =
    message.metadata && typeof message.metadata === 'object' && !Array.isArray(message.metadata)
      ? message.metadata
      : null;

  return {
    role: message.role,
    content: message.content.trim(),
    metadata,
  };
}

function getSessionId(sessionData: unknown): string | null {
  if (!sessionData || typeof sessionData !== 'object') {
    return null;
  }

  const session = sessionData as { id?: unknown; sessionId?: unknown };
  if (typeof session.id === 'string') {
    return session.id;
  }

  if (typeof session.sessionId === 'string') {
    return session.sessionId;
  }

  return null;
}

export async function listSessionController(_req: Request, res: Response): Promise<void> {
  const sessions = await ChatSession.findAll({ order: [['createdAt', 'DESC']] });
  res.json(sessions.map(serializeSession));
}

export async function createSessionController(req: Request, res: Response): Promise<void> {
  console.log('checkingreq.body', req.body)
  const incomingMessage = parseIncomingMessage(req.body.messages);
  const title = typeof req.body?.messages?.content === 'string' ? req.body?.messages?.content : defaultSessionTitle;
  const sessionId = getSessionId(req.body.sessionData);

  let session: ChatSession;
  if (sessionId) {
    const existingSession = await ChatSession.findByPk(sessionId);
    if (!existingSession) {
      throw new HttpError(404, 'Session not found');
    }
    session = existingSession;
  } else {
    session = await ChatSession.create({ title });
  }

  const userMessageRecord = await ChatMessage.create({
    sessionId: session.id,
    role: incomingMessage.role,
    content: incomingMessage.content,
    metadata: incomingMessage.metadata,
  });

  const conversation = await getSessionMessages(session.id);
  const assistantReply = await generateAssistantReply(conversation);
  const assistantMessageRecord = await ChatMessage.create({
    sessionId: session.id,
    role: 'assistant',
    content: assistantReply,
  });

  res.status(201).json({
    session: serializeSession(session),
    messages: [serializeMessage(userMessageRecord), serializeMessage(assistantMessageRecord)],
  });
}

export async function getSessionController(req: Request, res: Response): Promise<void> {
  const session = await ChatSession.findByPk(req.params.sessionId);
  if (!session) {
    throw new HttpError(404, 'Session not found');
  }

  res.json(serializeSession(session));
}
