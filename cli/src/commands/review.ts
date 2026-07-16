import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { section, success, warn, error, info, divider, score } from '../utils/ui.js';
import { readVibeFile } from '../utils/fileReader.js';
import { scanFileContent, ReviewIssue } from '../utils/reviewScanner.js';
import { removeConsoleLogStatements, FIX_SUGGESTIONS } from '../utils/fixer.js';

interface ReviewOptions {
  staged?: boolean;
  file?: string;
  fix?: boolean;
}

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function selectFiles(options: ReviewOptions, cwd: string): string[] | null {
  if (options.file) {
    return [options.file];
  }
  const gitCommand = options.staged ? 'git diff --cached --name-only' : 'git diff --name-only';
  try {
    const output = execSync(gitCommand, { cwd, encoding: 'utf-8' });
    return output.split('\n').filter((f) => SOURCE_EXTENSIONS.some((ext) => f.endsWith(ext)));
  } catch {
    error(options.staged ? 'Not a git repository or no staged files' : 'Not a git repository');
    return null;
  }
}

function scanFiles(files: string[], cwd: string, cursorRules: string, agentsMd: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  for (const file of files) {
    const fullPath = path.join(cwd, file);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
    issues.push(...scanFileContent(file, lines, cursorRules, agentsMd));
  }
  return issues;
}

// Applies safe auto-fixes (standalone console.log removal) and rewrites affected files.
function applyFixes(files: string[], issues: ReviewIssue[], cwd: string): { fixedCount: number; fixedFiles: number } {
  let fixedCount = 0;
  let fixedFiles = 0;
  for (const file of files) {
    const issueLines = issues.filter((i) => i.file === file && i.rule === 'No console.log' && i.line).map((i) => i.line as number);
    if (issueLines.length === 0) continue;
    const fullPath = path.join(cwd, file);
    const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
    const result = removeConsoleLogStatements(lines, issueLines);
    if (result.fixed.length === 0) continue;
    fs.writeFileSync(fullPath, result.lines.join('\n'));
    fixedCount += result.fixed.length;
    fixedFiles += 1;
  }
  return { fixedCount, fixedFiles };
}

function printIssues(issues: ReviewIssue[]): void {
  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '✖' : issue.severity === 'warning' ? '⚠' : 'ℹ';
    const color = issue.severity === 'error' ? '\x1b[31m' : issue.severity === 'warning' ? '\x1b[33m' : '\x1b[34m';
    const reset = '\x1b[0m';
    console.log(`  ${color}${icon}${reset} ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
    console.log(`     ${issue.message}`);
    console.log(`     ${'\x1b[90m'}Rule: ${issue.rule}${reset}`);
    console.log();
  }
}

function printFixSuggestions(issues: ReviewIssue[]): void {
  const rules = [...new Set(issues.map((i) => i.rule))].filter((rule) => FIX_SUGGESTIONS[rule]);
  if (rules.length === 0) return;
  console.log('How to fix the rest:');
  for (const rule of rules) {
    console.log(`  • ${rule} — ${FIX_SUGGESTIONS[rule]}`);
  }
  console.log();
}

function printReport(issues: ReviewIssue[], showSuggestions: boolean): void {
  divider();
  console.log();

  if (issues.length === 0) {
    success('No issues found! Code looks clean.');
    return;
  }

  printIssues(issues);

  divider();
  console.log();

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');
  const totalScore = Math.max(0, 100 - errors.length * 15 - warnings.length * 5);
  console.log(`Score: ${score(totalScore)}`);
  console.log(`  ${errors.length} errors · ${warnings.length} warnings · ${infos.length} suggestions`);
  console.log();

  if (showSuggestions) {
    printFixSuggestions(issues);
  }
}

export async function reviewCommand(options: ReviewOptions): Promise<void> {
  section('Vibe Code Review');

  const cwd = process.cwd();
  const cursorRules = readVibeFile('.cursorrules') || '';
  const agentsMd = readVibeFile('AGENTS.md') || '';

  const files = selectFiles(options, cwd);
  if (files === null) return;

  if (files.length === 0) {
    warn('No files to review');
    return;
  }

  info(`Reviewing ${files.length} file(s)...`);
  console.log();

  let issues = scanFiles(files, cwd, cursorRules, agentsMd);

  if (options.fix) {
    const { fixedCount, fixedFiles } = applyFixes(files, issues, cwd);
    if (fixedCount > 0) {
      success(`Auto-fix: removed ${fixedCount} console.log statement(s) from ${fixedFiles} file(s)`);
      console.log();
      issues = scanFiles(files, cwd, cursorRules, agentsMd);
    } else if (issues.some((i) => i.rule === 'No console.log')) {
      info('No console.log statements were safe to auto-remove (inline or multi-line usage).');
      console.log();
    }
  }

  printReport(issues, Boolean(options.fix));
}
