import fs from 'fs';
import path from 'path';
import { prompt } from 'enquirer';
import { header, section, success, info, warn, error, fileTree, spinner, isInteractive } from '../utils/ui.js';
import { scanProject, generateSmartAgentsMd, generateCursorRules } from '../utils/scanner.js';
import { detectLlmConfig, generateAgentsMd } from '../utils/llm.js';
import { wrapInMarkers, mergeIntoExisting } from '../utils/merge.js';

export async function initCommand(options: { yes?: boolean; type?: string; merge?: boolean; describe?: string }): Promise<void> {
  header('Vibe Coding — Initialize Project');

  const cwd = process.cwd();
  const scan = scanProject(cwd);

  info(`Detected: ${scan.framework} + ${scan.language}`);
  if (scan.styling !== 'none') info(`Styling: ${scan.styling}`);
  if (scan.hasDatabase) info(`Database: ${scan.database}`);
  if (scan.hasAuth) info(`Auth: ${scan.authProvider}`);
  console.log();

  // Confirm before overwriting existing AGENTS.md (interactive only; CI always proceeds).
  // --merge is an explicit decision to preserve user content, so it never asks.
  if (!options.merge && !options.yes && isInteractive() && fs.existsSync(path.join(cwd, 'AGENTS.md'))) {
    const overwriteRes = await prompt<{ overwrite: boolean }>({
      type: 'confirm',
      name: 'overwrite',
      message: 'AGENTS.md already exists. Overwrite?',
      initial: false,
    });
    if (!overwriteRes.overwrite) {
      info('Aborted. Existing files were left untouched.');
      return;
    }
    console.log();
  }

  // Interactive or defaults
  let projectName = scan.name;
  let projectType = options.type || 'saas';

  if (!options.yes) {
    const nameRes = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: 'Project name:',
      initial: scan.name,
    });
    projectName = nameRes.name;

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

  // Resolve AGENTS.md content (heuristic or LLM from natural-language description)
  const agentsPath = path.join(cwd, 'AGENTS.md');
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
  if (options.merge && fs.existsSync(agentsPath)) {
    // --merge: update only the managed block, preserve user content outside it
    fs.writeFileSync(agentsPath, mergeIntoExisting(fs.readFileSync(agentsPath, 'utf-8'), agentsContent));
  } else if (options.merge) {
    // --merge on a fresh file: wrap in markers so future merges work
    fs.writeFileSync(agentsPath, wrapInMarkers(agentsContent));
  } else {
    fs.writeFileSync(agentsPath, agentsContent);
  }

  // Generate .cursorrules
  fs.writeFileSync(path.join(cwd, '.cursorrules'), generateCursorRules(scan));

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
    { path: '.cursorrules', type: 'file' },
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

function generateSecurityPolicy(scan: { hasPayments: boolean; hasAuth: boolean }): string {
  return `# Security Policy

## Authentication
- All API endpoints (except auth) require valid JWT
- Tokens expire after 24 hours
- Refresh tokens are httpOnly cookies

${scan.hasPayments ? `## Payments (CRITICAL)
- NEVER log payment tokens or card data
- All payment webhooks must verify signatures
- Idempotency keys on all payment operations
- Test with Stripe test keys only\n` : ''}## Data Protection
- Input validation on ALL user inputs
- Output encoding to prevent XSS
- Parameterized queries only
- Rate limiting: 100 req/min IP, 1000 req/min user

## Environment Variables
- .env files NEVER committed
- Secrets rotated every 90 days
`;
}

function generateTestingPolicy(scan: { hasTests: boolean; testFramework: string }): string {
  return `# Testing Policy

## Requirements

| Test Type | Coverage | Tool |
|-----------|----------|------|
| Unit | 60% | ${scan.testFramework} |
| Integration | Critical paths | ${scan.testFramework} |
| E2E | User journeys | Playwright/Cypress |

## Rules
- Follow Arrange-Act-Assert pattern
- Descriptive names: "should [expected] when [condition]"
- Mock external dependencies
- Test edge cases

${!scan.hasTests ? '\n⚠ No testing framework detected. Run:\n- npm install -D vitest @testing-library/react @testing-library/jest-dom\n' : ''}`;
}

function generateDeploymentPolicy(scan: { framework: string; hasDatabase: boolean }): string {
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
- [ ] ${scan.hasDatabase ? 'Database migrations tested on staging' : 'No database migrations needed'}
- [ ] Environment variables configured
- [ ] Feature flags configured

${scan.framework === 'Next.js' ? '## Next.js Specific\n- Preview deployments on every PR\n- Production deploys from main branch\n- Configure Vercel Analytics' : ''}
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
- \`../.cursorrules\` — IDE rules
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
