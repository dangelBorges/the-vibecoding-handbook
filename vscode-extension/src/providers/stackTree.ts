import * as vscode from 'vscode';
import { detectStack, readVibeFile } from '../utils/fileReader';

export class StackItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description?: string,
    public readonly icon?: string
  ) {
    super(label);
    this.description = description;
    this.tooltip = `${label}: ${description}`;
    if (icon) {
      this.iconPath = new vscode.ThemeIcon(icon as any);
    }
  }
}

export class StackTreeProvider implements vscode.TreeDataProvider<StackItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<StackItem | undefined | null | void> =
    new vscode.EventEmitter<StackItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<StackItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: StackItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<StackItem[]> {
    const stack = detectStack();
    const items: StackItem[] = [];

    items.push(new StackItem('Framework', stack.framework, 'window'));
    items.push(new StackItem('Language', stack.language, 'code'));
    items.push(new StackItem('Database', stack.hasDatabase ? 'Configured' : 'Not detected', stack.hasDatabase ? 'database' : 'circle-slash'));
    items.push(new StackItem('Auth', stack.hasAuth ? 'Configured' : 'Not detected', stack.hasAuth ? 'shield' : 'circle-slash'));
    items.push(new StackItem('Tests', stack.hasTests ? 'Configured' : 'Not detected', stack.hasTests ? 'check' : 'circle-slash'));

    // Add AGENTS.md status
    const agentsContent = readVibeFile('AGENTS.md');
    if (agentsContent) {
      const lineCount = agentsContent.split('\n').length;
      items.push(new StackItem('AGENTS.md', `${lineCount} lines`, 'file-code'));
    } else {
      items.push(new StackItem('AGENTS.md', 'Missing', 'warning'));
    }

    // Add .cursorrules status
    const cursorRules = readVibeFile('.cursorrules');
    items.push(new StackItem('.cursorrules', cursorRules ? 'Found' : 'Missing', cursorRules ? 'file-code' : 'warning'));

    return Promise.resolve(items);
  }
}
