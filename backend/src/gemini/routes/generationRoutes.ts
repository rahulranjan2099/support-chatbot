import { Router } from 'express';
import { asyncHandler } from '../../shared/http/asyncHandler';
import {
  generateCompanyPolicyTextController,
  generateTextController,
} from '../controllers/generationController';

export function createGenerationRouter(): Router {
  const router = Router();

  router.post('/askCompanyPolicy', asyncHandler(generateCompanyPolicyTextController));

  router.post('/generate', asyncHandler(generateTextController));

  return router;
}
