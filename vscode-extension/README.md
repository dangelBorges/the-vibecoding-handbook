# Vibe Coding — VS Code Extension

> AI-first project governance directly in your IDE

## Features

- **🛡️ Policy Sidebar** — Browse project policies (Git, Security, Testing) in the activity bar
- **📋 Architecture Decisions** — View ADRs (Architecture Decision Records) 
- **⚡ Stack Detection** — Auto-detect your framework, language, auth, database
- **🚀 Initialize Project** — Generate AGENTS.md, .cursorrules, and policies with one command
- **🔍 Check Project** — Validate governance setup (6 checks)
- **🔄 Refresh Context** — Auto-update AGENTS.md from current codebase
- **✨ Optimize Prompt** — Transform vague prompts into structured instructions
- **📖 Context Panel** — Rich webview with project overview, AGENTS.md, and .cursorrules

## Commands

| Command | Description |
|---------|-------------|
| `Vibe: Initialize Project` | Generate governance files |
| `Vibe: Check Project` | Run 6 validation checks |
| `Vibe: Refresh Context` | Update AGENTS.md from codebase |
| `Vibe: Optimize Prompt` | Optimize a prompt for AI agents |
| `Vibe: Show Project Context` | Open context webview panel |
| `Open AGENTS.md` | Open project's AGENTS.md |
| `Open .cursorrules` | Open project's .cursorrules |

## Generated Files

```
project/
├── AGENTS.md              ← Main agent context
├── .cursorrules           ← IDE rules
└── .vibecoding/
    ├── policies/
    │   ├── git-policy.md
    │   ├── security-policy.md
    │   └── testing-policy.md
    └── decisions/
        └── ADR-001-architecture.md
```

## Install

From the VS Code Marketplace (coming soon) or install from VSIX.

## Learn More

Visit [vibecoding.guide](https://vibecoding.guide) for the complete handbook.
