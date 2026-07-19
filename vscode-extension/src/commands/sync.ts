import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getWorkspacePath, writeVibeFile } from '../utils/fileReader';
import {
  defaultGitPolicy,
  defaultSecurityPolicy,
  formatPromptFileContent,
  getPrompt,
  getPromptsByCategory,
  getTemplate,
  listPromptCategories,
  listTemplates,
  defaultPromptFileName,
} from '../utils/syncLibrary';

type SyncMode = 'templates' | 'prompts' | 'both';

export async function syncCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const mode = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: SyncMode }>(
    [
      { label: 'Templates', description: 'Install AGENTS.md / .iderules templates', value: 'templates' },
      { label: 'Prompts', description: 'Save reusable AI prompts', value: 'prompts' },
      { label: 'Both', description: 'Templates and prompts', value: 'both' },
    ],
    { placeHolder: 'What do you want to sync?' }
  );

  if (!mode) return;

  if (mode.value === 'templates' || mode.value === 'both') {
    await syncTemplates(wsPath);
  }
  if (mode.value === 'prompts' || mode.value === 'both') {
    await syncPrompts(wsPath);
  }

  vscode.window.showInformationMessage('Vibe sync complete!');
}

async function syncTemplates(wsPath: string): Promise<void> {
  const templates = listTemplates();
  const choices = templates.map((t) => ({
    label: t.name,
    description: t.description,
    id: t.id,
  }));

  const selected = await vscode.window.showQuickPick(choices, {
    placeHolder: 'Choose a template to install (or Esc to skip)',
  });
  if (!selected) return;

  const template = getTemplate(selected.id);
  if (!template) return;

  for (const [fileName, content] of Object.entries(template.files)) {
    const fullPath = path.join(wsPath, fileName);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      const overwrite = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `${fileName} already exists. Overwrite?`,
      });
      if (overwrite !== 'Yes') continue;
    }

    writeVibeFile(fileName, content);
  }

  writeVibeFile('.vibecoding/policies/git.md', defaultGitPolicy);
  writeVibeFile('.vibecoding/policies/security.md', defaultSecurityPolicy);
}

async function syncPrompts(wsPath: string): Promise<void> {
  const categories = listPromptCategories();
  const categoryChoices = categories.map((c) => ({
    label: `${c.label} (${c.count})`,
    id: c.id,
  }));

  const selectedCategory = await vscode.window.showQuickPick(categoryChoices, {
    placeHolder: 'Choose a prompt category (or Esc to skip)',
  });
  if (!selectedCategory) return;

  const prompts = getPromptsByCategory(selectedCategory.id);
  const promptChoices = prompts.map((p, index) => ({
    label: p.name,
    description: p.description,
    index,
  }));

  const selectedPrompt = await vscode.window.showQuickPick(promptChoices, {
    placeHolder: 'Choose a prompt',
  });
  if (!selectedPrompt) return;

  const promptItem = getPrompt(selectedCategory.id, selectedPrompt.index);
  if (!promptItem) return;

  const fileName = await vscode.window.showInputBox({
    prompt: 'File name for the prompt',
    value: defaultPromptFileName(promptItem.name),
  });
  if (!fileName) return;

  const save = await vscode.window.showQuickPick(['Yes', 'No'], {
    placeHolder: 'Save this prompt to a file?',
  });

  if (save === 'Yes') {
    writeVibeFile(fileName, formatPromptFileContent(promptItem));
  }

  const copy = await vscode.window.showQuickPick(['Yes', 'No'], {
    placeHolder: 'Copy prompt to clipboard?',
  });

  if (copy === 'Yes') {
    await vscode.env.clipboard.writeText(promptItem.prompt);
  }
}
