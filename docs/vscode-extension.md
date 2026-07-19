# VS Code Extension

The **Vibe Coding** extension brings the CLI's governance workflow directly into VS Code. You can initialize projects, validate setup, review code, optimize prompts, plan tasks, and sync templates — all from the Command Palette.

## Install

The extension is not yet published to the VS Code Marketplace. You can install it from a local `.vsix`:

```bash
cd vscode-extension
npm install
npm run compile
npx @vscode/vsce package
```

Then in VS Code:

1. Open the Extensions view (`Ctrl+Shift+X`).
2. Click the `...` menu → **Install from VSIX...**.
3. Select `vscode-extension/vibecoding-1.0.0.vsix`.

A Marketplace release is coming soon.

## Quick Start

1. Open a project in VS Code.
2. Run `Vibe: Initialize Project` from the Command Palette (`Ctrl+Shift+P`).
3. Run `Vibe: Check Project` to validate your governance setup.
4. Run `Vibe: Review Changed Files` before committing.

## Commands

| Command | Description |
|---|---|
| `Vibe: Initialize Project` | Generate `AGENTS.md`, `.iderules`, and `.vibecoding/` policies. |
| `Vibe: Check Project` | Validate governance setup and show a score. |
| `Vibe: Refresh Context` | Re-scan dependencies and update `AGENTS.md`. |
| `Vibe: Optimize Prompt` | Turn a vague prompt into a structured instruction. |
| `Vibe: Review Active File` | Review the currently open file. |
| `Vibe: Review Changed Files` | Review working-tree changes. |
| `Vibe: Review Staged Files` | Review staged changes. |
| `Vibe: Review Against Base` | Review changes since a base ref (e.g. `origin/main`). |
| `Vibe: Review & Fix Changed Files` | Review and auto-remove standalone `console.log` lines. |
| `Vibe: Chat / Plan Task` | Generate `vibe-plan.md` and `vibe-prompt.md` from a task. |
| `Vibe: Sync Templates & Prompts` | Install starter templates or save reusable prompts. |
| `Vibe: Show Project Context` | Open a webview with project overview, `AGENTS.md`, and `.iderules`. |
| `Open AGENTS.md` | Open the project's `AGENTS.md`. |
| `Open .iderules` | Open the project's `.iderules`. |

## Generated Files

```
project/
├── AGENTS.md              ← Main agent context
├── .iderules              ← IDE/agent rules
├── vibe-plan.md           ← Chat-generated plan (when using Chat)
├── vibe-prompt.md         ← Chat-generated prompt (when using Chat)
└── .vibecoding/
    ├── policies/
    │   ├── git-policy.md
    │   ├── security-policy.md
    │   └── testing-policy.md
    └── decisions/
        └── ADR-001-architecture.md
```

## Sidebar Views

When a project has Vibe Coding governance, the activity bar shows a **Vibe Coding** view with:

- **Policies** — `.vibecoding/policies/*.md`
- **Decisions** — `.vibecoding/decisions/*.md` (ADRs)
- **Stack** — Detected framework, language, auth, database, and test setup

## Settings

| Setting | Default | Description |
|---|---|---|
| `vibecoding.showNotifications` | `true` | Show status notifications. |
| `vibecoding.autoCheckOnSave` | `false` | Run `Vibe: Check Project` on every file save. |

## Learn More

- [CLI Reference](./cli-reference.md)
- [Getting Started](./getting-started.md)
- [Extension source code](../vscode-extension/)
