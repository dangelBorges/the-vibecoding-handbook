import pc from 'picocolors';

export function showHelp(): void {
  console.log(`
${pc.cyan('╔══════════════════════════════════════════════════════╗')}
${pc.cyan('║')}  ${pc.bold('Vibe Coding CLI')} — AI-first project governance      ${pc.cyan('║')}
${pc.cyan('╚══════════════════════════════════════════════════════╝')}

${pc.bold('Usage:')} vibe <command> [options]

${pc.bold('Commands:')}
  ${pc.cyan('init')}         Initialize a new project with the setup wizard
  ${pc.cyan('check')}        Validate project against vibe coding policies
  ${pc.cyan('context')}      Update AGENTS.md from current codebase
  ${pc.cyan('optimize')}     Optimize a prompt for AI agents

${pc.bold('Options:')}
  -h, --help     Show this help message
  -v, --version  Show version number

${pc.bold('Examples:')}
  ${pc.dim('$')} vibe init
  ${pc.dim('$')} vibe check
  ${pc.dim('$')} vibe context
  ${pc.dim('$')} vibe optimize "create a login page"
  ${pc.dim('$')} vibe optimize --file prompt.txt

${pc.dim('Learn more: https://vibecoding.guide')}
`);
}

export function showVersion(): void {
  console.log(pc.cyan('vibe CLI v1.0.0'));
}

export function printSuccess(message: string): void {
  console.log(pc.green('✔'), message);
}

export function printError(message: string): void {
  console.error(pc.red('✖'), message);
}

export function printWarning(message: string): void {
  console.log(pc.yellow('⚠'), message);
}

export function printInfo(message: string): void {
  console.log(pc.cyan('ℹ'), message);
}

export function printStep(step: number, total: number, message: string): void {
  console.log(`\n${pc.cyan(`[${step}/${total}]`)} ${pc.bold(message)}`);
}

export function printDivider(): void {
  console.log(pc.dim('─'.repeat(50)));
}

export function printFileTree(files: { path: string; type: 'file' | 'dir' }[]): void {
  for (const file of files) {
    const icon = file.type === 'dir' ? pc.cyan('📁') : pc.dim('📄');
    const name = file.type === 'dir' ? pc.cyan(file.path) : file.path;
    console.log(`  ${icon} ${name}`);
  }
}
