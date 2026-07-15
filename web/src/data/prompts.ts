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
  {
    id: 'jwt-auth',
    title: 'JWT Authentication Flow',
    category: 'feature',
    tool: 'universal',
    stack: 'universal',
    prompt: `Implement a complete JWT authentication flow for [APP_NAME].

Requirements:
1. POST /auth/register — hash passwords with bcrypt or argon2 (never store plaintext)
2. POST /auth/login — issue a short-lived access token (15 min) plus a refresh token (7 days, httpOnly cookie)
3. POST /auth/refresh — rotate refresh tokens and detect token reuse
4. POST /auth/logout — invalidate the refresh token server-side
5. Auth middleware that verifies tokens and attaches the user to the request

Constraints:
- Secrets come from environment variables, never hardcoded
- Consistent error responses (401 vs 403)
- Rate limiting on the login endpoint to mitigate brute force

Before writing code, list the trade-offs of token storage (cookie vs localStorage) for my use case.`,
    description: 'Full JWT auth with refresh rotation, reuse detection, and secure storage.',
    whenToUse: 'When adding authentication to an app that does not use a hosted auth provider.',
  },
  {
    id: 'infinite-pagination',
    title: 'Infinite Scroll Pagination',
    category: 'feature',
    tool: 'cursor',
    stack: 'universal',
    prompt: `Implement infinite scroll pagination for [LIST_COMPONENT].

Context:
- Data source: [API_ENDPOINT] with cursor-based pagination
- The list can grow to 10,000+ items

Requirements:
1. Use IntersectionObserver (or the framework equivalent) to trigger the next page
2. Show skeleton loaders while fetching, not a full-page spinner
3. Handle empty, error, and end-of-list states explicitly
4. Keep scroll position stable as new items load
5. Cancel in-flight requests when the component unmounts

Avoid offset pagination — first explain briefly why cursor-based scales better here.`,
    description: 'Cursor-based infinite scroll with proper loading and error states.',
    whenToUse: 'When building feeds or long lists that must stay fast at scale.',
  },
  {
    id: 'file-upload',
    title: 'File Upload with Validation',
    category: 'feature',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `Build a file upload feature in this Next.js app.

Requirements:
1. Drag-and-drop zone with click-to-browse fallback
2. Client-side validation: file type, max size [X]MB, max [N] files
3. Per-file upload progress indicator
4. Server-side validation again — never trust the client
5. Store files in [S3/local disk] and persist metadata in the database
6. Image previews with proper cleanup of object URLs

Every validation failure needs a clear, user-readable error message. Include the server action or route handler with proper size limits.`,
    description: 'Complete upload flow with dual validation and progress feedback.',
    whenToUse: 'When adding avatar, attachment, or document uploads to a Next.js app.',
  },
  {
    id: 'websocket-realtime',
    title: 'Real-Time Updates with WebSockets',
    category: 'feature',
    tool: 'universal',
    stack: 'universal',
    prompt: `Add real-time updates to [FEATURE] using WebSockets.

Requirements:
1. WebSocket server with rooms/channels scoped to [RESOURCE]
2. Client with automatic reconnection and exponential backoff
3. Typed JSON message envelopes with a discriminator field
4. Heartbeat/ping to detect dead connections
5. Auth: validate the user token during the connection upgrade
6. Graceful fallback to polling when WebSockets are unavailable

After implementing, explain the scaling limits of a single server and when I would need Redis pub/sub.`,
    description: 'Production-ready WebSocket layer with reconnection and auth.',
    whenToUse: 'When building live dashboards, chat, or collaborative features.',
  },
  {
    id: 'feature-flags',
    title: 'Feature Flag System',
    category: 'feature',
    tool: 'universal',
    stack: 'universal',
    prompt: `Implement a lightweight feature flag system for rolling out [FEATURE_NAME].

Requirements:
1. A typed flag registry — no raw string lookups scattered through the code
2. Flags resolvable per environment and per user segment (percentage rollout)
3. A one-line hook/helper so components read flags cleanly
4. A kill switch that works without a redeploy
5. Ownership metadata per flag: who created it and when it should be removed

Finish with a cleanup checklist for deleting the flag once rollout reaches 100%.`,
    description: 'Typed feature flags with gradual rollout and a cleanup path.',
    whenToUse: 'When shipping risky changes that need gradual rollout or instant rollback.',
  },
  {
    id: 'memory-leak',
    title: 'Memory Leak Investigation',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `Our application's memory usage grows continuously until it crashes.

Context:
- Runtime: [Node.js/browser]
- Growth pattern: [DESCRIBE — e.g. steady climb after each request]
- What I have already ruled out: [LIST]

Walk me through a systematic investigation:
1. Which signals confirm a leak versus normal GC behavior
2. How to capture and compare heap snapshots/profiles in this runtime
3. The usual suspects for this stack: event listeners, timers, closures, unbounded caches, detached DOM
4. The most likely cause given my symptoms, and the fix
5. A regression check that proves the leak is gone`,
    description: 'Systematic heap analysis to find and fix memory leaks.',
    whenToUse: 'When memory climbs monotonically and restarts are masking the problem.',
  },
  {
    id: 'race-condition',
    title: 'Race Condition Diagnosis',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `I suspect a race condition: [SYMPTOM — e.g. duplicate records, stale reads after writes].

Relevant code:
[PASTE CODE]

Please:
1. Identify the exact interleaving that causes the bug (describe it step by step)
2. Explain why it only manifests under concurrency or load
3. Propose fixes ordered by intrusiveness: atomic operation, optimistic locking, pessimistic locking, serialization via queue
4. Recommend one, justify it, and implement it
5. Write a test that reliably failed before the fix and passes after`,
    description: 'Find the interleaving, fix it with the right concurrency primitive.',
    whenToUse: 'When you see duplicates, lost updates, or heisenbugs under load.',
  },
  {
    id: 'cors-error',
    title: 'CORS Error Resolution',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `I am getting this CORS error: [EXACT_ERROR_MESSAGE]

Setup:
- Frontend origin: [URL], Backend origin: [URL]
- Request: [simple or preflighted — credentials? custom headers?]
- Current CORS config: [PASTE]

Explain and fix:
1. What the browser is actually blocking and why
2. Why the fix belongs on the server, not the client
3. The exact config change — without falling back to a wildcard origin combined with credentials
4. A curl command that verifies the preflight succeeds
5. Common gotchas: trailing slashes, redirects, and proxies stripping headers`,
    description: 'Understand and fix CORS properly instead of wildcarding everything.',
    whenToUse: 'When the browser blocks cross-origin requests to your API.',
  },
  {
    id: 'n-plus-one-queries',
    title: 'N+1 Query Elimination',
    category: 'bugfix',
    tool: 'universal',
    stack: 'python',
    prompt: `This endpoint is slow and I suspect N+1 queries: [ENDPOINT]

Context:
- ORM: SQLAlchemy [VERSION]
- Relevant models: [PASTE MODELS]
- Current query code: [PASTE CODE]

Please:
1. Point out exactly where the N+1 pattern occurs
2. Show how to confirm it with query logging or a query counter
3. Fix it with selectinload or joinedload — explain which one fits and why
4. Note the trade-off versus eager-loading everything
5. Add a test that fails if the query count regresses`,
    description: 'Detect, confirm, and eliminate N+1 queries in SQLAlchemy.',
    whenToUse: 'When an endpoint gets slower as related data grows.',
  },
  {
    id: 'slow-query-indexes',
    title: 'Slow Query & Index Tuning',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `This SQL query takes [X] seconds on a table with [ROW_COUNT] rows:

[PASTE QUERY]

Table definitions:
[PASTE SCHEMA]

Existing indexes:
[PASTE INDEXES]

Tasks:
1. Interpret the EXPLAIN plan (ask me for it if needed) and identify the bottleneck
2. Recommend indexes — explain why column order in a composite index matters here
3. Rewrite the query if its shape is the real problem
4. Flag the downsides of each new index: write amplification and storage
5. Give me before/after verification steps to prove the improvement`,
    description: 'EXPLAIN-driven index and query optimization with verification.',
    whenToUse: 'When a query that was fine in development is slow in production.',
  },
  {
    id: 'cache-invalidation',
    title: 'Stale Cache / Invalidation Bug',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `Users see stale data after updates. Caching is involved.

Setup:
- Cache layer: [Redis/browser/CDN/in-memory]
- Write path: [DESCRIBE]
- Read path: [DESCRIBE]

Diagnose and fix:
1. Identify where invalidation is missing or racing with concurrent reads
2. Choose a strategy — TTL, write-through, write-behind, or event-based invalidation — and justify it
3. Implement it with stampede protection (request coalescing or locking)
4. Version cache keys so deploys do not serve mixed shapes
5. Add observability: hit-rate and staleness metrics`,
    description: 'Fix stale-data bugs with a deliberate invalidation strategy.',
    whenToUse: 'When users must refresh or wait to see their own changes.',
  },
  {
    id: 'timezone-bug',
    title: 'Timezone & Date Bug',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `Dates and times are wrong for some users: [SYMPTOM — e.g. records appear on the wrong day].

Relevant code:
[PASTE CODE]

Please:
1. Trace where the value crosses boundaries: client to API to database and back
2. Identify every implicit conversion: Date parsing, server timezone, DB column type
3. State the rule we will follow (store UTC, convert only at the edges) and apply it
4. Replace Date-string hacks with an explicit timezone-aware library
5. Add tests covering DST transitions and a user in a non-UTC timezone`,
    description: 'Trace date values across boundaries and enforce UTC-at-rest.',
    whenToUse: 'When times shift by hours or dates flip depending on user location.',
  },
  {
    id: 'flaky-test',
    title: 'Flaky Test Stabilization',
    category: 'bugfix',
    tool: 'universal',
    stack: 'universal',
    prompt: `This test fails intermittently in CI but passes locally:

[PASTE TEST]

Typical failure output: [ERROR/OUTPUT]

Please:
1. List the likely sources of flakiness in this code: real timers, wall-clock time, randomness, network, test ordering, shared state, un-awaited async
2. Rank them for this specific test
3. Fix it properly: fake timers, seeded randomness, explicit awaits, isolated state
4. If the test couples to implementation details, rewrite it against observable behavior
5. Suggest a CI quarantine policy as a temporary safety net — explicitly not as the fix`,
    description: 'Root-cause flaky tests instead of retrying them into passing.',
    whenToUse: 'When CI failures disappear on re-run and erode trust in the suite.',
  },
  {
    id: 'incident-triage',
    title: 'Production Incident Triage',
    category: 'bugfix',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Production incident: [SYMPTOM — e.g. 5xx spike or latency jump since 14:00 UTC].

Available evidence:
- Recent deploys: [LIST]
- Logs: [PASTE RELEVANT LOGS]
- Metrics: [DESCRIBE]

Act as an incident responder:
1. Form hypotheses ranked by likelihood, each tied to specific evidence
2. For each hypothesis, give one command, query, or check that confirms or rules it out
3. Recommend immediate mitigation (rollback, feature flag, scale out) separately from the root-cause fix
4. Once the cause is confirmed, write the fix
5. Draft a blameless postmortem skeleton: timeline, impact, root cause, action items`,
    description: 'Structured incident response: mitigate first, root-cause second.',
    whenToUse: 'During or right after a production incident with unclear cause.',
  },
  {
    id: 'class-to-hooks',
    title: 'Class Component to Hooks',
    category: 'refactor',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `Convert this React class component to a function component with hooks:

[PASTE COMPONENT]

Rules:
1. Map lifecycle methods to useEffect with correct dependency arrays — do not blindly mirror componentDidMount/componentDidUpdate
2. Replace this.state with useState, or useReducer where updates are coupled
3. Preserve behavior exactly, including cleanup of subscriptions and timers
4. Use useCallback only where referential stability actually matters
5. Add TypeScript types for props and state

Finish by listing the behavioral differences you had to watch for.`,
    description: 'Faithful class-to-function conversion with correct effect semantics.',
    whenToUse: 'When modernizing legacy React class components.',
  },
  {
    id: 'js-to-ts-migration',
    title: 'JavaScript to TypeScript Migration',
    category: 'refactor',
    tool: 'cursor',
    stack: 'nextjs',
    prompt: `Migrate this JavaScript module to TypeScript:

[PASTE JS CODE]

Requirements:
1. Strict-mode compatible: no implicit any, no non-null assertion abuse
2. Model the domain precisely — prefer union types over loose strings
3. Use generics where the module is reused with different shapes
4. Type the public API first, then the internals
5. Keep runtime behavior identical — this is a types-only change

Flag anything too dynamic to type safely and propose the minimal refactor to make it typable.`,
    description: 'Strict, behavior-preserving JS to TS conversion.',
    whenToUse: 'When migrating a codebase to TypeScript incrementally.',
  },
  {
    id: 'tech-debt-paydown',
    title: 'Technical Debt Paydown Plan',
    category: 'refactor',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Help me pay down technical debt in [MODULE/AREA].

Current pain points:
[DESCRIBE — e.g. duplicated logic, god object, missing tests]

Constraints:
- Feature work continues in parallel — no big-bang rewrites
- Public behavior must not change

Plan:
1. Catalog the debt with an interest-vs-principal estimate (ongoing pain versus cost to fix)
2. Sequence the work so every step leaves the codebase releasable
3. For the top item, apply the strangler-fig pattern: add the new path, migrate callers, delete the old one
4. Add characterization tests before touching anything risky
5. Define measurable done criteria for this debt being paid`,
    description: 'Incremental, releasable debt reduction with characterization tests.',
    whenToUse: 'When debt slows every change but a rewrite is not an option.',
  },
  {
    id: 'performance-review',
    title: 'Performance Review & Optimization',
    category: 'refactor',
    tool: 'universal',
    stack: 'universal',
    prompt: `Review this code for performance problems:

[PASTE CODE]

Context: [hot path? traffic volume? latency budget?]

Analyze:
1. Time and space complexity of the core logic
2. Wasteful work: recomputation, unnecessary copies, N+1 patterns, chatty I/O
3. Concurrency opportunities missed or misused
4. Frontend: re-render triggers, bundle weight, hydration cost
5. Backend: allocations and blocking calls on the hot path

Output a table of findings (issue, impact, effort, expected win) and fixed code for the top items. Include benchmark suggestions — no optimization without measurement.`,
    description: 'Measure-first performance review with prioritized fixes.',
    whenToUse: 'When something is slow and you need evidence before optimizing.',
  },
  {
    id: 'security-review',
    title: 'Security-Focused Code Review',
    category: 'refactor',
    tool: 'universal',
    stack: 'universal',
    prompt: `Perform a security-focused review of this code:

[PASTE CODE OR DIFF]

Threat model: [web app / API / CLI — and which assets matter]

Check specifically for:
1. Injection: SQL, command, template, XSS
2. Broken authN/authZ: missing checks, IDOR, privilege escalation
3. Secrets: hardcoded, logged, or leaked through error messages
4. Unsafe deserialization and risky dependencies
5. Data exposure: overly broad responses, missing rate limits

For every finding give: severity, a concrete exploit scenario, and the specific fix. Reference OWASP categories where relevant.`,
    description: 'OWASP-aligned security audit with exploit scenarios and fixes.',
    whenToUse: 'Before shipping auth, payment, or user-data handling code.',
  },
  {
    id: 'dead-code-elimination',
    title: 'Dead Code Elimination',
    category: 'refactor',
    tool: 'windsurf',
    stack: 'rust',
    prompt: `Help me safely remove dead code from this Rust project.

Steps:
1. Use compiler warnings, cargo-udeps, and reachability from the crate entry points to find candidates: unused functions, modules, features, and dependencies
2. For each candidate, confirm it is truly unreferenced — check trait impls, macros, and conditional compilation
3. Produce a deletion list grouped by confidence: safe / needs verification / keep
4. Remove the safe group and keep the test suite green
5. Update Cargo.toml and any docs referencing removed items

Do not delete public API items without flagging the semver impact.`,
    description: 'Confidence-graded dead code removal in Rust projects.',
    whenToUse: 'When warnings and unused code accumulate after refactors.',
  },
  {
    id: 'error-handling-standardization',
    title: 'Error Handling Standardization',
    category: 'refactor',
    tool: 'universal',
    stack: 'rust',
    prompt: `Standardize error handling across this codebase. Today it is inconsistent: [DESCRIBE — mix of unwrap, string errors, silent ignores].

Target state:
1. A clear taxonomy: domain errors versus infrastructure errors
2. thiserror for typed library errors; anyhow only at application boundaries
3. No panics on recoverable paths — every Result handled or propagated with context
4. Errors carry actionable context (which operation failed, with which input) without leaking internals to end users
5. A single mapping layer from internal errors to user-facing messages or HTTP status codes

Demonstrate the pattern on [PASTE MODULE], then give a migration checklist for the rest of the codebase.`,
    description: 'Consistent Result-based error handling with proper context.',
    whenToUse: 'When every module handles errors differently and debugging suffers.',
  },
  {
    id: 'structured-logging',
    title: 'Structured Logging Migration',
    category: 'refactor',
    tool: 'universal',
    stack: 'python',
    prompt: `Replace ad-hoc print and logging calls with structured logging in this Python service.

Requirements:
1. JSON-formatted logs with consistent fields: timestamp, level, service, request_id, message
2. Context propagation via contextvars — no manual passing of request/user IDs
3. A defined level policy: what belongs in DEBUG vs INFO vs WARNING vs ERROR
4. A redaction filter so PII and secrets never reach logs
5. Correlation across async tasks and outgoing HTTP calls

Deliver the logging setup module, convert [PASTE FILE] as the reference example, and list the fields our dashboards should index.`,
    description: 'JSON logs with request correlation and secret redaction.',
    whenToUse: 'When grepping unstructured logs during incidents wastes hours.',
  },
  {
    id: 'e2e-playwright',
    title: 'Playwright E2E Tests',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write Playwright end-to-end tests for this critical user flow: [FLOW — e.g. signup to onboarding to first project].

Requirements:
1. Page Object Model so selectors live in exactly one place
2. Prefer role and label selectors over CSS or XPath
3. Run against a real backend with seeded test data — do not mock our own API
4. Rely on auto-waiting assertions; no fixed sleeps
5. Capture trace and video on failure for CI debugging
6. Tag tests (@smoke vs full) so CI runs a fast subset on every PR

Cover the happy path plus the two most damaging failure modes.`,
    description: 'Maintainable E2E suite with page objects and CI tiers.',
    whenToUse: 'When critical flows break in production despite unit tests.',
  },
  {
    id: 'api-integration-tests',
    title: 'API Integration Tests',
    category: 'test',
    tool: 'universal',
    stack: 'python',
    prompt: `Write integration tests for this FastAPI service, exercising the real HTTP layer against a test database.

Setup:
- pytest with httpx AsyncClient via ASGI transport
- PostgreSQL in Docker (or testcontainers), migrated fresh per session
- Per-test transaction rollback for isolation

Cover, for the [RESOURCE] endpoints:
1. Happy-path CRUD round trip
2. Validation failures returning 422 with useful detail
3. Auth boundaries: missing or expired token gives 401, wrong owner gives 403
4. Pagination edges and filtering
5. The concurrency-sensitive case: [DESCRIBE]

Include fixtures for the app, the client, and test data factories.`,
    description: 'Full-stack API tests with real DB and per-test isolation.',
    whenToUse: 'When unit tests with mocked DBs let contract bugs through.',
  },
  {
    id: 'third-party-mocks',
    title: 'Mocking Third-Party APIs',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `I need to test code that depends on [THIRD_PARTY_API — e.g. Stripe, SendGrid, S3].

Relevant code:
[PASTE CODE]

Please:
1. Introduce a thin adapter interface around the third party, so the mock boundary is ours, not theirs
2. Provide mocks simulating success, failure, timeout, and rate limiting
3. Add one contract test against the real sandbox API to catch drift — marked to skip in normal CI
4. Keep mock behavior faithful to the documented API; note the assumptions you took from their docs
5. Assert on the interactions that matter, not on implementation details`,
    description: 'Adapter-based mocking with a sandbox contract test.',
    whenToUse: 'When external APIs make tests slow, flaky, or impossible offline.',
  },
  {
    id: 'edge-case-coverage',
    title: 'Edge Case Test Coverage',
    category: 'test',
    tool: 'windsurf',
    stack: 'universal',
    prompt: `Audit this function's test coverage for edge cases:

[PASTE FUNCTION]

Existing tests:
[PASTE TESTS]

Tasks:
1. Map the input domain: boundaries, empty/null/undefined, extremes, unicode, very large inputs
2. Identify untested branches and error paths
3. Write the missing tests — use property-based testing (fast-check/hypothesis) where the input space is large
4. Assert on error types and messages, not just that it throws
5. Report before/after branch coverage and any bugs the new tests exposed`,
    description: 'Systematic edge-case audit with property-based testing.',
    whenToUse: 'When coverage looks high but bugs keep slipping through.',
  },
  {
    id: 'a11y-tests',
    title: 'Accessibility (a11y) Testing',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `Add accessibility testing for this UI: [COMPONENT/PAGE]

Requirements:
1. Automated axe-core checks wired into the existing test runner
2. Keyboard-only navigation test: tab order, visible focus, focus trapped in modals, Escape closes dialogs
3. Screen-reader semantics: correct roles, labels, and aria-live regions for dynamic updates
4. Color-contrast verification against WCAG 2.1 AA
5. Sanity checks for reduced motion and 200% zoom

Fix any violations you find as part of the work and explain each fix.`,
    description: 'WCAG AA testing: axe, keyboard nav, and screen-reader semantics.',
    whenToUse: 'When shipping user-facing UI that must be accessible.',
  },
  {
    id: 'test-data-factories',
    title: 'Test Data Factories',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `Create test data factories to replace our brittle fixtures.

Current pain: [DESCRIBE — e.g. huge JSON fixtures, interdependent objects, tests breaking on schema changes]

Requirements:
1. One factory per entity ([ENTITIES]) with sensible defaults and named overrides
2. Relationship helpers: build a user with N posts in a single call
3. Unique values per call (emails, slugs) to avoid collisions between tests
4. Traits for common states: admin, expired, archived
5. Integration with [TEST_FRAMEWORK] and our ORM

Refactor [PASTE TEST] to demonstrate the before/after readability gain.`,
    description: 'Composable factories and traits replacing static fixtures.',
    whenToUse: 'When fixture maintenance costs more than the tests are worth.',
  },
  {
    id: 'load-testing-k6',
    title: 'Load Testing with k6',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write a k6 load test for [ENDPOINT/SYSTEM].

Context:
- Expected traffic: [RPS/users], peak multiplier: [X]
- SLA: [e.g. p95 under 300ms, error rate under 0.1%]

Requirements:
1. A realistic user scenario, not a single-endpoint hammer: [DESCRIBE FLOW]
2. Stages: ramp-up, sustained load, spike, ramp-down
3. Thresholds codified from the SLA so CI fails on regression
4. Think time and parameterized data (unique users and payloads)
5. A summary with p50/p95/p99 and an analysis of what breaks first

Include instructions to run it locally and in CI.`,
    description: 'SLA-driven load tests with realistic scenarios and CI gates.',
    whenToUse: 'Before launches, sales events, or after scaling complaints.',
  },
  {
    id: 'pytest-suite',
    title: 'Professional pytest Suite',
    category: 'test',
    tool: 'universal',
    stack: 'python',
    prompt: `Build a proper pytest suite for this Python module:

[PASTE CODE]

Requirements:
1. Test files mirroring the module structure
2. parametrize for input matrices instead of copy-pasted tests
3. Fixtures with deliberate scopes — no hidden inter-test state
4. monkeypatch for external calls; tests never touch network or disk
5. Naming convention: test_<unit>__<behavior>__<condition>
6. Project config: markers (slow, integration), coverage fail-under, strict defaults

Aim for behavior coverage, not line-count coverage.`,
    description: 'Idiomatic pytest suite with parametrize, fixtures, and markers.',
    whenToUse: 'When a Python project has ad-hoc or copy-pasted tests.',
  },
  {
    id: 'webhook-contract-tests',
    title: 'Webhook Contract Tests',
    category: 'test',
    tool: 'universal',
    stack: 'universal',
    prompt: `We receive webhooks from [PROVIDER] and also send webhooks to customers. I need contract tests for both directions.

Receiving side:
1. Signature verification: valid, invalid, expired timestamp, replay attempt
2. Payload schema validation against the provider's documented shapes
3. Idempotency: the same event delivered twice is processed exactly once

Sending side:
4. Golden payloads pinned to our public schema — CI fails if we break consumers
5. Delivery semantics: retries with backoff and the guarantee we document (at-least-once)

Include example payloads as fixtures and recommend a versioning strategy.`,
    description: 'Contract tests for inbound and outbound webhooks.',
    whenToUse: 'When webhook integrations break silently on provider or schema changes.',
  },
  {
    id: 'openapi-spec',
    title: 'OpenAPI Specification',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Generate an OpenAPI 3.1 specification for this API:

[PASTE ROUTES/CODE OR DESCRIBE ENDPOINTS]

Requirements:
1. Every endpoint with request/response schemas, shared via components to avoid duplication
2. Auth scheme documented (JWT bearer or API key) and applied per endpoint
3. Standard error responses (400/401/403/404/422/500) with one consistent error schema
4. Pagination, filtering, and sorting parameters documented with examples
5. Realistic example values — never bare "string"

Then advise how to keep spec and code in sync (code-first vs spec-first) for our stack.`,
    description: 'Complete OpenAPI 3.1 spec with shared schemas and examples.',
    whenToUse: 'When consumers need API docs that stay trustworthy.',
  },
  {
    id: 'project-readme',
    title: 'Project README',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write a README.md for this project: [PROJECT NAME/DESCRIPTION]

Context:
- Audience: developers evaluating or contributing to the project
- Stack: [STACK]

Structure:
1. One-paragraph pitch: what it does and the problem it solves
2. Badges (CI, license, version) — only ones that actually work
3. Quickstart: prerequisites, install, run — in under five commands
4. Usage examples the reader can copy-paste and run
5. Configuration table: env vars, options, defaults
6. Architecture overview in three to five sentences with a diagram placeholder
7. Contributing and license sections linking to the real files

Tone: direct, no marketing fluff. Every command must be correct.`,
    description: 'Developer-first README with a working five-command quickstart.',
    whenToUse: 'When open-sourcing a project or onboarding new contributors.',
  },
  {
    id: 'docstrings',
    title: 'Docstrings & API Comments',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write documentation comments for this module following our style guide:

[PASTE CODE]

Style:
- Format: [JSDoc / TSDoc / Google-style / NumPy-style / rustdoc]
- Document the why and the contracts, not the obvious what
- Cover parameters, return values, thrown/raised errors, and panics or safety invariants where relevant
- One runnable example per public function where it aids understanding
- Note edge cases, complexity, and side effects when they are non-obvious

Skip self-explanatory internals; concentrate on the public API surface.`,
    description: 'Contract-focused docstrings with runnable examples.',
    whenToUse: 'When public APIs lack documentation before a release.',
  },
  {
    id: 'changelog-generation',
    title: 'Changelog Generation',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Generate a CHANGELOG.md entry for release [VERSION] from these commits and PRs:

[PASTE COMMIT LIST OR git log OUTPUT]

Rules:
1. Follow Keep a Changelog format with Semantic Versioning
2. Group entries into Added / Changed / Deprecated / Removed / Fixed / Security
3. Rewrite from the user's perspective: "Fixed crash when X", not "refactored Y"
4. Flag breaking changes prominently, with migration steps
5. Drop internal noise (chores, CI tweaks) unless user-visible
6. Link PRs and issues following the existing convention

Recommend the correct version bump and justify it.`,
    description: 'Keep-a-Changelog release notes written for users, not devs.',
    whenToUse: 'When cutting a release from a pile of raw commits.',
  },
  {
    id: 'contributing-guide',
    title: 'Contributing Guide',
    category: 'docs',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Write a CONTRIBUTING.md for this repository.

Context:
- Stack and tooling: [STACK]
- Review process: [DESCRIBE]

Cover:
1. Dev environment setup: exact commands from clone to running the test suite
2. Branch and commit conventions (e.g. Conventional Commits) and PR requirements
3. Code style: which linter/formatter runs and how to run it before pushing
4. Testing expectations for a mergeable PR
5. How to report bugs and propose features (issue templates)
6. What contributors can expect: review turnaround, merge process, release cadence

Keep it under one page where possible — link out instead of duplicating other docs.`,
    description: 'One-page contributing guide from clone to merged PR.',
    whenToUse: 'When preparing a repo for external contributors.',
  },
  {
    id: 'docker-guide',
    title: 'Docker Packaging & Guide',
    category: 'docs',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Create production-grade Docker packaging for this app: [STACK/SERVICE DESCRIPTION]

Deliverables:
1. Multi-stage Dockerfile: small final image, non-root user, pinned base image versions
2. A .dockerignore that keeps the build context lean
3. docker-compose.yml for local development with dependencies ([DB/Redis/etc.]) and healthchecks
4. Layer caching optimized so dependency installs are cached separately from source changes
5. Docs: build/run commands, an env var table, and how to debug inside the container

Report the final image size and suggest an image scanning step (e.g. trivy) for CI.`,
    description: 'Multi-stage Dockerfile, compose for dev, and security notes.',
    whenToUse: 'When containerizing a service for the first time or hardening it.',
  },
  {
    id: 'ci-pipeline',
    title: 'CI Pipeline Setup',
    category: 'docs',
    tool: 'claude-code',
    stack: 'universal',
    prompt: `Set up a GitHub Actions CI pipeline for this repository: [STACK]

Requirements:
1. Jobs: lint, typecheck, unit tests, build — each with clear failure output
2. A matrix across [runtime versions/OS] only where it adds real signal
3. Dependency caching so a typical run stays under [X] minutes
4. A concurrency group that cancels outdated runs on the same branch
5. Required status checks for merge, with artifacts (coverage, build output) uploaded
6. A separate, clearly marked job for slow or integration tests

Write the workflow YAML and explain every non-obvious choice.`,
    description: 'Fast, cached GitHub Actions pipeline with branch protection.',
    whenToUse: 'When setting up CI for a new repo or fixing a slow one.',
  },
  {
    id: 'env-vars-doc',
    title: 'Environment Variables Audit',
    category: 'docs',
    tool: 'windsurf',
    stack: 'universal',
    prompt: `Audit and document every environment variable in this codebase.

Steps:
1. Find every env var read: search for process.env, os.environ, std::env, and config files
2. Produce a reference table: name, required/optional, default, type/format, used by, description
3. Group by concern: server, database, third-party keys, feature flags
4. Generate a .env.example with safe placeholder values — never real secrets
5. Add startup validation that fails fast with a clear message listing missing or invalid vars
6. Document which vars need rotation procedures and where the real secrets live (vault/SSM)`,
    description: 'Full env var inventory with validation and .env.example.',
    whenToUse: 'When new developers cannot start the app without tribal knowledge.',
  },
  {
    id: 'adr',
    title: 'Architecture Decision Record',
    category: 'docs',
    tool: 'universal',
    stack: 'universal',
    prompt: `Write an Architecture Decision Record for this decision: [DECISION — e.g. choose Postgres over DynamoDB for X].

Context:
[DESCRIBE FORCES, CONSTRAINTS, TEAM, SCALE]

Format:
1. Status (proposed/accepted/superseded) and date
2. Context: the forces at play, including non-technical ones
3. Decision: what we decided, stated plainly
4. Alternatives considered with honest pros and cons — including "do nothing"
5. Consequences: positive, negative, and the follow-up work this creates
6. Revisit triggers: how we will know the decision was wrong

Write it for a future engineer who was not in the room.`,
    description: 'ADR template that captures context, alternatives, and consequences.',
    whenToUse: 'When making architectural choices the team must remember later.',
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
