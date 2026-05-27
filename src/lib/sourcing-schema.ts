import { graphSchema } from './seo';
import type { Product } from './products';
import type { SourcingPage } from './sourcing-pages';

export function buildSourcingPageSchema(page: SourcingPage, products: Product[], siteUrl: string): string {
  const pageUrl = new URL(page.url, siteUrl).toString();

  return graphSchema([
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: page.h1, item: pageUrl },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@type': 'CollectionPage',
      name: page.h1,
      description: page.description,
      url: pageUrl,
      about: page.kicker,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: new URL(`/products/${product.slug}/`, siteUrl).toString(),
        })),
      },
    },
    ...products.map((product) => ({
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription,
      sku: product.sku,
      category: product.category,
      url: new URL(`/products/${product.slug}/`, siteUrl).toString(),
      brand: { '@type': 'Brand', name: 'IndustryPro' },
    })),
  ]);
}
