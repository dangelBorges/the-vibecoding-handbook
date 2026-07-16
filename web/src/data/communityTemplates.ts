import type { Template } from './templates';

export interface CommunityTemplate extends Template {
  author: string;
  submittedAt: string;
  votes: number;
}

export const communityTemplates: CommunityTemplate[] = [
  {
    id: 'community-security-checklist',
    name: 'Security Review Checklist',
    filename: 'SECURITY_REVIEW_CHECKLIST.md',
    description: 'A community-curated checklist for reviewing security before shipping features.',
    content: `# Security Review Checklist

## Authentication & Authorization
- [ ] All routes that expose data require authentication
- [ ] Role-based access control is enforced on the server
- [ ] Tokens expire and are refreshed securely

## Input & Data
- [ ] All user inputs are validated (Zod, Yup, or similar)
- [ ] SQL/NoSQL injection vectors are eliminated
- [ ] Output is encoded to prevent XSS

## Secrets & Configuration
- [ ] No secrets committed to the repository
- [ ] Environment variables are documented in a sample file
- [ ] Production secrets are rotated regularly

## Dependencies
- [ ] No known vulnerable dependencies ('npm audit')
- [ ] Unused dependencies removed

## Logging & Monitoring
- [ ] Sensitive data is never logged
- [ ] Error messages do not leak stack traces or secrets
`,
    category: 'checklist',
    tags: ['Security', 'Review', 'Checklist'],
    author: '@vibe-community',
    submittedAt: '2026-07-15',
    votes: 7,
  },
  {
    id: 'community-onboarding-prompt',
    name: 'AI Onboarding Prompt',
    filename: 'ONBOARDING_PROMPT.md',
    description: 'A prompt to give an AI agent full context when joining an existing codebase.',
    content: `# AI Onboarding Context

You are joining an existing project. Before writing any code, follow these steps:

1. Read the project README and AGENTS.md.
2. Inspect the top-level directory structure and key config files.
3. Identify the framework, language, testing approach, and styling system.
4. Look at 2–3 existing features to understand conventions.
5. Ask clarifying questions before proposing changes.

Constraints:
- Match existing naming conventions and file organization.
- Prefer named exports and small functions.
- Write tests for new logic.
- Never change unrelated files.
`,
    category: 'context',
    tags: ['Onboarding', 'Context', 'AI Agent'],
    author: '@dangelborges',
    submittedAt: '2026-07-14',
    votes: 4,
  },
];
