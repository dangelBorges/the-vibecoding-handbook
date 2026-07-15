import fs from 'fs';
import path from 'path';

export interface ProjectScan {
  name: string;
  framework: string;
  language: string;
  runtime: string;
  hasTypeScript: boolean;
  hasTests: boolean;
  testFramework: string;
  hasDatabase: boolean;
  database: string;
  hasAuth: boolean;
  authProvider: string;
  hasPayments: boolean;
  paymentProvider: string;
  hasRealtime: boolean;
  styling: string;
  apiStyle: string;
  packageManager: string;
  structure: string[];
  keyFiles: string[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  conventions: string[];
}

export function scanProject(projectPath: string = process.cwd()): ProjectScan {
  const result: ProjectScan = {
    name: path.basename(projectPath),
    framework: 'unknown',
    language: 'javascript',
    runtime: 'node',
    hasTypeScript: false,
    hasTests: false,
    testFramework: 'none',
    hasDatabase: false,
    database: 'none',
    hasAuth: false,
    authProvider: 'none',
    hasPayments: false,
    paymentProvider: 'none',
    hasRealtime: false,
    styling: 'none',
    apiStyle: 'none',
    packageManager: detectPackageManager(projectPath),
    structure: [],
    keyFiles: [],
    dependencies: [],
    devDependencies: [],
    scripts: {},
    conventions: [],
  };

  // ─── package.json ───
  const pkgPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      result.name = pkg.name || result.name;
      result.scripts = pkg.scripts || {};
      result.dependencies = Object.keys(pkg.dependencies || {});
      result.devDependencies = Object.keys(pkg.devDependencies || {});

      const allDeps = [...result.dependencies, ...result.devDependencies];

      // Framework detection
      if (allDeps.includes('next')) result.framework = 'Next.js';
      else if (allDeps.includes('react')) result.framework = 'React';
      else if (allDeps.includes('vue')) result.framework = 'Vue';
      else if (allDeps.includes('svelte')) result.framework = 'Svelte';
      else if (allDeps.includes('astro')) result.framework = 'Astro';
      else if (allDeps.includes('nuxt')) result.framework = 'Nuxt';
      else if (allDeps.includes('fastify') || allDeps.includes('express') || allDeps.includes('koa')) result.framework = 'Node.js API';

      // TypeScript
      result.hasTypeScript = allDeps.includes('typescript') || allDeps.includes('ts-node');
      result.language = result.hasTypeScript ? 'TypeScript' : 'JavaScript';

      // Test framework
      if (allDeps.includes('vitest')) { result.hasTests = true; result.testFramework = 'Vitest'; }
      else if (allDeps.includes('jest')) { result.hasTests = true; result.testFramework = 'Jest'; }
      else if (allDeps.includes('mocha')) { result.hasTests = true; result.testFramework = 'Mocha'; }
      else if (allDeps.includes('playwright')) { result.hasTests = true; result.testFramework = 'Playwright'; }
      else if (allDeps.includes('cypress')) { result.hasTests = true; result.testFramework = 'Cypress'; }

      // Database
      if (allDeps.includes('prisma') || allDeps.includes('@prisma/client')) { result.hasDatabase = true; result.database = 'PostgreSQL (Prisma)'; }
      else if (allDeps.includes('mongoose')) { result.hasDatabase = true; result.database = 'MongoDB (Mongoose)'; }
      else if (allDeps.includes('drizzle-orm')) { result.hasDatabase = true; result.database = 'PostgreSQL (Drizzle)'; }
      else if (allDeps.includes('@supabase/supabase-js')) { result.hasDatabase = true; result.database = 'Supabase'; }
      else if (allDeps.includes('firebase')) { result.hasDatabase = true; result.database = 'Firebase'; }
      else if (allDeps.includes('better-sqlite3') || allDeps.includes('@libsql/client')) { result.hasDatabase = true; result.database = 'SQLite'; }

      // Auth
      if (allDeps.includes('next-auth') || allDeps.includes('@auth/core')) { result.hasAuth = true; result.authProvider = 'NextAuth.js'; }
      else if (allDeps.includes('@clerk')) { result.hasAuth = true; result.authProvider = 'Clerk'; }
      else if (allDeps.includes('@supabase/supabase-js')) { result.hasAuth = true; result.authProvider = 'Supabase Auth'; }
      else if (allDeps.includes('firebase')) { result.hasAuth = true; result.authProvider = 'Firebase Auth'; }
      else if (allDeps.includes('passport')) { result.hasAuth = true; result.authProvider = 'Passport.js'; }
      else if (allDeps.includes('jsonwebtoken') || allDeps.includes('jose')) { result.hasAuth = true; result.authProvider = 'Custom JWT'; }

      // Payments
      if (allDeps.includes('stripe')) { result.hasPayments = true; result.paymentProvider = 'Stripe'; }
      else if (allDeps.includes('@lemonsqueezy')) { result.hasPayments = true; result.paymentProvider = 'LemonSqueezy'; }

      // Realtime
      if (allDeps.includes('socket.io') || allDeps.includes('ws')) { result.hasRealtime = true; }
      else if (allDeps.includes('@supabase/supabase-js')) { result.hasRealtime = true; }

      // Styling
      if (allDeps.includes('tailwindcss')) result.styling = 'Tailwind CSS';
      else if (allDeps.includes('styled-components')) result.styling = 'Styled Components';
      else if (allDeps.includes('@emotion')) result.styling = 'Emotion';
      else if (allDeps.includes('sass') || allDeps.includes('node-sass')) result.styling = 'Sass/SCSS';
      else if (allDeps.includes('postcss')) result.styling = 'PostCSS';

      // API style
      if (allDeps.includes('trpc') || allDeps.includes('@trpc')) result.apiStyle = 'tRPC';
      else if (allDeps.includes('graphql')) result.apiStyle = 'GraphQL';
      else if (allDeps.includes('@tanstack/react-query')) result.apiStyle = 'REST + React Query';
      else if (allDeps.includes('axios') || allDeps.includes('fetch')) result.apiStyle = 'REST';

    } catch { /* ignore */ }
  }

  // ─── Directory structure ───
  const dirsToCheck = ['src', 'app', 'pages', 'components', 'lib', 'utils', 'hooks', 'types', 'server', 'api', 'prisma', 'tests', 'test', '__tests__', 'public', 'static'];
  for (const dir of dirsToCheck) {
    const fullPath = path.join(projectPath, dir);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const files = fs.readdirSync(fullPath).slice(0, 5);
      result.structure.push(`${dir}/ (${files.length} items: ${files.join(', ')}${files.length >= 5 ? '...' : ''})`);
    }
  }

  // ─── Key config files ───
  const configFiles = [
    '.eslintrc', '.eslintrc.js', '.eslintrc.json',
    '.prettierrc', '.prettierrc.js', 'prettier.config.js',
    'tsconfig.json', 'jsconfig.json',
    'next.config.js', 'next.config.ts', 'next.config.mjs',
    'tailwind.config.js', 'tailwind.config.ts',
    'vite.config.ts', 'vite.config.js',
    'astro.config.mjs', 'svelte.config.js',
    'jest.config.js', 'vitest.config.ts', 'playwright.config.ts',
    'Dockerfile', 'docker-compose.yml',
  ];
  for (const file of configFiles) {
    if (fs.existsSync(path.join(projectPath, file))) {
      result.keyFiles.push(file);
    }
  }

  // ─── Detect conventions from code ───
  const srcDir = path.join(projectPath, 'src');
  const appDir = path.join(projectPath, 'app');
  const codeRoot = fs.existsSync(srcDir) ? srcDir : fs.existsSync(appDir) ? appDir : projectPath;

  if (fs.existsSync(codeRoot)) {
    // Check for specific patterns
    const checkFile = (pattern: string): boolean => {
      try {
        const files = findFiles(codeRoot, pattern);
        return files.length > 0;
      } catch { return false; }
    };

    if (checkFile('*.server.ts') || checkFile('*.server.js')) result.conventions.push('Server/Client file separation');
    if (checkFile('loading.tsx') || checkFile('loading.ts')) result.conventions.push('Loading UI patterns');
    if (checkFile('error.tsx') || checkFile('error.ts')) result.conventions.push('Error boundary patterns');
    if (checkFile('layout.tsx') || checkFile('layout.ts')) result.conventions.push('Layout patterns');
    if (checkFile('route.ts') || checkFile('route.tsx')) result.conventions.push('Route handlers');
    if (checkFile('*.test.ts') || checkFile('*.spec.ts')) result.conventions.push('Co-located tests');
    if (checkFile('*.stories.ts') || checkFile('*.stories.tsx')) result.conventions.push('Storybook stories');
    if (checkFile('actions.ts') || checkFile('actions.tsx')) result.conventions.push('Server Actions');
  }

  return result;
}

function detectPackageManager(projectPath: string): string {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  return 'npm';
}

function findFiles(dir: string, pattern: string): string[] {
  const results: string[] = [];
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...findFiles(fullPath, pattern));
      } else if (file.match(pattern.replace('*', '.*').replace('.', '\\.'))) {
        results.push(fullPath);
      }
    }
  } catch { /* ignore permission errors */ }
  return results;
}

export function generateSmartAgentsMd(scan: ProjectScan): string {
  const deps = [...scan.dependencies, ...scan.devDependencies];
  const features: string[] = [];

  if (scan.hasAuth) features.push('- **Authentication**: ' + scan.authProvider);
  if (scan.hasDatabase) features.push('- **Database**: ' + scan.database);
  if (scan.hasPayments) features.push('- **Payments**: ' + scan.paymentProvider);
  if (scan.hasRealtime) features.push('- **Real-time**: WebSocket/Supabase realtime');
  if (scan.hasTests) features.push('- **Testing**: ' + scan.testFramework);

  return `# ${scan.name} — Agent Context

> Auto-generated by \`vibe context --auto\`
> Last updated: ${new Date().toISOString().split('T')[0]}

## Overview
A ${scan.framework} application using ${scan.language}.

## Tech Stack (Detected)

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | ${scan.framework} | ${deps.includes(scan.framework.toLowerCase()) || deps.includes('next') ? '✓ Confirmed' : '⚠ Inferred'} |
| Language | ${scan.language} | ${scan.hasTypeScript ? '✓ Strict mode recommended' : '⚠ Consider TypeScript'} |
| Runtime | ${scan.runtime} | ✓ |
| Styling | ${scan.styling} | ${scan.styling !== 'none' ? '✓' : '⚠ Not detected'} |
| API Style | ${scan.apiStyle} | ${scan.apiStyle !== 'none' ? '✓' : '⚠ Not detected'} |
| Package Manager | ${scan.packageManager} | ✓ |

## Architecture

### Detected Features
${features.length > 0 ? features.join('\n') : '- No advanced features detected'}

### Project Structure
${scan.structure.map((s) => '- ' + s).join('\n') || '- Standard structure'}

### Key Configuration Files
${scan.keyFiles.map((f) => '- \`' + f + '\`').join('\n') || '- No config files detected'}

### Code Conventions
${scan.conventions.length > 0 ? scan.conventions.map((c) => '- ' + c).join('\n') : '- Standard conventions'}

## Coding Standards

### ${scan.language}
${scan.hasTypeScript
    ? '- Strict mode enabled — no \`any\` types allowed\n- All functions must have typed parameters and return types\n- Use interfaces for object shapes, types for unions'
    : '- Use modern ES2022+ features\n- Consider migrating to TypeScript for better DX'}

### Framework: ${scan.framework}
${scan.framework === 'Next.js'
    ? '- Use React Server Components by default\n- Client components only with \`"use client"\` directive\n- Follow App Router patterns (layout.tsx, page.tsx, loading.tsx, error.tsx)'
    : scan.framework === 'React'
    ? '- Follow React best practices\n- Use hooks for state management\n- Component composition over inheritance'
    : '- Follow framework conventions and best practices'}

### General
- Named exports preferred over default exports
- async/await (no .then() chains)
- Max function length: 50 lines (extract if longer)
- Destructure props in function parameters

### Styling: ${scan.styling}
${scan.styling === 'Tailwind CSS'
    ? '- Utility-first approach\n- No inline styles\n- Use \`cn()\` helper for conditional classes\n- Responsive design: mobile-first'
    : scan.styling === 'Styled Components'
    ? '- Co-located styles\n- Theme provider for design tokens\n- Avoid prop drilling for styles'
    : '- Follow established styling conventions'}

### Testing: ${scan.testFramework}
${scan.hasTests
    ? '- Follow Arrange-Act-Assert pattern\n- Descriptive test names: "should [expected] when [condition]"\n- Mock external dependencies\n- Test edge cases: null, undefined, empty, max values'
    : '⚠ No testing framework detected. Recommended: Vitest + React Testing Library'}

## Security Rules

${scan.hasAuth
    ? '- All API routes (except auth endpoints) require authentication\n- Verify JWT tokens server-side on every request\n- Refresh tokens stored in httpOnly cookies\n- Session timeout: 24 hours'
    : '⚠ No auth system detected. Add authentication before handling sensitive data.'}

${scan.hasPayments
    ? '### Payments (CRITICAL)\n- NEVER log payment tokens or card data\n- All payment webhooks must verify signatures\n- Idempotency keys on all payment operations\n- Test with Stripe test keys only\n- PCI compliance: never store card data client-side'
    : ''}

### Data Protection
- Input validation on ALL user inputs
- Output encoding to prevent XSS
- Parameterized queries (no string concatenation in SQL)
- Rate limiting: 100 req/min IP, 1000 req/min user

### Environment Variables
- NEVER commit \`.env\` files (ensure in .gitignore)
- All secrets in \`.env.local\`
- Validate env vars at startup — fail fast if missing
- Different keys for dev/staging/prod

## Git Workflow

| Branch | Purpose | Protection |
|--------|---------|------------|
| \`main\` | Production deploys | No direct commits. PRs only. |
| \`develop\` | Integration branch | PRs from feature branches. |
| \`feature/*\` | New features | Delete after merge. |
| \`hotfix/*\` | Production fixes | Urgent PRs to main. |

### Commit Convention
Format: \`type(scope): description\`

Types: \`feat\`, \`fix\`, \`docs\`, \`test\`, \`refactor\`, \`security\`, \`deps\`, \`chore\`

## Deployment Checklist

- [ ] All tests pass (${scan.testFramework !== 'none' ? `npm run test` : '⚠ Add tests'})
- [ ] TypeScript compiles (${scan.hasTypeScript ? 'npm run typecheck' : '⚠ Not applicable'})
- [ ] Lint passes (npm run lint)
- [ ] No console.log statements in production code
- [ ] Environment variables configured
- [ ] Database migrations tested on staging
- [ ] Feature flags configured (if applicable)

## Scripts Reference

| Script | Command |
|--------|---------|
${Object.entries(scan.scripts).slice(0, 8).map(([name, cmd]) => `| \`${name}\` | \`${cmd}\` |`).join('\n')}

---

*Generated by Vibe Coding CLI. Update with \`vibe context --auto\`.*
`;
}

export function generateCursorRules(scan: ProjectScan): string {
  const deps = [...scan.dependencies, ...scan.devDependencies];
  const rules: string[] = [
    `# ${scan.name} — Cursor Rules`,
    '',
    `# Framework`,
    `- This is a ${scan.framework} project using ${scan.language}`,
    scan.hasTypeScript ? '- TypeScript strict mode — no \`any\` types' : '',
    '',
    `# Code Style`,
    '- Named exports preferred (\`export function\`, not \`export default\`)',
    '- async/await (no .then() chains)',
    '- Destructure props in function parameters',
    '- Max function length: 50 lines',
    '',
    '# Styling',
    scan.styling === 'Tailwind CSS'
      ? '- Tailwind CSS utility classes only\n- No inline styles\n- Use cn() helper for conditional classes'
      : `- Follow ${scan.styling} conventions`,
    '',
    '# API / Data',
    scan.apiStyle === 'tRPC'
      ? '- Use tRPC procedures for all API calls\n- Zod schemas for input validation\n- Type-safe end-to-end'
      : scan.hasDatabase && scan.database.includes('Prisma')
      ? '- Use Prisma ORM for all database operations\n- No raw SQL queries'
      : '- Follow project data patterns',
    '',
    '# Security',
    '- Input validation on ALL user inputs',
    '- No hardcoded secrets or API keys',
    '- No console.log in production code',
    deps.includes('next-auth') || deps.includes('@auth/core')
      ? '- All server actions require auth checks'
      : '',
    '',
    '# Forbidden',
    '- No \`eval()\` or \`Function()\`',
    '- No unvalidated user input in queries',
    '- No direct database queries from components',
    scan.hasTypeScript ? '- No \`any\` types' : '',
  ];

  return rules.filter(Boolean).join('\n');
}
