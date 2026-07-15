import * as vscode from 'vscode';
import { getWorkspacePath, readVibeFile, detectStack, writeVibeFile } from '../utils/fileReader';
import * as fs from 'fs';
import * as path from 'path';

export async function contextCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Refreshing project context...',
      cancellable: false,
    },
    async () => {
      const stack = detectStack();

      // Read existing AGENTS.md
      const agentsPath = path.join(wsPath, 'AGENTS.md');
      if (!fs.existsSync(agentsPath)) {
        vscode.window.showWarningMessage('AGENTS.md not found. Run "Vibe: Initialize Project" first.');
        return;
      }

      let content = fs.readFileSync(agentsPath, 'utf-8');

      // Update last updated
      content = content.replace(
        /Last updated:.*/,
        `Last updated: ${new Date().toISOString().split('T')[0]} (via VS Code extension)`
      );

      // Update detected stack
      const stackSection = `## Detected Stack (Auto-updated)\n\n| Technology | Status |\n|-----------|--------|\n| Framework | ${stack.framework} |\n| Language | ${stack.language} |\n| Auth | ${stack.hasAuth ? 'Configured' : 'Not detected'} |\n| Database | ${stack.hasDatabase ? 'Configured' : 'Not detected'} |\n| Tests | ${stack.hasTests ? 'Configured' : 'Not detected'} |`;

      if (content.includes('## Detected Stack')) {
        content = content.replace(/## Detected Stack[\s\S]*?(?=\n## |$)/, stackSection);
      } else {
        content += '\n\n' + stackSection;
      }

      writeVibeFile('AGENTS.md', content);

      // Update .cursorrules
      const cursorRulesPath = path.join(wsPath, '.cursorrules');
      if (fs.existsSync(cursorRulesPath)) {
        let cursorRules = fs.readFileSync(cursorRulesPath, 'utf-8');
        cursorRules = cursorRules.replace(
          /This is a .* project/,
          `This is a ${stack.framework} project using ${stack.language}`
        );
        writeVibeFile('.cursorrules', cursorRules);
      }

      vscode.window.showInformationMessage('Project context refreshed!');
    }
  );
}
