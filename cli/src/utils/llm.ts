export type LlmProvider = 'openai' | 'anthropic';

export interface LlmConfig {
  provider: LlmProvider;
  apiKey: string;
  model: string;
}

const DEFAULT_MODELS: Record<LlmProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
};

const KEY_ENV: Record<LlmProvider, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
};

/**
 * Resolves the LLM configuration from environment variables.
 * `VIBE_PROVIDER` forces a provider (its key must exist); otherwise the first
 * available key wins (OpenAI, then Anthropic). `VIBE_MODEL` overrides the model.
 * Returns null when no usable key is found.
 */
export function detectLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig | null {
  const forced = env.VIBE_PROVIDER;
  const candidates: LlmProvider[] =
    forced === 'openai' || forced === 'anthropic' ? [forced] : ['openai', 'anthropic'];

  for (const provider of candidates) {
    const apiKey = env[KEY_ENV[provider]];
    if (apiKey) {
      return { provider, apiKey, model: env.VIBE_MODEL || DEFAULT_MODELS[provider] };
    }
  }
  return null;
}

interface LlmRequest {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  extract: (data: unknown) => string | null;
}

function buildRequest(config: LlmConfig, system: string, user: string): LlmRequest {
  if (config.provider === 'openai') {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: {
        model: config.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      },
      extract: (data) => {
        const d = data as { choices?: { message?: { content?: string } }[] };
        return d.choices?.[0]?.message?.content ?? null;
      },
    };
  }
  return {
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: {
      model: config.model,
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    },
    extract: (data) => {
      const d = data as { content?: { type: string; text?: string }[] };
      const block = d.content?.find((b) => b.type === 'text');
      return block?.text ?? null;
    },
  };
}

/**
 * Calls the configured LLM and returns the text response.
 * Never throws: returns null on HTTP errors, network failures, timeouts or
 * malformed responses, so callers can fall back to local heuristics.
 */
export async function generateText(config: LlmConfig, system: string, user: string): Promise<string | null> {
  const request = buildRequest(config, system, user);
  try {
    const response = await fetch(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(request.body),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return request.extract(data);
  } catch {
    return null;
  }
}
