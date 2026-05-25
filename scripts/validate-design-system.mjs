import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'src/lib/design-tokens.ts',
  'src/pages/design-system/index.astro',
  'src/pages/design-system/tokens.json.ts',
  'src/lib/verticals.ts',
  'src/lib/routes.ts',
  'migrations/002_inquiry_extra_fields.sql',
  'migrations/003_inquiry_lead_score.sql',
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required design-system file: ${file}`);
  }
}

function read(file) {
  return readFileSync(join(root, file), 'utf8');
}

if (!failures.length) {
  const tokens = read('src/lib/design-tokens.ts');
  for (const marker of ['CORE_TOKENS', 'COMPONENT_TOKENS', 'VERTICAL_TOKENS', 'machinery', 'materials', 'consumer-oem']) {
    if (!tokens.includes(marker)) failures.push(`Token export missing marker: ${marker}`);
  }

  const tokenRoute = read('src/pages/design-system/tokens.json.ts');
  if (!tokenRoute.includes('getDesignTokenExport')) {
    failures.push('tokens.json route must serve getDesignTokenExport().');
  }

  const verticals = read('src/lib/verticals.ts');
  for (const marker of ['PDP_MODULE_KEYS', 'visibleWhen']) {
    if (!verticals.includes(marker)) failures.push(`Vertical config missing marker: ${marker}`);
  }

  const unoConfig = read('uno.config.ts');
  for (const marker of ['btn-primary', 'btn-inquiry', '--button-inquiry-bg']) {
    if (!unoConfig.includes(marker)) failures.push(`UnoCSS config missing marker: ${marker}`);
  }

  const routes = read('src/lib/routes.ts');
  if (!routes.includes('SOURCING_PAGES')) failures.push('Sourcing pages must be included in indexable routes.');

  const inquiryApi = read('src/pages/api/inquiry.ts');
  const inquiryFunction = read('functions/api/inquiry.js');
  for (const field of ['extra_fields', 'lead_score', 'lead_grade']) {
    if (!inquiryApi.includes(field)) failures.push(`Astro inquiry API missing ${field}.`);
    if (!inquiryFunction.includes(field)) failures.push(`Pages Function inquiry API missing ${field}.`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Design system guardrails passed.');
