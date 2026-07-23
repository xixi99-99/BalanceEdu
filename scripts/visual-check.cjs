const path = require('node:path');
const { chromium } = require('playwright');

const outputDirectory = process.argv[2];
if (!outputDirectory) {
  throw new Error('請提供截圖輸出目錄');
}

async function checkViewport(browser, name, viewport) {
  const context = await browser.newContext({ viewport, locale: 'zh-TW' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('http://127.0.0.1:5180/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outputDirectory, `${name}-login.png`), fullPage: true });
  await page.getByRole('button', { name: '登入平台' }).click();
  await page.waitForURL('**/dashboard');
  await page.getByText('在籍學生').first().waitFor();
  await page.screenshot({ path: path.join(outputDirectory, `${name}-dashboard.png`), fullPage: true });

  const visited = [];
  if (name === 'desktop') {
    const routes = ['/students', '/student-attendance', '/makeup-classes', '/finance', '/staff', '/schedules', '/classes', '/transportation', '/teacher-attendance', '/attendance-records', '/communication-book', '/settings'];
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:5180${route}`, { waitUntil: 'networkidle' });
      visited.push(new URL(page.url()).pathname);
    }
    await page.getByLabel('切換示範角色').selectOption('teacher');
    await page.goto('http://127.0.0.1:5180/finance', { waitUntil: 'networkidle' });
    if (new URL(page.url()).pathname !== '/dashboard') errors.push('教師可直接開啟未授權的財務頁面');
  }

  const result = { name, url: page.url(), title: await page.title(), visited, errors };
  await context.close();
  return result;
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const results = [];
  results.push(await checkViewport(browser, 'desktop', { width: 1440, height: 1000 }));
  results.push(await checkViewport(browser, 'mobile', { width: 390, height: 844 }));
  await browser.close();
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  if (results.some((result) => result.errors.length > 0)) process.exitCode = 1;
})().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
