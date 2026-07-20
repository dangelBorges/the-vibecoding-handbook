import type { LLMRequest, LLMRecommendations, LLMResponse } from '@/types/llm';
import type { WizardAnswers } from '@/data/wizard';

export interface LLMRecommendationsResult {
  recommendations: LLMRecommendations | null;
  error: string | null;
}

export async function requestLLMRecommendations(
  answers: WizardAnswers,
  locale: string
): Promise<LLMRecommendationsResult> {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, locale } satisfies LLMRequest),
    });

    const data = (await response.json()) as LLMResponse;

    if (!response.ok || !data.ok) {
      return {
        recommendations: null,
        error: data.ok ? `HTTP ${response.status}` : data.error,
      };
    }

    return { recommendations: data.recommendations, error: null };
  } catch {
    return { recommendations: null, error: 'Network error while contacting AI service' };
  }
}
