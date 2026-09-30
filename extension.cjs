const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function activate(context) {
  const disposable = vscode.commands.registerCommand('neonDistrict.openCommandDeck', async () => {
    const previousUri = vscode.window.activeTextEditor?.document.uri;
    const panel = vscode.window.createWebviewPanel('neonDistrict.commandDeck', 'Command Deck', vscode.ViewColumn.Active, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'deck')],
    });
    const nonce = crypto.randomBytes(16).toString('hex');
    const cssUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'deck', 'deck.css'));
    const jsUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'deck', 'deck.js'));
    panel.webview.html = fs.readFileSync(path.join(context.extensionPath, 'deck', 'index.html'), 'utf8')
      .replaceAll('{{cspSource}}', panel.webview.cspSource)
      .replaceAll('{{nonce}}', nonce)
      .replaceAll('{{styleUri}}', cssUri.toString())
      .replaceAll('{{scriptUri}}', jsUri.toString());

    let recent = [];
    let tasks = [];
    async function refresh() {
      const folder = vscode.workspace.workspaceFolders?.[0];
      const git = vscode.extensions.getExtension('vscode.git');
      let branch = 'No branch';
      try {
        if (git) {
          if (!git.isActive) await git.activate();
          const repository = git.exports.getAPI(1).repositories.find(repo => !folder || repo.rootUri.fsPath === folder.uri.fsPath)
            ?? git.exports.getAPI(1).repositories[0];
          branch = repository?.state.HEAD?.name || branch;
        }
      } catch { /* The dashboard still works without the Git extension. */ }

      const tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
      const paths = new Map();
      if (previousUri?.scheme === 'file') paths.set(previousUri.toString(), previousUri);
      for (const tab of tabs) {
        const uri = tab.input?.uri;
        if (uri?.scheme === 'file') paths.set(uri.toString(), uri);
      }
      recent = [...paths.values()].slice(0, 8);
      try { tasks = (await vscode.tasks.fetchTasks()).slice(0, 8); }
      catch { tasks = []; }
      panel.webview.postMessage({
        type: 'state',
        workspace: folder?.name || 'No workspace',
        branch,
        files: recent.map(uri => ({ name: path.basename(uri.fsPath), detail: vscode.workspace.asRelativePath(uri, false) })),
        tasks: tasks.map(task => task.name),
        hasLastFile: Boolean(previousUri),
      });
    }

    panel.webview.onDidReceiveMessage(async message => {
      try {
        if (message?.type === 'ready' || message?.type === 'refresh') await refresh();
        else if (message?.type === 'openFile' && Number.isInteger(message.index) && recent[message.index]) {
          await vscode.window.showTextDocument(recent[message.index]);
        } else if (message?.type === 'openLast' && previousUri) {
          await vscode.window.showTextDocument(previousUri);
        } else if (message?.type === 'runTask') {
          if (Number.isInteger(message.index) && tasks[message.index]) await vscode.tasks.executeTask(tasks[message.index]);
          else await vscode.commands.executeCommand('workbench.action.tasks.runTask');
        } else if (message?.type === 'runTests') {
          const testTask = tasks.find(task => /test/i.test(task.name));
          if (testTask) await vscode.tasks.executeTask(testTask);
          else await vscode.commands.executeCommand('workbench.action.tasks.runTask');
        } else if (message?.type === 'sourceControl') {
          await vscode.commands.executeCommand('workbench.view.scm');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Command Deck: ${error.message}`);
      }
    }, undefined, context.subscriptions);
  });
  context.subscriptions.push(disposable);
}

function deactivate() {}
module.exports = { activate, deactivate };
