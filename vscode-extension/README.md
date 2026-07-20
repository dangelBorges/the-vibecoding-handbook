# Vibe Coding — VS Code Extension

> AI-first project governance directly in your IDE

## Features

- **🛡️ Policy Sidebar** — Browse project policies (Git, Security, Testing) in the activity bar
- **📋 Architecture Decisions** — View ADRs (Architecture Decision Records) 
- **⚡ Stack Detection** — Auto-detect your framework, language, auth, database
- **🚀 Initialize Project** — Generate AGENTS.md, .iderules, and policies with one command
- **🔍 Check Project** — Validate governance setup (6 checks)
- **🔄 Refresh Context** — Auto-update AGENTS.md from current codebase
- **✨ Optimize Prompt** — Transform vague prompts into structured instructions
- **💬 Chat / Plan Task** — Generate `vibe-plan.md` and `vibe-prompt.md` from a task description
- **🗂️ Sync Templates & Prompts** — Install starter templates and reusable AI prompts
- **👁️ Review Code** — Scan active, changed, staged, or base-ref files for common issues
- **📖 Context Panel** — Rich webview with project overview, AGENTS.md, and .iderules

## Commands

| Command | Description |
|---------|-------------|
| `Vibe: Initialize Project` | Generate governance files |
| `Vibe: Check Project` | Run 6 validation checks |
| `Vibe: Refresh Context` | Update AGENTS.md from codebase |
| `Vibe: Optimize Prompt` | Optimize a prompt for AI agents |
| `Vibe: Chat / Plan Task` | Generate vibe-plan.md and vibe-prompt.md |
| `Vibe: Sync Templates & Prompts` | Install templates or reusable prompts |
| `Vibe: Show Project Context` | Open context webview panel |
| `Open AGENTS.md` | Open project's AGENTS.md |
| `Open .iderules` | Open project's .iderules |

## Generated Files

```
project/
├── AGENTS.md              ← Main agent context
├── .iderules           ← IDE rules
└── .vibecoding/
    ├── policies/
    │   ├── git-policy.md
    │   ├── security-policy.md
    │   └── testing-policy.md
    └── decisions/
        └── ADR-001-architecture.md
```

## CLI Integration

When `@vibecoding/cli` is installed in the workspace (or globally available), the extension delegates `Vibe: Initialize Project` and `Vibe: Refresh Context` to it. This means the extension automatically uses your configured LLM (`OPENAI_API_KEY` or `ANTHROPIC_API_KEY`) and preserves existing `AGENTS.md` content with merge markers. If the CLI is not available, the extension falls back to a built-in heuristic generator.

You can disable LLM calls in the extension settings (`the-vibecoding-handbook.useLLM`).

## Install

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=TheVibecoder.the-vibecoding-handbook).

Visit [the-vibecoding-handbook.com](https://www.the-vibecoding-handbook.com/) for the complete handbook.

## Learn More

Visit [The-vibecoding-handbook.com](https://www.the-vibecoding-handbook.com/) for the complete handbook.
