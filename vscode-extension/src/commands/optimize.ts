import * as vscode from 'vscode';
import { optimizePrompt } from '../utils/optimizer';
import { readVibeFile } from '../utils/fileReader';
import { t } from '../i18n';

export async function optimizeCommand(): Promise<void> {
  // Get raw prompt from user
  const rawPrompt = await vscode.window.showInputBox({
    prompt: t('optimizePrompt'),
    placeHolder: t('optimizePlaceholder'),
    validateInput: (value) => {
      if (!value || value.trim().length === 0) return t('optimizeEmptyError');
      return null;
    },
  });

  if (!rawPrompt) return;

  // Check for AGENTS.md context
  const agentsContent = readVibeFile('AGENTS.md');
  let projectContext: string | undefined;

  if (agentsContent) {
    const useContext = await vscode.window.showQuickPick(
      [t('yes'), t('no')],
      { placeHolder: t('optimizeIncludeContext') }
    );
    if (useContext === t('yes')) {
      // Extract key sections
      const stackMatch = agentsContent.match(/## Tech Stack[\s\S]*?(?=\n## |$)/);
      const standardsMatch = agentsContent.match(/## Coding Standards[\s\S]*?(?=\n## |$)/);
      projectContext = [stackMatch, standardsMatch].filter(Boolean).join('\n\n').slice(0, 1000);
    }
  }

  // Optimize
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: t('optimizing'),
      cancellable: false,
    },
    async () => {
      const result = optimizePrompt(rawPrompt, projectContext);

      // Show result in webview panel
      const panel = vscode.window.createWebviewPanel(
        'the-vibecoding-handbookOptimize',
        t('optimizedPrompt'),
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );

      panel.webview.html = getOptimizeHtml(result);

      // Also copy to clipboard
      await vscode.env.clipboard.writeText(result.optimized);
      vscode.window.showInformationMessage(t('optimizeCopied'));
    }
  );
}

function getOptimizeHtml(result: {
  original: string;
  optimized: string;
  intent: string;
  confidence: number;
  improvements: string[];
}): string {
  const intentColors: Record<string, string> = {
    feature: '#58A6B2',
    bugfix: '#ef4444',
    refactor: '#C792EA',
    test: '#C3E88D',
    docs: '#f59e0b',
    review: '#8B92A8',
    unknown: '#8B92A8',
  };

  const intentLabels: Record<string, string> = {
    feature: t('intentFeature'),
    bugfix: t('intentBugfix'),
    refactor: t('intentRefactor'),
    test: t('intentTest'),
    docs: t('intentDocs'),
    review: t('intentReview'),
    unknown: t('intentUnknown'),
  };

  const color = intentColors[result.intent] || '#8B92A8';
  const label = intentLabels[result.intent] || t('intentUnknown');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0B0C10;
      color: #F0F2F5;
      padding: 24px;
      line-height: 1.6;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .badge {
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
    }
    .stats {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      font-size: 13px;
      color: #8B92A8;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8B92A8;
      margin-bottom: 8px;
    }
    pre {
      background: #000;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #C792EA;
      white-space: pre-wrap;
    }
    .improvements {
      list-style: none;
      padding: 0;
    }
    .improvements li {
      padding: 4px 0;
      font-size: 13px;
      color: #C3E88D;
    }
    .improvements li::before {
      content: "✓ ";
    }
    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .comparison-box {
      background: #000;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 12px;
      font-size: 12px;
    }
    .comparison-box.before { color: #8B92A8; }
    .comparison-box.after { color: #58A6B2; border-color: rgba(88,166,178,0.3); }
    button {
      background: #58A6B2;
      color: #0B0C10;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    button:hover { background: #4a959f; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge" style="background: ${color}20; color: ${color};">${label}</div>
    <span style="font-size: 12px; color: #8B92A8;">${Math.round(result.confidence * 100)}% ${t('confidence')}</span>
  </div>

  <div class="stats">
    <span>${t('original')}: ~${Math.round(result.original.length / 4)} tokens</span>
    <span>→</span>
    <span style="color: #58A6B2;">${t('optimized')}: ~${Math.round(result.optimized.length / 4)} tokens</span>
    <span style="color: #C3E88D;">+${Math.round((result.optimized.length / Math.max(result.original.length, 1) - 1) * 100)}%</span>
  </div>

  <div class="section">
    <h3>${t('optimizedPromptCopied')}</h3>
    <pre>${escapeHtml(result.optimized)}</pre>
  </div>

  <div class="section">
    <h3>${t('improvements')}</h3>
    <ul class="improvements">
      ${result.improvements.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h3>${t('beforeVsAfter')}</h3>
    <div class="comparison">
      <div class="comparison-box before">
        <strong style="color: #8B92A8;">${t('before')}</strong><br>
        ${escapeHtml(result.original.slice(0, 200))}${result.original.length > 200 ? '...' : ''}
      </div>
      <div class="comparison-box after">
        <strong style="color: #58A6B2;">${t('after')}</strong><br>
        ${escapeHtml(result.optimized.slice(0, 200))}...
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

