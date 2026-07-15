import * as vscode from 'vscode';
import { PolicyTreeProvider } from './providers/policyTree';
import { DecisionTreeProvider } from './providers/decisionTree';
import { StackTreeProvider } from './providers/stackTree';
import { ContextPanel } from './panels/contextPanel';
import { initCommand } from './commands/init';
import { checkCommand } from './commands/check';
import { contextCommand } from './commands/context';
import { optimizeCommand } from './commands/optimize';
import { checkVibeSetup } from './utils/fileReader';

export function activate(context: vscode.ExtensionContext) {
  console.log('Vibe Coding extension activated');

  // Check if project has vibe coding setup
  const hasSetup = checkVibeSetup();
  vscode.commands.executeCommand('setContext', 'vibecoding.hasSetup', hasSetup);

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

    // Show Context Panel
    vscode.commands.registerCommand('vibecoding.showContext', () => {
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

    // Open .cursorrules
    vscode.commands.registerCommand('vibecoding.openCursorRules', async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return;
      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, '.cursorrules');
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } catch {
        vscode.window.showWarningMessage('.cursorrules not found. Run "Vibe: Initialize Project" first.');
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
    context.subscriptions.push(watcher);
  }

  // ─── Welcome message ───
  if (!hasSetup && workspaceFolders) {
    vscode.window.showInformationMessage(
      'This project doesn\'t have Vibe Coding governance yet. Initialize it?',
      'Initialize',
      'Later'
    ).then((selection) => {
      if (selection === 'Initialize') {
        vscode.commands.executeCommand('vibecoding.init');
      }
    });
  }
}

export function deactivate() {
  console.log('Vibe Coding extension deactivated');
}
