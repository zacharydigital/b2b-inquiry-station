import { describe, expect, it } from 'vitest';
import {
  PDP_MODULE_KEYS,
  VERTICAL_CONFIGS,
  getInquiryFields,
  getVerticalConfig,
  normalizeVertical,
} from './verticals';

describe('vertical configs', () => {
  it('defines the three supported B2B inquiry verticals', () => {
    expect(Object.keys(VERTICAL_CONFIGS).sort()).toEqual([
      'consumer-oem',
      'machinery',
      'materials',
    ]);
  });

  it('keeps sticky inquiry forms compact for every vertical', () => {
    for (const vertical of Object.keys(VERTICAL_CONFIGS)) {
      const fields = getInquiryFields(vertical, 'sticky');

      expect(fields.length).toBeGreaterThanOrEqual(5);
      expect(fields.length).toBeLessThanOrEqual(7);
    }
  });

  it('includes shared required buyer and product intent fields', () => {
    for (const vertical of Object.keys(VERTICAL_CONFIGS)) {
      const requiredNames = getInquiryFields(vertical, 'sticky')
        .filter((field) => field.required)
        .map((field) => field.name);

      expect(requiredNames).toContain('name');
      expect(requiredNames).toContain('email');
      expect(requiredNames).toContain('country');
      expect(requiredNames).toContain('quantity');
      expect(
        requiredNames.includes('product_slug') ||
        requiredNames.includes('material_grade') ||
        requiredNames.includes('product_interest'),
      ).toBe(true);
    }
  });

  it('uses vertical-specific conversion labels', () => {
    expect(getVerticalConfig('machinery').cta.primary).toBe('Request a Quote');
    expect(getVerticalConfig('materials').cta.primary).toBe('Request Sample');
    expect(getVerticalConfig('consumer-oem').cta.primary).toBe('Get OEM Quote');
  });

  it('requires every vertical to define CTA, sticky fields, full fields, and PDP modules', () => {
    const allowedModules = new Set(PDP_MODULE_KEYS);

    for (const config of Object.values(VERTICAL_CONFIGS)) {
      expect(config.cta.primary).toBeTruthy();
      expect(config.cta.secondary).toBeTruthy();
      expect(config.cta.mobilePrimary).toBeTruthy();
      expect(config.stickyFields.length).toBeGreaterThan(0);
      expect(config.fullFields.length).toBeGreaterThan(config.stickyFields.length);
      expect(config.pdpModules.length).toBeGreaterThan(0);
      for (const moduleKey of config.pdpModules) {
        expect(allowedModules.has(moduleKey)).toBe(true);
      }
    }
  });

  it('defines conditional fields against existing controller fields', () => {
    for (const config of Object.values(VERTICAL_CONFIGS)) {
      const fieldNames = new Set(config.fullFields.map((field) => field.name));
      for (const field of config.fullFields) {
        if (field.visibleWhen) {
          expect(fieldNames.has(field.visibleWhen.field)).toBe(true);
          expect(field.visibleWhen.values.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('falls back unknown vertical values to machinery', () => {
    expect(normalizeVertical('unknown')).toBe('machinery');
    expect(normalizeVertical(undefined)).toBe('machinery');
  });
});
