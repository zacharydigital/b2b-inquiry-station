import { describe, it, expect } from 'vitest';
import { generateSchema, faqSchema, breadcrumbSchema, productSchema, itemListSchema, graphSchema } from './seo';

describe('generateSchema', () => {
  it('generates valid JSON-LD schema', () => {
    const result = generateSchema({ '@type': 'Organization', name: 'Test' });
    const parsed = JSON.parse(result);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('Organization');
    expect(parsed.name).toBe('Test');
  });
});

describe('faqSchema', () => {
  it('generates FAQPage schema', () => {
    const result = faqSchema([{ question: 'Q?', answer: 'A.' }]);
    const parsed = JSON.parse(result);
    expect(parsed['@type']).toBe('FAQPage');
    expect(parsed.mainEntity).toHaveLength(1);
  });
});

describe('breadcrumbSchema', () => {
  it('generates BreadcrumbList schema', () => {
    const result = breadcrumbSchema([{ name: 'Home', url: '/' }]);
    const parsed = JSON.parse(result);
    expect(parsed['@type']).toBe('BreadcrumbList');
    expect(parsed.itemListElement).toHaveLength(1);
  });
});

describe('productSchema', () => {
  it('generates Product schema', () => {
    const result = productSchema({ name: 'Widget', description: 'A widget', sku: 'W-001', brand: 'Acme' });
    const parsed = JSON.parse(result);
    expect(parsed['@type']).toBe('Product');
    expect(parsed.sku).toBe('W-001');
  });
});

describe('itemListSchema', () => {
  it('generates crawlable product list schema for PLP pages', () => {
    const result = itemListSchema([
      { name: 'Gearbox HG-220', url: 'https://example.com/products/gearbox-hg-220/' },
      { name: 'Servo Motor SM-300', url: 'https://example.com/products/servo-motor-sm-300/' },
    ]);
    const parsed = JSON.parse(result);

    expect(parsed['@type']).toBe('ItemList');
    expect(parsed.itemListElement).toHaveLength(2);
    expect(parsed.itemListElement[0].position).toBe(1);
    expect(parsed.itemListElement[0].url).toBe('https://example.com/products/gearbox-hg-220/');
  });
});

describe('graphSchema', () => {
  it('combines multiple schema nodes into one JSON-LD graph', () => {
    const result = graphSchema([
      { '@type': 'Product', name: 'Widget' },
      { '@type': 'BreadcrumbList', itemListElement: [] },
    ]);
    const parsed = JSON.parse(result);

    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toHaveLength(2);
    expect(parsed['@graph'][0]['@type']).toBe('Product');
  });

  it('removes nested contexts from graph nodes', () => {
    const result = graphSchema([
      JSON.parse(faqSchema([{ question: 'Q?', answer: 'A.' }])),
      JSON.parse(breadcrumbSchema([{ name: 'Home', url: '/' }])),
    ]);
    const parsed = JSON.parse(result);

    expect(parsed['@graph'][0]['@context']).toBeUndefined();
    expect(parsed['@graph'][1]['@context']).toBeUndefined();
    expect(parsed['@graph'][0]['@type']).toBe('FAQPage');
  });
});
