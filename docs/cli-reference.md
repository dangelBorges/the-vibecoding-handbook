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

On install, a welcome banner shows the first steps. It stays silent in CI and
non-interactive terminals; set `VIBE_NO_BANNER=1` to disable it permanently.

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
vibe init --describe "SaaS booking app with Stripe" # LLM-generated AGENTS.md from description
vibe init --merge      # Merge into existing AGENTS.md (preserves your edits)
vibe init --overwrite  # Replace an existing AGENTS.md completely
vibe init --no-llm     # Force local heuristics, skip LLM
```

**Options:**
| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip prompts and use defaults |
| `-t, --type <type>` | Project type: saas, ecommerce, api, dashboard, content |
| `--describe <text>` | Generate AGENTS.md from a natural-language project description (requires `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`) |
| `--merge` | Merge into existing AGENTS.md using managed markers instead of overwriting |
| `--overwrite` | Replace an existing AGENTS.md completely instead of merging |
| `--no-llm` | Skip the LLM and generate AGENTS.md from local heuristics only |

`vibe init` scans your project (framework, language, database, auth, payments, tests, styling, API style, monorepo layout, scripts, conventions). When an LLM API key is present, it sends **only the detected stack summary** to the model to generate a project-specific `AGENTS.md`. If no key is present or the API fails, it falls back to local heuristics automatically. No source file contents are ever transmitted.

When `AGENTS.md` already exists, `vibe init` merges by default (updates only the managed block between `<!-- vibe:begin -->` / `<!-- vibe:end -->` markers). Use `--overwrite` to replace the file completely, or `--no-llm` to bypass the LLM.

`--describe` still requires an API key and exits with an error if one is not found.

With `--merge`, the generated content is wrapped in `<!-- vibe:begin -->` / `<!-- vibe:end -->`
markers. On subsequent runs only the block between the markers is updated — anything
you wrote outside the markers is preserved.

**Generated files:**
- `AGENTS.md` — Project context for AI agents
- `.iderules` — IDE coding rules
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
vibe context --describe "SaaS booking app with Stripe" # LLM-generated AGENTS.md
vibe context --dry-run # Preview without writing
vibe context --merge   # Update only the managed block, keep your custom notes
vibe context --no-llm  # Force local heuristics, skip LLM
```

**Options:**
| Option | Description |
|--------|-------------|
| `-a, --auto` | Auto-detect everything (no prompts) |
| `--describe <text>` | Generate AGENTS.md from a natural-language project description (requires `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`) |
| `--dry-run` | Show what would change without writing files |
| `--merge` | Merge into existing AGENTS.md using managed markers instead of overwriting |
| `--no-llm` | Skip the LLM and generate AGENTS.md from local heuristics only |

`--describe` sends your description and the detected stack summary to the LLM; no
source file contents are transmitted.

When an LLM API key is present and `--describe` is not used, `vibe context` automatically sends the detected stack summary to the model to generate a project-specific `AGENTS.md`. Use `--no-llm` to force local heuristics.

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

Review code against your project's `.iderules` and `AGENTS.md`.

```bash
vibe review            # Review modified files
vibe review -s         # Review staged files only
vibe review -f src/... # Review specific file
vibe review --fix      # Auto-fix safe issues, suggest fixes for the rest
vibe review --base origin/main --strict  # CI: review PR diff and fail on issues
```

**Options:**
| Option | Description |
|--------|-------------|
| `-s, --staged` | Review only git staged files |
| `-f, --file <file>` | Review a specific file |
| `--fix` | Remove standalone `console.log(...)` statements and print fix suggestions for the remaining issues |
| `--base <ref>` | Review files changed since a git ref (e.g. `origin/main`) |
| `--strict` | Exit code 1 when errors or warnings are found (CI mode) |

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
- AI mode: with `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`, the final prompt is rewritten by the LLM; falls back to heuristics on failure

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

**AI mode (optional):** with `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in the
environment, the plan and prompt are generated by the LLM instead of local
heuristics. `VIBE_PROVIDER=openai|anthropic` forces a provider, `VIBE_MODEL`
overrides the model. Only the task description, your answers and the stack
summary leave the machine — never source file contents. Without a key (or on
API failure) it falls back to local heuristics automatically.

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
- .iderules configured
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
| `OPENAI_API_KEY` | OpenAI API key for AI mode |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI mode |
| `VIBE_PROVIDER` | Force LLM provider: `openai` or `anthropic` |
| `VIBE_MODEL` | Override the default LLM model |
| `VIBE_NO_BANNER` | Set to `1` to disable the install welcome banner |

## Exit Codes

| Code | Meaning |
|------|-------------|
| `0` | Success |
| `1` | Check failures or errors |
| `1` | `--describe` used without a valid API key |
