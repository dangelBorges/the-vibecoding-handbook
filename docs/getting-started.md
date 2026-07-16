# Getting Started with Vibe Coding

## What is Vibe Coding?

Vibe coding is an AI-first approach to software development where you describe what you want in natural language, and AI agents generate production-ready code. Instead of writing every line manually, you:

1. **Describe** the feature or fix in plain language
2. **Provide context** about your project (tech stack, conventions, constraints)
3. **Review** the generated code
4. **Iterate** with follow-up prompts

## The Core Principle

> **Context is everything.** The quality of AI-generated code is directly proportional to the quality of context you provide.

That's why this project focuses heavily on **context engineering** — structuring your project information so AI agents can produce their best work.

## Quick Start (5 minutes)

### Step 1: Install the CLI

```bash
npm install -g @vibecoding/cli
```

### Step 2: Initialize Your Project

```bash
cd your-existing-project
vibe init
```

This creates:
- `AGENTS.md` — Your project's "brain" for AI agents
- `.iderules` — IDE-specific coding rules
- `.vibecoding/policies/` — Project policies (Git, Security, Testing, Deployment)

### Step 3: Scan Your Codebase

```bash
vibe context --auto
```

The CLI reads your `package.json`, directory structure, and config files to generate a **unique** AGENTS.md tailored to your project.

### Step 4: Start Coding with AI

Open your AI-powered editor (Cursor, GitHub Copilot, etc.) and start prompting. With AGENTS.md in your project root, the AI now understands:

- Your tech stack and framework conventions
- Your coding standards (TypeScript strict, testing requirements)
- Your security rules
- Your Git workflow

## Writing Effective Prompts

### Bad Prompts

```
"create a login page"
"fix the bug"
"add tests"
```

### Good Prompts

```
"Create a login page with email/password and OAuth (Google/GitHub). 
Use NextAuth.js v5 with the App Router. Include form validation with 
Zod, error handling, and loading states. Follow the existing component 
patterns in src/components/. Write tests with Vitest and React Testing 
Library."
```

### Optimized Prompts (using the CLI)

```bash
vibe optimize "create a login page"
```

The CLI transforms your prompt into a structured instruction with:
- Detected intent (feature, bugfix, refactor, test, docs)
- Role assignment (Senior Developer, Test Engineer, etc.)
- Constraints from your project context
- Pre-implementation planning steps

## The AGENTS.md File

This is the heart of vibe coding. It's a structured document that tells AI agents everything they need to know about your project:

```markdown
# MyProject — Agent Context

## Overview
A Next.js 14 application using TypeScript.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 |
| Language | TypeScript (strict) |
| Auth | NextAuth.js |
| Database | PostgreSQL (Prisma) |

## Coding Standards
- Strict mode — no `any` types
- Server Components by default
- Client components with `"use client"`

## Security Rules
- All API routes require authentication
- Input validation with Zod
- No raw SQL queries
```

## Next Steps

- Read the [full handbook](https://vibecoding.guide)
- Explore the [prompt library](https://vibecoding.guide/prompts)
- Try the [Project Decision Wizard](https://vibecoding.guide/wizard)
- Join the community discussions on GitHub
