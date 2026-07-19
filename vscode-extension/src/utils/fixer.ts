export const FIX_SUGGESTIONS: Record<string, string> = {
  'No any types': 'replace `: any` with a specific type, or `unknown` + type narrowing',
  'No hardcoded secrets': 'move the value to an environment variable and read it via process.env',
  'Prefer async/await': 'rewrite the .then().catch() chain as async/await with try/catch',
  'Max 50 lines per function': 'extract logical blocks into smaller, named helper functions',
};

const STANDALONE_CONSOLE_LOG = /^console\.log\(.*\);?$/;

export interface FixResult {
  lines: string[];
  fixed: number[];
  skipped: number[];
}

export function removeConsoleLogStatements(lines: string[], issueLines: number[]): FixResult {
  const removable = new Set(
    issueLines.filter((lineNo) => STANDALONE_CONSOLE_LOG.test((lines[lineNo - 1] ?? '').trim()))
  );
  const fixed = [...removable].sort((a, b) => a - b);
  const skipped = issueLines.filter((lineNo) => !removable.has(lineNo));
  const nextLines = lines.filter((_, idx) => !removable.has(idx + 1));
  return { lines: nextLines, fixed, skipped };
}
