import express, { json } from 'express';
import { errorHandler } from '../shared/http/errorHandler';
import { createGenerationRouter } from './routes/generationRoutes';

export function createGeminiApp() {
  const app = express();

  app.use(json());
  app.use(createGenerationRouter());
  app.use(errorHandler);

  return app;
}
