import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { contextCommand } from './commands/context.js';
import { reviewCommand } from './commands/review.js';
import { optimizeCommand } from './commands/optimize.js';
import { chatCommand } from './commands/chat.js';
import { checkCommand } from './commands/check.js';
import { syncCommand } from './commands/sync.js';
import { helpCommand } from './commands/help.js';

const program = new Command();

program
  .name('vibe')
  .description(chalk.cyan('AI-first project governance — context, policies, and prompt optimization'))
  .version('1.0.0', '-v, --version', 'Show version number')
  .helpOption('-h, --help', 'Show help')
  .addHelpCommand(false)
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });

// ─── vibe init ───
program
  .command('init')
  .description('Initialize project governance (AGENTS.md, .iderules, policies)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-t, --type <type>', 'Project type (saas, ecommerce, api, dashboard, content)')
  .option('--describe <text>', 'Generate AGENTS.md from a natural-language project description (requires an LLM API key)')
  .option('--merge', 'merge into existing AGENTS.md using managed markers instead of overwriting')
  .action(initCommand);

// ─── vibe context ───
program
  .command('context')
  .description('Update AGENTS.md from current codebase')
  .option('-a, --auto', 'Auto-detect everything (no prompts)')
  .option('--describe <text>', 'Generate AGENTS.md from a natural-language project description (requires an LLM API key)')
  .option('--dry-run', 'Show what would change without writing files')
  .option('--merge', 'merge into existing AGENTS.md using managed markers instead of overwriting')
  .action(contextCommand);

// ─── vibe review ───
program
  .command('review')
  .description('Review staged or specified files against project policies')
  .option('-s, --staged', 'Review only git staged files')
  .option('-f, --file <file>', 'Review a specific file')
  .option('--fix', 'Auto-fix safe issues (removes console.log), suggests fixes for the rest')
  .action(reviewCommand);

// ─── vibe optimize ───
program
  .command('optimize')
  .description('Optimize a prompt for AI agents')
  .argument('[prompt]', 'The prompt to optimize')
  .option('-f, --file <file>', 'Read prompt from file')
  .option('-c, --context <file>', 'Read context from file instead of AGENTS.md')
  .option('-o, --output <file>', 'Write result to file')
  .action((prompt: string | undefined, opts: { file?: string; context?: string; output?: string }) => optimizeCommand(prompt, opts));

// ─── vibe chat ───
program
  .command('chat')
  .description('Start an interactive REPL session with project context')
  .argument('[task]', 'Task description (e.g. "create a dashboard")')
  .action(chatCommand);

// ─── vibe check ───
program
  .command('check')
  .description('Validate project against vibe coding policies')
  .option('--strict', 'Fail on warnings too')
  .action((opts: { strict?: boolean }) => checkCommand(opts));

// ─── vibe sync ───
program
  .command('sync')
  .description('Browse bundled starter templates and prompt library')
  .option('--templates', 'Sync only templates')
  .option('--prompts', 'Sync only prompts')
  .action(syncCommand);

// ─── vibe help ───
program
  .command('help')
  .argument('[command]', 'Command to explain (or "modes")')
  .description('Show the full usage guide (try: vibe help <command>)')
  .action((command?: string) => helpCommand(command));

// ─── Default: show the rich help overview ───
if (process.argv.length <= 2) {
  helpCommand();
} else {
  program.parse();
}
