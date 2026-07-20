import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { findVibeCli, runVibe, isVibeCliAvailable } from '../../utils/cliRunner';
import * as path from 'path';
import * as fs from 'fs';

describe('cliRunner', () => {
  const monorepoCli = path.join(process.cwd(), '..', 'cli', 'dist', 'index.js');
  const monorepoRoot = path.join(process.cwd(), '..');

  it('findVibeCli returns a non-empty string for a workspace in the monorepo', () => {
    const result = findVibeCli(path.join(__dirname, 'test-workspace'));
    assert.ok(typeof result === 'string' && result.length > 0, 'findVibeCli should return a CLI path');
    assert.ok(fs.existsSync(result) || result === 'vibe', 'CLI path should exist or be a global command');
  });

  it('isVibeCliAvailable returns true for a workspace in the monorepo', () => {
    const result = isVibeCliAvailable(path.join(__dirname, 'test-workspace'));
    assert.strictEqual(result, true);
  });

  it('runVibe executes the monorepo CLI with --help and exits 0', async () => {
    assert.ok(fs.existsSync(monorepoCli), 'Monorepo CLI should be built');
    const result = await runVibe(monorepoCli, ['--help'], monorepoRoot);
    assert.strictEqual(result.exitCode, 0);
    assert.ok(result.stdout.includes('Usage'), 'CLI help should include usage text');
  });

  it('runVibe returns non-zero exit code for an invalid command', async () => {
    assert.ok(fs.existsSync(monorepoCli), 'Monorepo CLI should be built');
    const result = await runVibe(monorepoCli, ['invalid-command'], monorepoRoot);
    assert.notStrictEqual(result.exitCode, 0);
  });
});
