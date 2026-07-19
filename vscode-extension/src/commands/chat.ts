import * as vscode from 'vscode';
import { getWorkspacePath, readVibeFile, writeVibeFile, detectStack } from '../utils/fileReader';
import {
  ChatSession,
  ChatTopic,
  clarifyingQuestions,
  detectTopic,
  generatePlan,
  generateOptimizedPrompt,
  getAgentsMdContext,
} from '../utils/chatPlanner';

export async function chatCommand(): Promise<void> {
  const wsPath = getWorkspacePath();
  if (!wsPath) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const task = await vscode.window.showInputBox({
    prompt: 'What do you want to do?',
    placeHolder: 'e.g., "create a login page with Google auth"',
    validateInput: (value) => {
      if (!value || value.trim().length === 0) return 'Please describe your task';
      return null;
    },
  });

  if (!task) return;

  const topic = detectTopic(task) as ChatTopic;
  const session: ChatSession = {
    topic,
    messages: [{ role: 'user', content: task }],
  };

  const questions = clarifyingQuestions[topic].slice(0, 3);
  for (const question of questions) {
    const answer = await vscode.window.showInputBox({ prompt: question });
    if (answer?.trim()) {
      session.messages.push({ role: 'user', content: answer.trim() });
    }
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Generating vibe plan...',
      cancellable: false,
    },
    async () => {
      const agentsContent = readVibeFile('AGENTS.md') || '';
      const agentsContext = agentsContent ? getAgentsMdContext(agentsContent) : '';
      const stack = detectStack();

      const plan = generatePlan(session);
      const optimizedPrompt = generateOptimizedPrompt(session, stack, agentsContext);

      writeVibeFile('vibe-plan.md', plan);
      writeVibeFile('vibe-prompt.md', optimizedPrompt);

      await vscode.env.clipboard.writeText(optimizedPrompt);

      showChatPanel(plan, optimizedPrompt);
      vscode.window.showInformationMessage('Vibe plan generated! Optimized prompt copied to clipboard.');
    }
  );
}

function showChatPanel(plan: string, prompt: string): void {
  const panel = vscode.window.createWebviewPanel(
    'vibecodingChat',
    'Vibe Chat Results',
    vscode.ViewColumn.Two,
    { enableScripts: true }
  );

  panel.webview.html = getChatHtml(plan, prompt);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getChatHtml(plan: string, prompt: string): string {
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
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { color: var(--text-secondary); font-size: 13px; margin-bottom: 20px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .tab {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      border: none;
      background: transparent;
      color: var(--text-secondary);
    }
    .tab.active { background: rgba(88,166,178,0.1); color: var(--cyan); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    pre {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      color: var(--purple);
      white-space: pre-wrap;
    }
    .meta { color: var(--text-secondary); font-size: 12px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <h1>Vibe Chat Results</h1>
  <p class="subtitle">Files saved: <code>vibe-plan.md</code> and <code>vibe-prompt.md</code></p>

  <div class="tabs">
    <button class="tab active" onclick="showTab('plan')">Plan</button>
    <button class="tab" onclick="showTab('prompt')">Optimized Prompt</button>
  </div>

  <div id="tab-plan" class="tab-content active">
    <p class="meta">Pasted into vibe-plan.md</p>
    <pre>${escapeHtml(plan)}</pre>
  </div>
  <div id="tab-prompt" class="tab-content">
    <p class="meta">Copied to clipboard and saved to vibe-prompt.md</p>
    <pre>${escapeHtml(prompt)}</pre>
  </div>

  <script>
    function showTab(name) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('tab-' + name).classList.add('active');
    }
  </script>
</body>
</html>`;
}
