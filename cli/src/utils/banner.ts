/**
 * Brand banner — the CLI's "cover".
 * ASCII art with a cyan → purple gradient (brand palette), tagline and
 * version. Shared by `vibe` (no args) and the postinstall welcome.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';

const ART = [
  '██╗   ██╗██╗██████╗ ███████╗',
  '██║   ██║██║██╔══██╗██╔════╝',
  '██║   ██║██║██████╔╝█████╗  ',
  '╚██╗ ██╔╝██║██╔══██╗██╔══╝  ',
  ' ╚████╔╝ ██║██████╔╝███████╗',
  '  ╚═══╝  ╚═╝╚═════╝ ╚══════╝',
];

/** Brand gradient endpoints (same cyan/purple as the favicon and web). */
const FROM = [0, 229, 255] as const; // cyan
const TO = [199, 146, 234] as const; // purple

/** Paints one art line with a horizontal cyan → purple gradient. */
function paint(line: string, width: number): string {
  let out = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === ' ' || chalk.level === 0) {
      out += ch;
      continue;
    }
    const t = width <= 1 ? 0 : i / (width - 1);
    out += chalk.rgb(
      Math.round(FROM[0] + (TO[0] - FROM[0]) * t),
      Math.round(FROM[1] + (TO[1] - FROM[1]) * t),
      Math.round(FROM[2] + (TO[2] - FROM[2]) * t)
    )(ch);
  }
  return out;
}

function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')) as {
      version?: string;
    };
    return pkg.version ?? '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/** ASCII-art logo + tagline + version. One-liner fallback on narrow terminals. */
export function renderBanner(): void {
  const version = getVersion();
  const columns = process.stdout.columns ?? 80;
  console.log();
  if (columns < 34) {
    console.log('  ' + chalk.bold('✦ VIBE') + chalk.dim(` v${version} — AI-first project governance`));
    console.log();
    return;
  }
  const width = ART[0].length;
  for (const line of ART) console.log('  ' + paint(line, width));
  console.log();
  console.log('  ' + chalk.bold('AI-first project governance') + chalk.dim(`  v${version}`));
  console.log(chalk.dim('  Context, policies and prompt optimization for AI coding agents.'));
  console.log();
}

/** Postinstall welcome: banner + first steps. */
export function renderWelcome(): void {
  renderBanner();
  console.log('  ' + chalk.bold('Get started'));
  console.log(chalk.dim('    cd your-project'));
  console.log('    ' + chalk.greenBright('vibe init') + chalk.dim('   → generate AGENTS.md, .cursorrules & policies'));
  console.log('    ' + chalk.greenBright('vibe help') + chalk.dim('   → full command guide'));
  console.log();
  console.log(chalk.dim('  Docs: https://vibecoding.guide'));
  console.log();
}
