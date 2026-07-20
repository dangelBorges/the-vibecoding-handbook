import type { ProjectScan } from './scanner.js';

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

function buildScanSummary(scan: ProjectScan): Record<string, unknown> {
  return {
    name: scan.name,
    framework: scan.framework,
    language: scan.language,
    runtime: scan.runtime,
    hasTypeScript: scan.hasTypeScript,
    hasTests: scan.hasTests,
    testFramework: scan.testFramework,
    hasDatabase: scan.hasDatabase,
    database: scan.database,
    hasAuth: scan.hasAuth,
    authProvider: scan.authProvider,
    hasPayments: scan.hasPayments,
    paymentProvider: scan.paymentProvider,
    hasRealtime: scan.hasRealtime,
    styling: scan.styling,
    apiStyle: scan.apiStyle,
    packageManager: scan.packageManager,
    isMonorepo: scan.isMonorepo,
    monorepoTool: scan.monorepoTool,
    packages: scan.packages?.map((p) => ({
      name: p.name,
      framework: p.framework,
      language: p.language,
    })),
    conventions: scan.conventions,
    scripts: scan.scripts,
  };
}

/**
 * Rewrites a raw user prompt into a structured, high-signal prompt for AI coding
 * agents. Returns null on any LLM failure so callers can fall back to the local
 * heuristic optimizer.
 */
export async function generateOptimizedPrompt(
  rawPrompt: string,
  context: string | undefined,
  intent: string,
  config: LlmConfig
): Promise<string | null> {
  const system = `You are a prompt engineer for AI coding agents. Rewrite the user's raw prompt into a clear, structured Markdown prompt that an AI agent can execute effectively.
Include these sections only when relevant: Role, Context, Task, Constraints, Expected Output.
Be specific, concise, and actionable. Do not invent credentials, URLs, or implementation details not implied by the input.`;

  const parts = [
    `Detected intent: ${intent}`,
    `Raw prompt:\n${rawPrompt}`,
    context ? `Project context:\n${context}` : '',
    'Return only the rewritten prompt in Markdown. Do not wrap it in code fences.',
  ];

  return generateText(config, system, parts.filter(Boolean).join('\n\n'));
}

/**
 * Generates a complete AGENTS.md from a natural-language description and a
 * project scan summary. Returns null on any LLM failure so callers can fall
 * back to the local heuristic generator.
 */
export async function generateAgentsMd(description: string, scan: ProjectScan, config: LlmConfig): Promise<string | null> {
  const summary = buildScanSummary(scan);
  const system = `You are a senior technical writer creating an AGENTS.md file for a team of AI coding agents.
Be concise but specific. Do not invent concrete URLs, credentials, or secrets. Use the provided project stack.`;

  const user = `Project description:
${description}

Detected stack:
${JSON.stringify(summary, null, 2)}

Write a complete AGENTS.md in Markdown. Include these sections (omit any that are irrelevant):
- Overview
- Tech Stack
- Architecture
- Coding Standards
- Security Rules
- Git Workflow
- Deployment Checklist
- Scripts Reference (only if scripts exist)

Return only the Markdown content. Do not wrap it in code fences.`;

  return generateText(config, system, user);
}

/**
 * Generates a complete AGENTS.md purely from the project scan summary. This is
 * used by `vibe init` when no explicit `--describe` is provided but an LLM key
 * is available. Returns null on any LLM failure so callers can fall back to the
 * local heuristic generator.
 */
export async function generateAgentsMdFromScan(scan: ProjectScan, config: LlmConfig): Promise<string | null> {
  const summary = buildScanSummary(scan);
  const system = `You are a senior technical writer creating an AGENTS.md file for a team of AI coding agents working on an existing project.
Be concise but specific. Use ONLY the detected project stack to infer rules, conventions, and architecture. Do not invent concrete URLs, credentials, or secrets. Do not add sections that are irrelevant to the detected stack.
When the framework is unknown, keep the advice generic but practical. When a database, auth, payments, or tests are detected, include stack-specific rules for them.`;

  const user = `Detected project stack:
${JSON.stringify(summary, null, 2)}

Write a complete AGENTS.md in Markdown tailored to the project above. Include only relevant sections from this list:
- Overview (what kind of project this is, based on the stack)
- Tech Stack (table with Layer | Technology | Notes)
- Architecture (patterns implied by the stack, e.g. RSC for Next.js App Router, tRPC procedures, monorepo package layout)
- Coding Standards (language-specific, framework-specific, and general rules)
- Security Rules (auth, database, payments, env vars — only if detected)
- Git Workflow (branching, commits, PRs)
- Testing Standards (only if a test framework is detected or suggest one if not)
- Deployment Checklist (framework-specific when possible, e.g. Vercel for Next.js)
- Scripts Reference (only real scripts from the scan)

Rules:
- Mention specific technologies actually detected (e.g., Next.js, Prisma, Clerk, Vitest, Tailwind).
- Do not invent scripts, files, or conventions not present in the stack.
- Keep it scannable: use tables and bullet lists.
- Return only the Markdown content. Do not wrap it in code fences.`;

  return generateText(config, system, user);
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
