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
import { t } from '../i18n';

type SyncMode = 'templates' | 'prompts' | 'both';

export async function syncCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage(t('errNoWorkspace'));
    return;
  }

  const mode = await vscode.window.showQuickPick<vscode.QuickPickItem & { value: SyncMode }>(
    [
      { label: t('syncTemplates'), description: t('syncTemplatesDesc'), value: 'templates' },
      { label: t('syncPrompts'), description: t('syncPromptsDesc'), value: 'prompts' },
      { label: t('syncBoth'), description: t('syncBothDesc'), value: 'both' },
    ],
    { placeHolder: t('syncWhatToSync') }
  );

  if (!mode) return;

  if (mode.value === 'templates' || mode.value === 'both') {
    await syncTemplates(wsPath);
  }
  if (mode.value === 'prompts' || mode.value === 'both') {
    await syncPrompts(wsPath);
  }

  vscode.window.showInformationMessage(t('syncComplete'));
}

async function syncTemplates(wsPath: string): Promise<void> {
  const templates = listTemplates();
  const choices = templates.map((t) => ({
    label: t.name,
    description: t.description,
    id: t.id,
  }));

  const selected = await vscode.window.showQuickPick(choices, {
    placeHolder: t('syncChooseTemplate'),
  });
  if (!selected) return;

  const template = getTemplate(selected.id);
  if (!template) return;

  for (const [fileName, content] of Object.entries(template.files)) {
    const fullPath = path.join(wsPath, fileName);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      const overwrite = await vscode.window.showQuickPick([t('yes'), t('no')], {
        placeHolder: `${fileName} ${t('syncFileExists')}`,
      });
      if (overwrite !== t('yes')) continue;
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
    placeHolder: t('syncChooseCategory'),
  });
  if (!selectedCategory) return;

  const prompts = getPromptsByCategory(selectedCategory.id);
  const promptChoices = prompts.map((p, index) => ({
    label: p.name,
    description: p.description,
    index,
  }));

  const selectedPrompt = await vscode.window.showQuickPick(promptChoices, {
    placeHolder: t('syncChoosePrompt'),
  });
  if (!selectedPrompt) return;

  const promptItem = getPrompt(selectedCategory.id, selectedPrompt.index);
  if (!promptItem) return;

  const fileName = await vscode.window.showInputBox({
    prompt: t('syncFileName'),
    value: defaultPromptFileName(promptItem.name),
  });
  if (!fileName) return;

  const save = await vscode.window.showQuickPick([t('yes'), t('no')], {
    placeHolder: t('syncSavePrompt'),
  });

  if (save === t('yes')) {
    writeVibeFile(fileName, formatPromptFileContent(promptItem));
  }

  const copy = await vscode.window.showQuickPick([t('yes'), t('no')], {
    placeHolder: t('syncCopyPrompt'),
  });

  if (copy === t('yes')) {
    await vscode.env.clipboard.writeText(promptItem.prompt);
  }
}
