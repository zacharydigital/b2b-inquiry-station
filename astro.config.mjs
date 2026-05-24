// @ts-check
import { defineConfig } from 'astro/config';
import unocss from '@unocss/astro';
import cloudflare from '@astrojs/cloudflare';

const isCloudflare = !!process.env.CF_PAGES || !!process.env.CLOUDFLARE_ACCOUNT_ID;

export default defineConfig({
  integrations: [unocss({ injectReset: true })],
  output: isCloudflare ? 'server' : 'static',
  adapter: isCloudflare
    ? cloudflare({
        imageService: 'passthrough',
        prerenderEnvironment: 'node',
      })
    : undefined,
  vite: {
    ssr: {
      noExternal: ['@unocss/reset', 'nanostores'],
    },
  },
});
