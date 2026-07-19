import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'the-vibecoding-handbook.the-vibecoding-handbook';

suite('Vibe Coding Extension', () => {
  test('extension is activated on startup', () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, `Extension ${EXTENSION_ID} should be installed`);
    assert.strictEqual(extension!.isActive, true, 'Extension should be active');
  });

  test('vibe commands are registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    const expectedCommands = [
      'the-vibecoding-handbook.init',
      'the-vibecoding-handbook.check',
      'the-vibecoding-handbook.context',
      'the-vibecoding-handbook.optimize',
      'the-vibecoding-handbook.showContext',
      'the-vibecoding-handbook.openAgents',
      'the-vibecoding-handbook.openIdeRules',
      'the-vibecoding-handbook.refreshContext',
    ];

    for (const command of expectedCommands) {
      assert.ok(commands.includes(command), `Command ${command} should be registered`);
    }
  });

  test('workspace is available for tests', () => {
    const folders = vscode.workspace.workspaceFolders;
    assert.ok(folders && folders.length > 0, 'Test workspace should be open');
    assert.strictEqual(folders![0].name, 'test-workspace');
  });
});

