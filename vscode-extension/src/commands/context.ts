import * as vscode from 'vscode';
import { getWorkspacePath, readVibeFile, detectStack, writeVibeFile } from '../utils/fileReader';
import { t } from '../i18n';
import * as fs from 'fs';
import * as path from 'path';

export async function contextCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage(t('errNoWorkspace'));
    return;
  }

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
