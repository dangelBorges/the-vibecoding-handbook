import * as vscode from 'vscode';
import { checkVibeSetup, readVibeFile, getWorkspacePath } from '../utils/fileReader';
import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export async function checkCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const progress = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Running vibe check...',
      cancellable: false,
    },
    async () => {
      const results: CheckResult[] = [];

      // Check AGENTS.md
      results.push({
        name: 'AGENTS.md',
        status: readVibeFile('AGENTS.md') ? 'pass' : 'fail',
        message: readVibeFile('AGENTS.md') ? 'Found' : 'Missing — run "Vibe: Initialize Project"',
      });

      // Check .cursorrules
      results.push({
        name: '.cursorrules',
        status: readVibeFile('.cursorrules') ? 'pass' : 'warn',
        message: readVibeFile('.cursorrules') ? 'Found' : 'Missing',
      });

      // Check .vibecoding
      results.push({
        name: '.vibecoding/',
        status: checkVibeSetup() ? 'pass' : 'warn',
        message: checkVibeSetup() ? 'Directory exists' : 'Missing',
      });

      // Check .gitignore
      const gitignorePath = path.join(wsPath, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
        const hasEnv = gitignore.includes('.env') || gitignore.includes('.env.local');
        results.push({
          name: '.env in .gitignore',
          status: hasEnv ? 'pass' : 'fail',
          message: hasEnv ? 'Environment files ignored' : '.env files may be committed!',
        });
      } else {
        results.push({ name: '.gitignore', status: 'fail', message: 'Missing' });
      }

      // Check package.json scripts
      const pkgPath = path.join(wsPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          results.push({
            name: 'Test Script',
            status: pkg.scripts?.test ? 'pass' : 'warn',
            message: pkg.scripts?.test ? 'Configured' : 'No test script',
          });
          results.push({
            name: 'Lint Script',
            status: pkg.scripts?.lint ? 'pass' : 'warn',
            message: pkg.scripts?.lint ? 'Configured' : 'No lint script',
          });
        } catch {
          // ignore
        }
      }

      // Calculate score
      const passCount = results.filter((r) => r.status === 'pass').length;
      const failCount = results.filter((r) => r.status === 'fail').length;
      const warnCount = results.filter((r) => r.status === 'warn').length;
      const score = Math.round((passCount / results.length) * 100);

      // Show results in output channel
      const channel = vscode.window.createOutputChannel('Vibe Check');
      channel.clear();
      channel.appendLine('=== Vibe Coding Project Check ===\n');

      for (const r of results) {
        const icon = r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : '⚠';
        channel.appendLine(`${icon} ${r.name}: ${r.message}`);
      }

      channel.appendLine(`\nScore: ${score}% (${passCount} passed, ${warnCount} warnings, ${failCount} failed)`);
      channel.show();

      // Show notification
      if (score >= 80) {
        vscode.window.showInformationMessage(`Vibe Check: ${score}% — Looking good!`);
      } else if (score >= 50) {
        vscode.window.showWarningMessage(`Vibe Check: ${score}% — Some issues found. Check output panel.`);
      } else {
        vscode.window.showErrorMessage(`Vibe Check: ${score}% — Multiple issues. Run "Vibe: Initialize Project".`, 'Initialize')
          .then((sel) => { if (sel === 'Initialize') vscode.commands.executeCommand('vibecoding.init'); });
      }
    }
  );
}
