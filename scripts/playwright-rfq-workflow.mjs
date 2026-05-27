#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';

const root = process.cwd();
const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const headed = process.argv.includes('--headed') || process.env.HEADED === '1';
const codexHome = process.env.CODEX_HOME || path.join(process.env.HOME || '', '.codex');
const pwcli = process.env.PWCLI || path.join(codexHome, 'skills/playwright/scripts/playwright_cli.sh');
const session = process.env.PLAYWRIGHT_CLI_SESSION || `rfq${process.pid}`;
const outputDir = path.join(root, 'output/playwright/rfq-workflow');
const screenshotPath = path.join(outputDir, 'thank-you.png');

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_CLI_SESSION: session,
    },
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function closeSession() {
  spawnSync(pwcli, ['close'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_CLI_SESSION: session,
    },
  });
}

async function waitForServer(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status < 500) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(500);
  }

  throw new Error(`Dev server did not respond at ${url} within ${timeoutMs / 1000}s. Last error: ${lastError?.message || 'unknown'}`);
}

if (spawnSync('sh', ['-lc', 'command -v npx >/dev/null 2>&1']).status !== 0) {
  throw new Error('npx is required because the Playwright CLI wrapper depends on it.');
}

if (!existsSync(pwcli)) {
  throw new Error(`Playwright CLI wrapper not found at ${pwcli}. Set PWCLI to the wrapper script path.`);
}

mkdirSync(outputDir, { recursive: true });
let opened = false;
const flow = `
async page => {
const baseUrl = ${JSON.stringify(baseUrl)};
const screenshotPath = ${JSON.stringify(screenshotPath)};

await page.route('**/api/inquiry', async route => {
  const request = route.request();
  const headers = request.headers();
  const contentType = headers['content-type'] || '';
  const body = request.postData() || '';

  if (request.method() !== 'POST') {
    throw new Error('Expected RFQ form to POST /api/inquiry, got ' + request.method());
  }
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Expected multipart/form-data submission, got: ' + contentType);
  }

  for (const field of ['name', 'email', 'country', 'product_slug', 'quantity', 'application', 'message']) {
    if (!body.includes('name="' + field + '"')) {
      throw new Error('RFQ submission is missing field: ' + field);
    }
  }

  for (const value of ['Playwright RFQ Buyer', 'buyer@example.com', 'United States', 'industrial-conveyor-system']) {
    if (!body.includes(value)) {
      throw new Error('RFQ submission is missing value: ' + value);
    }
  }

  await route.fulfill({
    status: 303,
    headers: { Location: baseUrl + '/thank-you/' },
    body: '',
  });
});

await page.goto(baseUrl + '/get-a-quote/?utm_source=playwright-rfq', { waitUntil: 'domcontentloaded' });
await page.locator('#rfq-form').scrollIntoViewIfNeeded();

const form = page.locator('form.inquiry-form').first();
await form.waitFor({ state: 'visible', timeout: 15000 });

async function fillField(name, value) {
  const field = form.locator('[name="' + name + '"]');
  await field.waitFor({ state: 'attached', timeout: 10000 });
  await field.fill(value);
}

await fillField('name', 'Playwright RFQ Buyer');
await fillField('email', 'buyer@example.com');
await fillField('country', 'United States');
await fillField('product_slug', 'industrial-conveyor-system');
await fillField('quantity', '24 units');
await fillField('application', 'Packaging line upgrade');
await fillField('message', 'Please quote a conveyor package for food packaging with lead time, warranty, and export documentation.');
await fillField('target_specification', 'Stainless steel frame, variable speed, CE documentation');
await fillField('annual_demand', '120 units');
await fillField('delivery_time', '8 weeks');
await fillField('phone', '+1 415 555 0199');
await fillField('company', 'https://example-procurement.test');

const sourcePage = await form.locator('[name="source_page"]').inputValue();
if (!sourcePage.includes('/get-a-quote/')) {
  throw new Error('Expected source_page to be populated from the browser URL.');
}

await Promise.all([
  page.waitForURL('**/thank-you/**', { timeout: 15000 }),
  form.getByRole('button', { name: /submit rfq/i }).click(),
]);

if (!page.url().includes('/thank-you/')) {
  throw new Error('RFQ submission did not reach the thank-you page. Current URL: ' + page.url());
}

await page.screenshot({ path: screenshotPath, fullPage: true });
console.log('RFQ workflow completed:', page.url());
console.log('Screenshot:', screenshotPath);
}
`;

try {
  await waitForServer(`${baseUrl}/get-a-quote/`);

  const openArgs = [`${baseUrl}/get-a-quote/?utm_source=playwright-rfq`];
  if (headed) openArgs.push('--headed');

  run(pwcli, ['open', ...openArgs]);
  opened = true;
  run(pwcli, ['snapshot']);
  run(pwcli, ['run-code', flow]);
  if (!existsSync(screenshotPath)) {
    throw new Error(`Expected screenshot was not created at ${screenshotPath}. Check the Playwright CLI output above for errors.`);
  }
  run(pwcli, ['snapshot']);

  console.log(`\nVerified RFQ workflow with Playwright CLI session "${session}".`);
} catch (error) {
  console.error(`\n${error instanceof Error ? error.message : 'RFQ workflow failed.'}`);
  process.exitCode = 1;
} finally {
  if (opened) closeSession();
}
