import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { contextCommand } from './commands/context.js';
import { reviewCommand } from './commands/review.js';
import { optimizeCommand } from './commands/optimize.js';
import { chatCommand } from './commands/chat.js';
import { checkCommand } from './commands/check.js';
import { syncCommand } from './commands/sync.js';

const program = new Command();

program
  .name('vibe')
  .description(chalk.cyan('AI-first project governance — context, policies, and prompt optimization'))
  .version('1.0.0', '-v, --version', 'Show version number')
  .helpOption('-h, --help', 'Show help')
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });

// ─── vibe init ───
program
  .command('init')
  .description('Initialize project governance (AGENTS.md, .cursorrules, policies)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-t, --type <type>', 'Project type (saas, ecommerce, api, dashboard, content)')
  .action(initCommand);

// ─── vibe context ───
program
  .command('context')
  .description('Update AGENTS.md from current codebase')
  .option('-a, --auto', 'Auto-detect everything (no prompts)')
  .option('--dry-run', 'Show what would change without writing files')
  .action(contextCommand);

// ─── vibe review ───
program
  .command('review')
  .description('Review staged or specified files against project policies')
  .option('-s, --staged', 'Review only git staged files')
  .option('-f, --file <file>', 'Review a specific file')
  .option('--fix', 'Auto-fix issues where possible')
  .action(reviewCommand);

// ─── vibe optimize ───
program
  .command('optimize')
  .description('Optimize a prompt for AI agents')
  .argument('[prompt]', 'The prompt to optimize')
  .option('-f, --file <file>', 'Read prompt from file')
  .option('-c, --context', 'Include AGENTS.md context')
  .option('-o, --output <file>', 'Write result to file')
  .action(optimizeCommand);

// ─── vibe chat ───
program
  .command('chat')
  .description('Start an interactive REPL session with project context')
  .argument('[task]', 'Task description (e.g. "create a dashboard")')
  .option('-m, --model <model>', 'AI model to use (openai, anthropic, ollama)', 'openai')
  .action(chatCommand);

// ─── vibe check ───
program
  .command('check')
  .description('Validate project against vibe coding policies')
  .option('--strict', 'Fail on warnings too')
  .action(checkCommand);

// ─── vibe sync ───
program
  .command('sync')
  .description('Sync templates and prompts from vibecoding.guide')
  .option('--templates', 'Sync only templates')
  .option('--prompts', 'Sync only prompts')
  .action(syncCommand);

// ─── Default: show help ───
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
