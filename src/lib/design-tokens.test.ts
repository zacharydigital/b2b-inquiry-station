import { describe, expect, it } from 'vitest';
import { getDesignTokenExport, VERTICAL_TOKENS } from './design-tokens';
import { DESIGN_TOKEN_CONTRACT } from './design-token-contract';

describe('design token export', () => {
  it('exports core, component, and vertical token groups', () => {
    const tokens = getDesignTokenExport();

    expect(tokens.name).toBe('B2B Inquiry Design Language');
    expect(tokens.core.color.accent).toBe('#e85d1c');
    expect(tokens.components.buttonInquiryBg).toContain('--color-accent');
    expect(Object.keys(tokens.verticals)).toEqual(['machinery', 'materials', 'consumer-oem']);
  });

  it('keeps inquiry accent available across all vertical overlays', () => {
    Object.values(VERTICAL_TOKENS).forEach((vertical) => {
      expect(vertical.accent).toMatch(/^#/);
      expect(vertical.primary).toMatch(/^#/);
    });
  });

  it('exports the full B2B inquiry interface contract groups', () => {
    const tokens = getDesignTokenExport();

    expect(Object.keys(tokens)).toEqual(expect.arrayContaining([
      'layout',
      'state',
      'conversion',
      'dataDisplay',
      'media',
      'motion',
      'layers',
      'accessibility',
      'brand',
      'modules',
      'emailTheme',
    ]));
    expect(tokens.layout.mobileDockHeight).toBe('72px');
    expect(tokens.conversion.inquiryCtaBg).toContain('--color-inquiry-cta');
    expect(tokens.dataDisplay.tableHeaderBg).toContain('--table-header-bg');
    expect(tokens.layers.modal).toBe('var(--z-modal)');
    expect(tokens.accessibility.minTouchTarget).toBe('44px');
    expect(tokens.modules.rfqWizard.stepperActiveBg).toContain('--module-rfq-stepper-active-bg');
    expect(tokens.modules.rfqWizard.schema).toBe('RFQWizard.schema');
    expect(tokens.modules.productConfigurator.analytics).toBe('ProductConfigurator.analytics');
    expect(tokens.emailTheme.ctaBg).toBe('#e85d1c');
    expect(tokens.emailTheme.preBg).toBe('#f4f4f4');
  });

  it('uses the shared design token contract as the JSON export source', () => {
    const tokens = getDesignTokenExport();

    expect(tokens.core).toBe(DESIGN_TOKEN_CONTRACT.core);
    expect(tokens.conversion).toBe(DESIGN_TOKEN_CONTRACT.conversion);
    expect(tokens.dataDisplay.procurementRowBg).toBe('var(--procurement-row-bg)');
    expect(tokens.media.placeholderIcon).toBe('var(--media-image-placeholder-icon)');
    expect(tokens.accessibility.errorAnnouncementRole).toBe('var(--a11y-error-announcement-role)');
    expect(tokens.brand.protectedConversion).toBe('var(--brand-protected-conversion)');
    expect(tokens.motion.componentToastDuration).toBe('var(--motion-component-toast-duration)');
    expect(tokens.emailTheme).toBe(DESIGN_TOKEN_CONTRACT.emailTheme);
  });
});
