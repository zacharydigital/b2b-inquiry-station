const t = (locale: string, key: string): string => {
  // In production, this loads from JSON files. For now, return key.
  return key;
};

export function getLocaleFromUrl(url: string): string {
  const match = url.match(/\/(en|es|pt|fr|de|ru|ar|zh)\//);
  return match ? match[1] : 'en';
}

export function getLocalePath(base: string, locale: string): string {
  const industry = (import.meta.env.INDUSTRY as string) || 'machinery';
  return `/${industry}/${locale}${base}`;
}

export const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export { t };
