export type Role = 'user' | 'assistant';

export interface FaqArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  status: 'open' | 'closed';
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: Role;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
