export interface Prompt {
  id: string;
  title: string;
  category: 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs';
  tool: 'cursor' | 'claude-code' | 'windsurf' | 'universal';
  stack: 'nextjs' | 'python' | 'rust' | 'universal';
  prompt: string;
  description: string;
  whenToUse: string;
}

export const prompts: Prompt[] = [
  {
    id: 'nextjs-feature',
    title: 'Next.js Feature Implementation',
    category: 'feature',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `You are an expert senior TypeScript developer specializing in Next.js 15 with the App Router.

CONTEXT:
- We use Server Components by default ("use client" only when needed)
- Styling: Tailwind CSS with our custom design system
- Forms: react-hook-form + zod validation
- API: tRPC with Zod input validation
- Database: Prisma ORM with PostgreSQL
- Auth: NextAuth.js v5

TASK:
Implement a [FEATURE_NAME] page that:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

CONSTRAINTS:
- Follow the existing file structure in /src/app
- Use components from /src/components/ui for common elements
- All data fetching must use tRPC procedures
- Include loading and error states
- Add proper metadata for SEO

Before writing code, share your implementation plan.`,
    description: 'Complete feature implementation prompt for Next.js apps with full-stack context.',
    whenToUse: 'When building new pages or features in a Next.js application.',
  },
  {
    id: 'api-endpoint',
    title: 'tRPC API Endpoint',
    category: 'feature',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `Create a tRPC router for [RESOURCE_NAME] with these procedures:

1. create — Create a new [resource]
2. getById — Get a single [resource] by ID
3. list — List [resources] with pagination
4. update — Update an existing [resource]
5. delete — Soft delete a [resource]

Requirements:
- Use Zod for all input validation
- Implement proper error handling
- Add authorization checks (must be authenticated)
- Include rate limiting considerations
- Write the Prisma schema updates if needed

Context: Our tRPC routers are in /src/server/routers/`,
    description: 'Generates a complete CRUD tRPC router with validation and auth.',
    whenToUse: 'When creating new API endpoints in a tRPC + Prisma stack.',
  },
  {
    id: 'bug-investigation',
    title: 'Bug Investigation & Fix',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `I'm seeing this error: [ERROR_MESSAGE]

Context:
- The error occurs when [DESCRIPTION]
- Recent changes: [RECENT_CHANGES]
- Stack trace: [STACK_TRACE]

Please:
1. Analyze the error and identify the root cause
2. Explain what's happening in simple terms
3. Provide the fix with a clear explanation
4. Suggest how to prevent this in the future

Do NOT write any code until you've explained the root cause.`,
    description: 'Structured approach to debugging with root cause analysis first.',
    whenToUse: 'When you have an error and need help understanding and fixing it.',
  },
  {
    id: 'component-extraction',
    title: 'Component Extraction & Refactor',
    category: 'refactor',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `Refactor this component by extracting the following sub-components:

[PASTE COMPONENT CODE]

Extract these components:
1. [Component 1 name] — [what it does]
2. [Component 2 name] — [what it does]

Requirements:
- Keep Server Components as Server Components
- Only create Client Components where interactivity is needed
- Pass data via props, not context
- Maintain all existing functionality
- Add proper TypeScript types for all props`,
    description: 'Extract and refactor large components into smaller, focused ones.',
    whenToUse: 'When a component is too large or handles too many responsibilities.',
  },
  {
    id: 'test-generation',
    title: 'Test Suite Generation',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write a comprehensive test suite for this function/component:

[PASTE CODE]

Include:
1. Unit tests for the main functionality
2. Edge cases (empty input, null, undefined, large values)
3. Error handling tests
4. Integration tests if applicable
5. Snapshot tests for UI components

Use [TEST_FRAMEWORK] and follow our testing conventions:
- Descriptive test names: "should [expected behavior] when [condition]"
- Arrange-Act-Assert structure
- Mock external dependencies
- Test one concept per test`,
    description: 'Complete test suite with edge cases and error handling.',
    whenToUse: 'When you need tests for a function, hook, or component.',
  },
  {
    id: 'python-api',
    title: 'Python FastAPI Endpoint',
    category: 'feature',
    tool: 'universal',
    stack: 'python',
    prompt: `You are a senior Python developer specializing in FastAPI and SQLAlchemy.

Create a FastAPI router for [RESOURCE] with:

1. Pydantic models for request/response
2. CRUD operations using SQLAlchemy async
3. Dependency injection for database sessions
4. Proper HTTP status codes
5. OpenAPI documentation
6. Pagination for list endpoints

Stack:
- FastAPI with async support
- SQLAlchemy 2.0 (async)
- PostgreSQL
- Pydantic v2

Include:
- Input validation schemas
- Error response models
- Authentication dependency (assume JWT)
- Rate limiting decorators`,
    description: 'Complete FastAPI CRUD router with async SQLAlchemy.',
    whenToUse: 'Building Python backend APIs with FastAPI.',
  },
  {
    id: 'docs-generation',
    title: 'Documentation Generation',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Generate comprehensive documentation for this code:

[PASTE CODE]

Include:
1. Overview — What this does and why
2. Parameters — Table with name, type, required, description
3. Returns — Return type and description
4. Examples — Usage examples with expected output
5. Edge Cases — Known limitations and edge cases
6. Related — Links to related functions/components

Format: Markdown
Style: Clear, concise, developer-friendly
Assume the reader is familiar with the tech stack but not this specific module.`,
    description: 'Generate complete documentation for any code module.',
    whenToUse: 'When you need to document functions, components, or APIs.',
  },
  {
    id: 'database-migration',
    title: 'Database Schema Migration',
    category: 'feature',
    tool: 'universal',
    stack: 'universal',
    prompt: `I need to migrate our database schema. Here's the current state:

[CURRENT_SCHEMA]

And here's what we need:

[DESIRED_SCHEMA]

Please:
1. Generate the migration SQL/scripts
2. Provide a rollback plan
3. Identify any data loss risks
4. Suggest a deployment strategy (zero-downtime if possible)
5. Include validation queries to verify the migration

Important:
- We have [X] records in production
- The app must stay available during migration
- Backup strategy must be included`,
    description: 'Safe database migration with rollback and validation.',
    whenToUse: 'When modifying database schemas in production.',
  },
  {
    id: 'rust-cli',
    title: 'Rust CLI Tool',
    category: 'feature',
    tool: 'universal',
    stack: 'rust',
    prompt: `Create a Rust CLI tool that [DESCRIPTION].

Requirements:
- Use clap for argument parsing
- Proper error handling with anyhow/thiserror
- Async runtime with tokio if needed
- Logging with tracing
- Configuration file support
- Unit tests for core logic
- CI-ready (GitHub Actions workflow)

Project structure:
- src/main.rs — CLI entry point
- src/lib.rs — Core logic
- src/config.rs — Configuration
- tests/ — Integration tests

Follow Rust best practices:
- Idiomatic error handling
- Proper documentation comments
- Efficient memory usage
- Comprehensive tests`,
    description: 'Complete Rust CLI project with testing and CI.',
    whenToUse: 'Building command-line tools in Rust.',
  },
  {
    id: 'code-review',
    title: 'AI Code Review',
    category: 'refactor',
    tool: 'universal',
    stack: 'universal',
    prompt: `Review this code as a senior engineer:

[PASTE CODE]

Check for:
1. Bugs and logic errors
2. Security vulnerabilities
3. Performance issues
4. Code smells (duplication, long functions, etc.)
5. Type safety issues
6. Missing error handling
7. Testing gaps
8. Documentation gaps

Format your review as:
- 🔴 Critical — Must fix
- 🟠 Warning — Should fix
- 🟡 Suggestion — Consider
- 🟢 Praise — What looks good

Provide specific code suggestions, not just general comments.`,
    description: 'Comprehensive AI code review with severity levels.',
    whenToUse: 'Before submitting a PR or when reviewing AI-generated code.',
  },
];

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'feature', label: 'Features' },
  { value: 'bugfix', label: 'Bugfixes' },
  { value: 'refactor', label: 'Refactors' },
  { value: 'test', label: 'Tests' },
  { value: 'docs', label: 'Docs' },
] as const;

export const tools = [
  { value: 'all', label: 'All Tools' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'universal', label: 'Universal' },
] as const;

export const stacks = [
  { value: 'all', label: 'All Stacks' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'universal', label: 'Universal' },
] as const;
