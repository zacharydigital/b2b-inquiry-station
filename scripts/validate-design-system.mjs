import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'src/lib/design-tokens.ts',
  'src/lib/design-token-contract.ts',
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
  const tokenContract = read('src/lib/design-token-contract.ts');
  if (!tokenContract.includes('DESIGN_TOKEN_CONTRACT')) {
    failures.push('Token contract must export DESIGN_TOKEN_CONTRACT.');
  }
  for (const group of [
    'core',
    'components',
    'layout',
    'state',
    'conversion',
    'dataDisplay',
    'media',
    'motion',
    'layers',
    'accessibility',
    'brand',
    'emailTheme',
    'modules',
    'verticals',
  ]) {
    if (!tokenContract.includes(`${group}:`)) {
      failures.push(`Token contract missing group: ${group}`);
    }
  }
  for (const marker of ['machinery', 'materials', 'consumer-oem']) {
    if (!tokenContract.includes(marker)) {
      failures.push(`Token contract missing vertical overlay: ${marker}`);
    }
  }
  for (const marker of ['conversion-inquiry-cta-bg', 'conversion-inquiry-cta-hover-bg', 'protectedConversion']) {
    if (!tokenContract.includes(marker)) {
      failures.push(`Token contract missing conversion guardrail: ${marker}`);
    }
  }

  const tokens = read('src/lib/design-tokens.ts');
  for (const marker of ['getDesignTokenExport', 'DESIGN_TOKEN_CONTRACT', 'CORE_TOKENS', 'COMPONENT_TOKENS', 'VERTICAL_TOKENS']) {
    if (!tokens.includes(marker)) {
      failures.push(`Token export missing marker: ${marker}`);
    }
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
  for (const marker of ['btn-primary', 'btn-inquiry', '--conversion-inquiry-cta-bg', '--conversion-inquiry-cta-hover-bg']) {
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
