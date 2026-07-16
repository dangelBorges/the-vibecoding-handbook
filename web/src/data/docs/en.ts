export interface DocChapter {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const chapters: DocChapter[] = [
  {
    slug: 'fundamentals',
    title: '1. Fundamentals',
    description: 'What is vibe coding, where it came from, and when to use it.',
    sections: [
      {
        id: 'what-is-vibe-coding',
        title: 'What is Vibe Coding?',
        content: `Vibe coding is an AI-first development approach where you describe what you want in natural language, and AI agents generate the code. It was coined by Andrej Karpathy in early 2025 and has since evolved into a structured discipline.

**The Core Idea**
Instead of writing every line of code manually, you:
1. Describe the feature or fix you need
2. Provide context (your codebase, patterns, constraints)
3. Review the AI-generated output
4. Iterate with precise follow-up prompts

**Evolution: 2025 → 2026**
- **2025 (The Wild West)**: Early adopters experimenting with ChatGPT and Copilot. Lots of "vibes", little structure.
- **2026 (The Discipline)**: Specialized tools (Cursor, Claude Code), context engineering patterns, production checklists, and security gates. Vibe coding became conscious vibe coding.

**Vibe Coding vs No-Code vs Traditional Dev**

| Aspect | Vibe Coding | No-Code | Traditional |
|--------|-------------|---------|-------------|
| Code ownership | Full | Limited | Full |
| Flexibility | High | Low | High |
| Speed | Very High | High | Low |
| Learning curve | Medium | Low | High |
| Production ready | Yes (with gates) | Yes | Yes |

**The Spectrum: Casual → Conscious → Production-Ready**
- **Casual**: "Build me a todo app" — quick prototypes, experiments
- **Conscious**: Structured prompts, context files, review checklists
- **Production-Ready**: Security gates, tests, CI/CD integration`,
      },
      {
        id: 'when-to-use',
        title: 'When to Use Vibe Coding',
        content: `**When to say YES:**
- Prototyping and MVPs
- Boilerplate and scaffolding
- Refactoring repetitive code
- Writing tests (especially edge cases)
- Documentation and comments
- Learning new patterns or APIs

**When to say NO:**
- Critical security code (auth, encryption)
- Financial transactions and payment processing
- Code that handles PII (Personally Identifiable Information)
- Complex algorithmic logic requiring deep domain knowledge
- When you don't understand what the AI generated

**The Golden Rule**
> If you can't explain what the code does, you shouldn't ship it. Vibe coding amplifies your abilities—it doesn't replace your understanding.`,
      },
    ],
  },
  {
    slug: 'workflow',
    title: '2. The 4-Phase Workflow',
    description: 'Prompt → Generate → Review → Refine. The structured workflow for consistent results.',
    sections: [
      {
        id: 'phase-1-prompt',
        title: 'Phase 1: Prompt',
        content: `The prompt is your specification. A great prompt includes:

**1. Role Definition**
\`\`\`
You are an expert senior TypeScript developer specializing in 
Next.js applications with 10+ years of experience.
\`\`\`

**2. Context**
\`\`\`
We are working on a SaaS dashboard application. The tech stack is:
- Next.js 15 (App Router)
- TypeScript with strict mode
- Tailwind CSS
- Prisma ORM with PostgreSQL
- tRPC for API routes
\`\`\`

**3. Task Description**
\`\`\`
Implement a user settings page that allows users to:
- Update their profile (name, avatar, bio)
- Change notification preferences
- Manage connected accounts (GitHub, Google)
- Delete their account with confirmation
\`\`\`

**4. Constraints & Patterns**
\`\`\`
- Follow the existing component structure in /src/components
- Use React Server Components where possible
- All forms must use react-hook-form with zod validation
- API routes must be protected with our auth middleware
\`\`\`

**5. Examples (Optional but powerful)**
\`\`\`
Here's how we handle similar forms: [link to existing code]
The UI should match this design system: [link to Storybook]
\`\`\`

**Anti-patterns to avoid:**
- "Build me a website" (too vague)
- "Fix this" without specifying what's broken
- "Make it better" (subjective)`,
      },
      {
        id: 'phase-2-generate',
        title: 'Phase 2: Generate',
        content: `**Choosing the Right Model**

| Model | Best For | Cost | Speed |
|-------|----------|------|-------|
| Claude 4 Sonnet | Most coding tasks | $$ | Fast |
| Claude 4 Opus | Complex architecture | $$$ | Medium |
| GPT-4o | Quick tasks, explanations | $$ | Fast |
| o3-mini | Deep reasoning | $$ | Medium |

**Setting Up Context**
Before generating, ensure your context files are in place:
1. **AGENTS.md** at project root
2. **.iderules** in your IDE
3. **Skills/Memories** configured (if your tool supports them)

**Scope Control**
Tell the agent exactly what to touch:
\`\`\`
Only modify files in /src/app/settings/. 
Do not change the auth system or database schema.
Use the existing UI components from /src/components/ui.
\`\`\``,
      },
      {
        id: 'phase-3-review',
        title: 'Phase 3: Review',
        content: `**The Review Checklist**

Every generated change must pass these gates:

□ **Does it compile?** Run type checking before anything else.
\`\`\`
npm run typecheck
\`\`\`

□ **Do tests pass?**
\`\`\`
npm test
\`\`\`

□ **Security scan**: Check for:
- Hardcoded secrets or API keys
- SQL injection vulnerabilities
- XSS risks in user-facing output
- Unsafe eval() or Function() usage

□ **Architecture consistency**: Does it follow existing patterns?

□ **No unnecessary dependencies**: Did it install packages you don't need?

□ **Edge cases handled**: Empty states, errors, loading states?

□ **Accessibility**: Proper ARIA labels, keyboard navigation?

**Red Flags — Reject Immediately:**
- Comments like "// Generated by AI"
- console.log statements left in production code
- Any change to .env files or config
- Dependencies on unknown npm packages`,
      },
      {
        id: 'phase-4-refine',
        title: 'Phase 4: Refine',
        content: `**How to Iterate Effectively**

Bad refinement:
\`\`\`
"This doesn't work. Fix it."
\`\`\`

Good refinement:
\`\`\`
"The form submission is failing with a 422 error. 
The issue is in the zod schema— the 'bio' field has a max length 
of 100 but the database column allows 500. Update the schema 
to match the database constraint and add proper error messaging 
that shows remaining characters as the user types."
\`\`\`

**The STAR Method for Refinement:**
- **S**ituation: What is the current state?
- **T**arget: What should it be?
- **A**ction: What specifically needs to change?
- **R**estrictions: What should NOT change?

**When to Start Over**
Sometimes iteration makes things worse. Start fresh when:
- You've refined more than 3 times
- The code keeps getting more complex
- The agent seems stuck in a loop
- You don't understand half of what was generated`,
      },
    ],
  },
  {
    slug: 'context-engineering',
    title: '3. Context Engineering',
    description: 'The differentiator. How to structure context for multi-file precision.',
    sections: [
      {
        id: 'agents-md',
        title: 'AGENTS.md Template',
        content: `The AGENTS.md file lives at your project root and serves as the "source of truth" for AI agents working on your codebase.

**Template:**
\`\`\`markdown
# Project Context

## Overview
[Brief description of what this project does]

## Tech Stack
- Framework: [e.g., Next.js 15]
- Language: [e.g., TypeScript 5.7]
- Styling: [e.g., Tailwind CSS v4]
- Database: [e.g., PostgreSQL via Prisma]
- Auth: [e.g., NextAuth.js v5]

## Architecture
- App Router structure in /src/app
- Shared components in /src/components
- Database schema in /prisma/schema.prisma
- API routes via tRPC in /src/server

## Coding Standards
- Use React Server Components by default
- Client components only when needed ("use client")
- All forms use react-hook-form + zod
- API responses follow { success: boolean, data?: T, error?: string }

## Patterns
[Link to or describe key patterns the agent should follow]

## Constraints
- Never expose database connection strings
- Always validate user input server-side
- Use our logger utility, not console.log
\`\`\``,
      },
      {
        id: 'ide-rules',
        title: '.iderules',
        content: `The .iderules file provides real-time guidance to the AI agent in any IDE that reads it (Cursor, Windsurf, Claude Code, etc.).

**Example .iderules:**
\`\`\`
# Global rules
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
- No any types
- No console.log in production code
- No inline styles (use Tailwind)
- No direct database queries from components
\`\`\``,
      },
      {
        id: 'anti-patterns',
        title: 'Context Anti-patterns',
        content: `**1. Inflated Context**
Dumping your entire codebase into the context window. This confuses the agent and wastes tokens.

*Fix*: Be selective. Include only relevant files and patterns.

**2. Contradictory Rules**
Having conflicting instructions in AGENTS.md and .iderules.

*Fix*: Keep a single source of truth. AGENTS.md for project-level, .iderules for IDE-specific style.

**3. Over-specification**
Writing 500 lines of rules that no one will read or maintain.

*Fix*: Keep it under 100 lines. Focus on the 20% of rules that prevent 80% of issues.

**4. Stale Context**
Context files that haven't been updated in months.

*Fix*: Update context files when you change your stack or patterns. Add it to your PR checklist.`,
      },
    ],
  },
  {
    slug: 'tools',
    title: '4. Tools 2026',
    description: 'Comparative guide to the leading AI coding tools of 2026.',
    sections: [
      {
        id: 'cursor',
        title: 'Cursor',
        content: `**Cursor** — The IDE built for AI coding.

**Pros:**
- Native AI integration (no plugin needed)
- Excellent context awareness (reads your entire codebase)
- Composer mode for multi-file edits
- Fast and responsive

**Cons:**
- Fork of VS Code (slightly behind on updates)
- Can be aggressive with auto-suggestions
- Paid plans required for heavy usage

**Best for:** Full-stack developers, production codebases
**Pricing:** Free tier, Pro $20/month, Business $40/user/month`,
      },
      {
        id: 'claude-code',
        title: 'Claude Code',
        content: `**Claude Code** — Terminal-based AI agent from Anthropic.

**Pros:**
- Powerful for complex architectural tasks
- Excellent reasoning and planning
- Works with any editor
- Can run commands and tests directly

**Cons:**
- Terminal-only (no GUI)
- Slower than IDE-integrated tools
- Higher cost for extended sessions

**Best for:** Architecture decisions, complex refactors, CLI workflows
**Pricing:** Included with Claude Pro ($20/month)`,
      },
      {
        id: 'windsurf',
        title: 'Windsurf',
        content: `**Windsurf** (formerly Codeium) — Agentic IDE with cascade workflows.

**Pros:**
- Cascade agent can plan and execute multi-step tasks
- Free tier is generous
- Good context understanding

**Cons:**
- Smaller community than Cursor
- Some stability issues
- Less mature ecosystem

**Best for:** Developers wanting a free, capable alternative to Cursor
**Pricing:** Free tier, Pro $12/month`,
      },
      {
        id: 'others',
        title: 'Other Tools',
        content: `**v0** (Vercel)
- Best for: UI generation from prompts
- Type: App builder
- Pricing: Free tier, Pro $20/month

**Lovable**
- Best for: Full-stack apps with minimal code
- Type: App builder
- Pricing: Free tier, Pro $20/month

**Replit Agent**
- Best for: Education, quick prototypes
- Type: Cloud IDE + Agent
- Pricing: Free tier, Core $7/month

**Zed**
- Best for: Speed-focused developers
- Type: Native IDE (Rust)
- Pricing: Free (open source)

**Aider**
- Best for: Terminal lovers, Git-native workflows
- Type: CLI tool
- Pricing: Free (open source)`,
      },
    ],
  },
  {
    slug: 'prompting',
    title: '5. Prompting for Developers',
    description: 'Prompt engineering techniques specifically for coding tasks.',
    sections: [
      {
        id: 'prompt-patterns',
        title: 'Prompt Patterns',
        content: `**The RICE Pattern**
- **R**ole: Define who the AI should be
- **I**nstruction: What to do
- **C**ontext: Background information
- **E**xpectation: Desired output format

**The Chain-of-Thought Pattern**
Ask the AI to think step by step:
\`\`\`
"Before writing any code, plan the implementation:
1. What components will you need?
2. What API endpoints?
3. What database changes?
4. Share your plan, then implement."
\`\`\`

**The Few-Shot Pattern**
Provide examples of the desired output:
\`\`\`
"Here are examples of how we write API routes:
[example 1]
[example 2]

Now write a route for user preferences following the same pattern."
\`\`\``,
      },
      {
        id: 'prompt-library',
        title: 'Prompt Library',
        content: `Visit our interactive **Prompt Library** at /prompts for 50+ ready-to-use prompts organized by:

- **Task type**: Feature, bugfix, refactor, test, docs
- **Tool**: Cursor, Claude Code, Windsurf
- **Stack**: Next.js, Python, Rust, etc.

Each prompt includes:
- The full prompt text (copy with one click)
- When to use it
- Expected output
- Common follow-up prompts`,
      },
    ],
  },
  {
    slug: 'stack-patterns',
    title: '6. Stack Patterns',
    description: 'Battle-tested stack combinations for AI-first development.',
    sections: [
      {
        id: 'nextjs-stack',
        title: 'Next.js + TypeScript + Tailwind',
        content: `**The Recommended Stack**

\`\`\`
Next.js 15 (App Router)
├── TypeScript 5.7 (strict)
├── Tailwind CSS v4
├── shadcn/ui components
├── Prisma ORM
├── PostgreSQL
├── tRPC or Server Actions
├── NextAuth.js v5
└── Vercel (deploy)
\`\`\`

**Why this stack for vibe coding?**
- TypeScript catches AI-generated type errors
- Tailwind is easy for AI to generate correctly
- shadcn/ui provides consistent component patterns
- Prisma schema is self-documenting
- App Router gives clear boundaries for AI agents`,
      },
      {
        id: 'project-structure',
        title: 'Project Structure',
        content: `**AI-friendly folder structure:**

\`\`\`
my-app/
├── AGENTS.md              # Project context
├── .iderules              # IDE rules
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Route groups
│   │   ├── api/           # API routes
│   │   └── layout.tsx
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── [features]/    # Feature components
│   ├── lib/               # Utilities
│   ├── hooks/             # Custom hooks
│   ├── types/             # Shared types
│   └── server/            # Server-only code
├── prisma/
│   └── schema.prisma
└── tests/
\`\`\``,
      },
    ],
  },
  {
    slug: 'security',
    title: '7. Security & Production',
    description: 'Security gates and best practices for AI-generated code.',
    sections: [
      {
        id: 'security-mindset',
        title: 'The Security Mindset',
        content: `**Treat AI Output as Untrusted Code**

Every line generated by AI should go through the same scrutiny as a PR from a junior developer you've never met.

**The 3-Layer Defense:**
1. **Pre-generation**: Clear constraints in your context files
2. **Post-generation**: Automated security scanning
3. **Pre-deployment**: Human review for critical paths

**Critical Paths (Always Human Review):**
- Authentication and authorization
- Payment processing
- Data encryption
- PII handling
- API rate limiting`,
      },
      {
        id: 'security-tools',
        title: 'Security Tools',
        content: `**Essential Security Stack:**

| Tool | Purpose |
|------|---------|
| GitLeaks | Secret detection in commits |
| npm audit | Dependency vulnerability scanning |
| Snyk | Continuous dependency monitoring |
| ESLint security plugin | Static analysis for security |
| OWASP ZAP | Dynamic application security testing |

**Pre-commit Hooks:**
\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run security:check"
    }
  }
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'multi-agent',
    title: '8. Multi-Agent Workflows',
    description: 'Advanced patterns using multiple AI agents in concert.',
    sections: [
      {
        id: 'agent-roles',
        title: 'Agent Roles',
        content: `**The Agent Orchestra**

Modern vibe coding uses specialized agents:

1. **Planner**: Analyzes requirements and creates implementation plans
2. **Implementer**: Writes the actual code
3. **Reviewer**: Checks code quality, security, and consistency
4. **Tester**: Generates and runs tests

**Example Workflow:**
\`\`\`
[Planner] "Break down this feature into tasks"
    ↓
[Implementer] "Write the code for task 1"
    ↓
[Reviewer] "Review this code against our standards"
    ↓
[Tester] "Write tests for this implementation"
    ↓
[Human] Final review and merge
\`\`\``,
      },
      {
        id: 'subagents',
        title: 'When to Use Subagents',
        content: `**Use subagents when:**
- The task spans multiple domains (frontend + backend + database)
- You need parallel exploration of different approaches
- The codebase is large and you need specialized knowledge

**Don't use subagents when:**
- The task is simple and well-defined
- Context sharing between agents is difficult
- You're still learning the basics of vibe coding`,
      },
    ],
  },
  {
    slug: 'anti-patterns',
    title: '9. Anti-patterns & Debugging',
    description: 'Common mistakes and how to recover from them.',
    sections: [
      {
        id: 'common-mistakes',
        title: 'Common Mistakes',
        content: `**"Accept All" Without Review**
The #1 mistake. AI generates plausible-looking code that compiles but has subtle bugs.

*Fix*: Always review. Use the review checklist from Chapter 2.

**Invisible Technical Debt**
AI tends to:
- Duplicate code instead of abstracting
- Add unnecessary dependencies
- Skip error handling
- Write overly complex solutions

*Fix*: Regular refactoring sessions. Ask the AI to "simplify this" periodically.

**Context Loss**
Long conversations where the AI forgets earlier decisions.

*Fix*: Start fresh threads for new features. Reference your AGENTS.md frequently.`,
      },
      {
        id: 'recovery',
        title: 'Recovering a Chaotic Project',
        content: `**The Vibe Coded Mess Recovery Plan:**

1. **Stop generating** — Take a breath and assess
2. **Document the intended architecture** — Write down what the system should look like
3. **Create a clean branch** — Don't lose your progress
4. **Start with tests** — Write tests for the behavior you want
5. **Generate against tests** — Use the AI to make tests pass
6. **Refactor ruthlessly** — Delete dead code, consolidate duplicates
7. **Update context files** — Prevent future chaos

**Prevention is Better Than Cure:**
- Set up CI/CD early
- Write tests from day one
- Review every PR (even AI ones)
- Keep your context files current`,
      },
    ],
  },
  {
    slug: 'resources',
    title: '10. Resources',
    description: 'Awesome lists, communities, and accounts to follow.',
    sections: [
      {
        id: 'awesome-list',
        title: 'Awesome Vibe Coding',
        content: `**Curated Resources:**

**Communities:**
- r/cursor — Cursor-specific discussions
- r/vibecoding — General vibe coding community
- Discord: Vibe Coder Collective

**Newsletters:**
- Vibe Check Weekly
- AI-Assisted Dev Monthly

**People to Follow:**
- @karpathy — Andrej Karpathy (coined "vibe coding")
- @mengto — Design + AI
- @shadcn — UI component wizard

**Tools to Watch:**
- Keep an eye on our /tools page for the latest updates`,
      },
      {
        id: 'changelog',
        title: 'Changelog',
        content: `**The Vibe Coding Handbook — Changelog**

**v1.0 (2026-01)**
- Initial release
- 10 chapters
- 50+ prompts
- Tool comparison matrix

**Roadmap:**
- v1.1: Spanish translation, video guides
- v1.2: Advanced multi-agent patterns
- v2.0: Community-contributed case studies`,
      },
    ],
  },
];

export function getChapterBySlug(slug: string): DocChapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return chapters.map((c) => c.slug);
}
