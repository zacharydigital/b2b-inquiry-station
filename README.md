# B2B Inquiry Station

Astro + UnoCSS template for high-conversion B2B export inquiry sites. It is designed for Cloudflare Pages, Cloudflare D1, Cloudflare R2, and Resend transactional email.

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm preview
```

Local builds default to static output. Cloudflare Pages builds switch to server output when `CF_PAGES` or `CLOUDFLARE_ACCOUNT_ID` is present.

## Project Structure

- `src/pages/`: Astro routes, product pages, and API endpoints.
- `src/pages/api/`: inquiry, quote cart, and download gate handlers.
- `src/components/`: UI, trust, inquiry, and FAB-E product sections.
- `src/content/machinery/`: industry content and locale files.
- `src/lib/`: shared TypeScript utilities and tests.
- `migrations/`: Cloudflare D1 schema.
- `public/`: static assets and Cloudflare headers.

## Required Production Configuration

Create Cloudflare resources and keep binding names aligned with `wrangler.toml`.

```toml
[[d1_databases]]
binding = "DB"
database_name = "b2b-inquiries"
database_id = "<cloudflare-d1-database-id>"

[[r2_buckets]]
binding = "FILES"
bucket_name = "b2b-inquiry-files"
```

Set these Cloudflare Pages variables or secrets:

```env
RESEND_API_KEY=re_xxx
NOTIFY_EMAIL=sales@aiseopilot.com
FROM_EMAIL=inquiry@send.aiseopilot.com
PUBLIC_SITE_URL=https://b2b-inquiry-station.pages.dev
SITE_URL=https://b2b-inquiry-station.pages.dev
```

`FROM_EMAIL` must use a sender domain verified in Resend. Do not leave production values blank.

## D1 Migration

Apply the schema before accepting production inquiries:

```bash
pnpm dlx wrangler d1 execute b2b-inquiries --remote --file=migrations/001_schema.sql
```

The schema supports single-product inquiries, batch RFQs, download leads, source-page tracking, attachment keys, and inquiry status fields.

## Conversion Flow

Product and contact forms POST to `/api/inquiry`. Quote cart submissions POST to `/api/quote-cart`. Download gates POST to `/api/download-gate`. In production, API routes fail closed when required D1 or Resend configuration is missing, so setup issues surface instead of silently losing leads.
