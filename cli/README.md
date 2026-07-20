# @vibecoding/cli

> AI-first project governance — context generation, prompt optimization, code review, and interactive planning.

The CLI companion to [The Vibe Coding Handbook](https://vibecoding.guide). It scans your actual codebase (not templates) to generate intelligent context files that make AI agents produce dramatically better code.

## Install

```bash
npm install -g @vibecoding/cli
# or
npx @vibecoding/cli <command>
```

## Commands

### `vibe init`

Initialize project governance files:

```bash
vibe init              # Interactive setup
vibe init -y           # Skip prompts, use defaults
vibe init -t saas      # Pre-configured for SaaS
vibe init --name "My Project" # Override detected project name
vibe init --describe "SaaS booking app with Stripe" # Generate AGENTS.md from natural language
vibe init --merge      # Merge into existing AGENTS.md instead of overwriting
vibe init --overwrite  # Replace an existing AGENTS.md completely
vibe init --no-llm     # Force local heuristics, skip LLM
```

`vibe init` scans your project (framework, language, database, auth, payments, tests, styling, API style, monorepo layout, scripts, conventions). When an LLM API key is present, it sends **only the detected stack summary** to the model to generate a project-specific `AGENTS.md`. If no key is present or the API fails, it falls back to local heuristics automatically. No source file contents are ever transmitted.

When `AGENTS.md` already exists, `vibe init` **merges by default** (updates only the managed block between `<!-- vibe:begin -->` / `<!-- vibe:end -->` markers). Use `--overwrite` to replace the file completely, or `--no-llm` to bypass the LLM.

`--describe` uses an LLM (OpenAI or Anthropic) to generate `AGENTS.md` from your
description plus the detected stack. Requires `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
in the environment. Only the description and stack summary are sent — never source
file contents.

Creates:
- `AGENTS.md` — Project context for AI agents (auto-detected from your code or generated from description)
- `.iderules` — IDE-specific rules
- `.vibecoding/policies/` — Git, Security, Testing, Deployment policies
- `.vibecoding/decisions/` — Architecture Decision Records

### `vibe context --auto`

**The killer feature.** Scans your actual codebase and generates unique AGENTS.md — not a template.

```bash
vibe context           # Interactive refresh
vibe context --auto    # Full auto-detection, no prompts
vibe context --describe "SaaS booking app with Stripe" # LLM-generated AGENTS.md
vibe context --dry-run # Preview changes without writing
vibe context --merge   # Update only the managed block, keep your custom notes
vibe context --overwrite # Replace AGENTS.md completely
vibe context --no-llm  # Force local heuristics, skip LLM
```

`--merge` uses the same `<!-- vibe:begin -->` / `<!-- vibe:end -->` markers as `vibe init --merge`,
so refreshing AGENTS.md never destroys your manual edits. `vibe context` merges by default when `AGENTS.md` exists; use `--overwrite` to replace it completely. Add `--dry-run` to preview the result.

When an LLM API key is present and `--describe` is not used, `vibe context` automatically sends the detected stack summary to the model to generate a project-specific `AGENTS.md`. Use `--no-llm` to force local heuristics.

Detects automatically:
- Framework (Next.js, React, Vue, Svelte, Astro, Fastify...)
- Language (TypeScript strict mode detection)
- Database (Prisma, Drizzle, Mongoose, Supabase...)
- Auth (NextAuth, Clerk, Supabase Auth, JWT...)
- Payments (Stripe, LemonSqueezy)
- Testing framework (Vitest, Jest, Playwright...)
- Styling (Tailwind, Styled Components, Sass...)
- API style (tRPC, GraphQL, REST...)
- Code conventions from your actual files

### `vibe review`

Review code against your project's `.iderules` and `AGENTS.md`:

```bash
vibe review            # Review modified files
vibe review -s         # Review staged files only
vibe review -f src/... # Review specific file
vibe review --fix      # Auto-fix safe issues, suggest fixes for the rest
vibe review --base origin/main --strict  # CI: review PR diff and fail on issues
```

Checks:
- console.log statements (remove before production)
- `any` types (use specific types)
- Hardcoded secrets (use env vars)
- `.then().catch()` chains (prefer async/await)
- Function length > 50 lines (extract)

With `--fix`, standalone `console.log(...)` statements are removed automatically
(inline or multi-line usages are left untouched), the files are re-scanned, and
the remaining issues are printed with a fix suggestion for each rule.

`--base <ref>` reviews files changed since a git ref (e.g. `origin/main`), and
`--strict` exits with code 1 when errors or warnings are found — use it in CI
workflows to gate pull requests.

### `vibe optimize`

Transform vague prompts into structured AI instructions:

```bash
vibe optimize "create a login form"
vibe optimize -f prompt.txt
vibe optimize "fix the bug" -c context.md -o output.md
```

Features:
- Intent detection (feature, bugfix, refactor, test, docs)
- Auto-includes AGENTS.md context
- Role assignment (Senior Dev, Test Engineer, etc.)
- Constraint injection (TypeScript strict, testing, patterns)
- Token estimation
- AI mode: when `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set, the final prompt is rewritten by the LLM (`VIBE_PROVIDER` / `VIBE_MODEL` to override); falls back to heuristics automatically

### `vibe chat`

Interactive planning session that generates optimized prompts:

```bash
vibe chat
```

1. Describe what you want to build
2. Answer 3 clarifying questions (auto-detected intent)
3. Get a structured plan + optimized prompt
4. Save to `vibe-plan.md` and `vibe-prompt.md`
5. Auto-copied to clipboard

**AI mode (optional):** if `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set, the
plan and prompt are generated by the LLM instead of local heuristics
(`VIBE_PROVIDER=openai|anthropic` forces a provider, `VIBE_MODEL` overrides the
model). Only your task description, answers and stack summary are sent — never
source file contents. Without a key, or if the API fails, it falls back to local
heuristics automatically.

### `vibe check`

Validate your project setup:

```bash
vibe check         # Standard check
vibe check --strict # Fail on warnings too
```

Validates:
- AGENTS.md exists
- .iderules configured
- .vibecoding directory
- Git repository initialized
- .gitignore includes .env
- Framework detected
- Test/lint/typecheck scripts present

### `vibe sync`

Sync templates and prompts from the library:

```bash
vibe sync              # Templates + Prompts
vibe sync --templates  # Templates only
vibe sync --prompts    # Prompts only
```

Templates available:
- `next-saas` — Next.js + Auth + Stripe + Prisma
- `react-dashboard` — React + Recharts + TanStack Table
- `api-service` — Fastify + Prisma + OpenAPI

Prompt library:
- Component patterns (Compound Components, Data Tables)
- Auth patterns (OAuth, API Authentication)
- Database patterns (CRUD with Prisma)
- Testing patterns (Component Testing)

## Why This CLI is Different

| Feature | @vibecoding/cli | Template-based tools |
|---------|----------------|---------------------|
| Context generation | **Reads your actual code** | Generic templates |
| AGENTS.md uniqueness | Per-project, auto-updated | Same for everyone |
| Framework detection | 15+ frameworks | 2-3 hardcoded |
| Prompt optimization | Intent-aware + context | Simple wrapping |
| Code review | Reads your .iderules | Generic rules |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for AI mode |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI mode |
| `VIBE_PROVIDER` | Force LLM provider: `openai` or `anthropic` |
| `VIBE_MODEL` | Override the default LLM model |
| `VIBE_NO_BANNER` | Set to `1` to disable the install welcome banner |

## License

MIT
