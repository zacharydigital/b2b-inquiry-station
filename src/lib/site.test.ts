import { describe, expect, it } from 'vitest';
import { getSiteUrl, joinSiteUrl } from './site';

describe('getSiteUrl', () => {
  it('normalizes a configured site URL without a trailing slash', () => {
    expect(getSiteUrl('https://example-b2b.com/')).toBe('https://example-b2b.com');
  });

  it('falls back to the template placeholder when no site URL is configured', () => {
    expect(getSiteUrl()).toBe('https://example.com');
  });
});

describe('joinSiteUrl', () => {
  it('joins site and route paths with one slash', () => {
    expect(joinSiteUrl('https://example-b2b.com/', '/products/')).toBe('https://example-b2b.com/products/');
    expect(joinSiteUrl('https://example-b2b.com', 'products/hg-220/')).toBe('https://example-b2b.com/products/hg-220/');
  });
});
