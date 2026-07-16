export interface ReviewIssue {
  file: string;
  line?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

function checkConsoleLog(file: string, lines: string[], ideRules: string, agentsMd: string): ReviewIssue[] {
  const noConsoleRule = ideRules.toLowerCase().includes('console.log') || agentsMd.toLowerCase().includes('console.log') || ideRules.length > 0;
  if (!noConsoleRule) return [];
  const issues: ReviewIssue[] = [];
  lines.forEach((line, idx) => {
    if (line.includes('console.log') && !line.trim().startsWith('//') && !line.includes('eslint-disable') && !line.includes('logger') && !line.includes('process.stdout')) {
      issues.push({ file, line: idx + 1, severity: 'warning', message: 'console.log found — remove before production', rule: 'No console.log' });
    }
  });
  return issues;
}

function checkAnyTypes(file: string, lines: string[], ideRules: string, agentsMd: string): ReviewIssue[] {
  if (!ideRules.includes('any') && !agentsMd.includes('any')) return [];
  const issues: ReviewIssue[] = [];
  lines.forEach((line, idx) => {
    if (line.includes(': any') || line.includes('as any')) {
      issues.push({ file, line: idx + 1, severity: 'warning', message: '`any` type detected — use specific type', rule: 'No any types' });
    }
  });
  return issues;
}

function checkHardcodedSecrets(file: string, lines: string[]): ReviewIssue[] {
  const secretPatterns = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'api_key'];
  const issues: ReviewIssue[] = [];
  lines.forEach((line, idx) => {
    for (const pattern of secretPatterns) {
      if (line.includes(pattern) && !line.includes('process.env') && !line.includes('import')) {
        issues.push({ file, line: idx + 1, severity: 'error', message: `Possible hardcoded secret: "${pattern}" — use environment variables`, rule: 'No hardcoded secrets' });
      }
    }
  });
  return issues;
}

function checkThenChains(file: string, lines: string[]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  lines.forEach((line, idx) => {
    if (line.includes('.then(') && line.includes('.catch(')) {
      issues.push({ file, line: idx + 1, severity: 'info', message: 'Consider using async/await instead of .then().catch()', rule: 'Prefer async/await' });
    }
  });
  return issues;
}

function checkFunctionLength(file: string, lines: string[]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  let funcStart = -1;
  lines.forEach((line, idx) => {
    if (line.match(/^(export\s+)?(async\s+)?function\s+\w+\s*\(/)) {
      funcStart = idx;
    }
    if (funcStart >= 0 && line === '}') {
      const length = idx - funcStart;
      if (length > 50) {
        issues.push({ file, line: funcStart + 1, severity: 'info', message: `Function is ${length} lines — consider extracting (${length - 50} over limit)`, rule: 'Max 50 lines per function' });
      }
      funcStart = -1;
    }
  });
  return issues;
}

export function scanFileContent(file: string, lines: string[], ideRules: string, agentsMd: string): ReviewIssue[] {
  return [
    ...checkConsoleLog(file, lines, ideRules, agentsMd),
    ...checkAnyTypes(file, lines, ideRules, agentsMd),
    ...checkHardcodedSecrets(file, lines),
    ...checkThenChains(file, lines),
    ...checkFunctionLength(file, lines),
  ];
}
