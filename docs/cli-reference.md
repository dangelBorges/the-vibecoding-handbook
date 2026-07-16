# CLI Reference

Complete reference for `@vibecoding/cli`.

## Installation

```bash
npm install -g @vibecoding/cli
```

Or use without installing:

```bash
npx @vibecoding/cli <command>
```

## Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Show version number |
| `-h, --help` | Show help for a command |

## Commands

### `vibe init`

Initialize project governance files.

```bash
vibe init              # Interactive mode
vibe init -y           # Skip prompts, use defaults
vibe init -t saas      # Pre-configured template
vibe init --merge      # Merge into existing AGENTS.md (preserves your edits)
```

**Options:**
| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts and use defaults |
| `-t, --type <type>` | Project type: saas, ecommerce, api, dashboard, content |
| `--merge` | Merge into existing AGENTS.md using managed markers instead of overwriting |

With `--merge`, the generated content is wrapped in `<!-- vibe:begin -->` / `<!-- vibe:end -->`
markers. On subsequent runs only the block between the markers is updated — anything
you wrote outside the markers is preserved.

**Generated files:**
- `AGENTS.md` — Project context for AI agents
- `.cursorrules` — IDE coding rules
- `.vibecoding/policies/git-policy.md`
- `.vibecoding/policies/security-policy.md`
- `.vibecoding/policies/testing-policy.md`
- `.vibecoding/policies/deployment-policy.md`
- `.vibecoding/decisions/ADR-001-architecture.md`

---

### `vibe context`

Update AGENTS.md from current codebase. This is the **killer feature** — it reads your actual code, not templates.

```bash
vibe context           # Interactive refresh
vibe context --auto    # Full auto-detection
vibe context --dry-run # Preview without writing
vibe context --merge   # Update only the managed block, keep your custom notes
```

**Options:**
| Option | Description |
|--------|-------------|
| `-a, --auto` | Auto-detect everything (no prompts) |
| `--dry-run` | Show what would change without writing files |
| `--merge` | Merge into existing AGENTS.md using managed markers instead of overwriting |

`--merge` uses the same `<!-- vibe:begin -->` / `<!-- vibe:end -->` marker mechanism as
`vibe init --merge`: your content outside the markers is never touched. Combined with
`--dry-run` it previews the final merged file.

**Detected information:**
- Framework (Next.js, React, Vue, Svelte, Astro, Fastify...)
- Language (TypeScript strict mode detection)
- Database (Prisma, Drizzle, Mongoose, Supabase...)
- Auth (NextAuth, Clerk, Supabase Auth, JWT...)
- Payments (Stripe, LemonSqueezy)
- Testing (Vitest, Jest, Playwright...)
- Styling (Tailwind, Styled Components, Sass...)
- API style (tRPC, GraphQL, REST...)
- Code conventions from your files

---

### `vibe review`

Review code against your project's `.cursorrules` and `AGENTS.md`.

```bash
vibe review            # Review modified files
vibe review -s         # Review staged files only
vibe review -f src/... # Review specific file
```

**Options:**
| Option | Description |
|--------|-------------|
| `-s, --staged` | Review only git staged files |
| `-f, --file <file>` | Review a specific file |

**Checks performed:**
- console.log statements in production code
- `any` TypeScript types
- Hardcoded secrets/API keys
- `.then().catch()` chains (prefer async/await)
- Function length > 50 lines

---

### `vibe optimize`

Optimize a prompt for AI agents with intent detection and context injection.

```bash
vibe optimize "create a login form"
vibe optimize -f prompt.txt
vibe optimize "fix the bug" -c context.md -o output.md
```

**Options:**
| Option | Description |
|--------|-------------|
| `-f, --file <file>` | Read prompt from file (takes precedence over the positional argument) |
| `-c, --context <file>` | Read context from file instead of AGENTS.md |
| `-o, --output <file>` | Write result to file (default: `optimized-prompt.md`) |

**Features:**
- Intent detection (feature, bugfix, refactor, test, docs)
- Auto role assignment
- Constraint injection from project context
- Token estimation
- One-copy to clipboard

---

### `vibe chat`

Interactive planning session that generates optimized prompts.

```bash
vibe chat
```

**Flow:**
1. Describe what you want to build
2. Answer 3 clarifying questions (auto-detected from intent)
3. Get a structured plan + optimized prompt
4. Saves to `vibe-plan.md` and `vibe-prompt.md`
5. Auto-copies to clipboard

---

### `vibe check`

Validate project against vibe coding policies.

```bash
vibe check
vibe check --strict
```

**Options:**
| Option | Description |
|--------|-------------|
| `--strict` | Exit with code 1 on warnings too (not just failures) |

**Validations:**
- AGENTS.md exists
- .cursorrules configured
- .vibecoding directory
- Git repository initialized
- .gitignore includes .env
- Framework detected
- Test/lint/typecheck scripts present
- Score output (0-100%)

---

### `vibe sync`

Sync templates and prompts from the built-in library.

```bash
vibe sync              # Templates + Prompts
vibe sync --templates  # Templates only
vibe sync --prompts    # Prompts only
```

**Options:**
| Option | Description |
|--------|-------------|
| `--templates` | Sync only templates |
| `--prompts` | Sync only prompts |

**Available templates:**
- `next-saas` — Next.js + Auth + Stripe + Prisma
- `react-dashboard` — React + Recharts + TanStack Table
- `api-service` — Fastify + Prisma + OpenAPI

**Prompt categories:**
- Component patterns
- Auth patterns
- Database patterns
- Testing patterns

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | For future AI-powered features |
| `ANTHROPIC_API_KEY` | For future Claude integration |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Check failures or errors |
