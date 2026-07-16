import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import ora from 'ora';
import { input, confirm } from '@inquirer/prompts';
import { printSuccess, printInfo, printDivider } from '../utils/prompts.js';
import { isInteractive, warn } from '../utils/ui.js';
import { detectLlmConfig, generateOptimizedPrompt as generateLlmOptimizedPrompt } from '../utils/llm.js';

// Inline the optimizer engine (client-side code adapted for Node.js)
type IntentType = 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs' | 'review' | 'unknown';

interface OptimizedResult {
  original: string;
  optimized: string;
  intent: IntentType;
  confidence: number;
  improvements: string[];
}

const intentKeywords: Record<IntentType, string[]> = {
  feature: ['crea', 'create', 'haz', 'make', 'build', 'implement', 'add', 'agrega', 'nuevo', 'feature', 'page', 'component', 'form', 'dashboard'],
  bugfix: ['fix', 'arregla', 'corrige', 'bug', 'error', 'issue', 'problema', 'broken', 'not working', 'no funciona', 'falla', 'crash'],
  refactor: ['refactor', 'reorganiza', 'simplify', 'clean', 'mejora', 'improve', 'optimize', 'extract', 'rename', 'split'],
  test: ['test', 'prueba', 'spec', 'unit test', 'integration', 'coverage', 'mock', 'assert', 'testing'],
  docs: ['document', 'documenta', 'readme', 'comment', 'explain', 'explica', 'description', 'guide', 'tutorial'],
  review: ['review', 'revisa', 'check', 'audit', 'analyze', 'inspect', 'quality'],
  unknown: [],
};

function detectIntent(raw: string): { type: IntentType; confidence: number } {
  const lower = raw.toLowerCase();
  const scores: Record<IntentType, number> = { feature: 0, bugfix: 0, refactor: 0, test: 0, docs: 0, review: 0, unknown: 0 };

  for (const [intent, keywords] of Object.entries(intentKeywords) as [IntentType, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[intent] += 1;
    }
  }

  if (raw.includes('?')) { scores.bugfix += 0.5; scores.docs += 0.5; }
  if (raw.includes('```')) { scores.refactor += 0.5; scores.test += 0.5; }

  let best: IntentType = 'unknown';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores) as [IntentType, number][]) {
    if (intent !== 'unknown' && score > bestScore) { bestScore = score; best = intent; }
  }

  return { type: bestScore > 0.2 ? best : 'unknown', confidence: Math.min(bestScore / 3, 1) };
}

function generateOptimizedPrompt(raw: string, intent: IntentType, context?: string): string {
  const constraints = intent === 'feature'
    ? '- Use TypeScript strict mode\n- Follow existing patterns\n- Write tests\n- Handle edge cases\n- Ensure accessibility'
    : intent === 'bugfix'
    ? '- Minimal changes only\n- Add regression test\n- Explain root cause first'
    : intent === 'test'
    ? '- Arrange-Act-Assert pattern\n- Mock external deps\n- Test edge cases'
    : intent === 'refactor'
    ? '- Maintain backward compatibility\n- All tests must pass\n- Explain reasoning first'
    : intent === 'docs'
    ? '- Include code examples\n- Document params and returns\n- Note edge cases'
    : '- Use TypeScript strict mode\n- Follow existing patterns\n- Write tests';

  return `# Senior ${intent === 'feature' ? 'Developer' : intent === 'bugfix' ? 'Debug Assistant' : intent === 'test' ? 'Test Engineer' : 'Engineer'}

${context ? `## Context\n${context}\n` : ''}## Task
${raw}

## Constraints
${constraints}

## Before you start
1. Ask clarifying questions if anything is unclear
2. Share your plan before writing code
3. Break complex tasks into smaller steps

## Expected Output
Production-ready code with tests, error handling, and TypeScript types.`;
}

function optimize(raw: string, context?: string): OptimizedResult {
  const { type: intent, confidence } = detectIntent(raw);
  const optimized = generateOptimizedPrompt(raw, intent, context);

  const improvements: string[] = [];
  if (!raw.includes('#')) improvements.push('Added structured sections');
  if (!raw.toLowerCase().includes('context')) improvements.push('Added role and context');
  if (!raw.toLowerCase().includes('test') && intent !== 'docs') improvements.push('Added testing requirements');
  if (!raw.toLowerCase().includes('typescript')) improvements.push('Added TypeScript constraints');
  improvements.push(`Applied ${intent} pattern (${Math.round(confidence * 100)}% confidence)`);
  improvements.push('Added pre-implementation planning step');

  return { original: raw, optimized, intent, confidence, improvements };
}

interface OptimizeOptions {
  file?: string;
  context?: string;
  output?: string;
}

function extractContextSections(content: string): string {
  const stackMatch = content.match(/## Tech Stack[\s\S]*?(?=\n## |$)/);
  const standardsMatch = content.match(/## Coding Standards[\s\S]*?(?=\n## |$)/);
  const sections = [stackMatch, standardsMatch].filter(Boolean).join('\n\n');
  // Fall back to the whole file when the expected sections are not present
  return (sections || content).slice(0, 2000);
}

export async function optimizeCommand(prompt: string | undefined, options: OptimizeOptions): Promise<void> {
  console.log(`\n${pc.cyan('⚡ Prompt Optimizer')}\n`);

  let rawPrompt = typeof prompt === 'string' ? prompt.trim() : '';

  // --file takes precedence over the positional argument
  if (options.file) {
    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
      console.error(pc.red(`Error: Prompt file not found: ${filePath}`));
      process.exit(1);
    }
    rawPrompt = fs.readFileSync(filePath, 'utf-8').trim();
  }

  // Non-interactive: require prompt as argument
  if (!rawPrompt && !isInteractive()) {
    console.error(pc.red('Error: Prompt required when running non-interactively. Usage: vibe optimize "your prompt here"'));
    process.exit(1);
  }

  // Interactive mode: prompt for input
  if (!rawPrompt) {
    rawPrompt = await input({
      message: 'Enter your prompt:',
      validate: (val) => val.length > 0 || 'Prompt cannot be empty',
    });
  }

  // Context: --context file wins; otherwise auto-detect AGENTS.md
  let context: string | undefined;

  if (options.context) {
    const contextPath = path.resolve(options.context);
    if (!fs.existsSync(contextPath)) {
      console.error(pc.red(`Error: Context file not found: ${contextPath}`));
      process.exit(1);
    }
    const spinner = ora('Reading context file...').start();
    context = extractContextSections(fs.readFileSync(contextPath, 'utf-8'));
    spinner.succeed('Context loaded');
  } else {
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');

    if (fs.existsSync(agentsPath)) {
      // Non-interactive: auto-include context
      const useContext = isInteractive()
        ? await confirm({ message: 'Include AGENTS.md context?', default: true })
        : true;

      if (useContext) {
        const spinner = ora('Reading AGENTS.md...').start();
        context = extractContextSections(fs.readFileSync(agentsPath, 'utf-8'));
        spinner.succeed('Context loaded');
      }
    }
  }

  // Optimize (heuristics always run; LLM rewrites the prompt body when available)
  const spinner = ora('Optimizing prompt...').start();
  const result = optimize(rawPrompt, context);
  spinner.succeed('Prompt optimized');

  const llm = detectLlmConfig();
  if (llm) {
    printInfo(`AI mode: ${llm.provider} (${llm.model})`);
    const llmPrompt = await generateLlmOptimizedPrompt(rawPrompt, context, result.intent, llm);
    if (llmPrompt) {
      result.optimized = llmPrompt;
    } else {
      warn('LLM unavailable — using heuristic optimization');
    }
  } else {
    printInfo('Local mode: heuristic optimization');
  }

  // Output
  printDivider();
  console.log(`\n${pc.cyan('Intent:')} ${pc.bold(result.intent)} ${pc.dim(`(${Math.round(result.confidence * 100)}% confidence)`)}`);
  console.log(`${pc.cyan('Tokens:')} ~${Math.round(result.optimized.length / 4)} ${pc.dim(`(+${Math.round(((result.optimized.length / Math.max(result.original.length, 1)) - 1) * 100)}%)`)}\n`);

  console.log(pc.cyan('Improvements:'));
  for (const imp of result.improvements) {
    console.log(`  ${pc.green('✔')} ${imp}`);
  }

  printDivider();
  console.log(`\n${pc.cyan('Optimized Prompt:')}\n`);
  console.log(result.optimized);
  console.log();

  // Non-interactive: auto-save and skip clipboard questions
  if (!isInteractive()) {
    const autoFile = options.output ? path.resolve(options.output) : path.join(process.cwd(), 'optimized-prompt.md');
    fs.writeFileSync(autoFile, result.optimized);
    printSuccess(`Saved to ${autoFile}`);
    return;
  }

  // Copy to clipboard option
  const shouldCopy = await confirm({
    message: 'Copy optimized prompt to clipboard?',
    default: true,
  });

  if (shouldCopy) {
    try {
      const { execSync } = await import('child_process');
      const platform = process.platform;
      const cmd = platform === 'darwin' ? 'pbcopy' : platform === 'win32' ? 'clip' : 'xclip -selection clipboard';
      execSync(cmd, { input: result.optimized });
      printSuccess('Copied to clipboard!');
    } catch {
      printInfo('Could not auto-copy. Select and copy the prompt above.');
    }
  }

  // Save to file option
  const shouldSave = await confirm({
    message: 'Save to file?',
    default: false,
  });

  if (shouldSave) {
    const fileName = await input({
      message: 'File name:',
      default: options.output || 'optimized-prompt.md',
    });
    fs.writeFileSync(path.join(process.cwd(), fileName), result.optimized);
    printSuccess(`Saved to ${fileName}`);
  }
}
