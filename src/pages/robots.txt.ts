import { getSiteUrl, joinSiteUrl } from '../lib/site';

export const prerender = true;

export async function GET() {
  const siteUrl = getSiteUrl(import.meta.env.PUBLIC_SITE_URL);

  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /thank-you/

Sitemap: ${joinSiteUrl(siteUrl, '/sitemap.xml')}
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
