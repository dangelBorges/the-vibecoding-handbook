/**
 * `vibe help` — rich, topic-based help.
 * `vibe help` shows the overview; `vibe help <command>` shows deep detail
 * (options, modes, files, examples). `vibe help modes` shows the
 * interactive / non-interactive matrix for every command.
 */
import { c, header, section, divider } from '../utils/ui.js';

interface HelpLine {
  flag: string;
  description: string;
}

interface HelpExample {
  cmd: string;
  note: string;
}

interface CommandHelp {
  summary: string;
  description: string;
  usage: string;
  options?: HelpLine[];
  modes?: HelpLine[];
  files?: HelpLine[];
  examples: HelpExample[];
  tips?: string[];
}

const COMMAND_ORDER = ['init', 'context', 'check', 'review', 'optimize', 'chat', 'sync'];

const COMMAND_SUMMARIES: Record<string, string> = {
  init: 'Initialize project governance (AGENTS.md, .cursorrules, policies)',
  context: 'Update AGENTS.md from the current codebase',
  check: 'Validate project setup (score + CI-ready exit codes)',
  review: 'Review changed files against project policies',
  optimize: 'Turn a vague prompt into a structured, high-signal prompt',
  chat: 'Interview-style planning: from idea to plan + prompt',
  sync: 'Browse bundled starter templates and the prompt library',
};

const TOPICS: Record<string, CommandHelp> = {
  init: {
    summary: 'Initialize project governance files',
    description:
      'Scans your codebase (framework, language, database, auth, payments, testing, styling, API style — monorepo-aware) and generates a complete governance setup for AI coding agents.',
    usage: 'vibe init [options]',
    options: [
      { flag: '-y, --yes', description: 'Skip all prompts and accept detected defaults (CI-friendly)' },
      { flag: '-t, --type <type>', description: 'Project type: saas, ecommerce, api, dashboard, content' },
      { flag: '--merge', description: 'Merge into an existing AGENTS.md via managed markers (preserves your edits outside <!-- vibe:begin/end -->)' },
    ],
    modes: [
      { flag: 'Interactive', description: 'asks project name + type; confirms before overwriting an existing AGENTS.md' },
      { flag: 'Non-interactive', description: '-y (or no TTY): runs with detected defaults, never blocks — safe for CI' },
    ],
    files: [
      { flag: 'AGENTS.md', description: 'project context for AI agents' },
      { flag: '.cursorrules', description: 'IDE rules for Cursor-compatible tools' },
      { flag: '.vibecoding/policies/*.md', description: 'git, security, testing and deployment policies' },
      { flag: '.vibecoding/decisions/ADR-001-architecture.md', description: 'your first architecture decision record' },
    ],
    examples: [
      { cmd: 'vibe init', note: 'interactive setup' },
      { cmd: 'vibe init -y -t saas', note: 'no prompts, SaaS defaults — CI-friendly' },
      { cmd: 'vibe init --merge', note: 'update AGENTS.md without losing your custom notes' },
    ],
    tips: ['Run `vibe check` afterwards to validate the setup.'],
  },

  context: {
    summary: 'Regenerate AGENTS.md from the current codebase',
    description:
      'Re-scans the project and rewrites AGENTS.md and .cursorrules so they never go stale. Detects monorepos — npm/yarn/pnpm/lerna workspaces, or inferred from the directory structure when no tooling is declared.',
    usage: 'vibe context [options]',
    options: [
      { flag: '-a, --auto', description: 'Auto-detect everything (no prompts)' },
      { flag: '--dry-run', description: 'Print a preview (first 30 lines) without writing anything' },
      { flag: '--merge', description: 'Merge into the existing AGENTS.md via managed markers' },
    ],
    files: [
      { flag: 'AGENTS.md', description: 'rewritten (or merged) with fresh scan results' },
      { flag: '.cursorrules', description: 'regenerated from the detected stack' },
    ],
    examples: [
      { cmd: 'vibe context --dry-run', note: 'safe preview — writes nothing' },
      { cmd: 'vibe context --merge', note: 'refresh the managed block, keep your notes' },
      { cmd: 'vibe context', note: 'run at a monorepo root to see the package table' },
    ],
    tips: ['Use --dry-run liberally; it never touches your files.'],
  },

  check: {
    summary: 'Validate project setup against vibe coding policies',
    description:
      'Runs governance checks — AGENTS.md, .cursorrules, .vibecoding/, git repo, .gitignore covering .env, framework detection, test/lint/typecheck scripts, and obvious exposed secrets — and prints a score.',
    usage: 'vibe check [options]',
    options: [{ flag: '--strict', description: 'Warnings also count as failures' }],
    modes: [
      { flag: 'Exit 0', description: 'all checks passed (or only warnings, non-strict)' },
      { flag: 'Exit 1', description: 'failures found — or warnings with --strict. CI-ready gating' },
    ],
    examples: [
      { cmd: 'vibe check', note: 'local validation with score' },
      { cmd: 'vibe check --strict', note: 'CI mode: warnings fail the build' },
    ],
    tips: ['Adopt --strict in CI once warnings are under control.'],
  },

  review: {
    summary: 'Review changed files against project policies',
    description:
      'Heuristic review of your changes: console.log, explicit any, hardcoded secrets, .then() chains and oversized functions. Adapts to your .cursorrules / AGENTS.md. Score: 100 − 15 per error − 5 per warning.',
    usage: 'vibe review [options]',
    options: [
      { flag: '-s, --staged', description: 'Review only git staged files' },
      { flag: '-f, --file <file>', description: 'Review a single file' },
    ],
    modes: [{ flag: 'Default', description: 'reviews modified-but-unstaged files (git diff)' }],
    examples: [
      { cmd: 'vibe review -s', note: 'pre-commit: only what is staged' },
      { cmd: 'vibe review -f src/auth.ts', note: 'single file' },
    ],
    tips: ['Works great as a pre-commit step before handing code to an AI agent.'],
  },

  optimize: {
    summary: 'Turn a vague prompt into a structured, high-signal prompt',
    description:
      'Detects intent (feature, bugfix, refactor, test, docs, review — English and Spanish keywords), picks a pattern (RICE, STAR, Chain-of-Thought, Few-Shot, Structured) and enriches the prompt with your AGENTS.md context. 100% local — no AI API calls.',
    usage: 'vibe optimize [prompt] [options]',
    options: [
      { flag: '-f, --file <file>', description: 'Read the prompt from a file (takes precedence over [prompt])' },
      { flag: '-c, --context <file>', description: 'Read context from this file instead of AGENTS.md' },
      { flag: '-o, --output <file>', description: 'Write the optimized prompt to this file' },
    ],
    modes: [
      { flag: 'Interactive', description: 'asks for the prompt, offers clipboard copy and save' },
      { flag: 'Non-interactive', description: 'auto-saves to optimized-prompt.md (or --output path)' },
    ],
    examples: [
      { cmd: 'vibe optimize "create a login form"', note: 'inline prompt' },
      { cmd: 'vibe optimize -f draft.md -o final.md', note: 'file in, file out' },
      { cmd: 'vibe optimize "fix CORS error" -c CONTEXT.md', note: 'custom context source' },
    ],
    tips: ['Token estimate assumes ~4 characters per token.'],
  },

  chat: {
    summary: 'Interview-style planning: from idea to plan + prompt',
    description:
      'Detects the topic of your task, asks 3 clarifying questions, scans your project, and produces a step-by-step plan plus an optimized prompt ready to paste into your AI agent.',
    usage: 'vibe chat [task]',
    modes: [
      { flag: 'Interactive', description: '3 follow-up questions about your task' },
      { flag: 'Non-interactive', description: 'auto-generated answers; saves both files' },
    ],
    files: [
      { flag: 'vibe-plan.md', description: 'understanding, steps and checklist' },
      { flag: 'vibe-prompt.md', description: 'the optimized prompt for your agent' },
    ],
    examples: [{ cmd: 'vibe chat "build a sales dashboard"', note: 'plan + prompt in one pass' }],
    tips: ['No LLM involved — it structures YOUR input; paste the result into Cursor or Claude Code.'],
  },

  sync: {
    summary: 'Browse bundled starter templates and the prompt library',
    description:
      'Pick a starter template (next-saas, react-dashboard, api-service) to generate AGENTS.md + .cursorrules + policies, or browse categorized prompt patterns (components, auth, database, testing) to copy or save.',
    usage: 'vibe sync [options]',
    options: [
      { flag: '--templates', description: 'Only the templates flow' },
      { flag: '--prompts', description: 'Only the prompts flow' },
    ],
    modes: [{ flag: 'Interactive only', description: 'requires a TTY — exits with an error otherwise' }],
    examples: [
      { cmd: 'vibe sync', note: 'templates + prompts' },
      { cmd: 'vibe sync --templates', note: 'starter templates only' },
    ],
    tips: ['Everything is bundled with the CLI — works offline.'],
  },
};

const MODES_MATRIX: HelpLine[] = [
  { flag: 'init', description: 'interactive prompts · -y (or no TTY) = defaults, never blocks' },
  { flag: 'context', description: '--dry-run = read-only preview · otherwise writes AGENTS.md' },
  { flag: 'check', description: 'always read-only · --strict gates CI on warnings' },
  { flag: 'review', description: 'default: unstaged changes · -s staged · -f single file' },
  { flag: 'optimize', description: 'interactive (clipboard + save) · no TTY = auto-save to file' },
  { flag: 'chat', description: 'interactive (3 questions) · no TTY = auto answers' },
  { flag: 'sync', description: 'interactive only — requires a TTY' },
];

/** Pads to `width`, guaranteeing at least a 2-space gap for long values. */
function pad(text: string, width: number): string {
  return text.length >= width ? text + '  ' : text.padEnd(width);
}

/** Prints a padded "flag — description" line. */
function line(flag: string, description: string): void {
  console.log('  ' + c.cyan(pad(flag, 34)) + c.dim(description));
}

function renderOverview(): void {
  header('VIBE — AI-first project governance');
  console.log(
    c.dim('  Generate project context (AGENTS.md, .cursorrules), enforce') + '\n' +
    c.dim('  policies and level up prompts for AI coding agents.')
  );

  section('Usage');
  console.log('  ' + c.bold('vibe <command> [options]'));

  section('Commands');
  for (const name of COMMAND_ORDER) {
    line(name, COMMAND_SUMMARIES[name]);
  }
  line('help [command]', 'This guide — try `vibe help <command>`');

  section('Modes');
  line('Interactive', 'full prompts, clipboard, choices (requires a TTY)');
  line('Non-interactive', 'piped/CI: sensible defaults, files auto-saved');
  console.log(c.dim('  Details per command: ') + c.cyan('vibe help modes'));

  section('Quick start');
  console.log(c.dim('  cd your-project'));
  console.log('  ' + c.mint('vibe init') + c.dim('          # generate governance files'));
  console.log('  ' + c.mint('vibe check') + c.dim('         # validate the setup'));
  console.log('  ' + c.mint('vibe optimize "..."') + c.dim('  # level up a prompt'));

  section('More');
  line('-v, --version', 'show version number');
  line('-h, --help', 'quick auto-generated reference');
  line('vibe help <command>', 'deep dive: options, modes, files, examples');
  console.log();
  console.log(c.dim('  Docs: https://vibecoding.guide/#/docs'));
  console.log(c.dim('  Repo: https://github.com/dangelBorges/the-vibecoding-handbook'));
  console.log();
}

function renderModes(): void {
  header('VIBE — Interactive vs non-interactive');
  section('Modes per command');
  for (const row of MODES_MATRIX) {
    line(row.flag, row.description);
  }
  console.log();
  console.log(c.dim('  TTY = a real terminal. Piped stdin/stdout (CI, scripts) disables') + '\n' + c.dim('  interactivity; commands fall back to safe non-blocking behavior.'));
  console.log();
}

function renderTopic(name: string, topic: CommandHelp): void {
  header(`VIBE ${name.toUpperCase()} — ${topic.summary}`);
  console.log(c.dim('  ' + topic.description));

  section('Usage');
  console.log('  ' + c.bold(topic.usage));

  if (topic.options?.length) {
    section('Options');
    for (const o of topic.options) line(o.flag, o.description);
  }
  if (topic.modes?.length) {
    section('Modes');
    for (const m of topic.modes) line(m.flag, m.description);
  }
  if (topic.files?.length) {
    section('Files');
    for (const f of topic.files) line(f.flag, f.description);
  }

  section('Examples');
  for (const e of topic.examples) {
    console.log('  ' + c.mint(pad(e.cmd, 44)) + c.dim('# ' + e.note));
  }

  if (topic.tips?.length) {
    section('Tips');
    for (const t of topic.tips) console.log(c.dim('  • ' + t));
  }
  console.log();
}

export function helpCommand(topic?: string): void {
  if (!topic) return renderOverview();
  if (topic === 'modes') return renderModes();

  const found = TOPICS[topic];
  if (!found) {
    console.log(c.error(`  ✖ Unknown topic "${topic}".`));
    console.log(c.dim('  Available: ' + [...COMMAND_ORDER, 'modes'].join(', ')));
    process.exit(1);
  }
  renderTopic(topic, found);
  divider();
  console.log(c.dim('  Back to overview: ') + c.cyan('vibe help'));
  console.log();
}
