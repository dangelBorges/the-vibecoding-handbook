import * as vscode from 'vscode';
import { getWorkspacePath, readVibeFile, detectStack, writeVibeFile } from '../utils/fileReader';
import { findVibeCli, runVibe } from '../utils/cliRunner';
import { t } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

export async function contextCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage(t('errNoWorkspace'));
    return;
  }

  const config = vscode.workspace.getConfiguration('the-vibecoding-handbook');
  const useLLM = config.get('useLLM', true);
  const cliPath = findVibeCli(wsPath);

  if (cliPath) {
    const args = ['context', '--auto'];
    if (!useLLM) args.push('--no-llm');

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('contextRefreshing'),
        cancellable: false,
      },
      async () => {
        const result = await runVibe(cliPath, args, wsPath);
        if (result.exitCode !== 0) {
          const detail = result.stderr || result.stdout;
          vscode.window.showErrorMessage(`${t('errCommandFailed')}${detail ? ': ' + detail : ''}`);
        } else {
          vscode.window.showInformationMessage(t('contextRefreshed'));
        }
      }
    );
    return;
  }

  // CLI not found: local fallback
  vscode.window.showWarningMessage(t('msgCliNotFound'));

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: t('contextRefreshing'),
      cancellable: false,
    },
    async () => {
      const stack = detectStack();

      // Read existing AGENTS.md
      const agentsPath = path.join(wsPath, 'AGENTS.md');
      if (!fs.existsSync(agentsPath)) {
        vscode.window.showWarningMessage(t('contextAgentsNotFound'));
        return;
      }

      let content = fs.readFileSync(agentsPath, 'utf-8');

      // Update last updated
      content = content.replace(
        /Last updated:.*/,
        `Last updated: ${new Date().toISOString().split('T')[0]} (via VS Code extension)`
      );

      // Update detected stack
      const stackSection = `## Detected Stack (Auto-updated)\n\n| Technology | Status |\n|-----------|--------|\n| Framework | ${stack.framework} |\n| Language | ${stack.language} |\n| Auth | ${stack.hasAuth ? t('msgConfigured') : t('contextNotDetected')} |\n| Database | ${stack.hasDatabase ? t('msgConfigured') : t('contextNotDetected')} |\n| Tests | ${stack.hasTests ? t('msgConfigured') : t('contextNotDetected')} |`;

      if (content.includes('## Detected Stack')) {
        content = content.replace(/## Detected Stack[\s\S]*?(?=\n## |$)/, stackSection);
      } else {
        content += '\n\n' + stackSection;
      }

      writeVibeFile('AGENTS.md', content);

      // Update .iderules
      const ideRulesPath = path.join(wsPath, '.iderules');
      if (fs.existsSync(ideRulesPath)) {
        let ideRules = fs.readFileSync(ideRulesPath, 'utf-8');
        ideRules = ideRules.replace(
          /This is a .* project/,
          `This is a ${stack.framework} project using ${stack.language}`
        );
        writeVibeFile('.iderules', ideRules);
      }

      vscode.window.showInformationMessage(t('contextRefreshed'));
    }
  );
}
