#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const headed = args.has('--headed') || process.env.HEADED === '1';
const codexHome = process.env.CODEX_HOME || path.join(process.env.HOME || '', '.codex');
const pwcli = process.env.PWCLI || path.join(codexHome, 'skills/playwright/scripts/playwright_cli.sh');
const session = process.env.PLAYWRIGHT_CLI_SESSION || `visual-${process.pid}`;
const outputDir = path.join(root, 'output/playwright/visual-acceptance');

const screenshots = [
  'desktop-machinery-pdp.png',
  'desktop-materials-pdp.png',
  'desktop-oem-pdp.png',
  'mobile-materials-sourcing.png',
  'mobile-oem-pdp.png',
  'desktop-design-system.png',
  'desktop-admin-inquiries.png',
];

function printHelp() {
  console.log(`Browser visual acceptance with Codex Playwright CLI.

Usage:
  pnpm dev --host 127.0.0.1
  pnpm accept:visual

Options:
  --headed        Run Chromium headed for manual visual inspection.

Environment:
  BASE_URL        Local site URL. Default: http://127.0.0.1:4321
  PWCLI           Playwright CLI wrapper path. Default: ~/.codex/skills/playwright/scripts/playwright_cli.sh
  HEADED=1        Same as --headed.

Artifacts:
  output/playwright/visual-acceptance/

This script does not require @playwright/test or any project-level Playwright dependency.`);
}

function run(command, commandArgs = []) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_CLI_SESSION: session,
    },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command failed: ${command} ${commandArgs.join(' ')}`);
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

  throw new Error(`Dev server did not respond at ${url}. Last error: ${lastError?.message || 'unknown'}`);
}

if (args.has('--help') || args.has('-h')) {
  printHelp();
  process.exit(0);
}

if (spawnSync('sh', ['-lc', 'command -v npx >/dev/null 2>&1']).status !== 0) {
  throw new Error('npx is required because the Codex Playwright CLI wrapper depends on it.');
}

if (!existsSync(pwcli)) {
  throw new Error(`Playwright CLI wrapper not found at ${pwcli}. Set PWCLI to the wrapper script path.`);
}

mkdirSync(outputDir, { recursive: true });
let opened = false;
const flow = `
async page => {
const outputDir = ${JSON.stringify(outputDir)};
const baseUrl = ${JSON.stringify(baseUrl)};

const checks = [];

async function expectCount(label, locator, min = 1) {
  const count = await locator.count();
  checks.push({ label, ok: count >= min, count });
  if (count < min) throw new Error(label + ' failed. Count: ' + count);
}

async function capture(name, url, viewport, assertions) {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl + url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await assertions();
  await page.screenshot({ path: outputDir + '/' + name + '.png', fullPage: false });
}

await capture('desktop-machinery-pdp', '/products/planetary-gearbox-hg-series/', { width: 1440, height: 1000 }, async () => {
  await expectCount('machinery vertical body', page.locator('body[data-vertical="machinery"]'));
  await expectCount('machinery sticky inquiry', page.locator('.sticky-sidebar form .btn-inquiry'));
  await expectCount('machinery inline inquiry anchor', page.locator('#inline-inquiry'));
  await expectCount('machinery request quote text', page.getByText('Request a Quote').first());
});

await capture('desktop-materials-pdp', '/products/pa66-gf30-engineering-plastic/', { width: 1440, height: 1000 }, async () => {
  await expectCount('materials vertical body', page.locator('body[data-vertical="materials"]'));
  await expectCount('materials technical data', page.getByText('Technical data').first());
  await expectCount('materials request sample CTA', page.getByText('Request Sample').first());
});

await capture('desktop-oem-pdp', '/products/custom-stainless-water-bottle-oem/', { width: 1440, height: 1000 }, async () => {
  await expectCount('consumer-oem vertical body', page.locator('body[data-vertical="consumer-oem"]'));
  await expectCount('oem customization section', page.getByText('What Can Be Customized for OEM / ODM').first());
  await expectCount('oem variant section', page.getByText('Options Buyers Can Compare Quickly').first());
  await expectCount('oem quote CTA', page.getByText('Get OEM Quote').first());
});

await capture('mobile-materials-sourcing', '/materials/pa66-gf30-supplier/', { width: 390, height: 844 }, async () => {
  await expectCount('materials sourcing mobile vertical', page.locator('body[data-vertical="materials"]'));
  await expectCount('materials sourcing H1', page.getByRole('heading', { name: /PA66 GF30 supplier/i }).first());
  await expectCount('materials mobile CTA', page.getByText('Get Bulk Price').first());
});

await capture('mobile-oem-pdp', '/products/custom-stainless-water-bottle-oem/', { width: 390, height: 844 }, async () => {
  await expectCount('oem mobile vertical', page.locator('body[data-vertical="consumer-oem"]'));
  await expectCount('oem mobile CTA', page.getByText('OEM Quote').first());
});

await capture('desktop-design-system', '/design-system/', { width: 1440, height: 1000 }, async () => {
  await expectCount('design system heading', page.getByRole('heading', { name: 'B2B Inquiry Design System' }));
  await expectCount('design system token export', page.getByRole('link', { name: /Export tokens JSON/i }));
});

await capture('desktop-admin-inquiries', '/admin/inquiries?token=local-admin', { width: 1440, height: 900 }, async () => {
  await expectCount('admin inquiry inbox heading', page.getByRole('heading', { name: 'Inquiry inbox' }));
  await expectCount('admin lead grade filter', page.locator('#lead_grade'));
  await expectCount('admin CSV export', page.getByRole('link', { name: /Export CSV/i }));
});

console.log(JSON.stringify({ checks, outputDir }, null, 2));
}
`;

try {
  await waitForServer(`${baseUrl}/`);

  const openArgs = [`${baseUrl}/`];
  if (headed) openArgs.push('--headed');
  run(pwcli, ['open', ...openArgs]);
  opened = true;
  run(pwcli, ['snapshot']);
  run(pwcli, ['run-code', flow]);

  const missing = screenshots.filter((file) => !existsSync(path.join(outputDir, file)));
  if (missing.length) {
    throw new Error(`Missing expected screenshot files: ${missing.join(', ')}`);
  }

  const summary = [
    '# Browser Visual Acceptance Summary',
    '',
    `Base URL: ${baseUrl}`,
    `Session: ${session}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    'Screenshots:',
    ...screenshots.map((file) => `- ${file}`),
    '',
    'Notes:',
    '- Uses Codex Playwright CLI skill wrapper.',
    '- Does not require @playwright/test or project-level Playwright dependencies.',
    '- Artifacts are ignored by Git under output/playwright/.',
    '',
  ].join('\n');

  writeFileSync(path.join(outputDir, 'summary.md'), summary);

  console.log(`\nBrowser visual acceptance completed.`);
  console.log(`Artifacts: ${outputDir}`);
} catch (error) {
  console.error(`\n${error instanceof Error ? error.message : 'Browser visual acceptance failed.'}`);
  process.exitCode = 1;
} finally {
  if (opened) closeSession();
}
