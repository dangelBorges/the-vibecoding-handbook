// Inline prompt optimizer for VS Code extension
// No external dependencies — pure TypeScript

type IntentType = 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs' | 'review' | 'unknown';

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  intent: IntentType;
  confidence: number;
  improvements: string[];
}

const intentKeywords: Record<IntentType, string[]> = {
  feature: ['crea', 'create', 'haz', 'make', 'build', 'implement', 'add', 'agrega', 'nuevo', 'feature', 'page', 'component', 'form', 'dashboard', 'endpoint'],
  bugfix: ['fix', 'arregla', 'corrige', 'bug', 'error', 'issue', 'problema', 'broken', 'not working', 'no funciona', 'falla', 'crash', 'exception'],
  refactor: ['refactor', 'reorganiza', 'simplify', 'clean', 'mejora', 'improve', 'optimize', 'extract', 'rename', 'split', 'duplicate'],
  test: ['test', 'prueba', 'spec', 'unit test', 'integration', 'coverage', 'mock', 'assert', 'testing', 'jest', 'vitest'],
  docs: ['document', 'documenta', 'readme', 'comment', 'explain', 'explica', 'description', 'guide', 'tutorial'],
  review: ['review', 'revisa', 'check', 'audit', 'analyze', 'inspect', 'quality', 'code review'],
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
  if (raw.includes('```')) { scores.refactor += 0.5; scores.test += 0.5; scores.review += 0.5; }

  let best: IntentType = 'unknown';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores) as [IntentType, number][]) {
    if (intent !== 'unknown' && score > bestScore) { bestScore = score; best = intent; }
  }

  return { type: bestScore > 0.2 ? best : 'unknown', confidence: Math.min(bestScore / 3, 1) };
}

function getConstraints(intent: IntentType): string {
  switch (intent) {
    case 'feature':
      return '- Use TypeScript strict mode\n- Follow existing patterns\n- Write tests\n- Handle edge cases\n- Ensure accessibility';
    case 'bugfix':
      return '- Minimal changes only\n- Add regression test\n- Explain root cause first';
    case 'test':
      return '- Arrange-Act-Assert pattern\n- Mock external deps\n- Test edge cases\n- Descriptive names';
    case 'refactor':
      return '- Maintain backward compatibility\n- All tests must pass\n- Explain reasoning first';
    case 'docs':
      return '- Include code examples\n- Document params and returns\n- Note edge cases';
    default:
      return '- Use TypeScript strict mode\n- Follow existing patterns\n- Write tests';
  }
}

export function optimizePrompt(rawPrompt: string, projectContext?: string): OptimizedPrompt {
  const { type: intent, confidence } = detectIntent(rawPrompt);

  const constraints = getConstraints(intent);
  const role = intent === 'feature' ? 'Senior Full-Stack Developer'
    : intent === 'bugfix' ? 'Expert Debug Assistant'
    : intent === 'test' ? 'Test Engineer'
    : intent === 'refactor' ? 'Code Quality Engineer'
    : intent === 'docs' ? 'Technical Writer'
    : 'Senior Software Engineer';

  const contextSection = projectContext
    ? `\n## Context\n${projectContext.slice(0, 1000)}\n`
    : '';

  const optimized = `# ${role}${contextSection}
## Task
${rawPrompt}

## Constraints
${constraints}

## Before you start
1. Ask clarifying questions if anything is unclear
2. Share your plan before writing code
3. Break complex tasks into smaller steps

## Expected Output
Production-ready code with tests, error handling, and TypeScript types.`;

  const improvements: string[] = [];
  if (!rawPrompt.includes('#')) improvements.push('Added structured sections (Role, Context, Constraints)');
  if (!rawPrompt.toLowerCase().includes('context')) improvements.push('Added role definition and context');
  if (!rawPrompt.toLowerCase().includes('test') && intent !== 'docs') improvements.push('Added testing requirements');
  if (!rawPrompt.toLowerCase().includes('typescript')) improvements.push('Added TypeScript constraints');
  improvements.push(`Applied ${intent} pattern (${Math.round(confidence * 100)}% confidence)`);
  improvements.push('Added pre-implementation planning step');

  return { original: rawPrompt, optimized, intent, confidence, improvements };
}
