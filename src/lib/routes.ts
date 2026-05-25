import { listProducts } from './products';
import { SOURCING_PAGES } from './sourcing-pages';

export interface IndexableRoute {
  url: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

export function getIndexableRoutes(): IndexableRoute[] {
  return [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/products/', changefreq: 'daily', priority: 0.9 },
    ...listProducts().map((product) => ({
      url: `/products/${product.slug}/`,
      changefreq: 'weekly' as const,
      priority: 0.8,
    })),
    ...SOURCING_PAGES.map((page) => ({
      url: page.url,
      changefreq: 'weekly' as const,
      priority: 0.75,
    })),
    { url: '/get-a-quote/', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact/', changefreq: 'monthly', priority: 0.7 },
    { url: '/about/', changefreq: 'monthly', priority: 0.7 },
    { url: '/certifications/', changefreq: 'monthly', priority: 0.6 },
    { url: '/compare/', changefreq: 'monthly', priority: 0.6 },
  ];
}
