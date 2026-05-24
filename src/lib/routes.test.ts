import { describe, expect, it } from 'vitest';
import { getIndexableRoutes } from './routes';
import { listProducts } from './products';

describe('getIndexableRoutes', () => {
  it('includes core conversion and trust pages', () => {
    const urls = getIndexableRoutes().map((route) => route.url);

    expect(urls).toContain('/');
    expect(urls).toContain('/products/');
    expect(urls).toContain('/about/');
    expect(urls).toContain('/certifications/');
    expect(urls).toContain('/get-a-quote/');
  });

  it('includes every product detail page from the catalog', () => {
    const urls = getIndexableRoutes().map((route) => route.url);

    for (const product of listProducts()) {
      expect(urls).toContain(`/products/${product.slug}/`);
    }
  });

  it('excludes noindex and API routes from the sitemap manifest', () => {
    const urls = getIndexableRoutes().map((route) => route.url);

    expect(urls).not.toContain('/thank-you/');
    expect(urls.some((url) => url.startsWith('/api/'))).toBe(false);
  });
});
