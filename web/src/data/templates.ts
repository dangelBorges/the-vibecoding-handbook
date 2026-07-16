export interface Template {
  id: string;
  name: string;
  description: string;
  filename: string;
  content: string;
  category: 'context' | 'starter' | 'checklist' | 'rules';
  tags: string[];
}

export const templates: Template[] = [
  {
    id: 'agents-md',
    name: 'AGENTS.md',
    description: 'Project context file that defines architecture, patterns, and constraints for AI agents.',
    filename: 'AGENTS.md',
    category: 'context',
    tags: ['Context', 'AI Agent', 'Project Setup'],
    content: `# Project Context

## Overview
[Describe your project in 2-3 sentences]

## Tech Stack
- Framework: [e.g., Next.js 15]
- Language: [e.g., TypeScript 5.7]
- Styling: [e.g., Tailwind CSS v4]
- Database: [e.g., PostgreSQL via Prisma]
- Auth: [e.g., NextAuth.js v5]
- API: [e.g., tRPC / Server Actions]

## Architecture
- App Router structure in /src/app
- Shared components in /src/components
- Database schema in /prisma/schema.prisma
- API routes in /src/server/routers/
- Utilities in /src/lib/

## Coding Standards
- Use React Server Components by default
- Client components only when needed (\`"use client"\`)
- All forms use react-hook-form + zod
- API responses follow { success: boolean, data?: T, error?: string }
- Named exports preferred over default exports

## Patterns
- [Describe your key patterns]

## Constraints
- Never expose database connection strings
- Always validate user input server-side
- Use our logger utility, not console.log
- Follow existing file naming conventions
`,
  },
  {
    id: 'iderules',
    name: '.iderules',
    description: 'IDE-specific rules that guide the AI agent in real-time across editors.',
    filename: '.iderules',
    category: 'rules',
    tags: ['IDE', 'Rules'],
    content: `# Global rules
- Always use TypeScript strict mode
- Prefer Server Components unless interactivity is needed
- Use the existing UI component library
- Follow the established file naming conventions

# Code style
- Use named exports, not default exports
- Props interfaces should be named {ComponentName}Props
- Use async/await, not .then()
- Error handling: always use try/catch with our error utilities

# Forbidden
- No \`any\` types
- No console.log in production code
- No inline styles (use Tailwind)
- No direct database queries from components
- No unvalidated user input in queries
`,
  },
  {
    id: 'production-checklist',
    name: 'Production Checklist',
    description: 'Pre-deployment checklist for AI-generated code. Print and use in every PR.',
    filename: 'PRODUCTION_CHECKLIST.md',
    category: 'checklist',
    tags: ['Security', 'Deployment', 'Review'],
    content: `# Production Checklist

## Security
- [ ] No secrets or API keys in code
- [ ] Input validation on all user inputs
- [ ] Authorization checks on protected routes
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention (output encoding)
- [ ] Dependencies audited (\`npm audit\`)

## Quality
- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] New code has test coverage
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Loading states added

## Architecture
- [ ] Follows existing patterns
- [ ] No duplicate code
- [ ] Proper component decomposition
- [ ] Database migrations reviewed
- [ ] API changes documented

## Review
- [ ] Code reviewed by human
- [ ] Security-critical paths verified
- [ ] Performance impact assessed
- [ ] Accessibility checked
`,
  },
  {
    id: 'pr-review-template',
    name: 'PR Review Template',
    description: 'Template for reviewing AI-generated pull requests.',
    filename: 'PR_REVIEW_TEMPLATE.md',
    category: 'checklist',
    tags: ['PR', 'Review', 'Workflow'],
    content: `# PR Review: [Feature Name]

## Summary
[1-2 sentence description of the changes]

## AI Tool Used
- [ ] Cursor
- [ ] Claude Code
- [ ] Windsurf
- [ ] Other: ___

## Review Checklist
- [ ] Code compiles/types pass
- [ ] Tests added and passing
- [ ] No security issues
- [ ] Follows project patterns
- [ ] Documentation updated

## Security Review
- [ ] No hardcoded secrets
- [ ] Auth checks present
- [ ] Input validation
- [ ] Safe query construction

## Notes
[Any concerns, questions, or follow-ups]

## Decision
- [ ] Approved
- [ ] Changes requested
- [ ] Needs security review
`,
  },
  {
    id: 'project-starter-nextjs',
    name: 'Next.js Starter Prompt',
    description: 'Initial prompt to scaffold a new Next.js project with best practices.',
    filename: 'nextjs-starter-prompt.md',
    category: 'starter',
    tags: ['Next.js', 'Starter', 'Prompt'],
    content: `# Next.js Project Starter

## Initial Prompt
\`\`\`
Create a new Next.js 15 project with the following setup:

1. TypeScript with strict mode
2. Tailwind CSS v4
3. shadcn/ui initialized with neutral base color
4. App Router structure
5. The following folder structure:
   - src/app/ — Pages
   - src/components/ui/ — shadcn components
   - src/components/ — Custom components
   - src/lib/ — Utilities
   - src/hooks/ — Custom hooks
   - src/types/ — Shared types

6. Essential configurations:
   - ESLint with strict rules
   - Prettier formatting
   - Path aliases (@/)
   - Dark mode support

7. Install essential packages:
   - react-hook-form
   - zod
   - @hookform/resolvers
   - clsx, tailwind-merge

Create an AGENTS.md file at the root with project context.
\`\`\`
`,
  },
];

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'context', label: 'Context Files' },
  { value: 'rules', label: 'IDE Rules' },
  { value: 'checklist', label: 'Checklists' },
  { value: 'starter', label: 'Starters' },
] as const;
