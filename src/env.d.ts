/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly INDUSTRY: string;
  readonly RESEND_API_KEY: string;
  readonly NOTIFY_EMAIL: string;
  readonly FROM_EMAIL: string;
  readonly ADMIN_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly SITE_URL: string;
  readonly DB: D1Database;
  readonly FILES: R2Bucket;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'nanostores' {
  export { atom, computed, map, onMount, task } from 'nanostores';
}
