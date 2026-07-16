import type { Prompt } from './prompts';

export interface CommunityPrompt extends Prompt {
  author: string;
  submittedAt: string;
  votes: number;
}

export const communityPrompts: CommunityPrompt[] = [
  {
    id: 'community-nextjs-auth',
    title: 'Next.js Auth Flow',
    category: 'feature',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `You are a senior Next.js engineer. Implement a complete authentication flow for a Next.js 14 app using NextAuth.js v5 (Auth.js).

Requirements:
- Credentials provider with email/password
- Secure password hashing (bcrypt or argon2)
- Protected middleware route matcher
- Login/logout UI with server actions
- TypeScript strict mode, no any types
- Error handling and loading states

Start by sharing the plan, then implement files incrementally.`,
    description: 'Full-stack auth flow for Next.js with NextAuth.js and server actions.',
    whenToUse: 'When adding email/password authentication to a Next.js project.',
    author: '@dangelborges',
    submittedAt: '2026-07-15',
    votes: 12,
  },
  {
    id: 'community-react-table',
    title: 'TanStack Table + Pagination',
    category: 'feature',
    tool: 'universal',
    stack: 'universal',
    prompt: `Build a reusable data table component with TanStack React Table.

Features:
- Sortable columns
- Client-side pagination (10 rows per page)
- Global text filter
- Row selection with bulk actions
- Accessible markup and keyboard navigation
- Styled with Tailwind CSS

Use TypeScript generics for the row type. Provide a usage example with mock data.`,
    description: 'Reusable, accessible data table with sorting, filtering and pagination.',
    whenToUse: 'When you need a list view with pagination and sorting in a React app.',
    author: '@vibe-community',
    submittedAt: '2026-07-14',
    votes: 8,
  },
  {
    id: 'community-api-tests',
    title: 'API Integration Tests',
    category: 'test',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Write integration tests for a REST API using Vitest and supertest.

Coverage:
- Happy path for CRUD endpoints
- 400/401/404 error responses
- Database cleanup between tests (testcontainers or in-memory sqlite)
- Factory functions for test data

Use Arrange-Act-Assert pattern and descriptive test names.`,
    description: 'Integration test suite for REST APIs with Vitest and supertest.',
    whenToUse: 'When you need confidence in your API endpoints before deploying.',
    author: '@vibe-community',
    submittedAt: '2026-07-13',
    votes: 5,
  },
  {
    id: 'community-prisma-crud',
    title: 'Prisma CRUD Service',
    category: 'feature',
    tool: 'windsurf',
    stack: 'nextjs',
    prompt: `Create a type-safe CRUD service layer with Prisma ORM.

Requirements:
- Generic base service with findMany, findById, create, update, delete
- Input validation with Zod schemas
- Error mapping to domain errors
- Unit tests with mocked Prisma client
- No business logic in controllers

Use dependency injection so the Prisma client can be swapped in tests.`,
    description: 'Type-safe CRUD service layer using Prisma and Zod validation.',
    whenToUse: 'When building the data access layer of a TypeScript backend.',
    author: '@vibe-community',
    submittedAt: '2026-07-12',
    votes: 3,
  },
];
