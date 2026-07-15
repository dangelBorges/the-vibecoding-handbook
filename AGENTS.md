# AGENTS.md

Guidance for AI agents working in this repository.

## Git Workflow (MANDATORY)

- **`dev` is the only branch for development.** All changes, fixes and features MUST be committed to `dev`.
- **`main` is production-only.** Never commit or push directly to `main`. Changes reach `main` exclusively by merging `dev` (release flow controlled by the repo owner).
- Before starting any work, verify you are on `dev` (`git branch --show-current`). If not, switch to it first.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## Project Map

Monorepo (npm workspaces) — "The Vibecoding Handbook":

- `web/` — React 19 + Vite 7 + TypeScript + Tailwind + shadcn/ui site (vibecoding.guide)
- `cli/` — `@vibecoding/cli` npm package (`vibe` binary, Node 20+, Commander.js, ESM)
- `vscode-extension/` — VS Code extension (CommonJS, no runtime deps)
- `docs/` — public documentation; `.github/` — CI/CD, templates, contributing

## Verify Before Committing

- Web: `cd web && npx tsc --noEmit && npm run lint && npm run build`
- CLI: `cd cli && npm run build` (then smoke-test commands with `node dist/index.js`)
- Extension: `cd vscode-extension && npm run compile`

## Conventions

- TypeScript strict everywhere; no `any` in new code; named exports; functions < 50 lines.
- All user-facing content (code, docs, UI text, commit messages) in **English**.
- UI components in `web/src/components/ui/` are shadcn-generated — prefer config-level fixes over editing them.
- Repo is private until launch; remote: `github.com/dangelBorges/the-vibecoding-handbook`.
