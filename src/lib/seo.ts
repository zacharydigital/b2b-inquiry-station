export function generateSchema(schema: Record<string, unknown>): string {
  return JSON.stringify({ '@context': 'https://schema.org', ...schema });
}

export function graphSchema(nodes: Record<string, unknown>[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes.map(({ '@context': _context, ...node }) => node),
  });
}

export function schemaNode(schema: Record<string, unknown>): Record<string, unknown> {
  return schema;
}

export function organizationSchema(config: { name: string; url: string }) {
  return generateSchema({
    '@type': 'Organization',
    name: config.name,
    url: config.url,
  });
}

export function productSchema(product: {
  name: string;
  description: string;
  image?: string;
  sku: string;
  brand: string;
  category?: string;
  url?: string;
  mpn?: string;
  offers?: { availability: string };
}) {
  return generateSchema({
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    mpn: product.mpn || product.sku,
    category: product.category,
    url: product.url,
    brand: { '@type': 'Brand', name: product.brand },
    offers: product.offers
      ? { '@type': 'Offer', availability: `https://schema.org/${product.offers.availability}` }
      : undefined,
  });
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return generateSchema({
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  });
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return generateSchema({
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  });
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return generateSchema({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function localBusinessSchema(config: {
  name: string;
  url: string;
  email: string;
  telephone?: string;
}) {
  return generateSchema({
    '@type': 'LocalBusiness',
    name: config.name,
    url: config.url,
    email: config.email,
    telephone: config.telephone,
  });
}
