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
vibe init --merge      # Merge into existing AGENTS.md instead of overwriting
```

With `--merge`, generated content lives between `<!-- vibe:begin -->` / `<!-- vibe:end -->`
markers — your own notes outside the markers are preserved on every re-run.

Creates:
- `AGENTS.md` — Project context for AI agents (auto-detected from your code)
- `.cursorrules` — IDE-specific rules
- `.vibecoding/policies/` — Git, Security, Testing, Deployment policies
- `.vibecoding/decisions/` — Architecture Decision Records

### `vibe context --auto`

**The killer feature.** Scans your actual codebase and generates unique AGENTS.md — not a template.

```bash
vibe context           # Interactive refresh
vibe context --auto    # Full auto-detection, no prompts
vibe context --dry-run # Preview changes without writing
vibe context --merge   # Update only the managed block, keep your custom notes
```

`--merge` uses the same `<!-- vibe:begin -->` / `<!-- vibe:end -->` markers as `vibe init --merge`,
so refreshing AGENTS.md never destroys your manual edits. Add `--dry-run` to preview the merged result.

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

Review code against your project's `.cursorrules` and `AGENTS.md`:

```bash
vibe review            # Review modified files
vibe review -s         # Review staged files only
vibe review -f src/... # Review specific file
```

Checks:
- console.log statements (remove before production)
- `any` types (use specific types)
- Hardcoded secrets (use env vars)
- `.then().catch()` chains (prefer async/await)
- Function length > 50 lines (extract)

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

### `vibe check`

Validate your project setup:

```bash
vibe check         # Standard check
vibe check --strict # Fail on warnings too
```

Validates:
- AGENTS.md exists
- .cursorrules configured
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
| Code review | Reads your .cursorrules | Generic rules |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | For future AI-powered features |
| `ANTHROPIC_API_KEY` | For future Claude integration |

## License

MIT
