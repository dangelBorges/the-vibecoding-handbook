import fs from 'fs';
import path from 'path';
import { section, success, info, warn, spinner } from '../utils/ui.js';
import { scanProject, generateSmartAgentsMd, generateCursorRules } from '../utils/scanner.js';

export async function contextCommand(options: { auto?: boolean; dryRun?: boolean }): Promise<void> {
  const cwd = process.cwd();
  const s = spinner('Scanning your codebase...');
  s.start();

  // Deep scan
  const scan = scanProject(cwd);
  s.succeed(`Scanned: ${scan.framework} + ${scan.language} + ${scan.styling}`);

  // Show findings
  section('Detected from your codebase');
  if (scan.hasAuth) info(`Auth: ${scan.authProvider}`);
  if (scan.hasDatabase) info(`Database: ${scan.database}`);
  if (scan.hasPayments) info(`Payments: ${scan.paymentProvider}`);
  if (scan.hasTests) info(`Tests: ${scan.testFramework}`);
  if (scan.apiStyle !== 'none') info(`API: ${scan.apiStyle}`);
  scan.conventions.forEach((c) => info(`Convention: ${c}`));

  if (options.dryRun) {
    section('Dry Run — AGENTS.md Preview (first 30 lines)');
    const content = generateSmartAgentsMd(scan);
    console.log(content.split('\n').slice(0, 30).join('\n'));
    console.log();
    warn('Dry run — no files were written');
    return;
  }

  // Write files
  section('Writing files');

  const agentsPath = path.join(cwd, 'AGENTS.md');
  const oldExists = fs.existsSync(agentsPath);

  const agentsContent = generateSmartAgentsMd(scan);
  fs.writeFileSync(agentsPath, agentsContent);
  success(`${oldExists ? 'Updated' : 'Created'} AGENTS.md (${agentsContent.split('\n').length} lines)`);

  // Update .cursorrules
  const cursorPath = path.join(cwd, '.cursorrules');
  const cursorContent = generateCursorRules(scan);
  fs.writeFileSync(cursorPath, cursorContent);
  success(`${fs.existsSync(cursorPath) && oldExists ? 'Updated' : 'Created'} .cursorrules`);

  console.log();
  success('Project context refreshed from codebase!');
  info('Your AI agent now has the latest project context.');
  console.log();
}
