import { test } from 'node:test';
import assert from 'node:assert';
import {
  defaultPromptFileName,
  formatPromptFileContent,
  getPrompt,
  getPromptsByCategory,
  getTemplate,
  listPromptCategories,
  listTemplates,
  TEMPLATES,
} from '../../utils/syncLibrary';

test('listTemplates', async (t) => {
  await t.test('returns all template ids', () => {
    const templates = listTemplates();
    assert.strictEqual(templates.length, Object.keys(TEMPLATES).length);
    assert.ok(templates.some((t) => t.id === 'next-saas'));
  });
});

test('getTemplate', async (t) => {
  await t.test('returns template with AGENTS.md and .iderules', () => {
    const template = getTemplate('react-dashboard');
    assert.ok(template);
    assert.ok(template.files['AGENTS.md']);
    assert.ok(template.files['.iderules']);
  });

  await t.test('returns undefined for unknown template', () => {
    assert.strictEqual(getTemplate('unknown'), undefined);
  });
});

test('listPromptCategories', async (t) => {
  await t.test('returns formatted labels', () => {
    const categories = listPromptCategories();
    assert.ok(categories.length > 0);
    assert.ok(categories.some((c) => c.label === 'Component Patterns'));
  });
});

test('getPromptsByCategory', async (t) => {
  await t.test('returns prompts for a known category', () => {
    const prompts = getPromptsByCategory('auth-patterns');
    assert.ok(prompts.length > 0);
  });

  await t.test('returns empty array for unknown category', () => {
    assert.deepStrictEqual(getPromptsByCategory('unknown'), []);
  });
});

test('getPrompt', async (t) => {
  await t.test('returns the requested prompt', () => {
    const prompt = getPrompt('testing-patterns', 0);
    assert.ok(prompt);
    assert.match(prompt.prompt, /Vitest/);
  });

  await t.test('returns undefined for out of range index', () => {
    assert.strictEqual(getPrompt('testing-patterns', 99), undefined);
  });
});

test('defaultPromptFileName', async (t) => {
  await t.test('kebab-cases the prompt name', () => {
    assert.strictEqual(defaultPromptFileName('Compound Component'), 'compound-component-prompt.md');
  });
});

test('formatPromptFileContent', async (t) => {
  await t.test('formats prompt with title and description', () => {
    const content = formatPromptFileContent({
      name: 'Test Prompt',
      description: 'A test prompt',
      prompt: 'Do something useful',
    });
    assert.match(content, /# Test Prompt/);
    assert.match(content, /A test prompt/);
    assert.match(content, /Do something useful/);
  });
});

