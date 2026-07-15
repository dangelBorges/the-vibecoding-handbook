import fs from 'fs';
import path from 'path';
import { section, success, info, warn, divider, c, isInteractive } from '../utils/ui.js';
import { scanProject, type ProjectScan } from '../utils/scanner.js';

// Lazy import @inquirer/prompts to avoid TTY issues in non-interactive mode
let inquirerPrompts: typeof import('@inquirer/prompts') | null = null;
async function getPrompts() {
  if (!inquirerPrompts) {
    inquirerPrompts = await import('@inquirer/prompts');
  }
  return inquirerPrompts;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  topic: string;
  messages: ChatMessage[];
  plan?: string;
}

// Simple clarifying questions based on intent keywords
const clarifyingQuestions: Record<string, string[]> = {
  feature: [
    'What is the core user story? (e.g., "As a user, I want to...")',
    'Which existing components or pages will this affect?',
    'Are there any design references or mockups?',
    'What is the expected behavior on mobile?',
  ],
  bugfix: [
    'What is the exact error message or unexpected behavior?',
    'Steps to reproduce? (1. Go to... 2. Click... 3. See...)',
    'Which browser/device does this affect?',
    'When did this last work correctly?',
  ],
  refactor: [
    'What is the current pain point with this code?',
    'What should the improved architecture look like?',
    'Are there tests that must continue passing?',
    'Any dependencies or consumers to consider?',
  ],
  test: [
    'What functionality needs test coverage?',
    'Unit, integration, or E2E tests?',
    'Are there existing tests to use as patterns?',
    'Any external services that need mocking?',
  ],
  docs: [
    'Who is the target audience? (devs, users, API consumers)',
    'What format? (README, inline comments, API docs)',
    'Are there code examples to include?',
  ],
  unknown: [
    'What are you trying to accomplish?',
    'Is this a new feature, bug fix, or improvement?',
    'Any specific files or components involved?',
    'What does "done" look like for this task?',
  ],
};

function detectTopic(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('broken') || lower.includes('crash')) return 'bugfix';
  if (lower.includes('test') || lower.includes('spec') || lower.includes('coverage')) return 'test';
  if (lower.includes('refactor') || lower.includes('clean') || lower.includes('restructure') || lower.includes('simplify')) return 'refactor';
  if (lower.includes('doc') || lower.includes('readme') || lower.includes('comment') || lower.includes('explain')) return 'docs';
  if (lower.includes('create') || lower.includes('add') || lower.includes('build') || lower.includes('implement') || lower.includes('feature') || lower.includes('page') || lower.includes('component')) return 'feature';
  return 'unknown';
}

function generateOptimizedPrompt(session: ChatSession, scan: ProjectScan): string {
  const context: string[] = [];

  if (fs.existsSync(path.join(process.cwd(), 'AGENTS.md'))) {
    const agents = fs.readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf-8');
    const stackMatch = agents.match(/## Tech Stack[\s\S]*?(?=\n## |$)/);
    const standardsMatch = agents.match(/## Coding Standards[\s\S]*?(?=\n## |$)/);
    if (stackMatch) context.push(stackMatch[0]);
    if (standardsMatch) context.push(standardsMatch[0]);
  }

  const roleMap: Record<string, string> = {
    feature: 'Senior Developer',
    bugfix: 'Debug Assistant',
    test: 'Test Engineer',
    refactor: 'Software Architect',
    docs: 'Technical Writer',
    unknown: 'Software Engineer',
  };

  const constraintsMap: Record<string, string> = {
    feature: `- TypeScript strict mode — no \`any\` types\n- Follow existing ${scan.framework} patterns\n- Write tests (Arrange-Act-Assert)\n- Handle edge cases and errors\n- Ensure accessibility (ARIA labels)\n- Named exports, async/await, max 50 lines per function`,
    bugfix: `- Minimal changes only\n- Add regression test that fails before fix\n- Explain root cause first\n- Verify no other functionality breaks`,
    test: `- Arrange-Act-Assert pattern\n- Mock ALL external dependencies\n- Test edge cases: null, undefined, empty, errors\n- Descriptive names: "should [expected] when [condition]"`,
    refactor: `- Maintain backward compatibility\n- ALL existing tests must pass\n- Explain reasoning before implementation\n- Incremental changes, verify after each`,
    docs: `- Include practical code examples\n- Document all parameters and return types\n- Note edge cases and limitations\n- Keep it concise but complete`,
    unknown: `- TypeScript strict mode\n- Follow existing patterns\n- Write tests\n- Ask clarifying questions if unclear`,
  };

  const userAnswers = session.messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n');

  return `# ${roleMap[session.topic] || 'Software Engineer'}

${context.length > 0 ? `## Project Context\n${context.join('\n\n')}\n` : ''}## Task
${userAnswers}

## Constraints
${constraintsMap[session.topic] || constraintsMap.unknown}

## Before You Start
1. Share your plan before writing any code
2. Break complex tasks into smaller steps
3. Ask clarifying questions if anything is unclear

## Expected Output
Production-ready code with tests, error handling, and TypeScript types.`;
}

function generatePlan(session: ChatSession): string {
  const answers = session.messages
    .filter((m) => m.role === 'user' && m.content.length > 5)
    .map((m) => `- ${m.content}`)
    .join('\n');

  return `# Plan: ${session.topic.charAt(0).toUpperCase() + session.topic.slice(1)}

## Understanding
${answers}

## Steps
1. Review requirements and ask clarifying questions
2. Analyze existing code for patterns and conventions
3. Implement changes incrementally
4. Write/update tests
5. Verify against constraints

## Questions to Consider
- [ ] Does this affect existing data or users?
- [ ] Are there performance implications?
- [ ] Should this be behind a feature flag?
- [ ] What is the rollback plan?

---
Generated by Vibe Coding CLI — vibe chat`;
}

export async function chatCommand(arg?: string | string[]): Promise<void> {
  console.log();
  console.log(c.cyan('╔' + '═'.repeat(54) + '╗'));
  console.log(c.cyan('║') + '  ' + c.bold('Vibe Chat — AI Planning Assistant').padEnd(52) + c.cyan('║'));
  console.log(c.cyan('╚' + '═'.repeat(54) + '╝'));
  console.log();

  const interactive = isInteractive();
  let initialInput = '';

  // Parse arg (string from Commander.js positional, array fallback)
  if (typeof arg === 'string' && arg.length > 0) {
    initialInput = arg;
  } else if (Array.isArray(arg) && arg.length > 0) {
    initialInput = arg.join(' ');
  }

  if (interactive && !initialInput) {
    info('Describe what you want to build. I will ask clarifying questions');
    info('and generate an optimized prompt for your AI agent.');
    console.log();

    const prompts = await getPrompts();
    initialInput = await prompts.input({
      message: 'What do you want to do?',
      validate: (val) => val.length > 0 || 'Please describe your task',
    });
  }

  if (!initialInput) {
    console.error(c.error('Error: No task provided. Usage: vibe chat "create a dashboard"'));
    process.exit(1);
  }

  const topic = detectTopic(initialInput);
  const session: ChatSession = {
    topic,
    messages: [{ role: 'user', content: initialInput }],
  };

  section(`Detected: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`);

  // Ask clarifying questions (interactive only)
  const questions = clarifyingQuestions[topic] || clarifyingQuestions.unknown;

  if (interactive) {
    const selectedQuestions = questions.slice(0, 3);
    const prompts = await getPrompts();
    for (const question of selectedQuestions) {
      const answer = await prompts.input({ message: question });
      if (answer.trim()) {
        session.messages.push({ role: 'user', content: answer });
      }
    }
  } else {
    // Non-interactive: use questions as prompts to guide the AI
    for (const question of questions.slice(0, 3)) {
      session.messages.push({ role: 'user', content: `[Auto-generated] ${question}` });
    }
  }

  divider();

  // Show collected context
  section('Collected Context');
  for (const msg of session.messages) {
    if (msg.role === 'user') {
      console.log(`  ${c.dim('•')} ${msg.content}`);
    }
  }

  // Scan project for additional context
  const cwd = process.cwd();
  let scan: ProjectScan;
  try {
    scan = scanProject(cwd);
    info(`Project: ${scan.framework} + ${scan.language}`);
  } catch {
    scan = scanProject(cwd); // fallback
  }

  // Generate plan and optimized prompt
  section('Generating outputs');

  const plan = generatePlan(session);
  const optimizedPrompt = generateOptimizedPrompt(session, scan);

  success('Plan generated');
  success('Optimized prompt ready');

  divider();

  // Show the optimized prompt
  console.log();
  console.log(c.cyan('── Optimized Prompt ──'));
  console.log();
  console.log(optimizedPrompt);
  console.log();

  divider();

  // Non-interactive: auto-save
  if (!interactive) {
    fs.writeFileSync(path.join(cwd, 'vibe-plan.md'), plan);
    success('Saved to vibe-plan.md');
    fs.writeFileSync(path.join(cwd, 'vibe-prompt.md'), optimizedPrompt);
    success('Saved to vibe-prompt.md');
    console.log();
    console.log(c.mint('  ✔ ') + 'Done! Check vibe-plan.md and vibe-prompt.md');
    console.log();
    return;
  }

  // Interactive: ask before saving
  const prompts = await getPrompts();
  const savePlan = await prompts.confirm({
    message: 'Save plan to vibe-plan.md?',
    default: true,
  });

  if (savePlan) {
    fs.writeFileSync(path.join(cwd, 'vibe-plan.md'), plan);
    success('Saved to vibe-plan.md');
  }

  const savePrompt = await prompts.confirm({
    message: 'Save optimized prompt to vibe-prompt.md?',
    default: true,
  });

  if (savePrompt) {
    fs.writeFileSync(path.join(cwd, 'vibe-prompt.md'), optimizedPrompt);
    success('Saved to vibe-prompt.md');
  }

  // Try clipboard
  try {
    const { execSync } = await import('child_process');
    const platform = process.platform;
    const cmd = platform === 'darwin' ? 'pbcopy' : platform === 'win32' ? 'clip' : 'xclip -selection clipboard';
    execSync(cmd, { input: optimizedPrompt });
    success('Copied optimized prompt to clipboard!');
  } catch {
    info('Clipboard copy not available — prompt is saved to vibe-prompt.md');
  }

  console.log();
  console.log(c.mint('  ✔ ') + 'Ready! Paste the optimized prompt into your AI agent (Cursor, ChatGPT, Claude, etc.)');
  console.log();
}
