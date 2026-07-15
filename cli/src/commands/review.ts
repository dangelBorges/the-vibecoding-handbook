import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { section, success, warn, error, info, divider, score } from '../utils/ui.js';
import { readVibeFile } from '../utils/fileReader.js';

interface ReviewIssue {
  file: string;
  line?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

export async function reviewCommand(options: { staged?: boolean; file?: string; fix?: boolean }): Promise<void> {
  section('Vibe Code Review');

  const issues: ReviewIssue[] = [];
  const cwd = process.cwd();

  // Load rules
  const cursorRules = readVibeFile('.cursorrules') || '';
  const agentsMd = readVibeFile('AGENTS.md') || '';

  // Get files to review
  let files: string[] = [];
  if (options.file) {
    files = [options.file];
  } else if (options.staged) {
    try {
      const output = execSync('git diff --cached --name-only', { cwd, encoding: 'utf-8' });
      files = output.split('\n').filter((f) => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx'));
    } catch {
      error('Not a git repository or no staged files');
      return;
    }
  } else {
    try {
      const output = execSync('git diff --name-only', { cwd, encoding: 'utf-8' });
      files = output.split('\n').filter((f) => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx'));
    } catch {
      error('Not a git repository');
      return;
    }
  }

  if (files.length === 0) {
    warn('No files to review');
    return;
  }

  info(`Reviewing ${files.length} file(s)...`);
  console.log();

  for (const file of files) {
    const fullPath = path.join(cwd, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    // Rule: No console.log in production code (always check, universal best practice)
    const noConsoleRule = cursorRules.toLowerCase().includes('console.log') || agentsMd.toLowerCase().includes('console.log') || cursorRules.length > 0;
    if (noConsoleRule) {
      lines.forEach((line, idx) => {
        if (line.includes('console.log') && !line.trim().startsWith('//') && !line.includes('eslint-disable') && !line.includes('logger') && !line.includes('process.stdout')) {
          issues.push({ file, line: idx + 1, severity: 'warning', message: 'console.log found — remove before production', rule: 'No console.log' });
        }
      });
    }

    // Rule: No any types
    if (cursorRules.includes('any') || agentsMd.includes('any')) {
      lines.forEach((line, idx) => {
        if (line.includes(': any') || line.includes('as any')) {
          issues.push({ file, line: idx + 1, severity: 'warning', message: '`any` type detected — use specific type', rule: 'No any types' });
        }
      });
    }

    // Rule: No hardcoded secrets
    const secretPatterns = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'api_key'];
    lines.forEach((line, idx) => {
      for (const pattern of secretPatterns) {
        if (line.includes(pattern) && !line.includes('process.env') && !line.includes('import')) {
          issues.push({ file, line: idx + 1, severity: 'error', message: `Possible hardcoded secret: "${pattern}" — use environment variables`, rule: 'No hardcoded secrets' });
        }
      }
    });

    // Rule: Check for .then() chains (prefer async/await)
    lines.forEach((line, idx) => {
      if (line.includes('.then(') && line.includes('.catch(')) {
        issues.push({ file, line: idx + 1, severity: 'info', message: 'Consider using async/await instead of .then().catch()', rule: 'Prefer async/await' });
      }
    });

    // Rule: Check function length
    let funcStart = -1;
    lines.forEach((line, idx) => {
      if (line.match(/^(export\s+)?(async\s+)?function\s+\w+\s*\(/)) {
        funcStart = idx;
      }
      if (funcStart >= 0 && line === '}') {
        const length = idx - funcStart;
        if (length > 50) {
          issues.push({ file, line: funcStart + 1, severity: 'info', message: `Function is ${length} lines — consider extracting (${length - 50} over limit)`, rule: 'Max 50 lines per function' });
        }
        funcStart = -1;
      }
    });
  }

  // Report
  divider();
  console.log();

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  if (issues.length === 0) {
    success('No issues found! Code looks clean.');
    return;
  }

  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '✖' : issue.severity === 'warning' ? '⚠' : 'ℹ';
    const color = issue.severity === 'error' ? '\x1b[31m' : issue.severity === 'warning' ? '\x1b[33m' : '\x1b[34m';
    const reset = '\x1b[0m';
    console.log(`  ${color}${icon}${reset} ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
    console.log(`     ${issue.message}`);
    console.log(`     ${'\x1b[90m'}Rule: ${issue.rule}${reset}`);
    console.log();
  }

  divider();
  console.log();

  const totalScore = Math.max(0, 100 - errors.length * 15 - warnings.length * 5);
  console.log(`Score: ${score(totalScore)}`);
  console.log(`  ${errors.length} errors · ${warnings.length} warnings · ${infos.length} suggestions`);

  if (options.fix && (errors.length > 0 || warnings.length > 0)) {
    console.log();
    warn('Auto-fix not yet implemented. Run with --fix to attempt automatic fixes in future versions.');
  }

  console.log();
}
