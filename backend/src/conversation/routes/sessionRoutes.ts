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

  router.get('/sessions', asyncHandler(listSessionController));
  router.post('/sessions', asyncHandler(createSessionController));
  router.get('/sessions/:sessionId', asyncHandler(getSessionController));
  router.get('/sessions/:sessionId/messages', asyncHandler(listMessagesController));
  router.post('/sessions/:sessionId/messages', asyncHandler(createMessageController));

  return router;
}
