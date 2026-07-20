import type { IncomingMessage, ServerResponse } from 'node:http';
import type { LLMRequest, LLMResponse, LLMStackKey } from '../src/types/llm';

const NVIDIA_NIM_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.1-8b-instruct';
const MAX_TOKENS = 512;
const REQUEST_TIMEOUT_MS = 15000;
const DAILY_LIMIT_PER_IP = 10;

const VALID_OPTIONS: Record<LLMStackKey, string[]> = {
  frontend: ['nextjs-app', 'nextjs-pages', 'react-spa', 'astro', 'vue', 'svelte'],
  backend: ['nextjs-fullstack', 'nextjs-external', 'serverless', 'fastapi', 'express', 'rails'],
  database: ['supabase-postgres', 'vercel-postgres', 'firebase', 'prisma-postgres', 'mongodb', 'turso'],
  auth: ['supabase-auth', 'nextauth', 'clerk', 'firebase-auth', 'auth0', 'custom'],
  hosting: ['vercel', 'netlify', 'railway', 'cloudflare', 'aws'],
};

interface RateLimitEntry {
  count: number;
  date: string;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.date !== today) {
    rateLimitMap.set(ip, { count: 1, date: today });
    return true;
  }
  if (entry.count >= DAILY_LIMIT_PER_IP) return false;
  entry.count += 1;
  return true;
}

function buildPrompt(request: LLMRequest): string {
  const { answers, locale } = request;
  const localized = locale === 'es' ? 'español' : locale === 'pt' ? 'português' : locale === 'zh' ? '中文' : 'English';

  return `You are a technical architect recommending a web development stack.

Given the project details below, recommend the best stack from the allowed options. Respond ONLY with a valid JSON object (no markdown, no comments) in this exact format:

{
  "frontend": "one of: ${VALID_OPTIONS.frontend.join(', ')}",
  "backend": "one of: ${VALID_OPTIONS.backend.join(', ')}",
  "database": "one of: ${VALID_OPTIONS.database.join(', ')}",
  "auth": "one of: ${VALID_OPTIONS.auth.join(', ')}",
  "hosting": "one of: ${VALID_OPTIONS.hosting.join(', ')}",
  "rationale": "2-3 sentences in ${localized} explaining why this stack fits the project"
}

Project details:
- Name: ${answers.projectName || 'Unknown'}
- Description: ${answers.projectDescription || 'Not provided'}
- Type: ${answers.projectType || 'saas'}
- Features: ${(answers.features || []).join(', ') || 'none'}
- Timeline: ${answers.timeline || 'month'}
- Team size: ${answers.teamSize || 'solo'}
- Payments: ${answers.payments || 'none'}
- Email: ${answers.email || 'none'}
- Storage: ${answers.storage || 'none'}
- Testing: ${answers.testing || 'minimal'}
- Monitoring: ${answers.monitoring || 'none'}

Rules:
- Use only the allowed values listed above.
- If the project is "content" or "portfolio", prefer Astro or Next.js with a lightweight backend.
- If payments are needed, prefer a backend that supports secure webhooks.
- If real-time is needed, prefer Supabase or Firebase.
- If the team is solo or small, prefer simpler, managed services (Vercel, Supabase, Clerk).
- Keep the rationale concise and in ${localized}.`;
}

function normalizeRecommendation(value: string, allowed: string[]): string | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '-');
  if (allowed.includes(normalized)) return normalized;
  // Try matching without extra normalization
  if (allowed.includes(value.trim())) return value.trim();
  return null;
}

function parseRecommendations(content: string): LLMResponse {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { ok: false, error: 'LLM response did not contain valid JSON' };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'Failed to parse LLM response as JSON' };
  }

  const recommendations: Record<string, string> = {};
  for (const key of Object.keys(VALID_OPTIONS) as LLMStackKey[]) {
    const value = typeof parsed[key] === 'string' ? (parsed[key] as string) : '';
    const normalized = normalizeRecommendation(value, VALID_OPTIONS[key]);
    if (!normalized) {
      return { ok: false, error: `LLM returned an invalid value for ${key}: ${value}` };
    }
    recommendations[key] = normalized;
  }

  const rationale = typeof parsed.rationale === 'string' ? parsed.rationale : '';

  return {
    ok: true,
    recommendations: {
      frontend: recommendations.frontend,
      backend: recommendations.backend,
      database: recommendations.database,
      auth: recommendations.auth,
      hosting: recommendations.hosting,
      rationale,
    },
  };
}

async function callNvidiaNim(prompt: string): Promise<string | null> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(NVIDIA_NIM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a concise technical architect.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function sendJson(res: ServerResponse, statusCode: number, payload: LLMResponse): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function parseBody(req: IncomingMessage): Promise<Partial<LLMRequest> | null> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as Partial<LLMRequest>);
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    sendJson(res, 429, { ok: false, error: 'Daily rate limit exceeded. Try again tomorrow.' });
    return;
  }

  const body = await parseBody(req);
  if (!body || !body.answers || typeof body.locale !== 'string') {
    sendJson(res, 400, { ok: false, error: 'Invalid request body. Expected { answers, locale }' });
    return;
  }

  if (!process.env.NVIDIA_NIM_API_KEY) {
    sendJson(res, 503, { ok: false, error: 'LLM service is not configured' });
    return;
  }

  const prompt = buildPrompt(body as LLMRequest);
  const content = await callNvidiaNim(prompt);

  if (!content) {
    sendJson(res, 502, { ok: false, error: 'LLM service returned an error or timed out' });
    return;
  }

  const result = parseRecommendations(content);
  sendJson(res, result.ok ? 200 : 502, result);
}
