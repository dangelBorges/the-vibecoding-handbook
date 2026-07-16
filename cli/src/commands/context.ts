import fs from 'fs';
import path from 'path';
import { section, success, info, warn, spinner } from '../utils/ui.js';
import { scanProject, generateSmartAgentsMd, generateCursorRules } from '../utils/scanner.js';
import { wrapInMarkers, mergeIntoExisting } from '../utils/merge.js';

/** Computes the final AGENTS.md content, applying --merge semantics when requested. */
function finalAgentsContent(cwd: string, generated: string, merge?: boolean): string {
  if (!merge) return generated;
  const agentsPath = path.join(cwd, 'AGENTS.md');
  if (fs.existsSync(agentsPath)) {
    return mergeIntoExisting(fs.readFileSync(agentsPath, 'utf-8'), generated);
  }
  return wrapInMarkers(generated);
}

export async function contextCommand(options: { auto?: boolean; dryRun?: boolean; merge?: boolean }): Promise<void> {
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
    const content = finalAgentsContent(cwd, generateSmartAgentsMd(scan), options.merge);
    console.log(content.split('\n').slice(0, 30).join('\n'));
    console.log();
    warn('Dry run — no files were written');
    return;
  }

  // Write files
  section('Writing files');

  const agentsPath = path.join(cwd, 'AGENTS.md');
  const oldExists = fs.existsSync(agentsPath);

  const agentsContent = finalAgentsContent(cwd, generateSmartAgentsMd(scan), options.merge);
  fs.writeFileSync(agentsPath, agentsContent);
  const action = oldExists ? (options.merge ? 'Merged into' : 'Updated') : 'Created';
  success(`${action} AGENTS.md (${agentsContent.split('\n').length} lines)`);

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
