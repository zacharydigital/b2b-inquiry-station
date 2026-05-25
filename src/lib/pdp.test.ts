import { describe, expect, it } from 'vitest';
import { getPdpModules } from './pdp';

describe('getPdpModules', () => {
  it('orders machinery PDPs for technical proof before fit and trust', () => {
    expect(getPdpModules('machinery').slice(0, 3)).toEqual([
      'ProductHero',
      'Specifications',
      'Applications',
    ]);
  });

  it('includes compliance modules for materials PDPs', () => {
    const modules = getPdpModules('materials');

    expect(modules).toContain('TechnicalData');
    expect(modules).toContain('ComplianceDocuments');
  });

  it('includes catalog scanning modules for consumer OEM PDPs', () => {
    const modules = getPdpModules('consumer-oem');

    expect(modules).toContain('Variants');
    expect(modules).toContain('ChannelFit');
    expect(modules).toContain('Customization');
  });

  it('falls back invalid verticals to machinery order', () => {
    expect(getPdpModules('not-real').slice(0, 3)).toEqual([
      'ProductHero',
      'Specifications',
      'Applications',
    ]);
  });
});
