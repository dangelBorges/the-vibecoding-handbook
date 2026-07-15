import fs from 'fs';
import path from 'path';

export interface DetectedStack {
  frontend: string;
  backend: string;
  language: string;
  hasDatabase: boolean;
  hasAuth: boolean;
  hasTests: boolean;
  packageManager: string;
  framework: string;
}

export function detectStack(projectPath: string = process.cwd()): DetectedStack {
  const result: DetectedStack = {
    frontend: 'unknown',
    backend: 'unknown',
    language: 'unknown',
    hasDatabase: false,
    hasAuth: false,
    hasTests: false,
    packageManager: 'unknown',
    framework: 'unknown',
  };

  // Check package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Detect frontend
      if (deps.next) {
        result.frontend = 'nextjs';
        result.framework = 'Next.js';
      } else if (deps.react) {
        result.frontend = 'react';
        result.framework = 'React';
      } else if (deps.vue) {
        result.frontend = 'vue';
        result.framework = 'Vue';
      } else if (deps.astro) {
        result.frontend = 'astro';
        result.framework = 'Astro';
      } else if (deps.svelte) {
        result.frontend = 'svelte';
        result.framework = 'Svelte';
      }

      // Detect backend
      if (deps.express || deps['@nestjs/core']) {
        result.backend = 'nodejs';
      } else if (deps.fastapi) {
        result.backend = 'python';
      }

      // Detect language
      if (deps.typescript || pkg.devDependencies?.typescript) {
        result.language = 'typescript';
      } else {
        result.language = 'javascript';
      }

      // Detect auth
      if (deps['@auth/core'] || deps['next-auth'] || deps['@supabase/supabase-js'] || deps.clerk) {
        result.hasAuth = true;
      }

      // Detect database
      if (deps.prisma || deps['@prisma/client'] || deps.mongoose || deps['@supabase/supabase-js']) {
        result.hasDatabase = true;
      }

      // Detect tests
      if (deps.vitest || deps.jest || deps.cypress || deps['@playwright/test']) {
        result.hasTests = true;
      }

      // Detect package manager
      if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) {
        result.packageManager = 'pnpm';
      } else if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) {
        result.packageManager = 'yarn';
      } else if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) {
        result.packageManager = 'bun';
      } else {
        result.packageManager = 'npm';
      }
    } catch {
      // ignore
    }
  }

  // Check other config files
  if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) {
    result.language = 'rust';
  } else if (fs.existsSync(path.join(projectPath, 'pyproject.toml')) || fs.existsSync(path.join(projectPath, 'requirements.txt'))) {
    result.language = 'python';
  } else if (fs.existsSync(path.join(projectPath, 'go.mod'))) {
    result.language = 'go';
  }

  return result;
}
