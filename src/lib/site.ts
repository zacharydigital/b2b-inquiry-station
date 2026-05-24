const DEFAULT_SITE_URL = 'https://example.com';

export function getSiteUrl(configuredUrl?: string): string {
  const url = configuredUrl?.trim() || DEFAULT_SITE_URL;

  return url.replace(/\/+$/, '');
}

export function joinSiteUrl(configuredUrl: string | undefined, path = '/'): string {
  const siteUrl = getSiteUrl(configuredUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}
