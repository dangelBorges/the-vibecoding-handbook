# Vibe Coding Handbook — Web

Interactive learning platform and generator for vibe-coding governance files.

## Development

```bash
cd web
pnpm install
pnpm run dev
```

The dev server runs on `http://localhost:4000` (strict port).

## AI-powered wizard recommendations

The project wizard can call an LLM (NVIDIA NIM) to generate tailored stack recommendations based on the user's answers.

### Setup

1. Get a free NVIDIA NIM API key from [https://build.nvidia.com/](https://build.nvidia.com/).
2. Copy `web/.env.example` to `web/.env.local` and set the key:

```bash
NVIDIA_NIM_API_KEY=nvapi-...
```

3. Deploy the site to Vercel and add `NVIDIA_NIM_API_KEY` as an environment variable in the Vercel dashboard.

### Local testing of the API route

API routes (`web/api/*`) are Vercel Functions. During `pnpm run dev` (Vite), they are not served. To test locally:

```bash
cd web
vercel dev
```

Or deploy to a Vercel preview branch and test the wizard there.

### Rate limits

The API route includes a simple per-IP daily limit (10 requests/day) to protect the free NVIDIA NIM tier. For production scale, replace the in-memory limiter with Vercel KV or a similar persistent store.

## Build

```bash
cd web
pnpm exec tsc --noEmit && pnpm run lint && pnpm run build
```

## Deployment

The site deploys to Vercel. The `vercel.json` catch-all rewrite supports the SPA fallback; API routes are served from `web/api/*`.
