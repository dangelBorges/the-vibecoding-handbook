import pc from 'picocolors';

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

export function printDivider(): void {
  console.log(pc.dim('─'.repeat(50)));
}
