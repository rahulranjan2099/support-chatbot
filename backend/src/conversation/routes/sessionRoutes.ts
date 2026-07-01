import { Router } from 'express';
import {
  createMessageController,
  listMessagesController,
} from '../controllers/messageController';
import {
  createSessionController,
  getSessionController,
  listSessionController,
} from '../controllers/sessionController';
import { asyncHandler } from '../../shared/http/asyncHandler';

export function createSessionRouter(): Router {
  const router = Router();

  router.get('/chat', asyncHandler(listSessionController));
  router.post('/chat', asyncHandler(createSessionController));
  router.get('/chat/:sessionId', asyncHandler(getSessionController));
  router.get('/chat/:sessionId/messages', asyncHandler(listMessagesController));
  router.post('/chat/:sessionId/messages', asyncHandler(createMessageController));

  return router;
}
