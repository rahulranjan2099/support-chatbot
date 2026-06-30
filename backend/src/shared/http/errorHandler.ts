import { ErrorRequestHandler } from 'express';
import { HttpError } from './errors';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    if (error.statusCode >= 500) {
      console.error(error);
    }
    res.status(error.statusCode).json({ error: error.publicMessage });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
