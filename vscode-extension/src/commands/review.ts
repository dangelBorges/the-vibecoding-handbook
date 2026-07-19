import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { getWorkspacePath, readVibeFile } from '../utils/fileReader';
import { scanFileContent, ReviewIssue } from '../utils/reviewScanner';
import { removeConsoleLogStatements, FIX_SUGGESTIONS } from '../utils/fixer';
import { t } from '../i18n';

const execAsync = promisify(exec);
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(t('reviewOutputChannel'));
  }
  return outputChannel;
}

async function selectFiles(mode: 'active' | 'changed' | 'staged' | 'base', baseRef?: string): Promise<string[] | null> {
  const wsPath = getWorkspacePath();
  if (!wsPath) return null;

  if (mode === 'active') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage(t('reviewNoActiveEditor'));
      return null;
    }
    const relative = vscode.workspace.asRelativePath(editor.document.uri, false);
    return SOURCE_EXTENSIONS.some((ext) => relative.endsWith(ext)) ? [relative] : [];
  }

  let gitCommand: string;
  if (mode === 'base' && baseRef) {
    gitCommand = `git diff --name-only ${baseRef}...HEAD`;
  } else if (mode === 'staged') {
    gitCommand = 'git diff --cached --name-only';
  } else {
    gitCommand = 'git diff --name-only';
  }

  try {
    const { stdout } = await execAsync(gitCommand, { cwd: wsPath });
    return stdout
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => SOURCE_EXTENSIONS.some((ext) => f.endsWith(ext)));
  } catch {
    const context = mode === 'base' ? `base ref "${baseRef}"` : mode === 'staged' ? 'staged files' : 'working tree';
    vscode.window.showErrorMessage(t('reviewGitError'));
    return null;
  }
}

function scanFiles(files: string[], wsPath: string, ideRules: string, agentsMd: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  for (const file of files) {
    const fullPath = path.join(wsPath, file);
    if (!fs.existsSync(fullPath)) continue;
    try {
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
      issues.push(...scanFileContent(file, lines, ideRules, agentsMd));
    } catch {
      // ignore unreadable files
    }
  }
  return issues;
}

async function applyFixes(files: string[], issues: ReviewIssue[], wsPath: string): Promise<{ fixedCount: number; fixedFiles: number }> {
  let fixedCount = 0;
  let fixedFiles = 0;

  for (const file of files) {
    const issueLines = issues
      .filter((i) => i.file === file && i.rule === 'No console.log' && i.line)
      .map((i) => i.line as number);
    if (issueLines.length === 0) continue;

    const fullPath = path.join(wsPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    const result = removeConsoleLogStatements(lines, issueLines);
    if (result.fixed.length === 0) continue;

    const document = await vscode.workspace.openTextDocument(fullPath);
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(content.length)
    );
    edit.replace(document.uri, fullRange, result.lines.join('\n'));
    await vscode.workspace.applyEdit(edit);
    await document.save();

    fixedCount += result.fixed.length;
    fixedFiles += 1;
  }

  return { fixedCount, fixedFiles };
}

function publishDiagnostics(issues: ReviewIssue[], collection: vscode.DiagnosticCollection, wsPath: string): void {
  collection.clear();
  const map = new Map<string, vscode.Diagnostic[]>();

  for (const issue of issues) {
    const uri = vscode.Uri.file(path.join(wsPath, issue.file));
    const range = new vscode.Range(
      (issue.line ?? 1) - 1,
      0,
      (issue.line ?? 1) - 1,
      Number.MAX_SAFE_INTEGER
    );
    const diagnostic = new vscode.Diagnostic(
      range,
      `${issue.message} (${issue.rule})`,
      issue.severity === 'error' ? vscode.DiagnosticSeverity.Error : issue.severity === 'warning' ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Information
    );
    diagnostic.source = 'vibe';
    diagnostic.code = issue.rule;

    const list = map.get(uri.toString()) || [];
    list.push(diagnostic);
    map.set(uri.toString(), list);
  }

  for (const [uriString, diagnostics] of map) {
    collection.set(vscode.Uri.parse(uriString), diagnostics);
  }
}

function showReport(issues: ReviewIssue[], mode: string, fixedCount?: number): void {
  const output = getOutputChannel();
  output.clear();
  output.appendLine(t('reviewReportHeader', { mode }));

  if (fixedCount !== undefined && fixedCount > 0) {
    output.appendLine(t('reviewAutoRemoved', { count: fixedCount }));
  }

  if (issues.length === 0) {
    output.appendLine(t('reviewNoIssues'));
    output.show();
    vscode.window.showInformationMessage(t('reviewNoIssuesMessage'));
    return;
  }

  for (const issue of issues) {
    const icon = issue.severity === 'error' ? '✖' : issue.severity === 'warning' ? '⚠' : 'ℹ';
    output.appendLine(`${icon} ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
    output.appendLine(`   ${issue.message}`);
    output.appendLine(`   ${t('reviewRule')}: ${issue.rule}\n`);
  }

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const infos = issues.filter((i) => i.severity === 'info').length;
  const score = Math.max(0, 100 - errors * 15 - warnings * 5);

  output.appendLine(t('reviewScore', { score, errors, warnings, infos }));

  const suggestions = [...new Set(issues.map((i) => i.rule))].filter((rule) => FIX_SUGGESTIONS[rule]);
  if (suggestions.length > 0) {
    output.appendLine(`\n${t('reviewHowToFix')}:`);
    for (const rule of suggestions) {
      output.appendLine(`  • ${rule} — ${FIX_SUGGESTIONS[rule]}`);
    }
  }

  output.show();

  if (errors > 0) {
    vscode.window.showErrorMessage(t('reviewErrorsFound', { score, errors }));
  } else if (warnings > 0) {
    vscode.window.showWarningMessage(t('reviewWarningsFound', { score, warnings }));
  } else {
    vscode.window.showInformationMessage(t('reviewSuggestionsOnly', { score }));
  }
}

export async function reviewCommand(
  collection: vscode.DiagnosticCollection,
  mode: 'active' | 'changed' | 'staged' | 'base',
  options: { baseRef?: string; fix?: boolean } = {}
): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage(t('errNoWorkspace'));
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: t('reviewRunning', { mode }),
      cancellable: false,
    },
    async () => {
      const files = await selectFiles(mode, options.baseRef);
      if (files === null) return;
      if (files.length === 0) {
        vscode.window.showInformationMessage(t('reviewNoFiles'));
        collection.clear();
        return;
      }

      const ideRules = readVibeFile('.iderules') || '';
      const agentsMd = readVibeFile('AGENTS.md') || '';

      let issues = scanFiles(files, wsPath, ideRules, agentsMd);
      let fixedCount: number | undefined;

      if (options.fix) {
        const { fixedCount: fc } = await applyFixes(files, issues, wsPath);
        fixedCount = fc;
        if (fc > 0) {
          issues = scanFiles(files, wsPath, ideRules, agentsMd);
        }
      }

      publishDiagnostics(issues, collection, wsPath);
      showReport(issues, mode, fixedCount);
    }
  );
}

