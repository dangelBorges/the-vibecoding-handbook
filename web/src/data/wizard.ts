// ============================================================
// WIZARD DATA — Project Decision Framework
// ============================================================

export type WizardStep =
  | 'project-info'
  | 'requirements'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'auth'
  | 'hosting'
  | 'extras'
  | 'review';

export interface WizardQuestion {
  id: string;
  step: WizardStep;
  question: string;
  description?: string;
  type: 'select' | 'multi-select' | 'text' | 'radio';
  options: { value: string; label: string; description?: string }[];
}

export interface WizardAnswers {
  projectName: string;
  projectDescription: string;
  projectType: string;
  features: string[];
  timeline: string;
  teamSize: string;
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  hosting: string;
  payments: string;
  email: string;
  storage: string;
  realtime: boolean;
  testing: string;
  monitoring: string;
}

// ============================================================
// QUESTIONS
// ============================================================

export const questions: WizardQuestion[] = [
  // STEP 1: Project Info
  {
    id: 'projectName',
    step: 'project-info',
    question: 'What is your project name?',
    type: 'text',
    options: [],
  },
  {
    id: 'projectDescription',
    step: 'project-info',
    question: 'Describe your project in one sentence',
    description: 'Example: "A SaaS invoicing platform for freelancers"',
    type: 'text',
    options: [],
  },
  {
    id: 'projectType',
    step: 'project-info',
    question: 'What type of project is this?',
    type: 'select',
    options: [
      { value: 'saas', label: 'SaaS / Web App', description: 'Multi-tenant web application with auth and payments' },
      { value: 'ecommerce', label: 'E-commerce', description: 'Online store with products, cart, and checkout' },
      { value: 'content', label: 'Content Platform', description: 'Blog, CMS, or content-heavy site' },
      { value: 'marketplace', label: 'Marketplace', description: 'Platform connecting buyers and sellers' },
      { value: 'api', label: 'API / Backend Service', description: 'REST/GraphQL API consumed by other clients' },
      { value: 'dashboard', label: 'Internal Dashboard', description: 'Admin panel or analytics dashboard' },
      { value: 'mobile', label: 'Mobile App', description: 'iOS/Android app (with web fallback)' },
      { value: 'tool', label: 'Developer Tool / CLI', description: 'Command-line tool or developer utility' },
      { value: 'portfolio', label: 'Portfolio / Landing', description: 'Personal or company website' },
      { value: 'other', label: 'Other', description: 'Something unique' },
    ],
  },

  // STEP 2: Requirements
  {
    id: 'features',
    step: 'requirements',
    question: 'What core features do you need?',
    type: 'multi-select',
    options: [
      { value: 'auth', label: 'User Authentication', description: 'Sign up, login, password reset' },
      { value: 'payments', label: 'Payments / Subscriptions', description: 'Stripe, PayPal, or similar' },
      { value: 'realtime', label: 'Real-time Updates', description: 'WebSockets, live data, notifications' },
      { value: 'uploads', label: 'File Uploads', description: 'Images, documents, PDFs' },
      { value: 'search', label: 'Search', description: 'Full-text search across content' },
      { value: 'analytics', label: 'Analytics', description: 'User behavior tracking, dashboards' },
      { value: 'email', label: 'Email Sending', description: 'Transactional emails, newsletters' },
      { value: 'cms', label: 'CMS / Content Management', description: 'Admin can create/edit content' },
      { value: 'multi-tenant', label: 'Multi-tenancy', description: 'Organizations, teams, workspaces' },
      { value: 'notifications', label: 'Push Notifications', description: 'Browser or mobile push' },
      { value: 'api', label: 'Public API', description: 'REST/GraphQL API for third parties' },
      { value: 'ai', label: 'AI Integration', description: 'LLM features, chatbots, agents' },
    ],
  },
  {
    id: 'timeline',
    step: 'requirements',
    question: 'What is your timeline?',
    type: 'select',
    options: [
      { value: 'week', label: '1-2 weeks', description: 'Quick MVP or prototype' },
      { value: 'month', label: '1 month', description: 'Focused MVP with core features' },
      { value: 'quarter', label: '1-3 months', description: 'Full-featured product' },
      { value: 'long', label: '3+ months', description: 'Complex platform' },
    ],
  },
  {
    id: 'teamSize',
    step: 'requirements',
    question: 'How many developers?',
    type: 'select',
    options: [
      { value: 'solo', label: 'Just me', description: 'Solo developer' },
      { value: 'small', label: '2-3 people', description: 'Small team' },
      { value: 'medium', label: '4-10 people', description: 'Growing team' },
      { value: 'large', label: '10+ people', description: 'Large organization' },
    ],
  },

  // STEP 3: Frontend
  {
    id: 'frontend',
    step: 'frontend',
    question: 'Choose your frontend approach',
    type: 'radio',
    options: [
      {
        value: 'nextjs-app',
        label: 'Next.js 15 (App Router)',
        description: 'Full-stack React with SSR/SSG. Best for SEO, performance, and server components.',
      },
      {
        value: 'nextjs-pages',
        label: 'Next.js 15 (Pages Router)',
        description: 'Classic Next.js with pages directory. More mature ecosystem, simpler mental model.',
      },
      {
        value: 'react-spa',
        label: 'React SPA + Vite',
        description: 'Single-page application. Best for dashboards and apps where SEO is not critical.',
      },
      {
        value: 'astro',
        label: 'Astro',
        description: 'Content-focused sites. Islands architecture, minimal JavaScript. Great for blogs/docs.',
      },
      {
        value: 'vue',
        label: 'Vue 3 + Nuxt',
        description: 'Progressive framework. Gentler learning curve, excellent DX.',
      },
      {
        value: 'svelte',
        label: 'SvelteKit',
        description: 'Compiler-based, minimal runtime. Fastest performance, smaller bundles.',
      },
    ],
  },

  // STEP 4: Backend
  {
    id: 'backend',
    step: 'backend',
    question: 'Choose your backend approach',
    type: 'radio',
    options: [
      {
        value: 'nextjs-fullstack',
        label: 'Next.js Fullstack (Server Actions + tRPC)',
        description: 'Everything in one codebase. Best for rapid development and solo/small teams.',
      },
      {
        value: 'nextjs-external',
        label: 'Next.js Frontend + External API',
        description: 'Decoupled architecture. Better for complex backends or mobile apps.',
      },
      {
        value: 'serverless',
        label: 'Serverless Functions (Vercel / Netlify / Cloudflare)',
        description: 'Pay-per-request. Zero infrastructure management. Great for variable traffic.',
      },
      {
        value: 'fastapi',
        label: 'Python FastAPI',
        description: 'Modern Python. Best for ML integrations, data processing, or Python-heavy teams.',
      },
      {
        value: 'express',
        label: 'Node.js Express / NestJS',
        description: 'Traditional Node.js backend. Full control, mature ecosystem.',
      },
      {
        value: 'rails',
        label: 'Ruby on Rails',
        description: 'Convention over configuration. Rapid CRUD development.',
      },
    ],
  },

  // STEP 5: Database
  {
    id: 'database',
    step: 'database',
    question: 'Choose your database',
    type: 'radio',
    options: [
      {
        value: 'supabase-postgres',
        label: 'Supabase (PostgreSQL)',
        description: 'Open-source Firebase alternative. Realtime subscriptions, auth built-in, generous free tier.',
      },
      {
        value: 'vercel-postgres',
        label: 'Vercel Postgres (Neon)',
        description: 'Serverless PostgreSQL. Deep Vercel integration, auto-scaling, pay-for-usage.',
      },
      {
        value: 'firebase',
        label: 'Firebase (Firestore + Realtime DB)',
        description: 'Google-managed. Best for rapid prototyping, real-time apps, mobile-first projects.',
      },
      {
        value: 'prisma-postgres',
        label: 'Self-hosted PostgreSQL + Prisma',
        description: 'Maximum control. Use with Railway, DigitalOcean, or AWS RDS.',
      },
      {
        value: 'mongodb',
        label: 'MongoDB Atlas',
        description: 'Document database. Flexible schema, great for unstructured data.',
      },
      {
        value: 'turso',
        label: 'Turso (SQLite at the Edge)',
        description: 'Edge-hosted SQLite. Extremely fast reads, global replication, free tier generous.',
      },
    ],
  },

  // STEP 6: Auth
  {
    id: 'auth',
    step: 'auth',
    question: 'Choose your authentication',
    type: 'radio',
    options: [
      {
        value: 'supabase-auth',
        label: 'Supabase Auth',
        description: 'Free, open-source, works with any frontend. OAuth providers, email/password, magic links.',
      },
      {
        value: 'nextauth',
        label: 'NextAuth.js (Auth.js) v5',
        description: 'Best-in-class for Next.js. Multiple providers, JWT sessions, database sessions.',
      },
      {
        value: 'clerk',
        label: 'Clerk',
        description: 'Premium DX. Pre-built UI components, organizations, MFA, user management dashboard.',
      },
      {
        value: 'firebase-auth',
        label: 'Firebase Authentication',
        description: 'Works best with Firebase stack. Phone auth, anonymous auth, social providers.',
      },
      {
        value: 'auth0',
        label: 'Auth0',
        description: 'Enterprise-grade. Complex auth flows, rules engine, but higher cost.',
      },
      {
        value: 'custom',
        label: 'Custom Auth (JWT + bcrypt)',
        description: 'Full control. Only if you have specific security requirements or want to learn.',
      },
    ],
  },

  // STEP 7: Hosting
  {
    id: 'hosting',
    step: 'hosting',
    question: 'Choose your hosting platform',
    type: 'radio',
    options: [
      {
        value: 'vercel',
        label: 'Vercel',
        description: 'Best for Next.js. Edge network, preview deployments, analytics, zero config.',
      },
      {
        value: 'netlify',
        label: 'Netlify',
        description: 'Great for JAMstack. Git-based deploys, edge functions, forms, identity.',
      },
      {
        value: 'railway',
        label: 'Railway',
        description: 'Fullstack deployment. Docker support, databases, cron jobs, networking.',
      },
      {
        value: 'cloudflare',
        label: 'Cloudflare Pages + Workers',
        description: 'Edge-first. D1 database, KV storage, extremely fast global deployment.',
      },
      {
        value: 'aws',
        label: 'AWS (Amplify / ECS / Lambda)',
        description: 'Maximum control and scale. Steeper learning curve, more configuration.',
      },
    ],
  },

  // STEP 8: Extras
  {
    id: 'payments',
    step: 'extras',
    question: 'Payment provider (if needed)',
    type: 'select',
    options: [
      { value: 'none', label: 'No payments', description: 'Free tool or internal app' },
      { value: 'stripe', label: 'Stripe', description: 'Best for SaaS, subscriptions, global payments' },
      { value: 'lemon-squeezy', label: 'LemonSqueezy', description: 'Best for indie makers, EU VAT handling' },
      { value: 'paypal', label: 'PayPal', description: 'Alternative payment method' },
    ],
  },
  {
    id: 'email',
    step: 'extras',
    question: 'Email service (if needed)',
    type: 'select',
    options: [
      { value: 'none', label: 'No email', description: 'No transactional emails needed' },
      { value: 'resend', label: 'Resend', description: 'Modern email for developers. Great DX, good free tier.' },
      { value: 'sendgrid', label: 'SendGrid (Twilio)', description: 'Mature, reliable, good deliverability' },
      { value: 'aws-ses', label: 'AWS SES', description: 'Cheapest at scale. Requires AWS setup.' },
    ],
  },
  {
    id: 'storage',
    step: 'extras',
    question: 'File storage (if needed)',
    type: 'select',
    options: [
      { value: 'none', label: 'No file storage', description: 'No uploads needed' },
      { value: 'supabase-storage', label: 'Supabase Storage', description: 'Integrated with Supabase, policies with RLS' },
      { value: 'cloudflare-r2', label: 'Cloudflare R2', description: 'S3-compatible, zero egress fees, cheap' },
      { value: 'aws-s3', label: 'AWS S3', description: 'Industry standard, maximum features' },
      { value: 'firebase-storage', label: 'Firebase Storage', description: 'Works with Firebase, client-side uploads' },
    ],
  },
  {
    id: 'testing',
    step: 'extras',
    question: 'Testing strategy',
    type: 'select',
    options: [
      { value: 'vitest-playwright', label: 'Vitest (unit) + Playwright (E2E)', description: 'Modern, fast, recommended' },
      { value: 'jest-rtl', label: 'Jest + React Testing Library', description: 'Classic combo, mature ecosystem' },
      { value: 'minimal', label: 'Minimal (type checking only)', description: 'For quick prototypes' },
      { value: 'full', label: 'Full (unit + integration + E2E + visual)', description: 'For production-grade apps' },
    ],
  },
  {
    id: 'monitoring',
    step: 'extras',
    question: 'Monitoring & error tracking',
    type: 'select',
    options: [
      { value: 'sentry', label: 'Sentry', description: 'Error tracking + performance monitoring. Industry standard.' },
      { value: 'logrocket', label: 'LogRocket', description: 'Session replay + error tracking. See what users saw.' },
      { value: 'vercel-analytics', label: 'Vercel Analytics', description: 'Built into Vercel. Web Vitals, visitor insights.' },
      { value: 'none', label: 'None for now', description: 'Add later when needed' },
    ],
  },
];

// ============================================================
// DECISION HELPERS
// ============================================================

export function getRecommendedStack(answers: Partial<WizardAnswers>): {
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  hosting: string;
} {
  // Default recommendations based on project type
  const defaults: Record<string, { frontend: string; backend: string; database: string; auth: string; hosting: string }> = {
    saas: {
      frontend: 'nextjs-app',
      backend: 'nextjs-fullstack',
      database: 'supabase-postgres',
      auth: 'supabase-auth',
      hosting: 'vercel',
    },
    ecommerce: {
      frontend: 'nextjs-app',
      backend: 'nextjs-fullstack',
      database: 'supabase-postgres',
      auth: 'clerk',
      hosting: 'vercel',
    },
    content: {
      frontend: 'astro',
      backend: 'serverless',
      database: 'turso',
      auth: 'supabase-auth',
      hosting: 'cloudflare',
    },
    dashboard: {
      frontend: 'react-spa',
      backend: 'nextjs-fullstack',
      database: 'supabase-postgres',
      auth: 'nextauth',
      hosting: 'vercel',
    },
    api: {
      frontend: 'none',
      backend: 'fastapi',
      database: 'supabase-postgres',
      auth: 'supabase-auth',
      hosting: 'railway',
    },
    mobile: {
      frontend: 'react-spa',
      backend: 'serverless',
      database: 'firebase',
      auth: 'firebase-auth',
      hosting: 'firebase',
    },
    portfolio: {
      frontend: 'astro',
      backend: 'serverless',
      database: 'turso',
      auth: 'none',
      hosting: 'vercel',
    },
    tool: {
      frontend: 'react-spa',
      backend: 'serverless',
      database: 'turso',
      auth: 'supabase-auth',
      hosting: 'cloudflare',
    },
  };

  return defaults[answers.projectType || 'saas'];
}

// ============================================================
// TECH COMPARISONS
// ============================================================

export interface TechComparison {
  category: string;
  technologies: {
    name: string;
    bestFor: string;
    pros: string[];
    cons: string[];
    pricing: string;
    rating: number;
  }[];
}

export const comparisons: TechComparison[] = [
  {
    category: 'Database: Supabase vs Firebase',
    technologies: [
      {
        name: 'Supabase',
        bestFor: 'Developers who want PostgreSQL with realtime',
        pros: ['Open source', 'PostgreSQL (full SQL power)', 'Generous free tier', 'RLS policies', 'Edge functions'],
        cons: ['Newer ecosystem', 'Smaller community than Firebase', 'Self-hosting requires ops knowledge'],
        pricing: 'Free: 500MB DB, 1GB storage. Pro: $25/mo',
        rating: 4.7,
      },
      {
        name: 'Firebase',
        bestFor: 'Rapid prototyping, mobile apps, real-time',
        pros: ['Mature ecosystem', 'Excellent real-time', 'Great mobile SDKs', 'Analytics built-in', 'Google scale'],
        cons: ['Vendor lock-in', 'Firestore is NoSQL (limited queries)', 'Can get expensive', 'Cold starts'],
        pricing: 'Spark: free (limits). Blaze: pay-as-you-go',
        rating: 4.3,
      },
    ],
  },
  {
    category: 'Hosting: Vercel vs Netlify vs Railway',
    technologies: [
      {
        name: 'Vercel',
        bestFor: 'Next.js projects, frontend-first apps',
        pros: ['Zero-config Next.js', 'Preview deployments', 'Edge network', 'Analytics', 'Image optimization'],
        cons: ['Function timeout limits', 'Can get expensive', 'Serverless constraints'],
        pricing: 'Hobby: free. Pro: $20/mo',
        rating: 4.8,
      },
      {
        name: 'Netlify',
        bestFor: 'JAMstack, static sites, form handling',
        pros: ['Great for static sites', 'Edge functions', 'Forms handling', 'Split testing', 'Large free tier'],
        cons: ['Less optimized for Next.js', 'Fewer features than Vercel for React'],
        pricing: 'Starter: free. Pro: $19/mo',
        rating: 4.4,
      },
      {
        name: 'Railway',
        bestFor: 'Fullstack apps, Docker, databases',
        pros: ['Docker support', 'Private networking', 'Cron jobs', 'Any framework', 'Easy databases'],
        cons: ['Less edge-optimized', 'Smaller community'],
        pricing: 'Starter: $5/mo + usage. Pay-as-you-go',
        rating: 4.5,
      },
    ],
  },
  {
    category: 'Auth: Supabase Auth vs NextAuth vs Clerk',
    technologies: [
      {
        name: 'Supabase Auth',
        bestFor: 'Any frontend, OAuth, row-level security',
        pros: ['Free', 'Works with any frontend', 'OAuth providers', 'Magic links', 'Phone auth', 'RLS integration'],
        cons: ['UI components are basic', 'Less polished than Clerk'],
        pricing: 'Free: 50,000 users/month',
        rating: 4.5,
      },
      {
        name: 'NextAuth.js v5',
        bestFor: 'Next.js apps, maximum flexibility',
        pros: ['Best Next.js integration', 'Multiple auth strategies', 'JWT or database sessions', 'Type-safe', 'Open source'],
        cons: ['Requires more setup', 'No built-in UI', 'Next.js only'],
        pricing: 'Free (open source)',
        rating: 4.4,
      },
      {
        name: 'Clerk',
        bestFor: 'SaaS apps, organizations, premium UX',
        pros: ['Beautiful UI components', 'Organizations/teams', 'MFA', 'User impersonation', 'Webhooks', 'Dashboard'],
        cons: ['Paid for most features', 'Vendor lock-in', 'Less customizable'],
        pricing: 'Free: 10,000 MAU. Pro: $25/mo',
        rating: 4.7,
      },
    ],
  },
];

// ============================================================
// FILE GENERATORS
// ============================================================

export interface GeneratedFile {
  path: string;
  filename: string;
  content: string;
}

export function generateAgentsMd(answers: WizardAnswers): string {
  const features = answers.features || [];
  const hasPayments = features.includes('payments');
  const paymentSection = `### Payments (CRITICAL)\n- NEVER log payment tokens or card data\n- All payment webhooks must verify signatures\n- Idempotency keys on all payment operations\n- Test with Stripe test keys only`;
  const hasRealtime = features.includes('realtime');
  const hasUploads = features.includes('uploads');
  const hasEmail = features.includes('email');
  const hasMultiTenant = features.includes('multi-tenant');
  const hasApi = features.includes('api');
  const hasAi = features.includes('ai');

  return `# ${answers.projectName || 'Project'} — Agent Context

> Auto-generated by Vibe Coding Handbook Wizard
> Last updated: ${new Date().toISOString().split('T')[0]}

## Overview
${answers.projectDescription || 'A full-stack web application.'}

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | ${getTechLabel('frontend', answers.frontend)} | UI layer |
| Backend | ${getTechLabel('backend', answers.backend)} | API & business logic |
| Database | ${getTechLabel('database', answers.database)} | Data persistence |
| Auth | ${getTechLabel('auth', answers.auth)} | Authentication |
| Hosting | ${getTechLabel('hosting', answers.hosting)} | Deployment |
${hasPayments ? '| Payments | Stripe | Subscription billing |' : ''}
${hasEmail ? '| Email | Resend | Transactional emails |' : ''}
${hasUploads ? `| Storage | ${getTechLabel('storage', answers.storage)} | File uploads |` : ''}
| Testing | ${getTechLabel('testing', answers.testing)} | Test suite |
| Monitoring | ${getTechLabel('monitoring', answers.monitoring)} | Error tracking |

## Architecture Decisions

${hasMultiTenant ? '- **Multi-tenancy**: Organizations are implemented via row-level security (RLS) policies. Each table has an `org_id` column.' : ''}
${hasRealtime ? '- **Real-time**: Using database subscriptions for live updates. WebSocket connections managed by the database provider.' : ''}
${hasApi ? '- **Public API**: REST API with API key authentication. Rate limiting applied per key.' : ''}
${hasAi ? '- **AI Integration**: LLM features use streaming responses. All AI calls are logged for monitoring.' : ''}

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui components (DON'T MODIFY)
│   └── [features]/        # Feature-specific components
├── lib/
│   ├── db/                # Database queries & mutations
│   ├── auth/              # Auth helpers
│   ├── api/               # API client
│   └── utils/             # Shared utilities
├── hooks/                 # Custom React hooks
├── types/                 # Shared TypeScript types
└── server/                # Server-side code (tRPC, actions)
    ├── routers/           # tRPC routers
    └── middleware/        # Auth, validation
\`\`\`

## Coding Standards

### TypeScript
- Strict mode enabled — no \`any\` types allowed
- All functions must have typed parameters and return types
- Use interfaces for object shapes, types for unions

### React
- Server Components by default — use \`"use client"\` sparingly
- Custom hooks for reusable logic (\`use[Name]\` convention)
- Props interfaces named \`{ComponentName}Props\`

### Styling
- Tailwind CSS utility classes only
- No inline styles
- Use \`cn()\` helper for conditional classes
- Dark mode support required

### API Design
- tRPC procedures for type-safe APIs
- Zod schemas for all input validation
- Consistent error responses: \`{ success: false, error: string }\`
- All mutations require authentication

### Forms
- react-hook-form + zod resolver
- Client-side validation mirrors server validation
- Loading states on all submit buttons
- Error messages displayed per field

### Database
- Prisma migrations for schema changes
- RLS policies for row-level access control
- Indexed columns: id, email, org_id, created_at
- Soft deletes (\`deleted_at\` column) — never hard delete

## Security Rules

${hasPayments ? paymentSection : ''}

### Authentication
- All API routes (except \`/api/auth/*\`) require authentication
- Verify JWT tokens server-side on every request
- Refresh tokens stored in httpOnly cookies
- Session timeout: 24 hours

### Data Protection
- Input validation on ALL user inputs (Zod schemas)
- Output encoding to prevent XSS
- SQL injection prevention via parameterized queries (Prisma)
- Rate limiting: 100 req/min per IP, 1000 req/min per user

### Environment Variables
- NEVER commit \`.env\` files
- All secrets in \`.env.local\` (gitignored)
- Validate env vars at startup — fail fast if missing
- Required: DATABASE_URL, NEXTAUTH_SECRET, [PROVIDER]_CLIENT_ID, [PROVIDER]_SECRET

## Git Workflow

| Branch | Purpose | Protection |
|--------|---------|------------|
| \`main\` | Production deploys | No direct commits. PRs only |
| \`develop\` | Integration branch | PRs from feature branches |
| \`feature/*\` | New features | Delete after merge |
| \`hotfix/*\` | Production fixes | Urgent PRs to main |

### Commit Convention
\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer]
\`\`\`

Types: \`feat\`, \`fix\`, \`docs\`, \`test\`, \`refactor\`, \`security\`, \`deps\`

## Testing Requirements

- Unit tests: All utility functions, hooks, API procedures
- Integration tests: Database operations, auth flows
- E2E tests: Critical user journeys (signup → create → delete)
- Minimum coverage: 70% (enforced in CI)

## Deployment Checklist

Before every deploy to production:
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Lint passes (no warnings)
- [ ] Database migrations tested on staging
- [ ] Environment variables configured
- [ ] No console.log statements in production code
- [ ] Feature flags configured (if applicable)

---

*This file was generated by the Vibe Coding Handbook Wizard. Update it as your project evolves.*
`;
}

export function generateCursorRules(answers: WizardAnswers): string {
  const features = answers.features || [];

  return `# Global Rules — ${answers.projectName || 'Project'}

# Framework
- This is a ${getTechLabel('frontend', answers.frontend)} project
- ${answers.backend?.includes('nextjs') ? 'Use React Server Components by default' : 'Follow the framework conventions'}
- All API routes require authentication (except auth endpoints)

# TypeScript
- Strict mode — no \`any\` types
- All functions must have explicit return types
- Use interfaces for shapes, types for unions

# Code Style
- Named exports preferred (\`export function\`, not \`export default\`)
- async/await (no .then() chains)
- Destructure props in function parameters
- Max function length: 50 lines (extract if longer)

# Styling
- Tailwind CSS only — no inline styles
- Use \`cn()\` for conditional classes
- Responsive design: mobile-first

# Database
- Use Prisma ORM for all database operations
- RLS policies for access control
- Soft deletes only (never hard delete)

# Security
${features.includes('payments') ? '- NEVER log payment tokens or card data\n' : ''}- Input validation with Zod on ALL inputs
- Output encoding for user-generated content
- No direct database queries from components

# Forbidden
- No console.log in production code (use logger utility)
- No \`eval()\` or \`Function()\`
- No hardcoded secrets or API keys
- No unvalidated user input in queries
`;
}

export function generateGitPolicy(): string {
  return `# Git Policy

## Branching Strategy

| Branch | Purpose | Rules |
|--------|---------|-------|
| \`main\` | Production | NO direct commits. PRs only with 1 review |
| \`develop\` | Integration | Merge feature branches here. Test before merging to main |
| \`feature/description\` | New features | Branch from develop. Delete after merge |
| \`hotfix/description\` | Urgent fixes | Branch from main. Merge to both main and develop |

## Workflow

1. Create feature branch: \`git checkout -b feature/user-auth\`
2. Make commits following conventional format
3. Push branch and open PR to \`develop\`
4. CI must pass (tests, lint, typecheck)
5. At least 1 code review approval
6. Squash and merge
7. Delete feature branch

## Commit Convention

\`\`\`
<type>(<scope>): <description>

[optional body with details]

Closes #<issue-number>
\`\`\`

### Types
- \`feat\`: New feature
- \`fix\`: Bug fix
- \`docs\`: Documentation only
- \`test\`: Adding or updating tests
- \`refactor\`: Code change that neither fixes a bug nor adds a feature
- \`security\`: Security fix
- \`deps\`: Dependency updates
- \`chore\`: Build process or auxiliary tool changes

### Examples
\`\`\`
feat(auth): add OAuth login with Google

fix(api): resolve race condition in user creation

test(payments): add tests for Stripe webhook handler
\`\`\`

## Pull Request Template

Every PR must include:
- [ ] Description of changes
- [ ] Link to related issue
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)
- [ ] Screenshots (for UI changes)
- [ ] Breaking changes noted
`;
}

export function generateSecurityPolicy(): string {
  return `# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please email security@yourproject.com. Do NOT open a public issue.

## Security Rules

### Authentication
- All API endpoints (except auth) require valid JWT
- Tokens expire after 24 hours
- Refresh tokens are httpOnly cookies
- Password minimum: 8 characters with 1 uppercase, 1 number

### Authorization
- Row-level security (RLS) on all database tables
- Users can only access their own data (and org data)
- Admin endpoints check role before processing

### Data Protection
- All user inputs validated with Zod schemas
- Output encoded to prevent XSS
- Parameterized queries only (via Prisma)
- Rate limiting: 100 req/min IP, 1000 req/min user

### Payments
- Payment tokens NEVER logged or stored
- Webhook signatures verified
- Idempotency keys on all payment calls
- Test keys only in development/staging

### Environment Variables
- .env files NEVER committed
- Secrets rotated every 90 days
- Different keys for dev/staging/prod

## Security Checklist (every PR)

- [ ] No secrets in code
- [ ] Input validation added
- [ ] Auth checks on protected routes
- [ ] No SQL injection vectors
- [ ] XSS prevention on user content
- [ ] Dependencies audited (\`npm audit\`)
`;
}

export function generateTestingPolicy(_answers: WizardAnswers): string {
  return `# Testing Policy

## Requirements

| Test Type | Minimum Coverage | Tool |
|-----------|-----------------|------|
| Unit tests | 60% | Vitest |
| Integration tests | Critical paths | Vitest + test DB |
| E2E tests | User journeys | Playwright |
| Type safety | 100% | TypeScript strict |

## What to Test

### Must Test
- All API endpoints (happy path + errors)
- Authentication flows (login, register, logout)
- Database operations (CRUD)
- Form validation
- Permission checks

### Should Test
- Utility functions
- React hooks
- Edge cases (empty input, max length, special chars)
- Loading and error states

### Nice to Test
- UI component rendering
- Animation transitions
- Accessibility

## Testing Rules

1. **Test behavior, not implementation**
   Bad: \`expect(fn).toHaveBeenCalledWith('arg')\`
   Good: \`expect(result).toBe(expected)\`

2. **One concept per test**
   Each test should verify one thing

3. **Descriptive test names**
   \`should return 404 when user not found\`

4. **Setup in beforeEach, not in tests**
   Keep tests DRY

## CI Requirements

All tests must pass before merge:
\`\`\`
npm run test:unit
npm run test:integration
npm run test:e2e
\`\`\`
`;
}

export function generateDeploymentPolicy(answers: WizardAnswers): string {
  return `# Deployment Policy

## Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | any feature branch | localhost | Local development |
| Staging | \`develop\` | staging.yourproject.com | Pre-production testing |
| Production | \`main\` | yourproject.com | Live application |

## Deployment Flow

1. Feature complete → PR to \`develop\`
2. Merged → Auto-deploy to **Staging**
3. QA on staging
4. PR \`develop\` → \`main\`
5. Merged → Auto-deploy to **Production**

## Pre-deployment Checklist

- [ ] All CI checks pass (tests, lint, typecheck)
- [ ] Database migrations tested on staging
- [ ] Environment variables set in hosting platform
- [ ] Feature flags configured (if using)
- [ ] Monitoring dashboards checked
- [ ] Rollback plan ready (previous deployment)

## Database Migrations

1. migrations are forward-compatible
2. Backward-incompatible changes: deploy in 2 phases
   - Phase 1: Add new column/table (backward compatible)
   - Phase 2: Remove old column (after deploy)
3. Never delete data without backup
4. Test migrations on staging data

## Rollback Procedure

If production deployment fails:
1. Identify issue from monitoring/logs
2. Revert code change (git revert)
3. Revert database migration if needed
4. Verify rollback in staging first
5. Deploy revert to production
6. Post-incident review within 24 hours

## Hosting: ${getTechLabel('hosting', answers.hosting)}

${answers.hosting === 'vercel' ? '- Preview deployments on every PR\n- Production deploys from main branch\n- Environment variables in Vercel dashboard' : ''}
${answers.hosting === 'railway' ? '- Docker-based deployment\n- Automatic deploys on push to main\n- Private networking for database' : ''}
${answers.hosting === 'cloudflare' ? '- Edge deployment globally\n- D1 database migrations via Wrangler\n- KV storage for cache/sessions' : ''}
`;
}

export function generateAdr(answers: WizardAnswers, adrNumber: number): string {
  return `# ADR-${String(adrNumber).padStart(3, '0')}: Architecture Overview

## Status
Accepted

## Context
${answers.projectDescription || 'Building a full-stack web application.'}

## Decision

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | ${getTechLabel('frontend', answers.frontend)} | ${getRationale('frontend', answers.frontend)} |
| Backend | ${getTechLabel('backend', answers.backend)} | ${getRationale('backend', answers.backend)} |
| Database | ${getTechLabel('database', answers.database)} | ${getRationale('database', answers.database)} |
| Auth | ${getTechLabel('auth', answers.auth)} | ${getRationale('auth', answers.auth)} |
| Hosting | ${getTechLabel('hosting', answers.hosting)} | ${getRationale('hosting', answers.hosting)} |

## Consequences

### Positive
- Rapid development with familiar technologies
- Type safety end-to-end
- Scalable architecture

### Negative
- Learning curve for new team members
- ${answers.backend?.includes('nextjs') ? 'Monolithic architecture may need splitting later' : 'Multiple services to maintain'}

## Alternatives Considered

${getAlternatives(answers)}

## Date
${new Date().toISOString().split('T')[0]}
`;
}

// ============================================================
// HELPERS
// ============================================================

function getTechLabel(category: string, value: string): string {
  const labels: Record<string, Record<string, string>> = {
    frontend: {
      'nextjs-app': 'Next.js 15 (App Router)',
      'nextjs-pages': 'Next.js 15 (Pages)',
      'react-spa': 'React + Vite',
      astro: 'Astro',
      vue: 'Vue 3 + Nuxt',
      svelte: 'SvelteKit',
    },
    backend: {
      'nextjs-fullstack': 'Next.js Fullstack',
      'nextjs-external': 'Next.js + External API',
      serverless: 'Serverless Functions',
      fastapi: 'Python FastAPI',
      express: 'Node.js Express/NestJS',
      rails: 'Ruby on Rails',
    },
    database: {
      'supabase-postgres': 'Supabase (PostgreSQL)',
      'vercel-postgres': 'Vercel Postgres (Neon)',
      firebase: 'Firebase',
      'prisma-postgres': 'PostgreSQL + Prisma',
      mongodb: 'MongoDB Atlas',
      turso: 'Turso (SQLite)',
    },
    auth: {
      'supabase-auth': 'Supabase Auth',
      nextauth: 'NextAuth.js v5',
      clerk: 'Clerk',
      'firebase-auth': 'Firebase Auth',
      auth0: 'Auth0',
      custom: 'Custom JWT',
    },
    hosting: {
      vercel: 'Vercel',
      netlify: 'Netlify',
      railway: 'Railway',
      cloudflare: 'Cloudflare Pages',
      aws: 'AWS',
    },
    storage: {
      'supabase-storage': 'Supabase Storage',
      'cloudflare-r2': 'Cloudflare R2',
      'aws-s3': 'AWS S3',
      'firebase-storage': 'Firebase Storage',
    },
    testing: {
      'vitest-playwright': 'Vitest + Playwright',
      'jest-rtl': 'Jest + React Testing Library',
      minimal: 'Type checking only',
      full: 'Full suite (unit + integration + E2E)',
    },
    monitoring: {
      sentry: 'Sentry',
      logrocket: 'LogRocket',
      'vercel-analytics': 'Vercel Analytics',
      none: 'None (add later)',
    },
  };
  return labels[category]?.[value] || value;
}

function getRationale(category: string, value: string): string {
  const rationales: Record<string, Record<string, string>> = {
    frontend: {
      'nextjs-app': 'Full-stack React with SSR, Server Components, and excellent AI tooling support',
      'nextjs-pages': 'Mature ecosystem with extensive documentation and community resources',
      'react-spa': 'Lightweight, fast development, ideal for dashboards and internal tools',
    },
    backend: {
      'nextjs-fullstack': 'Single codebase, rapid iteration, type-safe APIs with tRPC',
      serverless: 'No server management, auto-scaling, pay-per-request',
      fastapi: 'Modern Python, excellent for data/ML integrations',
    },
    database: {
      'supabase-postgres': 'Open-source, PostgreSQL power, realtime subscriptions, generous free tier',
      'vercel-postgres': 'Serverless PostgreSQL with deep Vercel integration',
      firebase: 'Managed service, excellent real-time capabilities, mobile SDKs',
      turso: 'Edge-hosted SQLite, extremely fast, global replication',
    },
    auth: {
      'supabase-auth': 'Free, open-source, works with any frontend, OAuth built-in',
      nextauth: 'Best Next.js integration, multiple providers, type-safe',
      clerk: 'Premium UX, pre-built components, organizations support',
    },
    hosting: {
      vercel: 'Optimized for Next.js, preview deployments, global edge network',
      railway: 'Full Docker support, easy databases, private networking',
      cloudflare: 'Edge-first deployment, extremely fast global performance',
    },
  };
  return rationales[category]?.[value] || 'Good fit for project requirements';
}

function getAlternatives(answers: WizardAnswers): string {
  const alts: string[] = [];
  if (answers.frontend?.includes('nextjs')) {
    alts.push('- Vue/Nuxt: Good alternative but smaller AI tooling ecosystem');
  }
  if (answers.database?.includes('supabase')) {
    alts.push('- Firebase: Considered but Supabase offers more SQL flexibility');
  }
  if (answers.auth?.includes('supabase')) {
    alts.push('- Clerk: More polished UI but Supabase Auth is free and open-source');
  }
  return alts.join('\n') || '- Other options evaluated but current stack best fits requirements';
}

// ============================================================
// STEP CONFIGURATION
// ============================================================

export const steps: { id: WizardStep; label: string; description: string; icon: string }[] = [
  { id: 'project-info', label: 'Project', description: 'Name, type, description', icon: 'info' },
  { id: 'requirements', label: 'Requirements', description: 'Features, timeline, team', icon: 'list' },
  { id: 'frontend', label: 'Frontend', description: 'UI framework', icon: 'layout' },
  { id: 'backend', label: 'Backend', description: 'API & logic', icon: 'server' },
  { id: 'database', label: 'Database', description: 'Data storage', icon: 'database' },
  { id: 'auth', label: 'Auth', description: 'Authentication', icon: 'shield' },
  { id: 'hosting', label: 'Hosting', description: 'Deployment', icon: 'cloud' },
  { id: 'extras', label: 'Extras', description: 'Payments, email, monitoring', icon: 'plus' },
  { id: 'review', label: 'Review', description: 'Generate files', icon: 'check' },
];
