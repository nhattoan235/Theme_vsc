const vscode = acquireVsCodeApi();
const $ = id => document.getElementById(id);
function action(id, type) { $(id).addEventListener('click', () => vscode.postMessage({ type })); }
action('refresh', 'refresh'); action('run-tests', 'runTests'); action('open-last', 'openLast'); action('source-control', 'sourceControl');
function renderList(container, items, type, empty) {
  container.replaceChildren();
  if (!items.length) { const note = document.createElement('p'); note.className = 'empty'; note.textContent = empty; container.append(note); return; }
  items.forEach((item, index) => {
    const button = document.createElement('button'); button.className = 'row'; button.type = 'button';
    const dot = document.createElement('span'); dot.className = 'row-dot'; dot.textContent = type === 'openFile' ? '◈' : '▷';
    const labels = document.createElement('span'); labels.className = 'row-labels';
    const name = document.createElement('strong'); name.textContent = type === 'openFile' ? item.name : item;
    labels.append(name);
    if (type === 'openFile') { const detail = document.createElement('small'); detail.textContent = item.detail; labels.append(detail); }
    const arrow = document.createElement('span'); arrow.className = 'arrow'; arrow.textContent = '↗';
    button.append(dot, labels, arrow);
    button.addEventListener('click', () => vscode.postMessage({ type, index })); container.append(button);
  });
}
window.addEventListener('message', event => {
  const state = event.data; if (state?.type !== 'state') return;
  $('workspace-chip').textContent = `◈   ${state.workspace}`;
  $('branch-chip').textContent = `⑂   ${state.branch}`;
  $('open-last').disabled = !state.hasLastFile;
  renderList($('files'), state.files, 'openFile', 'Open a file to see it here.');
  renderList($('tasks'), state.tasks, 'runTask', 'No workspace tasks found.');
});
vscode.postMessage({ type: 'ready' });
