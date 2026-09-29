import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');
const design = JSON.parse(fs.readFileSync(path.join(root, 'design.json'), 'utf8'));
const extension = path.join(os.homedir(), '.vscode', 'extensions', `pkief.material-icon-theme-${design.materialVersion}`);
if (!fs.existsSync(extension)) throw new Error(`Material Icon Theme ${design.materialVersion} is required to build this package.`);
const sourceIcons = path.join(extension, 'icons');
const sourceTheme = JSON.parse(fs.readFileSync(path.join(extension, 'dist', 'material-icons.json'), 'utf8'));
const customDir = path.join(root, 'generated', 'icons', 'custom');
fs.mkdirSync(customDir, { recursive: true });

function recolor(svg, color) {
  return svg
    .replace(/(<path id="folder" fill=")[^"]+/, `$1${color}`)
    .replace(/(<path id="motive" fill=")[^"]+/, '$1#FFF5E8');
}

for (const folder of design.folders) {
  const key = folder.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
  for (const state of ['', '-open']) {
    const source = fs.readFileSync(path.join(sourceIcons, `folder-${folder.base}${state}.svg`), 'utf8');
    fs.writeFileSync(path.join(customDir, `folder-${key}${state}.svg`), recolor(source, folder.color));
  }
  const closedId = `neon-${key}`;
  const openId = `neon-${key}-open`;
  sourceTheme.iconDefinitions[closedId] = { iconPath: `./../icons/custom/folder-${key}.svg` };
  sourceTheme.iconDefinitions[openId] = { iconPath: `./../icons/custom/folder-${key}-open.svg` };
  sourceTheme.folderNames[folder.name] = closedId;
  sourceTheme.folderNamesExpanded[folder.name] = openId;
  if (sourceTheme.light) {
    sourceTheme.light.folderNames[folder.name] = closedId;
    sourceTheme.light.folderNamesExpanded[folder.name] = openId;
  }
}

sourceTheme.iconDefinitions['neon-markdown'] = { iconPath: './../icons/custom/markdown.svg' };
sourceTheme.iconDefinitions['neon-csv'] = { iconPath: './../icons/custom/csv.svg' };
sourceTheme.fileExtensions.md = 'neon-markdown';
sourceTheme.fileExtensions.csv = 'neon-csv';
sourceTheme.fileNames['readme.md'] = 'neon-markdown';
sourceTheme.languageIds.markdown = 'neon-markdown';
if (sourceTheme.languageIds.csv) sourceTheme.languageIds.csv = 'neon-csv';
for (const variant of [sourceTheme.light, sourceTheme.highContrast]) {
  if (!variant) continue;
  variant.fileExtensions.md = 'neon-markdown';
  variant.fileExtensions.csv = 'neon-csv';
  variant.fileNames['readme.md'] = 'neon-markdown';
  if (variant.languageIds) variant.languageIds.markdown = 'neon-markdown';
}

fs.copyFileSync(path.join(root, 'icons', 'markdown.svg'), path.join(customDir, 'markdown.svg'));
fs.copyFileSync(path.join(root, 'icons', 'csv.svg'), path.join(customDir, 'csv.svg'));
fs.mkdirSync(path.join(root, 'generated', 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'generated', 'dist', 'material-icons.json'), JSON.stringify(sourceTheme));
fs.copyFileSync(path.join(extension, 'LICENSE.txt'), path.join(root, 'generated', 'LICENSE-MATERIAL.txt'));
console.log(JSON.stringify({ source: extension, folders: design.folders.length, definitions: Object.keys(sourceTheme.iconDefinitions).length }));
