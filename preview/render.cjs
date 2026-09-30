const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files'],
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    const previewUrl = pathToFileURL(path.join(__dirname, 'overdrive.html')).href;
    for (const view of ['editor', 'deck']) {
      await page.goto(`${previewUrl}?view=${view}`);
      await page.screenshot({ path: path.join(__dirname, `overdrive-${view}.png`) });
    }
    await page.setViewportSize({ width: 1200, height: 740 });
    await page.goto(pathToFileURL(path.join(__dirname, 'icon-sheet.html')).href);
    await page.screenshot({ path: path.join(__dirname, 'overdrive-icons.png') });
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
