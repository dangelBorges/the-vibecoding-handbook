import fs from 'fs';
import path from 'path';

/** Per-package summary for monorepo roots (values reuse the detector's strings). */
export interface PackageSummary {
  name: string;
  /** Path relative to the monorepo root (e.g. "packages/web"). */
  path: string;
  framework: string;
  language: string;
  testFramework: string;
  styling: string;
  database: string;
  auth: string;
}

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
  isMonorepo: boolean;
  monorepoTool?: string;
  packages: PackageSummary[];
}

/** Minimal shape of a package.json we care about. */
interface PackageJson {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[] };
}

/** Stack details detected purely from a package.json's dependencies. */
interface DependencyStack {
  framework: string;
  language: string;
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
    isMonorepo: false,
    packages: [],
  };

  // ─── package.json ───
  const pkgPath = path.join(projectPath, 'package.json');
  let rootPkg: PackageJson | null = null;
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg: PackageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      rootPkg = pkg;
      result.name = pkg.name || result.name;
      result.scripts = pkg.scripts || {};
      result.dependencies = Object.keys(pkg.dependencies || {});
      result.devDependencies = Object.keys(pkg.devDependencies || {});

      // Stack detection (framework, language, tests, database, auth, ...)
      Object.assign(result, detectFromPackageJson(pkg));
    } catch { /* ignore */ }
  }

  // ─── Monorepo / workspaces ───
  // Formal tooling first (workspaces field, pnpm-workspace.yaml, lerna.json);
  // if none is declared, fall back to directory-structure inference.
  const formalMonorepo = detectMonorepo(projectPath, rootPkg);
  let monorepoTool: string | undefined;
  let packageDirs: string[] = [];
  if (formalMonorepo) {
    monorepoTool = formalMonorepo.tool;
    packageDirs = expandWorkspaceGlobs(projectPath, formalMonorepo.globs);
  } else {
    const inferredDirs = detectImplicitPackages(projectPath);
    if (inferredDirs.length >= 2) {
      monorepoTool = 'implicit';
      packageDirs = inferredDirs;
    }
  }

  if (monorepoTool) {
    result.isMonorepo = true;
    result.monorepoTool = monorepoTool;
    for (const dir of packageDirs) {
      const summary = scanWorkspacePackage(projectPath, dir);
      if (summary) result.packages.push(summary);
    }

    // Aggregate key facts from packages into the root scan
    if (result.packages.length > 0) {
      result.hasTypeScript = result.hasTypeScript || result.packages.some((p) => p.language === 'TypeScript');
      result.hasTests = result.hasTests || result.packages.some((p) => p.testFramework !== 'none');
      if (result.testFramework === 'none') {
        const firstWithTests = result.packages.find((p) => p.testFramework !== 'none');
        if (firstWithTests) result.testFramework = firstWithTests.testFramework;
      }
    }
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
        const files = findFiles(codeRoot, pattern, 1);
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

/** Detects the stack (framework, language, tests, ...) from a parsed package.json. */
function detectFromPackageJson(pkg: PackageJson): DependencyStack {
  const stack: DependencyStack = {
    framework: 'unknown',
    language: 'javascript',
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
  };

  const allDeps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];

  // Framework detection
  if (allDeps.includes('next')) stack.framework = 'Next.js';
  else if (allDeps.includes('react')) stack.framework = 'React';
  else if (allDeps.includes('vue')) stack.framework = 'Vue';
  else if (allDeps.includes('svelte')) stack.framework = 'Svelte';
  else if (allDeps.includes('astro')) stack.framework = 'Astro';
  else if (allDeps.includes('nuxt')) stack.framework = 'Nuxt';
  else if (allDeps.includes('fastify') || allDeps.includes('express') || allDeps.includes('koa')) stack.framework = 'Node.js API';

  // TypeScript
  stack.hasTypeScript = allDeps.includes('typescript') || allDeps.includes('ts-node');
  stack.language = stack.hasTypeScript ? 'TypeScript' : 'JavaScript';

  // Test framework
  if (allDeps.includes('vitest')) { stack.hasTests = true; stack.testFramework = 'Vitest'; }
  else if (allDeps.includes('jest')) { stack.hasTests = true; stack.testFramework = 'Jest'; }
  else if (allDeps.includes('mocha')) { stack.hasTests = true; stack.testFramework = 'Mocha'; }
  else if (allDeps.includes('playwright')) { stack.hasTests = true; stack.testFramework = 'Playwright'; }
  else if (allDeps.includes('cypress')) { stack.hasTests = true; stack.testFramework = 'Cypress'; }

  // Database
  if (allDeps.includes('prisma') || allDeps.includes('@prisma/client')) { stack.hasDatabase = true; stack.database = 'PostgreSQL (Prisma)'; }
  else if (allDeps.includes('mongoose')) { stack.hasDatabase = true; stack.database = 'MongoDB (Mongoose)'; }
  else if (allDeps.includes('drizzle-orm')) { stack.hasDatabase = true; stack.database = 'PostgreSQL (Drizzle)'; }
  else if (allDeps.includes('@supabase/supabase-js')) { stack.hasDatabase = true; stack.database = 'Supabase'; }
  else if (allDeps.includes('firebase')) { stack.hasDatabase = true; stack.database = 'Firebase'; }
  else if (allDeps.includes('better-sqlite3') || allDeps.includes('@libsql/client')) { stack.hasDatabase = true; stack.database = 'SQLite'; }

  // Auth
  if (allDeps.includes('next-auth') || allDeps.includes('@auth/core')) { stack.hasAuth = true; stack.authProvider = 'NextAuth.js'; }
  else if (allDeps.includes('@clerk')) { stack.hasAuth = true; stack.authProvider = 'Clerk'; }
  else if (allDeps.includes('@supabase/supabase-js')) { stack.hasAuth = true; stack.authProvider = 'Supabase Auth'; }
  else if (allDeps.includes('firebase')) { stack.hasAuth = true; stack.authProvider = 'Firebase Auth'; }
  else if (allDeps.includes('passport')) { stack.hasAuth = true; stack.authProvider = 'Passport.js'; }
  else if (allDeps.includes('jsonwebtoken') || allDeps.includes('jose')) { stack.hasAuth = true; stack.authProvider = 'Custom JWT'; }

  // Payments
  if (allDeps.includes('stripe')) { stack.hasPayments = true; stack.paymentProvider = 'Stripe'; }
  else if (allDeps.includes('@lemonsqueezy')) { stack.hasPayments = true; stack.paymentProvider = 'LemonSqueezy'; }

  // Realtime
  if (allDeps.includes('socket.io') || allDeps.includes('ws')) { stack.hasRealtime = true; }
  else if (allDeps.includes('@supabase/supabase-js')) { stack.hasRealtime = true; }

  // Styling
  if (allDeps.includes('tailwindcss')) stack.styling = 'Tailwind CSS';
  else if (allDeps.includes('styled-components')) stack.styling = 'Styled Components';
  else if (allDeps.includes('@emotion')) stack.styling = 'Emotion';
  else if (allDeps.includes('sass') || allDeps.includes('node-sass')) stack.styling = 'Sass/SCSS';
  else if (allDeps.includes('postcss')) stack.styling = 'PostCSS';

  // API style
  if (allDeps.includes('trpc') || allDeps.includes('@trpc')) stack.apiStyle = 'tRPC';
  else if (allDeps.includes('graphql')) stack.apiStyle = 'GraphQL';
  else if (allDeps.includes('@tanstack/react-query')) stack.apiStyle = 'REST + React Query';
  else if (allDeps.includes('axios') || allDeps.includes('fetch')) stack.apiStyle = 'REST';

  return stack;
}

interface MonorepoInfo {
  tool: string;
  globs: string[];
}

/**
 * Detects whether projectPath is the root of a monorepo.
 * Priority: lerna.json > pnpm-workspace.yaml > package.json "workspaces"
 * (lerna repos usually also declare npm/yarn workspaces, so lerna wins;
 * yarn = workspaces field + yarn.lock, npm workspaces otherwise).
 */
function detectMonorepo(projectPath: string, pkg: PackageJson | null): MonorepoInfo | null {
  const lernaPath = path.join(projectPath, 'lerna.json');
  if (fs.existsSync(lernaPath)) {
    let globs: string[] = [];
    try {
      const lerna: { packages?: unknown } = JSON.parse(fs.readFileSync(lernaPath, 'utf-8'));
      if (Array.isArray(lerna.packages)) globs = lerna.packages.filter((g): g is string => typeof g === 'string');
    } catch { /* ignore */ }
    if (globs.length === 0) globs = readWorkspacesField(pkg);
    if (globs.length === 0) globs = ['packages/*']; // lerna's own default
    return { tool: 'lerna', globs };
  }

  const pnpmWorkspacePath = path.join(projectPath, 'pnpm-workspace.yaml');
  if (fs.existsSync(pnpmWorkspacePath)) {
    try {
      const globs = parsePnpmWorkspaceGlobs(fs.readFileSync(pnpmWorkspacePath, 'utf-8'));
      if (globs.length > 0) return { tool: 'pnpm', globs };
    } catch { /* ignore */ }
  }

  const workspaceGlobs = readWorkspacesField(pkg);
  if (workspaceGlobs.length > 0) {
    const tool = fs.existsSync(path.join(projectPath, 'yarn.lock')) ? 'yarn workspaces' : 'npm workspaces';
    return { tool, globs: workspaceGlobs };
  }

  return null;
}

/** Reads the "workspaces" field — both valid forms: array or { packages: [...] }. */
function readWorkspacesField(pkg: PackageJson | null): string[] {
  if (!pkg || !pkg.workspaces) return [];
  if (Array.isArray(pkg.workspaces)) return pkg.workspaces.filter((g): g is string => typeof g === 'string');
  if (Array.isArray(pkg.workspaces.packages)) return pkg.workspaces.packages.filter((g): g is string => typeof g === 'string');
  return [];
}

/**
 * Minimal pnpm-workspace.yaml parser: collects the list items under the
 * top-level "packages:" key (simple form: lines like  - 'apps/*').
 * Negation patterns (!...) are ignored.
 */
function parsePnpmWorkspaceGlobs(content: string): string[] {
  const globs: string[] = [];
  let inPackages = false;
  for (const line of content.split('\n')) {
    if (!inPackages) {
      if (/^packages\s*:\s*$/.test(line)) inPackages = true;
      continue;
    }
    const item = line.match(/^\s*-\s*['"]?([^'"\s#]+)['"]?\s*$/);
    if (item) {
      if (!item[1].startsWith('!')) globs.push(item[1]);
      continue;
    }
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue; // tolerate blanks/comments
    break; // a new top-level key — end of the packages list
  }
  return globs;
}

/** Directories that never count as monorepo packages (false-positive guards). */
const IMPLICIT_EXCLUDE = new Set([
  'node_modules', 'dist', 'build', 'out', 'coverage',
  'example', 'examples', 'demo', 'demos',
  'fixture', 'fixtures', 'template', 'templates', 'sample', 'samples',
]);

/** Conventional container dirs worth scanning one level deeper (packages/, apps/, ...). */
const IMPLICIT_CONTAINERS = new Set(['packages', 'apps', 'libs', 'services', 'components', 'modules']);

/**
 * Infers monorepo packages from the directory structure when no workspace
 * tooling is declared: direct subdirectories with their own package.json,
 * plus one level deeper inside conventional container dirs (apps/*, packages/*).
 */
function detectImplicitPackages(projectPath: string): string[] {
  const dirs = new Set<string>();
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(projectPath, { withFileTypes: true });
  } catch { return []; }

  const hasPackageJson = (rel: string): boolean =>
    fs.existsSync(path.join(projectPath, rel, 'package.json'));
  const isCandidate = (name: string): boolean =>
    !name.startsWith('.') && !IMPLICIT_EXCLUDE.has(name);

  for (const entry of entries) {
    if (!entry.isDirectory() || !isCandidate(entry.name)) continue;
    if (hasPackageJson(entry.name)) {
      dirs.add(entry.name);
      continue;
    }
    if (!IMPLICIT_CONTAINERS.has(entry.name)) continue;
    let subEntries: fs.Dirent[];
    try {
      subEntries = fs.readdirSync(path.join(projectPath, entry.name), { withFileTypes: true });
    } catch { continue; }
    for (const sub of subEntries) {
      if (!sub.isDirectory() || !isCandidate(sub.name)) continue;
      const rel = `${entry.name}/${sub.name}`;
      if (hasPackageJson(rel)) dirs.add(rel);
    }
  }
  return [...dirs].sort();
}

/**
 * Expands workspace globs into package directories (relative to projectPath).
 * Supports single-level globs ("packages/*") and exact paths ("packages/foo").
 * Ignores node_modules, dot-directories, and dirs without a package.json.
 */
function expandWorkspaceGlobs(projectPath: string, globs: string[]): string[] {
  const dirs = new Set<string>();
  for (const glob of globs) {
    const pattern = glob.replace(/\\/g, '/').replace(/\/+$/, '');
    if (!pattern || pattern.split('/').includes('node_modules')) continue;

    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(path.join(projectPath, base), { withFileTypes: true });
      } catch { continue; }
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        const rel = `${base}/${entry.name}`;
        if (fs.existsSync(path.join(projectPath, rel, 'package.json'))) dirs.add(rel);
      }
    } else if (fs.existsSync(path.join(projectPath, pattern, 'package.json'))) {
      dirs.add(pattern);
    }
  }
  return [...dirs];
}

/** Builds the per-package summary used by the monorepo table. */
function scanWorkspacePackage(projectPath: string, relPath: string): PackageSummary | null {
  try {
    const pkg: PackageJson = JSON.parse(fs.readFileSync(path.join(projectPath, relPath, 'package.json'), 'utf-8'));
    const stack = detectFromPackageJson(pkg);
    return {
      name: pkg.name || path.basename(relPath),
      path: relPath,
      framework: stack.framework,
      language: stack.language,
      testFramework: stack.testFramework,
      styling: stack.styling,
      database: stack.database,
      auth: stack.authProvider,
    };
  } catch { return null; }
}

function detectPackageManager(projectPath: string): string {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
  return 'npm';
}

const WALK_SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', 'coverage',
  '.next', '.nuxt', '.turbo', '.cache', '.vscode',
]);

/**
 * Recursively finds files matching a simple glob ("*.test.ts" or "loading.tsx").
 * Skips dependency/build dirs and never follows symlinks/junctions (pnpm
 * stores form cycles). Anchored match; stops after `maxResults` hits.
 */
function findFiles(dir: string, pattern: string, maxResults = 50, depth = 0): string[] {
  if (depth > 10) return [];
  const results: string[] = [];
  const regex = new RegExp(
    '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'
  );
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch { return results; }
  for (const entry of entries) {
    if (results.length >= maxResults) break;
    if (WALK_SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, pattern, maxResults - results.length, depth + 1));
    } else if (entry.isFile() && regex.test(entry.name)) {
      results.push(fullPath);
    }
  }
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

  // Monorepo section (rendered right after the overview)
  const orDash = (value: string): string => (value === 'unknown' || value === 'none' ? '—' : value);
  const isImplicitMonorepo = scan.monorepoTool === 'implicit';
  const packageCount = scan.packages.length;
  const plural = packageCount === 1 ? '' : 's';
  const monorepoSection =
    scan.isMonorepo && packageCount > 0
      ? [
          '',
          '## Monorepo',
          '',
          isImplicitMonorepo
            ? `Inferred from directory structure — no workspace tooling detected (${packageCount} package${plural} found). Consider formalizing with pnpm or npm workspaces.`
            : `Managed with **${scan.monorepoTool}** (${packageCount} package${plural} detected).`,
          '',
          '| Package | Path | Framework | Language | Tests |',
          '|---------|------|-----------|----------|-------|',
          ...scan.packages.map(
            (p) => `| ${p.name} | \`${p.path}\` | ${orDash(p.framework)} | ${orDash(p.language)} | ${orDash(p.testFramework)} |`
          ),
          '',
        ].join('\n')
      : '';

  const overviewLine =
    scan.isMonorepo && scan.framework === 'unknown'
      ? isImplicitMonorepo
        ? `A monorepo (inferred from directory structure) containing ${packageCount} package${plural}.`
        : `A monorepo managed with ${scan.monorepoTool ?? 'workspaces'} containing ${packageCount} package${plural}.`
      : `A ${scan.framework} application using ${scan.language}.`;

  return `# ${scan.name} — Agent Context

> Auto-generated by \`vibe context --auto\`
> Last updated: ${new Date().toISOString().split('T')[0]}

## Overview
${overviewLine}
${monorepoSection}
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
