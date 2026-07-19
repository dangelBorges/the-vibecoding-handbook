import { test } from 'node:test';
import assert from 'node:assert';
import {
  detectTopic,
  generatePlan,
  generateOptimizedPrompt,
  getAgentsMdContext,
} from '../../utils/chatPlanner';
import type { DetectedStack } from '../../utils/fileReader';

const stack: DetectedStack = {
  framework: 'Next.js',
  language: 'TypeScript',
  hasDatabase: true,
  hasAuth: true,
  hasTests: true,
};

test('detectTopic', async (t) => {
  await t.test('detects feature intent', () => {
    assert.strictEqual(detectTopic('create a dashboard'), 'feature');
    assert.strictEqual(detectTopic('add login form'), 'feature');
  });

  await t.test('detects bugfix intent', () => {
    assert.strictEqual(detectTopic('fix the crash on login'), 'bugfix');
    assert.strictEqual(detectTopic('error when saving'), 'bugfix');
  });

  await t.test('detects refactor intent', () => {
    assert.strictEqual(detectTopic('refactor auth hook'), 'refactor');
  });

  await t.test('detects test intent', () => {
    assert.strictEqual(detectTopic('write tests for the API'), 'test');
  });

  await t.test('detects docs intent', () => {
    assert.strictEqual(detectTopic('document the components'), 'docs');
  });

  await t.test('falls back to unknown', () => {
    assert.strictEqual(detectTopic('something else'), 'unknown');
  });
});

test('getAgentsMdContext', async (t) => {
  await t.test('extracts tech stack and coding standards', () => {
    const content = `## Tech Stack\nReact + TS\n## Coding Standards\nStrict mode\n## Other\nIgnored`;
    const context = getAgentsMdContext(content);
    assert.match(context, /Tech Stack/);
    assert.match(context, /Coding Standards/);
    assert.doesNotMatch(context, /Other/);
  });

  await t.test('returns empty string when no relevant sections', () => {
    assert.strictEqual(getAgentsMdContext('## Overview\nNothing'), '');
  });
});

test('generatePlan', async (t) => {
  await t.test('includes topic and user answers', () => {
    const plan = generatePlan({
      topic: 'feature',
      messages: [
        { role: 'user', content: 'create dashboard' },
        { role: 'user', content: 'admin users' },
      ],
    });
    assert.match(plan, /Plan: Feature/);
    assert.match(plan, /create dashboard/);
    assert.match(plan, /admin users/);
  });
});

test('generateOptimizedPrompt', async (t) => {
  await t.test('includes role, task, constraints and context', () => {
    const prompt = generateOptimizedPrompt(
      {
        topic: 'feature',
        messages: [{ role: 'user', content: 'build dashboard' }],
      },
      stack,
      '## Tech Stack\nNext.js + TypeScript'
    );
    assert.match(prompt, /Senior Developer/);
    assert.match(prompt, /build dashboard/);
    assert.match(prompt, /Next.js/);
    assert.match(prompt, /TypeScript strict mode/);
    assert.match(prompt, /Project Context/);
  });

  await t.test('omits context when empty', () => {
    const prompt = generateOptimizedPrompt(
      {
        topic: 'bugfix',
        messages: [{ role: 'user', content: 'fix crash' }],
      },
      stack,
      ''
    );
    assert.match(prompt, /Debug Assistant/);
    assert.match(prompt, /fix crash/);
    assert.doesNotMatch(prompt, /Project Context/);
  });
});

