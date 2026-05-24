import type { DesignTokens } from './types';

export interface IndustryConfig {
  name: string;
  label: string;
  meta: {
    title: string;
    description: string;
  };
  tokens: DesignTokens;
  locales: string[];
  defaultLocale: string;
  modules: {
    tier1: string[];
    tier2: string[];
    tier3: string[];
  };
}

export interface DesignTokens {
  primary: string;
  primary_900: string;
  accent: string;
}

const industry = (import.meta.env.INDUSTRY as string) || 'machinery';

let cached: IndustryConfig | null = null;

export async function getIndustryConfig(): Promise<IndustryConfig> {
  if (cached) return cached;
  const mod = await import(`../content/${industry}/config.json`);
  cached = mod.default as IndustryConfig;
  return cached;
}

export function getIndustry(): string {
  return industry;
}

export function getTokenOverrides(config: IndustryConfig): string {
  return `
    :root {
      --color-primary: ${config.tokens.primary};
      --color-primary-900: ${config.tokens.primary_900};
      --color-accent: ${config.tokens.accent};
    }
  `;
}
