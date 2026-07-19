import * as vscode from 'vscode';
import { listDecisionFiles, readVibeFile } from '../utils/fileReader';
import { t } from '../i18n';

export class DecisionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly filePath?: string,
    public readonly description?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = filePath || label;
    if (filePath) {
      const folder = vscode.workspace.workspaceFolders?.[0];
      if (folder) {
        this.command = {
          command: 'vscode.open',
          title: 'Open',
          arguments: [vscode.Uri.joinPath(folder.uri, filePath)],
        };
      }
      this.iconPath = new vscode.ThemeIcon('git-commit');
    }
  }
}

export class DecisionTreeProvider implements vscode.TreeDataProvider<DecisionItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<DecisionItem | undefined | null | void> =
    new vscode.EventEmitter<DecisionItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<DecisionItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DecisionItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DecisionItem): Thenable<DecisionItem[]> {
    if (element) {
      if (element.filePath) {
        const content = readVibeFile(element.filePath);
        if (content) {
          // Extract status and date from ADR
          const statusMatch = content.match(/## Status\s*\n\s*(\w+)/);
          const dateMatch = content.match(/## Date\s*\n\s*(.+)/);
          const items: DecisionItem[] = [];
          if (statusMatch) {
            items.push(new DecisionItem(`Status: ${statusMatch[1]}`, vscode.TreeItemCollapsibleState.None, undefined, dateMatch ? dateMatch[1].trim() : undefined));
          }
          return Promise.resolve(items);
        }
      }
      return Promise.resolve([]);
    }

    const decisions = listDecisionFiles();
    if (decisions.length === 0) {
      return Promise.resolve([
        new DecisionItem(t('panelNoData'), vscode.TreeItemCollapsibleState.None, undefined, t('cmdInitDesc')),
      ]);
    }

    return Promise.resolve(
      decisions.map(
        (d) =>
          new DecisionItem(
            d.name,
            vscode.TreeItemCollapsibleState.Collapsed,
            d.path
          )
      )
    );
  }
}
