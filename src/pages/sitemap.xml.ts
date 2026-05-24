import { getIndexableRoutes } from '../lib/routes';
import { getSiteUrl, joinSiteUrl } from '../lib/site';

export const prerender = true;

export async function GET() {
  const siteUrl = getSiteUrl(import.meta.env.PUBLIC_SITE_URL);
  const pages = getIndexableRoutes();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${joinSiteUrl(siteUrl, p.url)}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
