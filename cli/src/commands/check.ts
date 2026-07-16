import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import ora from 'ora';
import { detectStack } from '../utils/detect.js';
import { printSuccess, printError, printWarning, printInfo, printDivider } from '../utils/prompts.js';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export async function checkCommand(options: { strict?: boolean } = {}): Promise<void> {
  console.log(`\n${pc.cyan('🔍 Vibe Coding Project Check')}\n`);

  if (options.strict) {
    console.log(pc.yellow('⚠ Strict mode enabled — warnings count as failures\n'));
  }

  const cwd = process.cwd();
  const spinner = ora('Analyzing project...').start();
  const results: CheckResult[] = [];

  // Check 1: AGENTS.md exists
  const agentsExists = fs.existsSync(path.join(cwd, 'AGENTS.md'));
  results.push({
    name: 'AGENTS.md',
    status: agentsExists ? 'pass' : 'fail',
    message: agentsExists ? 'Found and readable' : 'Missing — run "vibe init" to create',
  });

  // Check 2: .iderules exists
  const ideRulesExists = fs.existsSync(path.join(cwd, '.iderules'));
  results.push({
    name: '.iderules',
    status: ideRulesExists ? 'pass' : 'warn',
    message: ideRulesExists ? 'Found' : 'Missing — IDE rules not configured',
  });

  // Check 3: .vibecoding directory
  const vibecodingExists = fs.existsSync(path.join(cwd, '.vibecoding'));
  results.push({
    name: '.vibecoding/',
    status: vibecodingExists ? 'pass' : 'warn',
    message: vibecodingExists ? 'Directory exists' : 'Missing — policies not set up',
  });

  // Check 4: Git repository
  const gitExists = fs.existsSync(path.join(cwd, '.git'));
  results.push({
    name: 'Git Repository',
    status: gitExists ? 'pass' : 'warn',
    message: gitExists ? 'Initialized' : 'Not initialized — version control recommended',
  });

  // Check 5: .gitignore
  const gitignoreExists = fs.existsSync(path.join(cwd, '.gitignore'));
  results.push({
    name: '.gitignore',
    status: gitignoreExists ? 'pass' : 'fail',
    message: gitignoreExists ? 'Found' : 'Missing — may commit secrets',
  });

  if (gitignoreExists) {
    const gitignore = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf-8');
    const hasEnv = gitignore.includes('.env') || gitignore.includes('.env.local');
    results.push({
      name: '.env in .gitignore',
      status: hasEnv ? 'pass' : 'fail',
      message: hasEnv ? 'Environment files ignored' : '.env files may be committed!',
    });
  }

  // Check 6: Stack detection
  const stack = detectStack(cwd);
  results.push({
    name: 'Framework Detected',
    status: stack.framework !== 'unknown' ? 'pass' : 'warn',
    message: stack.framework !== 'unknown' ? stack.framework : 'Could not detect framework',
  });

  // Check 7: Package.json scripts
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const hasTestScript = pkg.scripts?.test;
    const hasLintScript = pkg.scripts?.lint;
    const hasTypecheck = pkg.scripts?.typecheck || pkg.scripts?.['type-check'];

    results.push({
      name: 'Test Script',
      status: hasTestScript ? 'pass' : 'warn',
      message: hasTestScript ? 'Configured' : 'No test script in package.json',
    });

    results.push({
      name: 'Lint Script',
      status: hasLintScript ? 'pass' : 'warn',
      message: hasLintScript ? 'Configured' : 'No lint script in package.json',
    });

    results.push({
      name: 'Type Check',
      status: hasTypecheck ? 'pass' : 'warn',
      message: hasTypecheck ? 'Configured' : 'No typecheck script in package.json',
    });
  }

  // Check 8: No secrets in code (basic check)
  const suspiciousPatterns = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN'];
  let hasSuspiciousFiles = false;
  const checkFiles = ['.env.example', 'README.md', 'src/config.ts', 'src/lib/config.ts'];
  for (const file of checkFiles) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of suspiciousPatterns) {
        if (content.includes(pattern) && !content.includes('process.env')) {
          hasSuspiciousFiles = true;
          break;
        }
      }
    }
  }
  results.push({
    name: 'Secret Exposure Check',
    status: !hasSuspiciousFiles ? 'pass' : 'warn',
    message: !hasSuspiciousFiles ? 'No obvious secrets found' : 'Potential hardcoded secrets detected',
  });

  spinner.stop();

  // Print results
  printDivider();
  console.log(`\n${pc.bold('Check Results:')}\n`);

  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  for (const result of results) {
    const icon = result.status === 'pass' ? pc.green('✔')
      : result.status === 'fail' ? pc.red('✖')
      : pc.yellow('⚠');
    const name = result.status === 'pass' ? pc.green(result.name)
      : result.status === 'fail' ? pc.red(result.name)
      : pc.yellow(result.name);

    console.log(`  ${icon} ${name}`);
    console.log(`    ${pc.dim(result.message)}`);

    if (result.status === 'pass') passCount++;
    if (result.status === 'fail') failCount++;
    if (result.status === 'warn') warnCount++;
  }

  printDivider();

  const total = results.length;
  const score = Math.round((passCount / total) * 100);

  console.log(`\n${pc.bold('Score:')} ${score >= 80 ? pc.green(`${score}%`) : score >= 50 ? pc.yellow(`${score}%`) : pc.red(`${score}%`)}`);
  console.log(`  ${pc.green(`${passCount} passed`)} · ${pc.yellow(`${warnCount} warnings`)} · ${pc.red(`${failCount} failed`)}\n`);

  if (failCount > 0 || (options.strict && warnCount > 0)) {
    if (options.strict && failCount === 0) {
      console.log(pc.yellow('Strict mode: failing due to warnings.\n'));
    } else {
      console.log(pc.yellow('Run "vibe init" to fix missing files.\n'));
    }
    process.exit(1);
  }
}
