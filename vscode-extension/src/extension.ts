import * as vscode from 'vscode';
import { PolicyTreeProvider } from './providers/policyTree';
import { DecisionTreeProvider } from './providers/decisionTree';
import { StackTreeProvider } from './providers/stackTree';
import { ContextPanel } from './panels/contextPanel';
import { initCommand } from './commands/init';
import { checkCommand } from './commands/check';
import { contextCommand } from './commands/context';
import { optimizeCommand } from './commands/optimize';
import { reviewCommand } from './commands/review';
import { chatCommand } from './commands/chat';
import { syncCommand } from './commands/sync';
import { checkVibeSetup, getWorkspacePath } from './utils/fileReader';
import { initI18n, t, getAvailableLocales, setLocale, getLocale, Locale } from './i18n';

export function activate(context: vscode.ExtensionContext) {
  // Initialize i18n with VS Code's language
  initI18n(vscode.env.language);
  console.log('Vibe Coding extension activated');

  // Check if project has vibe coding setup
  const hasSetup = checkVibeSetup();
  vscode.commands.executeCommand('setContext', 'the-vibecoding-handbook.hasSetup', hasSetup);

  // ─── Diagnostics ───
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('the-vibecoding-handbook');
  context.subscriptions.push(diagnosticCollection);

  // ─── Tree Data Providers ───
  const policyProvider = new PolicyTreeProvider();
  const decisionProvider = new DecisionTreeProvider();
  const stackProvider = new StackTreeProvider();

  vscode.window.registerTreeDataProvider('the-vibecoding-handbook.policies', policyProvider);
  vscode.window.registerTreeDataProvider('the-vibecoding-handbook.decisions', decisionProvider);
  vscode.window.registerTreeDataProvider('the-vibecoding-handbook.stack', stackProvider);

  // ─── Commands ───
  const disposables = [
    // Init
    vscode.commands.registerCommand('the-vibecoding-handbook.init', async () => {
      await initCommand();
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
      vscode.commands.executeCommand('setContext', 'the-vibecoding-handbook.hasSetup', checkVibeSetup());
    }),

    // Check
    vscode.commands.registerCommand('the-vibecoding-handbook.check', async () => {
      await checkCommand();
    }),

    // Refresh Context
    vscode.commands.registerCommand('the-vibecoding-handbook.context', async () => {
      await contextCommand();
      stackProvider.refresh();
    }),

    // Optimize Prompt
    vscode.commands.registerCommand('the-vibecoding-handbook.optimize', async () => {
      await optimizeCommand();
    }),

    // Review
    vscode.commands.registerCommand('the-vibecoding-handbook.reviewActive', async () => {
      await reviewCommand(diagnosticCollection, 'active');
    }),
    vscode.commands.registerCommand('the-vibecoding-handbook.reviewChanged', async () => {
      await reviewCommand(diagnosticCollection, 'changed');
    }),
    vscode.commands.registerCommand('the-vibecoding-handbook.reviewStaged', async () => {
      await reviewCommand(diagnosticCollection, 'staged');
    }),
    vscode.commands.registerCommand('the-vibecoding-handbook.reviewBase', async () => {
      const baseRef = await vscode.window.showInputBox({
        prompt: 'Git base ref to diff against',
        value: 'origin/main',
      });
      if (!baseRef) return;
      await reviewCommand(diagnosticCollection, 'base', { baseRef });
    }),
    vscode.commands.registerCommand('the-vibecoding-handbook.reviewFix', async () => {
      await reviewCommand(diagnosticCollection, 'changed', { fix: true });
    }),

    // Chat
    vscode.commands.registerCommand('the-vibecoding-handbook.chat', async () => {
      await chatCommand();
    }),

    // Sync
    vscode.commands.registerCommand('the-vibecoding-handbook.sync', async () => {
      await syncCommand();
    }),

    // Change Language
    vscode.commands.registerCommand('the-vibecoding-handbook.changeLanguage', async () => {
      const locales = getAvailableLocales();
      const currentLocale = getLocale();
      const items: vscode.QuickPickItem[] = locales.map(({ locale, name }) => ({
        label: locale === currentLocale ? `✓ ${name}` : name,
        description: locale,
      }));
      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: t('msgSelectLanguage'),
      });
      if (selected?.description) {
        setLocale(selected.description as Locale);
        vscode.window.showInformationMessage(t('msgLanguageChanged'));
      }
    }),

    // Show Context Panel
    vscode.commands.registerCommand('the-vibecoding-handbook.showContext', () => {
      if (!getWorkspacePath()) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
      }
      ContextPanel.createOrShow(context.extensionUri);
    }),

    // Open AGENTS.md
    vscode.commands.registerCommand('the-vibecoding-handbook.openAgents', async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return;
      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, 'AGENTS.md');
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch {
        vscode.window.showWarningMessage('AGENTS.md not found. Run "Vibe: Initialize Project" first.');
      }
    }),

    // Open .iderules
    vscode.commands.registerCommand('the-vibecoding-handbook.openIdeRules', async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return;
      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, '.iderules');
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch {
        vscode.window.showWarningMessage('.iderules not found. Run "Vibe: Initialize Project" first.');
      }
    }),

    // Refresh tree views
    vscode.commands.registerCommand('the-vibecoding-handbook.refreshContext', () => {
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    }),
  ];

  context.subscriptions.push(...disposables);

  // ─── File Watcher ───
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceFolders[0], '.the-vibecoding-handbook/**/*')
    );
    watcher.onDidChange(() => {
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    watcher.onDidCreate(() => {
      vscode.commands.executeCommand('setContext', 'the-vibecoding-handbook.hasSetup', checkVibeSetup());
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    watcher.onDidDelete(() => {
      vscode.commands.executeCommand('setContext', 'the-vibecoding-handbook.hasSetup', checkVibeSetup());
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    context.subscriptions.push(watcher);
  }

  // ─── Auto check on save ───
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => {
      const autoCheck = vscode.workspace.getConfiguration('the-vibecoding-handbook').get('autoCheckOnSave', false);
      if (autoCheck && getWorkspacePath() && checkVibeSetup()) {
        checkCommand(true);
      }
    })
  );

  // ─── Welcome message ───
  const showNotifications = vscode.workspace.getConfiguration('the-vibecoding-handbook').get('showNotifications', true);
  if (!hasSetup && workspaceFolders && showNotifications) {
    vscode.window.showInformationMessage(
      t('msgNoProject'),
      t('cmdInit'),
      'Later'
    ).then((selection) => {
      if (selection === t('cmdInit')) {
        vscode.commands.executeCommand('the-vibecoding-handbook.init');
      }
    });
  }
}

export function deactivate() {
  console.log('Vibe Coding extension deactivated');
}

