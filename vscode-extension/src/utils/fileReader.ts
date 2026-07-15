import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface VibeFile {
  name: string;
  path: string;
  content: string;
}

export interface DetectedStack {
  framework: string;
  language: string;
  hasDatabase: boolean;
  hasAuth: boolean;
  hasTests: boolean;
}

export function getWorkspacePath(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  return folders ? folders[0].uri.fsPath : undefined;
}

export function checkVibeSetup(): boolean {
  const wsPath = getWorkspacePath();
  if (!wsPath) return false;
  return fs.existsSync(path.join(wsPath, '.vibecoding')) ||
         fs.existsSync(path.join(wsPath, 'AGENTS.md'));
}

export function readVibeFile(relativePath: string): string | null {
  const wsPath = getWorkspacePath();
  if (!wsPath) return null;

  const fullPath = path.join(wsPath, relativePath);
  if (!fs.existsSync(fullPath)) return null;

  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return null;
  }
}

export function listPolicyFiles(): VibeFile[] {
  const wsPath = getWorkspacePath();
  if (!wsPath) return [];

  const policiesDir = path.join(wsPath, '.vibecoding', 'policies');
  if (!fs.existsSync(policiesDir)) return [];

  return fs.readdirSync(policiesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      name: f.replace('.md', ''),
      path: path.join('.vibecoding/policies', f),
      content: fs.readFileSync(path.join(policiesDir, f), 'utf-8'),
    }));
}

export function listDecisionFiles(): VibeFile[] {
  const wsPath = getWorkspacePath();
  if (!wsPath) return [];

  const decisionsDir = path.join(wsPath, '.vibecoding', 'decisions');
  if (!fs.existsSync(decisionsDir)) return [];

  return fs.readdirSync(decisionsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      name: f.replace('.md', ''),
      path: path.join('.vibecoding/decisions', f),
      content: fs.readFileSync(path.join(decisionsDir, f), 'utf-8'),
    }));
}

export function detectStack(): DetectedStack {
  const result: DetectedStack = {
    framework: 'unknown',
    language: 'unknown',
    hasDatabase: false,
    hasAuth: false,
    hasTests: false,
  };

  const wsPath = getWorkspacePath();
  if (!wsPath) return result;

  const pkgPath = path.join(wsPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.next) result.framework = 'Next.js';
      else if (deps.react) result.framework = 'React';
      else if (deps.vue) result.framework = 'Vue';
      else if (deps.astro) result.framework = 'Astro';
      else if (deps.svelte) result.framework = 'Svelte';

      if (deps.typescript) result.language = 'TypeScript';
      else result.language = 'JavaScript';

      if (deps.prisma || deps['@prisma/client'] || deps.mongoose) result.hasDatabase = true;
      if (deps['@auth/core'] || deps['next-auth'] || deps['@supabase/supabase-js']) result.hasAuth = true;
      if (deps.vitest || deps.jest || deps.cypress) result.hasTests = true;
    } catch {
      // ignore
    }
  }

  return result;
}

export function parseAgentsMd(): { key: string; value: string }[] {
  const content = readVibeFile('AGENTS.md');
  if (!content) return [];

  const sections: { key: string; value: string }[] = [];

  // Match a "## <header>" line and capture its body until the next section
  // (or the real end of the file).
  const sectionPattern = (header: string) =>
    new RegExp(`^## ${header}\\s*$[\\s\\S]*?(?=\\n## |$(?![\\s\\S]))`, 'm');

  // Extract key sections
  const extractSection = (title: string, pattern: RegExp) => {
    const match = content.match(pattern);
    if (match) {
      sections.push({ key: title, value: match[0].slice(0, 500) });
    }
  };

  extractSection('Tech Stack', sectionPattern('Tech Stack'));
  extractSection('Architecture', sectionPattern('(Architecture|Overview)'));
  extractSection('Coding Standards', sectionPattern('Coding Standards'));
  extractSection('Security', sectionPattern('Security( Rules)?'));
  extractSection('Git Workflow', sectionPattern('Git Workflow'));

  return sections;
}

export function writeVibeFile(relativePath: string, content: string): boolean {
  const wsPath = getWorkspacePath();
  if (!wsPath) return false;

  const fullPath = path.join(wsPath, relativePath);
  const dir = path.dirname(fullPath);

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
    return true;
  } catch {
    return false;
  }
}
