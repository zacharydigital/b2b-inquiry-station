import { describe, expect, it } from 'vitest';
import { companyProfile, getCompanyStats, getTrustProof } from './company';

describe('company profile', () => {
  it('exposes core E-E-A-T company details', () => {
    expect(companyProfile.name).toBe('IndustryPro Machinery');
    expect(companyProfile.founded).toBe(2010);
    expect(companyProfile.team.length).toBeGreaterThanOrEqual(3);
  });

  it('provides homepage/about trust stats', () => {
    const stats = getCompanyStats();

    expect(stats).toContainEqual({ label: 'Years Established', value: '15+' });
    expect(stats).toContainEqual({ label: 'Export Countries', value: '60+' });
  });

  it('groups certification and SLA proof for trust sections', () => {
    const proof = getTrustProof();

    expect(proof.certifications.length).toBeGreaterThanOrEqual(3);
    expect(proof.sla.replyTime).toBe('12 business hours');
    expect(proof.sla.nda).toContain('NDA');
  });
});
