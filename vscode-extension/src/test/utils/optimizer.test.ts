import { describe, it } from 'node:test';
import assert from 'node:assert';
import { optimizePrompt } from '../../utils/optimizer';

describe('optimizePrompt', () => {
  it('detects feature intent for creation prompts', () => {
    const result = optimizePrompt('create a login page with Google auth');
    assert.strictEqual(result.intent, 'feature');
    assert.ok(result.confidence > 0);
    assert.ok(result.optimized.includes('Senior Full-Stack Developer'));
  });

  it('detects bugfix intent for error prompts', () => {
    const result = optimizePrompt('fix the crash when clicking submit');
    assert.strictEqual(result.intent, 'bugfix');
    assert.ok(result.optimized.includes('Expert Debug Assistant'));
  });

  it('includes project context when provided', () => {
    const context = 'Tech Stack: Next.js + TypeScript';
    const result = optimizePrompt('add a dashboard widget', context);
    assert.ok(result.optimized.includes(context));
  });

  it('returns a list of improvements', () => {
    const result = optimizePrompt('build user profile page');
    assert.ok(Array.isArray(result.improvements));
    assert.ok(result.improvements.length > 0);
  });

  it('preserves the original prompt in the result', () => {
    const original = 'create a navigation component';
    const result = optimizePrompt(original);
    assert.strictEqual(result.original, original);
    assert.ok(result.optimized.includes(original));
  });
});
