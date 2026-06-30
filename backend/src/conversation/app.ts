import express, { json } from 'express';
import cors from 'cors';
import { errorHandler } from '../shared/http/errorHandler';
import { createSessionRouter } from './routes/sessionRoutes';

export function createConversationApp() {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(createSessionRouter());
  app.use(errorHandler);

  return app;
}
