# AGENTS.md

Guidance for AI agents working in this repository. Read this fully before making changes.

## Git Workflow (MANDATORY — read first)

- **`dev` is the only development branch.** ALL changes (features, fixes, docs) MUST be committed to `dev`.
- **`main` is production-only.** Never commit or push directly to `main`. Changes reach `main` only by merging `dev` (release flow controlled by the repo owner).
- Before any work, verify the current branch: `git branch --show-current`. If it is not `dev`, switch first.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Repo is **private until public launch**. Remote: `github.com/dangelBorges/the-vibecoding-handbook`.

## What This Project Is

**The Vibecoding Handbook** — an open-source monorepo that teaches and automates "vibe coding" (AI-first development): it generates project-governance files (`AGENTS.md`, `.iderules`, `.vibecoding/` policies, ADRs) and optimizes prompts for AI coding agents. Production site: https://vibecoding.guide.

Important: this repo is the **tool**, not a consumer. The governance templates in the codebase are the *product* it generates for other projects. If generated sample files (e.g. `.vibecoding/`, wizard output) ever appear in this repo, they are test artifacts — they do NOT describe this repo.

## Monorepo Structure (independent packages — no npm workspaces)

- `web/` — Public website. React 19 + Vite 7 + TypeScript + Tailwind 3.4 + shadcn/ui (Radix) + HashRouter. No backend: static data lives in `web/src/data/`, all processing is client-side. Deploys to Vercel (`vercel.json`, SPA fallback). **Package manager: pnpm** (`pnpm-lock.yaml`, `packageManager` pinned).
- `cli/` — `@vibecoding/cli` npm package (`vibe` binary). Node 20+, TypeScript ESM strict, Commander.js. 7 commands: `init`, `context`, `review`, `optimize`, `chat`, `check`, `sync`. Core: `src/utils/scanner.ts` (dependency-based stack detection, monorepo-aware). Build: `tsc` → `dist/`. **Package manager: pnpm**.
- `vscode-extension/` — VS Code extension, published on the Marketplace as `TheVibecoder.the-vibecoding-handbook`. CommonJS, no runtime deps. 3 tree views (policies / decisions / stack), commands, context webview. **Package manager: npm** (deliberate exception).
- `docs/` — Public docs + screenshots. `.github/` — CI (CLI functional tests, web build+typecheck, blocking lint) and release workflow (tags `cli@*` → npm publish).

Package manager rule: **use pnpm in `web/` and `cli/`** (never npm — do not create `package-lock.json` there); npm only in `vscode-extension/`. The repo root is scripts-only (no dependencies, no lockfile).

## Conventions

- **Local development always runs on port 4000** (`http://localhost:4000`) — port 3000 belongs to another project on the owner's machine. Dev and preview servers use `strictPort`; never change or let Vite fall back to another port.
- TypeScript strict everywhere; no `any` in new code; named exports; keep functions under ~50 lines.
- All user-facing content (code, UI text, docs, commit messages) in **English**.
- `web/src/components/ui/` is shadcn-generated vendor code — prefer eslint-config-level fixes over editing those files.
- React: functional components + hooks. No setState-in-effect (use lazy state init or render-phase adjustment). No navigate-during-render (wrap in `useEffect`).
- CLI: `vibe chat`, `vibe init`/`vibe context --describe`, and `vibe optimize` have **opt-in LLM enhancement** (owner-approved): if `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` is present the provider is called via native `fetch` (zero SDK deps — `src/utils/llm.ts`; `VIBE_PROVIDER`/`VIBE_MODEL` override). Everything else is local heuristics. **Hard rules:** never send source file contents; always fall back to heuristics on any API failure; `--describe` without a key exits with an error; do not add more API calls without prior discussion. Keep non-interactive (no-TTY) flows working: CI exercises them (`init -y`, `optimize`, `chat`, `review -f`).
- Marketing claims must match reality (prompt counts, check counts, feature lists) — when behavior changes, update docs and data in the same commit.

## Verify Before Committing

- Web: `cd web && pnpm exec tsc --noEmit && pnpm run lint && pnpm run build` (all must pass; lint is blocking in CI)
- CLI: `cd cli && pnpm run build` + smoke-test `node dist/index.js <command>` against a temp sample project
- Extension: `cd vscode-extension && npm run compile`
