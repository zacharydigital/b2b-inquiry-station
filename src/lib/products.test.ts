import { describe, expect, it } from 'vitest';
import { getProductBySlug, getProductStaticPaths, listProducts } from './products';

describe('product catalog', () => {
  it('lists products with SEO and sourcing metadata', () => {
    const products = listProducts();

    expect(products.length).toBeGreaterThanOrEqual(4);
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
});
