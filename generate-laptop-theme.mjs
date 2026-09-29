import fs from 'node:fs';

const source = new URL('./themes/neon-district-color-theme.json', import.meta.url);
const target = new URL('./themes/neon-district-laptop-color-theme.json', import.meta.url);
const theme = JSON.parse(fs.readFileSync(source, 'utf8'));

theme.name = 'Neon District — Laptop';
Object.assign(theme.colors, {
  'editor.background': '#181321',
  'editorGutter.background': '#181321',
  'breadcrumb.background': '#181321',
  'minimap.background': '#181321',
  'editor.lineHighlightBackground': '#30223E',
  'sideBar.background': '#25202F',
  'sideBarSectionHeader.background': '#30283C',
  'activityBar.background': '#1F192B',
  'titleBar.activeBackground': '#21192E',
  'titleBar.inactiveBackground': '#1B1527',
  'editorGroupHeader.tabsBackground': '#21192E',
  'tab.inactiveBackground': '#251B34',
  'panel.background': '#20182B',
  'terminal.background': '#1B1528',
  'quickInput.background': '#30223F',
  'notifications.background': '#30223F',
});

fs.writeFileSync(target, JSON.stringify(theme, null, 2) + '\n');
