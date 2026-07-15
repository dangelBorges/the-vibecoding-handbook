import chalk from 'chalk';
import ora from 'ora';

export const c = {
  primary: chalk.cyan,
  secondary: chalk.hex('#C792EA'),
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  dim: chalk.gray,
  bold: chalk.bold,
  cyan: chalk.cyanBright,
  purple: chalk.hex('#C792EA'),
  mint: chalk.greenBright,
};

export function header(text: string): void {
  console.log();
  console.log(c.cyan('╔' + '═'.repeat(54) + '╗'));
  console.log(c.cyan('║') + '  ' + c.bold(text).padEnd(52) + c.cyan('║'));
  console.log(c.cyan('╚' + '═'.repeat(54) + '╝'));
  console.log();
}

export function section(title: string): void {
  console.log();
  console.log(c.cyan('── ') + c.bold(title) + c.cyan(' ──'));
}

export function success(msg: string): void {
  console.log(c.mint('  ✔ ') + msg);
}

export function error(msg: string): void {
  console.log(c.error('  ✖ ') + msg);
}

export function warn(msg: string): void {
  console.log(c.warning('  ⚠ ') + msg);
}

export function info(msg: string): void {
  console.log(c.info('  ℹ ') + msg);
}

export function fileTree(files: { path: string; type: 'file' | 'dir' }[]): void {
  for (const f of files) {
    const icon = f.type === 'dir' ? c.cyan('📁') : c.dim('📄');
    const name = f.type === 'dir' ? c.cyan(f.path) : f.path;
    console.log(`    ${icon} ${name}`);
  }
}

export function spinner(text: string) {
  return ora({ text: c.dim(text), spinner: 'dots' });
}

export function divider(): void {
  console.log(c.dim('─'.repeat(56)));
}

export function score(value: number): string {
  if (value >= 80) return c.mint(`${value}%`);
  if (value >= 50) return c.warning(`${value}%`);
  return c.error(`${value}%`);
}

export function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}
