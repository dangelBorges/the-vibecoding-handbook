import fs from 'fs';
import path from 'path';
import { prompt } from 'enquirer';
import { header, section, success, info, warn, error, fileTree, spinner, isInteractive } from '../utils/ui.js';
import { scanProject, generateSmartAgentsMd, generateIdeRules } from '../utils/scanner.js';
import { detectLlmConfig, generateAgentsMd, generateAgentsMdFromScan } from '../utils/llm.js';
import { wrapInMarkers, mergeIntoExisting } from '../utils/merge.js';

export async function initCommand(options: { yes?: boolean; type?: string; name?: string; merge?: boolean; describe?: string; llm?: boolean; overwrite?: boolean }): Promise<void> {
  header('Vibe Coding — Initialize Project');

  const cwd = process.cwd();
  const scan = scanProject(cwd);

  info(`Detected: ${scan.framework} + ${scan.language}`);
  if (scan.styling !== 'none') info(`Styling: ${scan.styling}`);
  if (scan.hasDatabase) info(`Database: ${scan.database}`);
  if (scan.hasAuth) info(`Auth: ${scan.authProvider}`);
  console.log();

  // Resolve merge strategy for existing AGENTS.md.
  // Default is merge (preserve user edits outside markers) unless --overwrite is passed.
  const agentsPath = path.join(cwd, 'AGENTS.md');
  const agentsExists = fs.existsSync(agentsPath);
  let mergeStrategy: 'merge' | 'overwrite' | 'abort' = options.overwrite ? 'overwrite' : 'merge';
  if (options.merge) mergeStrategy = 'merge';

  // Interactive confirmation when AGENTS.md exists and no explicit flag was passed.
  if (agentsExists && !options.overwrite && !options.merge && !options.yes && isInteractive()) {
    const actionRes = await prompt<{ action: 'merge' | 'overwrite' | 'abort' }>({
      type: 'select',
      name: 'action',
      message: 'AGENTS.md already exists. What would you like to do?',
      choices: [
        { name: 'merge', message: 'Merge — preserve my existing content' },
        { name: 'overwrite', message: 'Overwrite — replace everything' },
        { name: 'abort', message: 'Abort — leave files untouched' },
      ] as any,
      initial: 'merge',
    } as any);
    mergeStrategy = actionRes.action;
    if (mergeStrategy === 'abort') {
      info('Aborted. Existing files were left untouched.');
      return;
    }
    console.log();
  }

  // Interactive or defaults
  let projectName = options.name || scan.name;
  let projectType = options.type || 'saas';

  if (!options.yes) {
    if (!options.name) {
      const nameRes = await prompt<{ name: string }>({
        type: 'input',
        name: 'name',
        message: 'Project name:',
        initial: scan.name,
      });
      projectName = nameRes.name;
    }

    const typeRes = await prompt<{ type: string }>({
      type: 'select',
      name: 'type',
      message: 'Project type:',
      choices: ['saas', 'ecommerce', 'content', 'api', 'dashboard', 'other'] as any,
      initial: 'saas',
    } as any);
    projectType = typeRes.type;
  }

  // Override scan name
  scan.name = projectName;

  // Resolve AGENTS.md content (heuristic or LLM)
  let agentsContent: string;
  if (options.describe) {
    const llm = detectLlmConfig();
    if (!llm) {
      error('No LLM API key found. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to use --describe, or omit --describe to use heuristics.');
      process.exit(1);
    }
    const llmContent = await generateAgentsMd(options.describe, scan, llm);
    if (llmContent) {
      agentsContent = llmContent;
      info('AGENTS.md generated from description');
    } else {
      warn('LLM unavailable — falling back to local heuristics');
      agentsContent = generateSmartAgentsMd(scan);
    }
  } else if (options.llm !== false) {
    const llm = detectLlmConfig();
    if (llm) {
      const sLlm = spinner('Generating project-specific context with LLM...');
      sLlm.start();
      const llmContent = await generateAgentsMdFromScan(scan, llm);
      if (llmContent) {
        sLlm.succeed('AGENTS.md generated from project scan using LLM');
        agentsContent = llmContent;
      } else {
        sLlm.warn('LLM unavailable — falling back to local heuristics');
        agentsContent = generateSmartAgentsMd(scan);
      }
    } else {
      agentsContent = generateSmartAgentsMd(scan);
    }
  } else {
    agentsContent = generateSmartAgentsMd(scan);
  }

  section('Generating Files');

  const s = spinner('Creating project governance...');
  s.start();

  // Create directories
  const dirs = ['.vibecoding', '.vibecoding/policies', '.vibecoding/decisions', '.vibecoding/templates'];
  for (const dir of dirs) {
    if (!fs.existsSync(path.join(cwd, dir))) {
      fs.mkdirSync(path.join(cwd, dir), { recursive: true });
    }
  }

  // Write AGENTS.md (plain, or merged via markers)
  if (mergeStrategy === 'merge' && agentsExists) {
    // update only the managed block, preserve user content outside it
    fs.writeFileSync(agentsPath, mergeIntoExisting(fs.readFileSync(agentsPath, 'utf-8'), agentsContent));
  } else if (mergeStrategy === 'merge') {
    // merge on a fresh file: wrap in markers so future merges work
    fs.writeFileSync(agentsPath, wrapInMarkers(agentsContent));
  } else {
    fs.writeFileSync(agentsPath, agentsContent);
  }

  // Generate .iderules
  fs.writeFileSync(path.join(cwd, '.iderules'), generateIdeRules(scan));

  // Generate policies
  fs.writeFileSync(path.join(cwd, '.vibecoding/policies/git-policy.md'), generateGitPolicy());
  fs.writeFileSync(path.join(cwd, '.vibecoding/policies/security-policy.md'), generateSecurityPolicy(scan));
  fs.writeFileSync(path.join(cwd, '.vibecoding/policies/testing-policy.md'), generateTestingPolicy(scan));
  fs.writeFileSync(path.join(cwd, '.vibecoding/policies/deployment-policy.md'), generateDeploymentPolicy(scan));

  // Generate ADR
  fs.writeFileSync(
    path.join(cwd, '.vibecoding/decisions/ADR-001-architecture.md'),
    generateAdr(projectName, projectType, scan)
  );

  // README
  fs.writeFileSync(
    path.join(cwd, '.vibecoding/README.md'),
    generateVibeReadme(projectName)
  );

  s.succeed('Files created!');

  section('Generated Structure');
  fileTree([
    { path: 'AGENTS.md', type: 'file' },
    { path: '.iderules', type: 'file' },
    { path: '.vibecoding/', type: 'dir' },
    { path: '  policies/', type: 'dir' },
    { path: '    git-policy.md', type: 'file' },
    { path: '    security-policy.md', type: 'file' },
    { path: '    testing-policy.md', type: 'file' },
    { path: '    deployment-policy.md', type: 'file' },
    { path: '  decisions/', type: 'dir' },
    { path: '    ADR-001-architecture.md', type: 'file' },
  ]);

  console.log();
  success(`Vibe Coding governance initialized for "${projectName}"!`);
  console.log();
  info('Next: Run "vibe check" to validate your setup');
  info('       Run "vibe context --auto" anytime to refresh from codebase');
  console.log();
}

function generateGitPolicy(): string {
  return `# Git Policy

## Branching Strategy

| Branch | Purpose | Rules |
|--------|---------|-------|
| \`main\` | Production | No direct commits. PRs only with 1 review. |
| \`develop\` | Integration | Merge feature branches here. |
| \`feature/description\` | New features | Branch from develop. Delete after merge. |
| \`hotfix/description\` | Urgent fixes | Branch from main. Merge to both main and develop. |

## Commit Convention

\`\`\`
type(scope): description

[optional body]
\`\`\`

Types: \`feat\`, \`fix\`, \`docs\`, \`test\`, \`refactor\`, \`security\`, \`deps\`, \`chore\`

## PR Template

- [ ] Description of changes
- [ ] Tests added/updated
- [ ] TypeScript compiles
- [ ] No console.log statements
- [ ] Breaking changes noted
`;
}

function generateSecurityPolicy(scan: { hasPayments: boolean; paymentProvider: string; hasAuth: boolean; authProvider: string; hasDatabase: boolean; database: string }): string {
  const authSection = scan.hasAuth
    ? scan.authProvider === 'NextAuth.js'
      ? '- Use NextAuth.js session checks on all server routes and API handlers\n- Keep OAuth secrets out of client bundles\n- Tokens expire after 24 hours; refresh tokens in httpOnly cookies'
      : scan.authProvider === 'Clerk'
      ? '- Verify Clerk sessions server-side before serving sensitive data\n- Keep Clerk keys out of client-side code except the publishable key\n- Protect API routes with Clerk middleware'
      : scan.authProvider === 'Supabase Auth'
      ? '- Use Supabase server-side auth helpers for protected routes\n- Store JWTs securely; never expose service role key client-side'
      : '- All API endpoints (except auth) require valid JWT\n- Tokens expire after 24 hours\n- Refresh tokens are httpOnly cookies'
    : '⚠ No auth system detected. Add authentication before handling sensitive data.';

  const paymentSection = scan.hasPayments
    ? `## Payments (${scan.paymentProvider}) — CRITICAL
- NEVER log payment tokens or card data
- All payment webhooks must verify signatures
- Idempotency keys on all payment operations
- Test with ${scan.paymentProvider === 'Stripe' ? 'Stripe' : 'provider'} test keys only\n- PCI compliance: never store card data client-side`
    : '';

  const dbSection = scan.hasDatabase
    ? `## Database (${scan.database})
- Parameterized queries only (no string concatenation in SQL)
- Validate all inputs before database writes
- Keep database credentials in environment variables only`
    : '';

  return `# Security Policy

## Authentication
${authSection}

${paymentSection}${paymentSection ? '\n' : ''}${dbSection}${dbSection ? '\n' : ''}## Data Protection
- Input validation on ALL user inputs
- Output encoding to prevent XSS
- Rate limiting: 100 req/min IP, 1000 req/min user

## Environment Variables
- .env files NEVER committed
- Secrets rotated every 90 days
`;
}

function generateTestingPolicy(scan: { hasTests: boolean; testFramework: string; framework: string; scripts: Record<string, string> }): string {
  const runCmd = scan.scripts.test ? `\`npm run test\`` : (scan.hasTests ? `\`${scan.testFramework.toLowerCase()}\`` : '⚠ Add a test script to package.json');
  const frameworkNotes =
    scan.framework === 'Next.js'
      ? '- Co-locate tests next to the code they test (e.g. \`page.test.tsx\`)\n- Use React Server Components by default; test client components with \`@testing-library/react\`'
      : scan.framework === 'React'
      ? '- Test components with \`@testing-library/react\`\n- Prefer testing behavior over implementation details'
      : scan.framework === 'Node.js API'
      ? '- Test routes and handlers in isolation\n- Spin up test database or use in-memory/store mocks'
      : '- Align tests with your framework conventions';

  return `# Testing Policy

## Requirements

| Test Type | Coverage | Tool |
|-----------|----------|------|
| Unit | 60% | ${scan.hasTests ? scan.testFramework : 'Vitest (recommended)'} |
| Integration | Critical paths | ${scan.hasTests ? scan.testFramework : 'Vitest (recommended)'} |
| E2E | User journeys | Playwright/Cypress |

## Run Tests

${runCmd}

## Rules
- Follow Arrange-Act-Assert pattern
- Descriptive names: "should [expected] when [condition]"
- Mock external dependencies
- Test edge cases

### Framework Notes
${frameworkNotes}

${!scan.hasTests ? '\n⚠ No testing framework detected. Run:\n- npm install -D vitest @testing-library/react @testing-library/jest-dom\n' : ''}`;
}

function generateDeploymentPolicy(scan: { framework: string; hasDatabase: boolean; database: string; scripts: Record<string, string> }): string {
  const frameworkSpecific =
    scan.framework === 'Next.js'
      ? '## Next.js Specific\n- Preview deployments on every PR\n- Production deploys from \`main\` branch\n- Configure Vercel Analytics and Speed Insights\n- Use \`next.config.js\` redirects/rewrites for legacy paths'
      : scan.framework === 'React'
      ? '## React SPA Specific\n- Build with \`npm run build\` and verify static assets\n- Configure CDN for production assets\n- Ensure environment variables are injected at build time'
      : scan.framework === 'Node.js API'
      ? '## Node.js API Specific\n- Health check endpoint required (\`/health\`)\n- Graceful shutdown on SIGTERM\n- Log structured JSON in production'
      : '';

  const buildCmd = scan.scripts.build ? 'Run `npm run build` before deploying' : 'Add a `build` script to package.json';

  return `# Deployment Policy

## Environments

| Environment | Branch | Purpose |
|-------------|--------|---------|
| Development | any feature | Local development |
| Staging | \`develop\` | Pre-production testing |
| Production | \`main\` | Live application |

## Pre-deployment Checklist

- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] Lint passes
- [ ] ${buildCmd}
- [ ] ${scan.hasDatabase ? `Database migrations tested on staging (${scan.database})` : 'No database migrations needed'}
- [ ] Environment variables configured
- [ ] Feature flags configured

${frameworkSpecific}
`;
}

function generateAdr(projectName: string, projectType: string, scan: { framework: string; language: string }): string {
  return `# ADR-001: Architecture Overview

## Status
Accepted

## Context
Building ${projectName} — a ${projectType} project.

## Decision

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | ${scan.framework} | Best fit for ${projectType} |
| Language | ${scan.language} | Type safety and DX |

## Date
${new Date().toISOString().split('T')[0]}
`;
}

function generateVibeReadme(projectName: string): string {
  return `# ${projectName} — Vibe Coding Setup

Generated by \`vibe init\`.

## Files

- \`../AGENTS.md\` — Main agent context (auto-generated from your codebase)
- \`../.iderules\` — IDE rules
- \`policies/\` — Project policies (Git, Security, Testing, Deployment)
- \`decisions/\` — Architecture Decision Records

## Commands

| Command | Description |
|---------|-------------|
| \`vibe check\` | Validate project setup |
| \`vibe context --auto\` | Refresh AGENTS.md from codebase |
| \`vibe review --staged\` | Review staged changes |
| \`vibe optimize "prompt"\` | Optimize a prompt |

Learn more: https://vibecoding.guide
`;
}
