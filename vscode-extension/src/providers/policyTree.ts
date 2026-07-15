import * as vscode from 'vscode';
import { listPolicyFiles, readVibeFile } from '../utils/fileReader';

export class PolicyItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly filePath?: string,
    public readonly description?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = filePath || label;
    if (filePath) {
      this.command = {
        command: 'vscode.open',
        title: 'Open',
        arguments: [vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, filePath)],
      };
      this.iconPath = new vscode.ThemeIcon('shield');
    }
    if (description) {
      this.description = description;
    }
  }
}

export class PolicyTreeProvider implements vscode.TreeDataProvider<PolicyItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PolicyItem | undefined | null | void> =
    new vscode.EventEmitter<PolicyItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PolicyItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PolicyItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PolicyItem): Thenable<PolicyItem[]> {
    if (element) {
      // Return lines of the policy file as children
      if (element.filePath) {
        const content = readVibeFile(element.filePath);
        if (content) {
          const lines = content
            .split('\n')
            .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'))
            .slice(0, 10)
            .map((l) => new PolicyItem(l.trim().slice(1).trim(), vscode.TreeItemCollapsibleState.None));
          return Promise.resolve(lines);
        }
      }
      return Promise.resolve([]);
    }

    // Root level
    const policies = listPolicyFiles();
    if (policies.length === 0) {
      return Promise.resolve([
        new PolicyItem('No policies found', vscode.TreeItemCollapsibleState.None, undefined, 'Run "Vibe: Initialize Project"'),
      ]);
    }

    return Promise.resolve(
      policies.map(
        (p) =>
          new PolicyItem(
            this.formatPolicyName(p.name),
            vscode.TreeItemCollapsibleState.Collapsed,
            p.path
          )
      )
    );
  }

  private formatPolicyName(name: string): string {
    return name
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
