# AGENTS.md

Guidance for AI agents working in this repository. Read this fully before making changes.

## Git Workflow (MANDATORY — read first)

- **`dev` is the only development branch.** ALL changes (features, fixes, docs) MUST be committed to `dev`.
- **`main` is production-only.** Never commit or push directly to `main`. Changes reach `main` only by merging `dev` (release flow controlled by the repo owner).
- Before any work, verify the current branch: `git branch --show-current`. If it is not `dev`, switch first.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Repo is **private until public launch**. Remote: `github.com/dangelBorges/the-vibecoding-handbook`.

## What This Project Is

**The Vibecoding Handbook** — an open-source monorepo that teaches and automates "vibe coding" (AI-first development): it generates project-governance files (`AGENTS.md`, `.cursorrules`, `.vibecoding/` policies, ADRs) and optimizes prompts for AI coding agents. Production site: https://vibecoding.guide.

Important: this repo is the **tool**, not a consumer. The governance templates in the codebase are the *product* it generates for other projects. If generated sample files (e.g. `.vibecoding/`, wizard output) ever appear in this repo, they are test artifacts — they do NOT describe this repo.

## Monorepo Structure (npm workspaces)

- `web/` — Public website. React 19 + Vite 7 + TypeScript + Tailwind 3.4 + shadcn/ui (Radix) + HashRouter. No backend: static data lives in `web/src/data/`, all processing is client-side. Deploys to Vercel (`vercel.json`, SPA fallback).
- `cli/` — `@vibecoding/cli` npm package (`vibe` binary). Node 20+, TypeScript ESM strict, Commander.js. 7 commands: `init`, `context`, `review`, `optimize`, `chat`, `check`, `sync`. Core: `src/utils/scanner.ts` (dependency-based stack detection). Build: `tsc` → `dist/`.
- `vscode-extension/` — VS Code extension (WIP, unpublished). CommonJS, no runtime deps. 3 tree views (policies / decisions / stack), commands, context webview.
- `docs/` — Public docs + screenshots. `.github/` — CI (CLI functional tests, web build+typecheck, blocking lint) and release workflow (tags `cli@*` → npm publish).

## Conventions

- TypeScript strict everywhere; no `any` in new code; named exports; keep functions under ~50 lines.
- All user-facing content (code, UI text, docs, commit messages) in **English**.
- `web/src/components/ui/` is shadcn-generated vendor code — prefer eslint-config-level fixes over editing those files.
- React: functional components + hooks. No setState-in-effect (use lazy state init or render-phase adjustment). No navigate-during-render (wrap in `useEffect`).
- CLI: there is **no real LLM integration** — all "intelligence" is local heuristics; do not add API calls without prior discussion. Keep non-interactive (no-TTY) flows working: CI exercises them (`init -y`, `optimize`, `chat`, `review -f`).
- Marketing claims must match reality (prompt counts, check counts, feature lists) — when behavior changes, update docs and data in the same commit.

## Verify Before Committing

- Web: `cd web && npx tsc --noEmit && npm run lint && npm run build` (all must pass; lint is blocking in CI)
- CLI: `cd cli && npm run build` + smoke-test `node dist/index.js <command>` against a temp sample project
- Extension: `cd vscode-extension && npm run compile`
