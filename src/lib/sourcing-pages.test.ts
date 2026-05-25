import { describe, expect, it } from 'vitest';
import { listProducts } from './products';
import { buildSourcingPageSchema } from './sourcing-schema';
import { getSourcingPage, getSourcingPagesByType, SOURCING_PAGES } from './sourcing-pages';

describe('sourcing pages', () => {
  it('defines one high-intent page for each planned URL family', () => {
    expect(getSourcingPagesByType('application').map((page) => page.url)).toContain('/applications/gearbox-for-cnc-machines/');
    expect(getSourcingPagesByType('material').map((page) => page.url)).toContain('/materials/pa66-gf30-supplier/');
    expect(getSourcingPagesByType('oem').map((page) => page.url)).toContain('/oem/private-label-water-bottle-manufacturer/');
  });

  it('links every page to existing product data', () => {
    const slugs = new Set(listProducts().map((product) => product.slug));

    for (const page of SOURCING_PAGES) {
      expect(page.productSlugs.length).toBeGreaterThan(0);
      for (const slug of page.productSlugs) {
        expect(slugs.has(slug)).toBe(true);
      }
    }
  });

  it('builds FAQ, breadcrumb, collection, and product schema', () => {
    const page = getSourcingPage('material', 'pa66-gf30-supplier');
    expect(page).toBeTruthy();
    const products = listProducts().filter((product) => page?.productSlugs.includes(product.slug));
    const schema = JSON.parse(buildSourcingPageSchema(page!, products, 'https://factory.example.com'));

    expect(schema['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(
      expect.arrayContaining(['BreadcrumbList', 'FAQPage', 'CollectionPage', 'Product']),
    );
  });
});
