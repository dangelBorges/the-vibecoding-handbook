import * as vscode from 'vscode';
import { parseAgentsMd, detectStack, readVibeFile } from '../utils/fileReader';

export class ContextPanel {
  public static currentPanel: ContextPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.webview.html = this._getHtml();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.One;

    if (ContextPanel.currentPanel) {
      ContextPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'the-vibecoding-handbookContext',
      'Vibe Coding Context',
      column,
      { enableScripts: true }
    );

    ContextPanel.currentPanel = new ContextPanel(panel, extensionUri);
  }

  private _getHtml(): string {
    const stack = detectStack();
    const agentsSections = parseAgentsMd();
    const agentsContent = readVibeFile('AGENTS.md') || '# No AGENTS.md found\n\nRun "Vibe: Initialize Project" to create one.';
    const ideRules = readVibeFile('.iderules') || '# No .iderules found';

    const techStackRows = agentsSections
      .filter((s) => s.key === 'Tech Stack')
      .map((s) => s.value)
      .join('\n')
      .replace(/\n/g, '<br>');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg: #0B0C10;
      --surface: #15171C;
      --cyan: #58A6B2;
      --purple: #C792EA;
      --mint: #C3E88D;
      --text: #F0F2F5;
      --text-secondary: #8B92A8;
      --border: rgba(255,255,255,0.08);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 24px;
      line-height: 1.6;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.02em; }
    .subtitle { color: var(--text-secondary); font-size: 13px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .card h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .card .value {
      font-size: 18px;
      font-weight: 600;
      color: var(--cyan);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 500;
    }
    .badge.ok { background: rgba(195,232,141,0.1); color: var(--mint); }
    .badge.warn { background: rgba(245,158,11,0.1); color: #f59e0b; }
    .tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .tab {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .tab:hover { color: var(--text); }
    .tab.active { background: rgba(88,166,178,0.1); color: var(--cyan); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    pre {
      background: #000;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      color: var(--purple);
      max-height: 400px;
      overflow-y: auto;
    }
    .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.02);
      border-radius: 8px;
      font-size: 12px;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .status-dot.ok { background: var(--mint); }
    .status-dot.warn { background: #f59e0b; }
    .status-dot.miss { background: #ef4444; }
  </style>
</head>
<body>
  <h1>Project Context</h1>
  <p class="subtitle">AI agent governance overview</p>

  <div class="grid">
    <div class="card">
      <h3>Framework</h3>
      <div class="value">${stack.framework}</div>
    </div>
    <div class="card">
      <h3>Language</h3>
      <div class="value">${stack.language}</div>
    </div>
  </div>

  <div class="status-grid" style="margin-bottom: 24px;">
    <div class="status-item">
      <div class="status-dot ${stack.hasDatabase ? 'ok' : 'miss'}"></div>
      <span>Database</span>
      ${stack.hasDatabase ? '<span class="badge ok">OK</span>' : '<span class="badge warn">Missing</span>'}
    </div>
    <div class="status-item">
      <div class="status-dot ${stack.hasAuth ? 'ok' : 'miss'}"></div>
      <span>Auth</span>
      ${stack.hasAuth ? '<span class="badge ok">OK</span>' : '<span class="badge warn">Missing</span>'}
    </div>
    <div class="status-item">
      <div class="status-dot ${stack.hasTests ? 'ok' : 'miss'}"></div>
      <span>Tests</span>
      ${stack.hasTests ? '<span class="badge ok">OK</span>' : '<span class="badge warn">Missing</span>'}
    </div>
    <div class="status-item">
      <div class="status-dot ${readVibeFile('AGENTS.md') ? 'ok' : 'miss'}"></div>
      <span>AGENTS.md</span>
      ${readVibeFile('AGENTS.md') ? '<span class="badge ok">Found</span>' : '<span class="badge warn">Missing</span>'}
    </div>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="showTab('agents')">AGENTS.md</button>
    <button class="tab" onclick="showTab('ide')">.iderules</button>
    <button class="tab" onclick="showTab('stack')">Tech Stack</button>
  </div>

  <div id="tab-agents" class="tab-content active">
    <pre>${this._escapeHtml(agentsContent)}</pre>
  </div>
  <div id="tab-ide" class="tab-content">
    <pre>${this._escapeHtml(ideRules)}</pre>
  </div>
  <div id="tab-stack" class="tab-content">
    <pre>${this._escapeHtml(techStackRows || 'No tech stack info found in AGENTS.md')}</pre>
  </div>

  <script>
    function showTab(name) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-' + name).classList.add('active');
    }
  </script>
</body>
</html>`;
  }

  private _escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public dispose() {
    ContextPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) x.dispose();
    }
  }
}

