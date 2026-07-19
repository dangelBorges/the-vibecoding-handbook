import { describe, it } from 'node:test';
import assert from 'node:assert';
import { scanFileContent } from '../../utils/reviewScanner';

describe('scanFileContent', () => {
  it('detects console.log statements', () => {
    const issues = scanFileContent('test.ts', ["console.log('debug');"], 'No console.log', '');
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].rule, 'No console.log');
    assert.strictEqual(issues[0].severity, 'warning');
  });

  it('detects any types when policy mentions any', () => {
    const issues = scanFileContent('test.ts', ['const x: any = 1;'], 'Strict TypeScript, no any', '');
    assert.ok(issues.some((i) => i.rule === 'No any types'));
  });

  it('detects hardcoded secrets', () => {
    const issues = scanFileContent('test.ts', ['const API_KEY = "secret";'], '', '');
    assert.ok(issues.some((i) => i.rule === 'No hardcoded secrets'));
  });

  it('flags .then().catch() chains', () => {
    const issues = scanFileContent('test.ts', ['fetch().then().catch();'], '', '');
    assert.ok(issues.some((i) => i.rule === 'Prefer async/await'));
  });

  it('flags functions longer than 50 lines', () => {
    const lines: string[] = ['function longFunction() {'];
    for (let i = 0; i < 55; i++) lines.push('  doSomething();');
    lines.push('}');
    const issues = scanFileContent('test.ts', lines, '', '');
    assert.ok(issues.some((i) => i.rule === 'Max 50 lines per function'));
  });

  it('ignores console.log when no rule is provided', () => {
    const issues = scanFileContent('test.ts', ["console.log('debug');"], '', '');
    assert.strictEqual(issues.length, 0);
  });
});

