import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'vibecoding.vibecoding';

suite('Vibe Coding Extension', () => {
  test('extension is activated on startup', () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, `Extension ${EXTENSION_ID} should be installed`);
    assert.strictEqual(extension!.isActive, true, 'Extension should be active');
  });

  test('vibe commands are registered', async () => {
    const commands = await vscode.commands.getCommands(true);
    const expectedCommands = [
      'vibecoding.init',
      'vibecoding.check',
      'vibecoding.context',
      'vibecoding.optimize',
      'vibecoding.showContext',
      'vibecoding.openAgents',
      'vibecoding.openIdeRules',
      'vibecoding.refreshContext',
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
