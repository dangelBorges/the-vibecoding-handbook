# Contributing to The Vibe Coding Handbook

First off, thank you for considering contributing! It's people like you that make this project a great tool for the vibe coding community.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues. When you create a bug report, include:
- **Use a clear descriptive title**
- **Describe the exact steps to reproduce**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots or GIFs if applicable**
- **Mention your environment** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:
- **Use a clear descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit using conventional commits (`feat:`, `fix:`, `docs:`, etc.)
5. Push to your fork
6. Open a Pull Request

### Conventional Commits

```
feat: add new prompt pattern for API testing
fix: resolve scanner crash on monorepos
docs: update CLI command reference
refactor: simplify intent detection logic
test: add coverage for chat command
```

## Project Structure

- `web/` — React web application (handbook + tools)
- `cli/` — Node.js CLI (`@vibecoding/cli`)
- `vscode-extension/` — VS Code extension

## Development Setup

### Web App

Uses **pnpm** (required — lockfile is `pnpm-lock.yaml`):

```bash
cd web
pnpm install
pnpm run dev   # http://localhost:4000
```

### CLI

Uses **pnpm** as well:

```bash
cd cli
pnpm install
pnpm run build
node dist/index.js --help
```

### VS Code Extension

```bash
cd vscode-extension
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

## Style Guides

### TypeScript
- Strict mode enabled
- No `any` types
- Named exports preferred
- Max 50 lines per function

### React Components
- Functional components with hooks
- Props destructured in parameters
- `cn()` helper for conditional Tailwind classes

### CLI Commands
- Use the `ui.ts` utility for consistent output
- Follow the existing command structure in `commands/`
- Add `--help` text for all options

## Questions?

Feel free to open an issue with the `question` label.
