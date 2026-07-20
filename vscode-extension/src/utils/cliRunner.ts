import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Locates the @vibecoding/cli binary for a workspace.
 * Tries, in order:
 * 1. workspace/node_modules/.bin/vibe
 * 2. workspace/node_modules/@vibecoding/cli/bin/vibe.js
 * 3. workspace/node_modules/@vibecoding/cli/dist/index.js
 * 4. global "vibe" on PATH
 * 5. local monorepo CLI during development
 * Returns null if no CLI is found.
 */
export function findVibeCli(workspacePath: string): string | null {
  const candidates = [
    path.join(workspacePath, 'node_modules', '.bin', 'vibe'),
    path.join(workspacePath, 'node_modules', '@vibecoding', 'cli', 'bin', 'vibe.js'),
    path.join(workspacePath, 'node_modules', '@vibecoding', 'cli', 'dist', 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  // Global "vibe" on PATH
  try {
    const check = process.platform === 'win32' ? 'where vibe' : 'which vibe';
    cp.execSync(check, { stdio: 'ignore' });
    return 'vibe';
  } catch {
    // ignore
  }

  // Local monorepo fallback during development
  const monorepoPath = path.join(__dirname, '..', '..', '..', 'cli', 'dist', 'index.js');
  if (fs.existsSync(monorepoPath)) return monorepoPath;

  return null;
}

/**
 * Spawns the CLI with the given arguments and returns stdout/stderr/exitCode.
 */
export function runVibe(
  cliPath: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = process.env
): Promise<CliResult> {
  const isJsFile = cliPath.endsWith('.js');
  const command = isJsFile ? process.execPath : cliPath;
  const spawnArgs = isJsFile ? [cliPath, ...args] : args;

  return new Promise((resolve, reject) => {
    const proc = cp.spawn(command, spawnArgs, {
      cwd,
      env: { ...process.env, ...env },
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', reject);
    proc.on('close', (exitCode) => {
      resolve({ stdout, stderr, exitCode: exitCode ?? 1 });
    });
  });
}

export function isVibeCliAvailable(workspacePath: string): boolean {
  return findVibeCli(workspacePath) !== null;
}
