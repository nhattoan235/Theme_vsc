import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const extensionsDir = path.join(os.homedir(), '.vscode', 'extensions');
const materialDir = fs.readdirSync(extensionsDir)
  .filter(name => name.startsWith('pkief.material-icon-theme-'))
  .sort()
  .at(-1);
if (!materialDir) throw new Error('Material Icon Theme is not installed.');
const iconsDir = path.join(extensionsDir, materialDir, 'icons');
const outDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');

const { folders } = JSON.parse(fs.readFileSync(path.join(outDir, '..', 'material-neon-icons', 'design.json'), 'utf8'));

function esc(s) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function icon(name, x, y, color, custom = false) {
  const file = custom
    ? path.join(outDir, '..', 'material-neon-icons', 'icons', `${name}.svg`)
    : path.join(iconsDir, `${name}.svg`);
  let svg = fs.readFileSync(file, 'utf8');
  if (color) {
    svg = svg.replace(/(<path id="folder" fill=")[^"]+/, `$1${color}`);
    svg = svg.replace(/(<path id="motive" fill=")[^"]+/, '$1#FFF5E8');
  }
  return svg.replace('<svg ', `<svg x="${x}" y="${y}" width="23" height="23" `);
}

const rows = folders.map((folder, i) => {
  const y = 150 + i * 47;
  return `
    <rect x="39" y="${y - 7}" width="558" height="39" rx="6" fill="${i % 2 ? '#211C2C' : '#1B1727'}"/>
    <rect x="661" y="${y - 7}" width="580" height="39" rx="6" fill="${i % 2 ? '#252033' : '#1B1727'}"/>
    ${icon(folder.current === 'folder' ? 'folder' : `folder-${folder.current}`, 59, y, null)}
    <text x="95" y="${y + 17}" class="name">${esc(folder.name)}</text>
    ${icon(`folder-${folder.base}`, 681, y, folder.color)}
    <text x="717" y="${y + 17}" class="name">${esc(folder.name)}</text>
    <text x="1010" y="${y + 16}" class="note">${esc(folder.note)}</text>`;
}).join('');

const fileNames = [
  { label: 'README.md', icon: 'markdown', custom: 'markdown' },
  { label: 'sales_quarterly.csv', icon: 'table', custom: 'csv' },
  { label: 'serve.mjs', icon: 'javascript' },
];
const fileRows = fileNames.map((file, i) => {
  const y = 725 + i * 43;
  return `
    ${icon(file.icon, 59, y, null)}<text x="95" y="${y + 17}" class="name">${esc(file.label)}</text>
    ${icon(file.custom || file.icon, 681, y, null, !!file.custom)}<text x="717" y="${y + 17}" class="name">${esc(file.label)}</text>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="930" viewBox="0 0 1280 930">
<style>
  .title { font: 700 30px 'Segoe UI', sans-serif; fill: #F4EDFF }
  .sub { font: 16px 'Segoe UI', sans-serif; fill: #B9ABC9 }
  .head { font: 700 19px 'Segoe UI', sans-serif; fill: #FFBB79 }
  .name { font: 16px 'Segoe UI', sans-serif; fill: #EEE8F6 }
  .note { font: 13px 'Segoe UI', sans-serif; fill: #BDAED0 }
  .small { font: 14px 'Segoe UI', sans-serif; fill: #B9ABC9 }
</style>
<rect width="1280" height="930" fill="#0C0A16"/>
<text x="40" y="52" class="title">Material Icon Theme · đề xuất cho thư mục</text>
<text x="40" y="82" class="sub">Giữ icon Material cho các file khác. Đổi thư mục theo vai trò và vẽ lại riêng Markdown, CSV.</text>
<rect x="28" y="103" width="580" height="777" rx="13" fill="#1B1727" stroke="#493859"/>
<rect x="649" y="103" width="603" height="777" rx="13" fill="#1B1727" stroke="#735392"/>
<text x="58" y="136" class="head">HIỆN TẠI</text>
<text x="681" y="136" class="head">BẢN ĐỀ XUẤT</text>
${rows}
<path d="M48 687H588 M669 687H1231" stroke="#604C72"/>
<text x="59" y="711" class="small">FILE ICONS · GIỮ NGUYÊN</text>
<text x="681" y="711" class="small">FILE ICONS · MD/CSV MỚI</text>
${fileRows}
<text x="40" y="911" class="small">Xem trước thiết kế · chưa cài vào VS Code · hình gốc từ Material Icon Theme (MIT)</text>
</svg>`;

fs.mkdirSync(outDir, { recursive: true });
const svgPath = path.join(outDir, 'folder-preview.svg');
const pngPath = path.join(outDir, 'folder-preview.png');
fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);
console.log(pngPath);
