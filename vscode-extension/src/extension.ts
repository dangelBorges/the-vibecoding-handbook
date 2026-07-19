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
  vscode.commands.executeCommand('setContext', 'vibecoding.hasSetup', hasSetup);

  // ─── Diagnostics ───
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('vibecoding');
  context.subscriptions.push(diagnosticCollection);

  // ─── Tree Data Providers ───
  const policyProvider = new PolicyTreeProvider();
  const decisionProvider = new DecisionTreeProvider();
  const stackProvider = new StackTreeProvider();

  vscode.window.registerTreeDataProvider('vibecoding.policies', policyProvider);
  vscode.window.registerTreeDataProvider('vibecoding.decisions', decisionProvider);
  vscode.window.registerTreeDataProvider('vibecoding.stack', stackProvider);

  // ─── Commands ───
  const disposables = [
    // Init
    vscode.commands.registerCommand('vibecoding.init', async () => {
      await initCommand();
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
      vscode.commands.executeCommand('setContext', 'vibecoding.hasSetup', checkVibeSetup());
    }),

    // Check
    vscode.commands.registerCommand('vibecoding.check', async () => {
      await checkCommand();
    }),

    // Refresh Context
    vscode.commands.registerCommand('vibecoding.context', async () => {
      await contextCommand();
      stackProvider.refresh();
    }),

    // Optimize Prompt
    vscode.commands.registerCommand('vibecoding.optimize', async () => {
      await optimizeCommand();
    }),

    // Review
    vscode.commands.registerCommand('vibecoding.reviewActive', async () => {
      await reviewCommand(diagnosticCollection, 'active');
    }),
    vscode.commands.registerCommand('vibecoding.reviewChanged', async () => {
      await reviewCommand(diagnosticCollection, 'changed');
    }),
    vscode.commands.registerCommand('vibecoding.reviewStaged', async () => {
      await reviewCommand(diagnosticCollection, 'staged');
    }),
    vscode.commands.registerCommand('vibecoding.reviewBase', async () => {
      const baseRef = await vscode.window.showInputBox({
        prompt: 'Git base ref to diff against',
        value: 'origin/main',
      });
      if (!baseRef) return;
      await reviewCommand(diagnosticCollection, 'base', { baseRef });
    }),
    vscode.commands.registerCommand('vibecoding.reviewFix', async () => {
      await reviewCommand(diagnosticCollection, 'changed', { fix: true });
    }),

    // Chat
    vscode.commands.registerCommand('vibecoding.chat', async () => {
      await chatCommand();
    }),

    // Sync
    vscode.commands.registerCommand('vibecoding.sync', async () => {
      await syncCommand();
    }),

    // Change Language
    vscode.commands.registerCommand('vibecoding.changeLanguage', async () => {
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
    vscode.commands.registerCommand('vibecoding.showContext', () => {
      if (!getWorkspacePath()) {
        vscode.window.showErrorMessage('No workspace folder open.');
        return;
      }
      ContextPanel.createOrShow(context.extensionUri);
    }),

    // Open AGENTS.md
    vscode.commands.registerCommand('vibecoding.openAgents', async () => {
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
    vscode.commands.registerCommand('vibecoding.openIdeRules', async () => {
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
    vscode.commands.registerCommand('vibecoding.refreshContext', () => {
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
      new vscode.RelativePattern(workspaceFolders[0], '.vibecoding/**/*')
    );
    watcher.onDidChange(() => {
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    watcher.onDidCreate(() => {
      vscode.commands.executeCommand('setContext', 'vibecoding.hasSetup', checkVibeSetup());
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    watcher.onDidDelete(() => {
      vscode.commands.executeCommand('setContext', 'vibecoding.hasSetup', checkVibeSetup());
      policyProvider.refresh();
      decisionProvider.refresh();
      stackProvider.refresh();
    });
    context.subscriptions.push(watcher);
  }

  // ─── Auto check on save ───
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => {
      const autoCheck = vscode.workspace.getConfiguration('vibecoding').get('autoCheckOnSave', false);
      if (autoCheck && getWorkspacePath() && checkVibeSetup()) {
        checkCommand(true);
      }
    })
  );

  // ─── Welcome message ───
  const showNotifications = vscode.workspace.getConfiguration('vibecoding').get('showNotifications', true);
  if (!hasSetup && workspaceFolders && showNotifications) {
    vscode.window.showInformationMessage(
      t('msgNoProject'),
      t('cmdInit'),
      'Later'
    ).then((selection) => {
      if (selection === t('cmdInit')) {
        vscode.commands.executeCommand('vibecoding.init');
      }
    });
  }
}

export function deactivate() {
  console.log('Vibe Coding extension deactivated');
}
