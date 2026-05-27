import { describe, expect, it } from 'vitest';
import { getProductBySlug, getProductStaticPaths, listProducts } from './products';
import { PDP_MODULE_KEYS, VERTICAL_CONFIGS } from './verticals';

describe('product catalog', () => {
  it('lists products with SEO and sourcing metadata', () => {
    const products = listProducts();

    expect(products.length).toBeGreaterThanOrEqual(6);
    expect(products[0]).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      model: expect.any(String),
      category: expect.any(String),
      moq: expect.any(String),
      leadTime: expect.any(String),
      standard: expect.any(String),
      updated: expect.any(String),
    });
    expect(products[0].faqs.length).toBeGreaterThan(0);
    expect(products[0].specifications.length).toBeGreaterThan(0);
  });

  it('finds a product by slug', () => {
    const product = getProductBySlug('planetary-gearbox-hg-series');

    expect(product?.model).toBe('HG-220');
    expect(product?.category).toBe('Gearboxes');
  });

  it('generates Astro static paths from the catalog', () => {
    const paths = getProductStaticPaths();

    expect(paths).toContainEqual({ params: { slug: 'planetary-gearbox-hg-series' } });
    expect(paths.length).toBe(listProducts().length);
  });

  it('includes real products for every configured vertical', () => {
    const verticals = new Set(listProducts().map((product) => product.vertical || 'machinery'));

    expect(verticals).toEqual(new Set(['machinery', 'materials', 'consumer-oem']));
    expect(getProductBySlug('pa66-gf30-engineering-plastic')?.technicalData?.length).toBeGreaterThan(0);
    expect(getProductBySlug('custom-stainless-water-bottle-oem')?.variants?.length).toBeGreaterThan(0);
  });

  it('keeps product verticals and PDP overrides valid', () => {
    const verticals = new Set(Object.keys(VERTICAL_CONFIGS));
    const modules = new Set(PDP_MODULE_KEYS);

    for (const product of listProducts()) {
      expect(verticals.has(product.vertical || 'machinery')).toBe(true);
      for (const moduleKey of product.pdpModuleOverrides || []) {
        expect(modules.has(moduleKey)).toBe(true);
      }
    }
  });
});
