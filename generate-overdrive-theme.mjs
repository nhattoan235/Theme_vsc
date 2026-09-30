import fs from 'node:fs';

const source = new URL('./themes/neon-district-cyberpunk-plus-color-theme.json', import.meta.url);
const target = new URL('./themes/neon-district-overdrive-color-theme.json', import.meta.url);
const theme = JSON.parse(fs.readFileSync(source, 'utf8'));
theme.name = 'Neon District — Overdrive';
Object.assign(theme.colors, {
  'focusBorder': '#53F4EE',
  'editor.background': '#0C0A16',
  'sideBar.background': '#1D1B29',
  'sideBarSectionHeader.background': '#25203A',
  'sideBarSectionHeader.border': '#69447A',
  'activityBar.background': '#181323',
  'activityBar.activeBorder': '#FF5AB5',
  'tab.activeBackground': '#492157',
  'tab.activeBorderTop': '#FF5AB5',
  'tab.activeBorder': '#53F4EE',
  'tab.activeForeground': '#99FFFA',
  'tab.inactiveBackground': '#15111F',
  'tab.inactiveForeground': '#AE9DBF',
  'modernTab.activeBackground': '#492157',
  'modernTab.activeForeground': '#99FFFA',
  'modernEditorTab.activeBackground': '#492157',
  'modernEditorTab.activeForeground': '#99FFFA',
  'modernEditorTab.activeHoverBackground': '#5A2B6A',
  'modernEditorTab.activeActionBackground': '#492157',
  'modernEditorTab.activeHoverActionBackground': '#683678',
  'editor.lineHighlightBackground': '#211A31',
  'editor.lineHighlightBorder': '#B84E9C88',
  'editor.selectionBackground': '#74439C88',
  'list.activeSelectionBackground': '#382D51',
  'list.focusOutline': '#53F4EE',
  'list.focusAndSelectionOutline': '#53F4EE',
  'statusBar.background': '#251C2D',
  'statusBar.foreground': '#F2CB9F',
  'statusBar.border': '#A86444',
  'commandCenter.background': '#241635',
  'commandCenter.border': '#704288',
  'commandCenter.foreground': '#F4EFFF',
  'panelTitle.activeBorder': '#FF5AB5',
  'terminalCursor.foreground': '#53F4EE',
});
fs.writeFileSync(target, JSON.stringify(theme, null, 2) + '\n');
