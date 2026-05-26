import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return listSourceFiles(path);
    return /\.(astro|ts)$/.test(path) ? [path] : [];
  });
}

describe('B2B inquiry design system guardrails', () => {
  it('does not style inquiry conversion CTAs with btn-primary', () => {
    const inquiryTerms = /(Request a Quote|Send RFQ|Get OEM Quote|Request Sample|Start RFQ|Get a Quote|Quote Now)/;
    const violations: string[] = [];

    for (const file of listSourceFiles(join(root, 'src'))) {
      const rel = relative(root, file);
      if (rel === 'src/pages/design-system/index.astro') continue;
      if (rel === 'src/lib/design-rules.test.ts') continue;
      const source = readFileSync(file, 'utf8');
      const ctaTags = source.match(/<(a|button)[^>]*class="[^"]*btn-primary[^"]*"[^>]*>[\s\S]*?<\/\1>/g) || [];
      ctaTags.forEach((tag) => {
        if (inquiryTerms.test(tag)) violations.push(rel);
      });
    }

    expect(violations).toEqual([]);
  });

  it('keeps D1 inquiry fields aligned with migrations and insert statements', () => {
    const requiredFields = ['extra_fields', 'lead_score', 'lead_grade'];
    const checkedFiles = [
      'migrations/002_inquiry_extra_fields.sql',
      'migrations/003_inquiry_lead_score.sql',
      'src/pages/api/inquiry.ts',
      'functions/api/inquiry.js',
      'src/lib/admin-inquiries.ts',
      'functions/_admin.js',
    ];

    for (const field of requiredFields) {
      const filesContainingField = checkedFiles.filter((file) => readFileSync(join(root, file), 'utf8').includes(field));
      expect(filesContainingField.length, `${field} should appear in schema/API/admin files`).toBeGreaterThanOrEqual(3);
    }
  });

  it('defines required interface contract css variables', () => {
    const source = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
    const requiredVariables = [
      '--container-page',
      '--section-padding-block',
      '--state-disabled-opacity',
      '--conversion-sticky-sidebar-width',
      '--conversion-mobile-dock-height',
      '--table-cell-padding-y',
      '--media-gallery-aspect',
      '--z-modal',
      '--overlay-bg',
      '--motion-duration-base',
      '--a11y-min-touch-target',
      '--brand-primary',
      '--module-rfq-stepper-active-bg',
    ];

    for (const variable of requiredVariables) {
      expect(source, `${variable} should be defined in token contract`).toContain(variable);
    }
  });

  it('keeps phase-one conversion components on tokenized overlays, layers, motion, and shadows', () => {
    const checkedFiles = listSourceFiles(join(root, 'src/components'))
      .filter((file) => /\.astro$/.test(file))
      .map((file) => relative(root, file))
      .concat([
        'src/pages/index.astro',
        'src/pages/about.astro',
        'src/pages/compare.astro',
        'src/pages/get-a-quote.astro',
      ]);
    const forbiddenPatterns = [
      /\bz-(?:30|40|50)\b/,
      /\bbg-(?:black|graphite)\/(?:30|45)\b/,
      /\bduration-300\b/,
      /shadow-\[[^\]]+\]/,
      /\btop-24\b/,
      /\bsm:w-96\b/,
      /\bbg-accent\b/,
      /\bborder-accent\b/,
      /\bhover:bg-accent-hover\b/,
    ];
    const violations: string[] = [];

    for (const file of checkedFiles) {
      const source = readFileSync(join(root, file), 'utf8');
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(source)) violations.push(`${file}: ${pattern}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('defines complete data, media, accessibility, brand, and motion contracts', () => {
    const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
    const ts = readFileSync(join(root, 'src/lib/design-token-contract.ts'), 'utf8');
    const requiredCssVariables = [
      '--procurement-row-bg',
      '--procurement-row-label-color',
      '--table-error-bg',
      '--table-error-text',
      '--media-image-placeholder-icon',
      '--media-document-preview-border',
      '--a11y-error-announcement-role',
      '--a11y-reduced-motion-duration',
      '--brand-protected-conversion',
      '--motion-component-accordion-duration',
      '--motion-component-toast-duration',
    ];
    const requiredExports = [
      'procurementRowBg',
      'tableErrorBg',
      'placeholderIcon',
      'documentPreviewBorder',
      'errorAnnouncementRole',
      'reducedMotionDuration',
      'protectedConversion',
      'componentAccordionDuration',
      'componentToastDuration',
    ];

    for (const variable of requiredCssVariables) {
      expect(css, `${variable} should exist in CSS token contract`).toContain(variable);
    }

    for (const exportedName of requiredExports) {
      expect(ts, `${exportedName} should exist in token JSON contract`).toContain(exportedName);
    }
  });

  it('defines form validation and conversion primitive contracts', () => {
    const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
    const contract = readFileSync(join(root, 'src/lib/design-token-contract.ts'), 'utf8');
    const designSystemPage = readFileSync(join(root, 'src/pages/design-system/index.astro'), 'utf8');
    const requiredCssVariables = [
      '--field-required-marker-color',
      '--form-field-group-gap',
      '--form-error-summary-bg',
      '--form-error-summary-border',
      '--form-status-submitting-bg',
      '--form-status-success-bg',
      '--form-status-failed-bg',
      '--file-upload-selected-bg',
      '--file-upload-error-bg',
      '--conditional-field-transition-duration',
      '--conversion-rfq-progress-height',
      '--conversion-rfq-progress-track-bg',
    ];
    const requiredContractExports = [
      'requiredMarkerColor',
      'errorSummaryBg',
      'statusSubmittingBg',
      'fileUploadSelectedBg',
      'conditionalFieldTransitionDuration',
      'rfqProgressHeight',
    ];
    const requiredExamples = [
      'Error summary',
      'RFQ progress',
      'Trust reassurance',
      'File upload state',
    ];

    for (const variable of requiredCssVariables) {
      expect(css, `${variable} should exist in CSS token contract`).toContain(variable);
    }

    for (const exportedName of requiredContractExports) {
      expect(contract, `${exportedName} should exist in token JSON contract`).toContain(exportedName);
    }

    for (const example of requiredExamples) {
      expect(designSystemPage, `${example} should be visible on design system page`).toContain(example);
    }
  });

  it('validates the design system against the shared token contract source', () => {
    const validator = readFileSync(join(root, 'scripts/validate-design-system.mjs'), 'utf8');

    expect(validator).toContain('design-token-contract.ts');
    expect(validator).toContain('DESIGN_TOKEN_CONTRACT');
    expect(validator).toContain('conversion-inquiry-cta-bg');
    expect(validator).not.toContain('--button-inquiry-bg');
  });

  it('keeps QuickQuotePop modal display state aligned with modal-shell flex layout', () => {
    const source = readFileSync(join(root, 'src/components/inquiry/QuickQuotePop.astro'), 'utf8');

    expect(source).toContain("modal.classList.add('flex')");
    expect(source).toContain("modal.classList.remove('flex')");
  });

  it('products real phase-one inquiry forms with tokenized validation state primitives', () => {
    const formFiles = [
      'src/components/inquiry/InlineInquiryForm.astro',
      'src/components/inquiry/FullInquiryForm.astro',
      'src/components/inquiry/StickyInquirySidebar.astro',
    ];

    for (const file of formFiles) {
      const source = readFileSync(join(root, file), 'utf8');

      expect(source, `${file} should render a tokenized error summary`).toContain('form-error-summary');
      expect(source, `${file} should announce invalid submissions`).toContain('role="alert"');
      expect(source, `${file} should expose assertive error updates`).toContain('aria-live="assertive"');
      expect(source, `${file} should use submitting status token`).toContain('form-status-submitting');
    }
  });

  it('defines reusable Astro conversion primitives instead of only ad hoc markup', () => {
    const primitives = [
      'src/components/inquiry/InquiryCTA.astro',
      'src/components/inquiry/ConversionPanel.astro',
      'src/components/inquiry/TrustReassurance.astro',
      'src/components/inquiry/RFQProgress.astro',
    ];

    for (const file of primitives) {
      expect(existsSync(join(root, file)), `${file} should exist`).toBe(true);
    }
  });

  it('exposes repeatable browser acceptance scripts without depending on Codex Browser localhost access', () => {
    const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts['accept:visual']).toBe('node scripts/playwright-visual-acceptance.mjs');
    expect(packageJson.scripts['accept:rfq']).toBe('node scripts/playwright-rfq-workflow.mjs');
    expect(packageJson.scripts['accept:local']).toBe('node scripts/playwright-local-acceptance.mjs');
    expect(readFileSync(join(root, '.gitignore'), 'utf8')).toContain('output/playwright/');

    const localAcceptance = readFileSync(join(root, 'scripts/playwright-local-acceptance.mjs'), 'utf8');
    expect(localAcceptance).toContain("['dev', '--', '--host', '127.0.0.1']");
    expect(localAcceptance).toContain("runPnpm(['accept:visual'");
    expect(localAcceptance).toContain("runPnpm(['accept:rfq'");
  });

  it('defines explicit GET 405 fallbacks for Astro POST-only API routes', () => {
    const apiRoutes = [
      'src/pages/api/inquiry.ts',
      'src/pages/api/download-gate.ts',
      'src/pages/api/quote-cart.ts',
    ];

    for (const file of apiRoutes) {
      const source = readFileSync(join(root, file), 'utf8');

      expect(source, `${file} should export GET handler`).toContain('export const GET: APIRoute');
      expect(source, `${file} should return 405 for GET`).toContain('status: 405');
      expect(source, `${file} should expose Allow header`).toContain("'Allow': 'POST'");
      expect(source, `${file} should return JSON error`).toContain("error: 'Method not allowed.'");
    }
  });
});
