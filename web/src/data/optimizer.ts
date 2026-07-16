// ============================================================
// PROMPT OPTIMIZER ENGINE
// ============================================================

export type IntentType = 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs' | 'review' | 'unknown';
export type PatternType = 'rice' | 'star' | 'few-shot' | 'chain-of-thought' | 'structured';

export interface DetectedIntent {
  type: IntentType;
  confidence: number;
  keywords: string[];
}

export type ImprovementKey =
  | 'structuredSections'
  | 'roleContext'
  | 'testingRequirements'
  | 'typescriptConstraints'
  | 'edgeCaseHandling'
  | 'preImplementationPlanning'
  | 'expandedContext'
  | 'patternApplied'
  | 'optimizedForAI';

export interface ImprovementItem {
  key: ImprovementKey;
  data?: Record<string, string | number>;
}

export interface OptimizedPrompt {
  original: string;
  optimized: string;
  intent: DetectedIntent;
  pattern: PatternType;
  sections: { title: string; content: string }[];
  improvements: ImprovementItem[];
  tokenEstimate: number;
}

// ============================================================
// INTENT DETECTION
// ============================================================

const intentPatterns: Record<IntentType, string[]> = {
  feature: [
    'crea', 'create', 'haz', 'make', 'build', 'implement', 'add', 'agrega', 'añade',
    'new', 'nuevo', 'nueva', 'feature', 'funcionalidad', 'page', 'página', 'component',
    'form', 'dashboard', 'integration', 'endpoint', 'api', 'route',
  ],
  bugfix: [
    'fix', 'arregla', 'corrige', 'repair', 'bug', 'error', 'issue', 'problema',
    'broken', 'roto', 'not working', 'no funciona', 'falla', 'crash', 'exception',
    ' TypeError', ' ReferenceError', 'undefined', 'null', 'cannot', 'failed',
  ],
  refactor: [
    'refactor', 'reorganiza', 'simplify', 'simplifica', 'clean', 'limpia', 'mejora',
    'improve', 'optimize', 'optimiza', 'extract', 'extrae', 'move', 'mueve',
    'rename', 'renombra', 'split', 'divide', 'consolidate', 'duplicate', 'duplicado',
  ],
  test: [
    'test', 'prueba', 'spec', 'unit test', 'integration test', 'e2e', 'coverage',
    'jest', 'vitest', 'cypress', 'playwright', 'mock', 'stub', 'assert',
    'testear', 'testing', 'validate', 'valida', 'verify', 'verifica',
  ],
  docs: [
    'document', 'documenta', 'readme', 'doc', 'comment', 'comenta', 'explain', 'explica',
    'description', 'describe', 'guide', 'tutorial', 'example', 'ejemplo', 'usage',
  ],
  review: [
    'review', 'revisa', 'check', 'verifica', 'audit', 'evalua', 'evaluate',
    'analyze', 'analiza', 'inspect', 'quality', 'code review',
  ],
  unknown: [],
};

export function detectIntent(rawPrompt: string): DetectedIntent {
  const lower = rawPrompt.toLowerCase();
  const scores: Record<IntentType, number> = {
    feature: 0,
    bugfix: 0,
    refactor: 0,
    test: 0,
    docs: 0,
    review: 0,
    unknown: 0,
  };
  const matchedKeywords: Record<IntentType, string[]> = {
    feature: [],
    bugfix: [],
    refactor: [],
    test: [],
    docs: [],
    review: [],
    unknown: [],
  };

  for (const [intent, patterns] of Object.entries(intentPatterns) as [IntentType, string[]][]) {
    for (const pattern of patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        scores[intent] += 1;
        if (!matchedKeywords[intent].includes(pattern)) {
          matchedKeywords[intent].push(pattern);
        }
      }
    }
  }

  // Check for question marks (likely bugfix or docs)
  if (rawPrompt.includes('?')) {
    scores.bugfix += 0.5;
    scores.docs += 0.5;
  }

  // Check for code blocks (likely refactor, test, or review)
  if (rawPrompt.includes('```')) {
    scores.refactor += 0.5;
    scores.test += 0.5;
    scores.review += 0.5;
  }

  // Find the highest scoring intent
  let bestIntent: IntentType = 'unknown';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores) as [IntentType, number][]) {
    if (intent !== 'unknown' && score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  const confidence = Math.min(bestScore / 3, 1); // Normalize to 0-1

  return {
    type: confidence > 0.2 ? bestIntent : 'unknown',
    confidence,
    keywords: matchedKeywords[bestIntent],
  };
}

// ============================================================
// PATTERN SELECTION
// ============================================================

function selectPattern(intent: IntentType, rawPrompt: string): PatternType {
  if (rawPrompt.length < 50) return 'rice'; // Short prompts need structure
  if (intent === 'bugfix') return 'star';
  if (intent === 'refactor') return 'chain-of-thought';
  if (intent === 'test') return 'few-shot';
  if (intent === 'docs') return 'structured';
  if (intent === 'review') return 'chain-of-thought';
  return 'rice';
}

// ============================================================
// PATTERN GENERATORS
// ============================================================

function generateRicePrompt(raw: string, intent: IntentType, context?: string): string {
  const role = getRoleForIntent(intent);
  const constraints = getConstraints(intent);
  const expectations = getExpectations(intent);

  const prompt = `# ${role}

## Context
${context || 'You are working on a modern web application.'}

## Instruction
${raw}

## Constraints
${constraints}

## Expected Output
${expectations}

## Before you start
1. Ask clarifying questions if anything is unclear
2. Share your plan before writing code
3. Break complex tasks into smaller steps`;

  return prompt;
}

function generateStarPrompt(raw: string, _intent: IntentType, context?: string): string {
  return `# Expert Debug Assistant

## Context
${context || 'You are debugging a web application.'}

## Situation
The user has described the following issue:
"${raw}"

## Task
Analyze the root cause and provide a fix.

## Action Required
1. Identify the likely root cause (not just symptoms)
2. Explain the problem in simple terms
3. Provide the minimal code fix
4. Suggest how to prevent this in the future

## Constraints
- Do NOT write code until you've explained the root cause
- Keep changes minimal — fix the bug, don't refactor
- Add a test case that would have caught this bug
- Verify the fix doesn't break existing functionality

${context || ''}`;
}

function generateChainOfThoughtPrompt(raw: string, intent: IntentType, context?: string): string {
  return `# ${getRoleForIntent(intent)}

## Context
${context || 'You are improving a codebase.'}

## Task
${raw}

## Thinking Process
Before making any changes, walk through this reasoning:
1. What is the current state of the code?
2. What are the problems or limitations?
3. What are 2-3 possible approaches?
4. Which approach is best and why?
5. What are the risks?
6. Plan the implementation steps

## Constraints
- Share your full reasoning BEFORE writing code
- Each change must be a separate step
- Explain WHY each change is needed
- Ensure backward compatibility
- Add/update tests for modified code

${context || ''}`;
}

function generateFewShotPrompt(raw: string, _intent: IntentType, context?: string): string {
  return `# Test Engineer

## Context
${context || 'You are writing tests for a modern web application.'}

## Task
Write comprehensive tests for: ${raw}

## Examples of our testing style

### Example 1: Testing a utility function
\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should return correct sum for valid inputs', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should throw error for negative values', () => {
    expect(() => calculateTotal([-1])).toThrow('Negative values not allowed');
  });
});
\`\`\`

### Example 2: Testing a React component
\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('should display user name and email', () => {
    render(<UserCard name="John" email="john@example.com" />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show placeholder when no user', () => {
    render(<UserCard name="" email="" />);
    expect(screen.getByText('No user data')).toBeInTheDocument();
  });
});
\`\`\`

## Requirements
- Follow the Arrange-Act-Assert pattern
- Descriptive test names: "should [expected] when [condition]"
- Test edge cases: null, undefined, empty, max values
- Mock external dependencies
- Minimum 80% coverage for the tested module

${context || ''}`;
}

function generateStructuredPrompt(raw: string, intent: IntentType, context?: string): string {
  return `# ${getRoleForIntent(intent)}

## Context
${context || 'You are documenting a codebase.'}

## Task
${raw}

## Output Format
Please provide:
1. **Overview** — What this does and why (2-3 sentences)
2. **Parameters** — Table with name, type, required, description
3. **Returns** — Return type and description
4. **Example** — Code example with expected output
5. **Edge Cases** — Known limitations
6. **Related** — Links to related modules

## Style Guide
- Clear, concise language
- Code examples in TypeScript
- Assume reader knows the stack but not this specific module
- Use JSDoc format for code documentation

${context || ''}`;
}

// ============================================================
// HELPERS
// ============================================================

function getRoleForIntent(intent: IntentType): string {
  const roles: Record<IntentType, string> = {
    feature: 'Senior Full-Stack Developer',
    bugfix: 'Expert Debug Assistant',
    refactor: 'Code Quality Engineer',
    test: 'Test Engineer',
    docs: 'Technical Writer',
    review: 'Senior Code Reviewer',
    unknown: 'Senior Software Engineer',
  };
  return roles[intent] || roles.unknown;
}

function getConstraints(intent: IntentType): string {
  const constraints: Record<IntentType, string> = {
    feature: `- Use TypeScript with strict mode
- Follow existing patterns in the codebase
- Write tests for all new functionality
- Handle edge cases (empty states, errors, loading)
- Add proper TypeScript types
- Ensure accessibility (ARIA labels, keyboard nav)
- Mobile-responsive design`,
    bugfix: `- Minimal changes — fix the bug only
- Add a regression test
- Verify no existing tests break
- Document the root cause`,
    refactor: `- Maintain backward compatibility
- All existing tests must pass
- Add tests for extracted functions
- No changes to external behavior`,
    test: `- Follow Arrange-Act-Assert pattern
- Mock external dependencies
- Test edge cases
- Descriptive test names`,
    docs: `- Include code examples
- Document parameters and return types
- Note edge cases and limitations
- Keep it concise`,
    review: `- Check for bugs, security, performance
- Verify against project patterns
- Suggest specific improvements
- Rate: Critical / Warning / Suggestion / Praise`,
    unknown: `- Use TypeScript with strict mode
- Follow existing patterns
- Write tests
- Handle edge cases`,
  };
  return constraints[intent] || constraints.unknown;
}

function getExpectations(intent: IntentType): string {
  const expectations: Record<IntentType, string> = {
    feature: 'Complete, production-ready implementation with tests, error handling, and TypeScript types.',
    bugfix: 'Root cause analysis + minimal fix + regression test.',
    refactor: 'Improved code structure with same functionality, all tests passing.',
    test: 'Comprehensive test suite covering happy paths, edge cases, and error scenarios.',
    docs: 'Clear documentation with examples that a new developer can understand.',
    review: 'Structured review with severity ratings and specific code suggestions.',
    unknown: 'Complete, well-structured solution following best practices.',
  };
  return expectations[intent] || expectations.unknown;
}

// ============================================================
// MAIN OPTIMIZER
// ============================================================

export function optimizePrompt(rawPrompt: string, context?: string): OptimizedPrompt {
  const intent = detectIntent(rawPrompt);
  const pattern = selectPattern(intent.type, rawPrompt);

  let optimized: string;
  switch (pattern) {
    case 'rice':
      optimized = generateRicePrompt(rawPrompt, intent.type, context);
      break;
    case 'star':
      optimized = generateStarPrompt(rawPrompt, intent.type, context);
      break;
    case 'chain-of-thought':
      optimized = generateChainOfThoughtPrompt(rawPrompt, intent.type, context);
      break;
    case 'few-shot':
      optimized = generateFewShotPrompt(rawPrompt, intent.type, context);
      break;
    case 'structured':
      optimized = generateStructuredPrompt(rawPrompt, intent.type, context);
      break;
    default:
      optimized = generateRicePrompt(rawPrompt, intent.type, context);
  }

  // Extract sections for display
  const sections = extractSections(optimized);

  // Calculate improvements
  const improvements = calculateImprovementItems(rawPrompt, optimized, intent.type, pattern);

  // Token estimate (rough: ~4 chars per token)
  const tokenEstimate = Math.round(optimized.length / 4);

  return {
    original: rawPrompt,
    optimized,
    intent,
    pattern,
    sections,
    improvements,
    tokenEstimate,
  };
}

function extractSections(markdown: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const lines = markdown.split('\n');
  let currentTitle = 'General';
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentContent.length > 0) {
        sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
      }
      currentTitle = line.replace('## ', '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
  }

  return sections;
}

function calculateImprovementItems(
  original: string,
  optimized: string,
  intent: IntentType,
  pattern: PatternType
): ImprovementItem[] {
  const improvements: ImprovementItem[] = [];

  // Structure improvements
  if (!original.includes('#') && optimized.includes('#')) {
    improvements.push({ key: 'structuredSections' });
  }

  // Context improvement
  if (
    !original.toLowerCase().includes('context') &&
    !original.toLowerCase().includes('you are')
  ) {
    improvements.push({ key: 'roleContext' });
  }

  // Constraints improvement
  if (
    !original.toLowerCase().includes('constraint') &&
    !original.toLowerCase().includes('test')
  ) {
    if (intent !== 'docs') {
      improvements.push({ key: 'testingRequirements' });
    }
  }

  // TypeScript mention
  if (
    !original.toLowerCase().includes('typescript') &&
    !original.toLowerCase().includes('type')
  ) {
    improvements.push({ key: 'typescriptConstraints' });
  }

  // Edge cases
  if (
    !original.toLowerCase().includes('edge') &&
    !original.toLowerCase().includes('error')
  ) {
    improvements.push({ key: 'edgeCaseHandling' });
  }

  // Pre-thinking
  if (
    !original.toLowerCase().includes('plan') &&
    !original.toLowerCase().includes('before')
  ) {
    improvements.push({ key: 'preImplementationPlanning' });
  }

  // Length improvement
  if (optimized.length > original.length * 2) {
    improvements.push({
      key: 'expandedContext',
      data: {
        originalLength: original.length,
        optimizedLength: optimized.length,
        percent: Math.round((optimized.length / original.length - 1) * 100),
      },
    });
  }

  // Always add these
  improvements.push({
    key: 'patternApplied',
    data: { pattern },
  });
  improvements.push({ key: 'optimizedForAI' });

  return improvements;
}

// ============================================================
// AGENTS.md PARSER (context enrichment)
// ============================================================

export function parseAgentsMd(content: string): string {
  // Extract key sections from AGENTS.md
  const sections: string[] = [];

  // Try to extract Tech Stack
  const techStackMatch = content.match(/## Tech Stack[\s\S]*?(?=## |$)/);
  if (techStackMatch) {
    sections.push('## Project Tech Stack\n' + techStackMatch[0].replace('## Tech Stack', '').trim());
  }

  // Try to extract Coding Standards
  const standardsMatch = content.match(/## Coding Standards[\s\S]*?(?=## |$)/);
  if (standardsMatch) {
    sections.push('## Coding Standards\n' + standardsMatch[0].replace('## Coding Standards', '').trim());
  }

  // Try to extract Architecture
  const archMatch = content.match(/## Architecture[\s\S]*?(?=## |$)/);
  if (archMatch) {
    sections.push('## Architecture\n' + archMatch[0].replace('## Architecture', '').trim());
  }

  // Try to extract Project Structure
  const structureMatch = content.match(/## Project Structure[\s\S]*?(?=## |$)/);
  if (structureMatch) {
    sections.push('## Project Structure\n' + structureMatch[0].replace('## Project Structure', '').trim());
  }

  if (sections.length === 0) {
    // Fallback: just use the first 2000 chars
    return content.slice(0, 2000);
  }

  return sections.join('\n\n');
}

export function extractContextFromAgentsMd(agentsMdContent: string): string {
  const parsed = parseAgentsMd(agentsMdContent);
  return `## Project Context (from AGENTS.md)\n\n${parsed}`;
}
