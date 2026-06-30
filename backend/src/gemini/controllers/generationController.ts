import { Request, Response } from 'express';
import {
  generateCompanyPolicyText,
  generateText,
} from '../services/generationService';

export async function generateCompanyPolicyTextController(req: Request, res: Response): Promise<void> {
  const result = await generateCompanyPolicyText(req.body);
  res.json({ text: result.text, raw: result.raw });
}

export async function generateTextController(req: Request, res: Response): Promise<void> {
  const result = await generateText(req.body);
  res.json({ text: result.text, raw: result.raw });
}
