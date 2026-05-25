import { describe, expect, it } from 'vitest';
import { getDesignTokenExport, VERTICAL_TOKENS } from './design-tokens';

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
});
