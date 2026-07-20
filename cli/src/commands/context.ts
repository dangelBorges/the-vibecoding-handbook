import fs from 'fs';
import path from 'path';
import { section, success, info, warn, error, spinner } from '../utils/ui.js';
import { scanProject, generateSmartAgentsMd, generateIdeRules } from '../utils/scanner.js';
import { detectLlmConfig, generateAgentsMd, generateAgentsMdFromScan } from '../utils/llm.js';
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

export async function contextCommand(options: { auto?: boolean; dryRun?: boolean; merge?: boolean; describe?: string; llm?: boolean }): Promise<void> {
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

  // Resolve AGENTS.md content (heuristic or LLM from natural-language description or auto-scan)
  let generatedAgents: string;
  if (options.describe) {
    const llm = detectLlmConfig();
    if (!llm) {
      error('No LLM API key found. Set OPENAI_API_KEY or ANTHROPIC_API_KEY to use --describe, or omit --describe to use heuristics.');
      process.exit(1);
    }
    const llmContent = await generateAgentsMd(options.describe, scan, llm);
    if (llmContent) {
      generatedAgents = llmContent;
      info('AGENTS.md generated from description');
    } else {
      warn('LLM unavailable — falling back to local heuristics');
      generatedAgents = generateSmartAgentsMd(scan);
    }
  } else if (options.llm !== false) {
    const llm = detectLlmConfig();
    if (llm) {
      const llmContent = await generateAgentsMdFromScan(scan, llm);
      if (llmContent) {
        generatedAgents = llmContent;
        info('AGENTS.md generated from project scan using LLM');
      } else {
        warn('LLM unavailable — falling back to local heuristics');
        generatedAgents = generateSmartAgentsMd(scan);
      }
    } else {
      generatedAgents = generateSmartAgentsMd(scan);
    }
  } else {
    generatedAgents = generateSmartAgentsMd(scan);
  }

  if (options.dryRun) {
    section('Dry Run — AGENTS.md Preview (first 30 lines)');
    const content = finalAgentsContent(cwd, generatedAgents, options.merge);
    console.log(content.split('\n').slice(0, 30).join('\n'));
    console.log();
    warn('Dry run — no files were written');
    return;
  }

  // Write files
  section('Writing files');

  const agentsPath = path.join(cwd, 'AGENTS.md');
  const oldExists = fs.existsSync(agentsPath);

  const agentsContent = finalAgentsContent(cwd, generatedAgents, options.merge);
  fs.writeFileSync(agentsPath, agentsContent);
  const action = oldExists ? (options.merge ? 'Merged into' : 'Updated') : 'Created';
  success(`${action} AGENTS.md (${agentsContent.split('\n').length} lines)`);

  // Update .iderules
  const idePath = path.join(cwd, '.iderules');
  const ideContent = generateIdeRules(scan);
  fs.writeFileSync(idePath, ideContent);
  success(`${fs.existsSync(idePath) && oldExists ? 'Updated' : 'Created'} .iderules`);

  console.log();
  success('Project context refreshed from codebase!');
  info('Your AI agent now has the latest project context.');
  console.log();
}
