import type { WizardAnswers } from '../data/wizard';

export interface LLMRequest {
  answers: WizardAnswers;
  locale: string;
}

export interface LLMRecommendations {
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  hosting: string;
  rationale: string;
}

export interface LLMSuccessResponse {
  ok: true;
  recommendations: LLMRecommendations;
}

export interface LLMErrorResponse {
  ok: false;
  error: string;
}

export type LLMResponse = LLMSuccessResponse | LLMErrorResponse;

export type LLMStackKey = 'frontend' | 'backend' | 'database' | 'auth' | 'hosting';

export const LLM_STACK_KEYS: LLMStackKey[] = ['frontend', 'backend', 'database', 'auth', 'hosting'];
