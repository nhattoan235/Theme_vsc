import fs from 'node:fs';

const source = new URL('./themes/neon-district-color-theme.json', import.meta.url);
const target = new URL('./themes/neon-district-cyberpunk-plus-color-theme.json', import.meta.url);
const theme = JSON.parse(fs.readFileSync(source, 'utf8'));

theme.name = 'Neon District — Cyberpunk+';
Object.assign(theme.colors, {
  // Visible accents stay concentrated around focus and navigation.
  'focusBorder': '#33E7EE',
  'list.activeSelectionBackground': '#382D51',
  'list.activeSelectionForeground': '#FFFFFF',
  'list.inactiveSelectionBackground': '#302840',
  'list.focusOutline': '#33E7EE',
  'list.focusAndSelectionOutline': '#33E7EE',
  'list.hoverBackground': '#292638',
  'sideBar.background': '#1D1B29',
  'sideBarSectionHeader.background': '#282337',
  'sideBarSectionHeader.border': '#574165',
  'activityBar.activeBorder': '#FF5FB7',
  'tab.activeBackground': '#51205D',
  'tab.activeBorderTop': '#FF53BD',
  'tab.activeBorder': '#46FFF2',
  'tab.activeForeground': '#8FFFF7',
  'tab.unfocusedActiveBackground': '#35203E',
  'tab.unfocusedActiveForeground': '#E6D8F0',
  'tab.unfocusedActiveBorderTop': '#C54B9F',
  'tab.unfocusedActiveBorder': '#2E9A9B',
  'tab.inactiveBackground': '#17121F',
  'tab.inactiveForeground': '#9F91AF',
  'tab.unfocusedInactiveBackground': '#15111C',
  'tab.unfocusedInactiveForeground': '#81788E',
  'tab.activeModifiedBorder': '#FFC05C',
  'tab.inactiveModifiedBorder': '#FFC05C99',
  'modernTab.activeBackground': '#51205D',
  'modernTab.activeForeground': '#8FFFF7',
  'modernTab.hoverBackground': '#30223F',
  'modernTab.hoverForeground': '#FFFFFF',
  'modernEditorTab.activeBackground': '#51205D',
  'modernEditorTab.activeForeground': '#8FFFF7',
  'modernEditorTab.inactiveBackground': '#17121F',
  'modernEditorTab.hoverBackground': '#30223F',
  'modernEditorTab.hoverForeground': '#FFFFFF',
  'modernEditorTab.activeHoverBackground': '#622F70',
  'modernEditorTab.activeActionBackground': '#51205D',
  'modernEditorTab.activeHoverActionBackground': '#713580',
  'modernEditorTab.selectedActionBackground': '#713580',
  'tab.hoverBackground': '#30223F',
  'tab.activeModifiedBorder': '#35E2E9',
  'editorCursor.foreground': '#FF64BD',
  'editor.lineHighlightBackground': '#1C172C',
  'editor.lineHighlightBorder': '#A0448B88',
  'editorLineNumber.activeForeground': '#F5A7D9',
  'editor.selectionBackground': '#6A3D8C88',
  'terminal.background': '#141020',
  'terminalCursor.foreground': '#35E2E9',
  'terminal.selectionBackground': '#4C315C99',
  'panelTitle.activeBorder': '#FF5FB7',
  'panelTitle.activeForeground': '#FF9BD4',
});

fs.writeFileSync(target, JSON.stringify(theme, null, 2) + '\n');
