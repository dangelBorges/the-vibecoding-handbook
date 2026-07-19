import * as vscode from 'vscode';
import { checkVibeSetup, readVibeFile, getWorkspacePath } from '../utils/fileReader';
import { t } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

// Reuse a single output channel across runs
let channel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
  if (!channel) {
    channel = vscode.window.createOutputChannel('Vibe Check');
  }
  return channel;
}

export async function checkCommand(silent = false): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    if (!silent) {
      vscode.window.showErrorMessage(t('errNoWorkspace'));
    }
    return;
  }

  const runChecks = async (): Promise<void> => {
    const results: CheckResult[] = [];

    // Check AGENTS.md
    results.push({
      name: 'AGENTS.md',
      status: readVibeFile('AGENTS.md') ? 'pass' : 'fail',
      message: readVibeFile('AGENTS.md') ? t('msgFound') : t('msgMissingInit'),
    });

    // Check .iderules
    results.push({
      name: '.iderules',
      status: readVibeFile('.iderules') ? 'pass' : 'warn',
      message: readVibeFile('.iderules') ? t('msgFound') : t('msgMissing'),
    });

    // Check .vibecoding
    results.push({
      name: '.vibecoding/',
      status: checkVibeSetup() ? 'pass' : 'warn',
      message: checkVibeSetup() ? t('msgDirectoryExists') : t('msgMissing'),
    });

    // Check .gitignore
    const gitignorePath = path.join(wsPath, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
      const hasEnv = gitignore.includes('.env') || gitignore.includes('.env.local');
      results.push({
        name: '.env in .gitignore',
        status: hasEnv ? 'pass' : 'fail',
        message: hasEnv ? t('msgEnvIgnored') : t('msgEnvNotIgnored'),
      });
    } else {
      results.push({ name: '.gitignore', status: 'fail', message: t('msgMissing') });
    }

    // Check package.json scripts
    const pkgPath = path.join(wsPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        results.push({
          name: 'Test Script',
          status: pkg.scripts?.test ? 'pass' : 'warn',
          message: pkg.scripts?.test ? t('msgConfigured') : t('msgNoTestScript'),
        });
        results.push({
          name: 'Lint Script',
          status: pkg.scripts?.lint ? 'pass' : 'warn',
          message: pkg.scripts?.lint ? t('msgConfigured') : t('msgNoLintScript'),
        });
      } catch {
        // ignore
      }
    } else {
      results.push({ name: 'Test Script', status: 'warn', message: t('msgNoPackageJson') });
      results.push({ name: 'Lint Script', status: 'warn', message: t('msgNoPackageJson') });
    }

    // Calculate score
    const passCount = results.filter((r) => r.status === 'pass').length;
    const failCount = results.filter((r) => r.status === 'fail').length;
    const warnCount = results.filter((r) => r.status === 'warn').length;
    const score = Math.round((passCount / results.length) * 100);

    // Show results in output channel
    const output = getChannel();
    output.clear();
    output.appendLine(`=== ${t('checkTitle')} ===\n`);

    for (const r of results) {
      const icon = r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : '⚠';
      output.appendLine(`${icon} ${r.name}: ${r.message}`);
    }

    output.appendLine(`\n${t('checkScore')}: ${score}% (${passCount} ${t('checkPassed')}, ${warnCount} ${t('checkWarnings')}, ${failCount} ${t('checkFailed')})`);

    // In silent mode only reveal the panel on failures, without stealing focus
    if (!silent) {
      output.show();
    } else if (failCount > 0) {
      output.show(true);
    }

    // Notifications are skipped in silent mode; errors are always shown
    if (silent) return;

    const showNotifications = vscode.workspace.getConfiguration('vibecoding').get('showNotifications', true);
    if (score >= 80) {
      if (showNotifications) {
        vscode.window.showInformationMessage(t('checkGood'), t('checkTitle'), `${score}%`);
      }
    } else if (score >= 50) {
      if (showNotifications) {
        vscode.window.showWarningMessage(t('checkIssues'), t('checkTitle'), `${score}%`);
      }
    } else {
      vscode.window.showErrorMessage(t('checkMultipleIssues'), t('cmdInit'))
        .then((sel) => { if (sel === t('cmdInit')) vscode.commands.executeCommand('vibecoding.init'); });
    }
  };

  if (silent) {
    await runChecks();
  } else {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('checkRunning'),
        cancellable: false,
      },
      runChecks
    );
  }
}
