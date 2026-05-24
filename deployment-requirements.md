# Deployment Requirements

This document lists the required configuration and execution steps before deploying this project to Cloudflare Pages.

## Required Services

- Cloudflare Pages: hosts the Astro site and Pages Functions.
- Cloudflare D1: stores inquiries, RFQs, and download leads.
- Cloudflare R2: stores uploaded files such as drawings, PDFs, DWG, STEP, and images.
- Resend: sends inquiry notifications and buyer confirmation emails.

## Required Parameters

| Parameter or Binding | Purpose | Required | Example |
|---|---|---:|---|
| `DB` | D1 binding used by API routes | Yes | `DB` |
| `database_id` | Cloudflare D1 database UUID | Yes | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `FILES` | R2 binding used for uploaded files | Yes | `FILES` |
| `bucket_name` | R2 bucket name | Yes | `b2b-inquiry-files` |
| `RESEND_API_KEY` | Resend transactional email key | Yes | `re_xxx` |
| `NOTIFY_EMAIL` | Internal sales notification recipient | Yes | `sales@aiseopilot.com` |
| `FROM_EMAIL` | Verified sender email | Yes | `inquiry@send.aiseopilot.com` |
| `PUBLIC_SITE_URL` | Public site URL for canonical, schema, sitemap, robots | Yes | `https://b2b-inquiry-station.pages.dev` |
| `SITE_URL` | Backend fallback site URL for email links | Yes | `https://b2b-inquiry-station.pages.dev` |
| `NODE_VERSION` | Cloudflare Pages build Node version | Recommended | `22.12.0` |

## 1. Confirm Production Domain

The temporary demo production domain is:

```env
PUBLIC_SITE_URL=https://b2b-inquiry-station.pages.dev
SITE_URL=https://b2b-inquiry-station.pages.dev
```

These values affect canonical URLs, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml`.

Custom domain setup is deferred. Do not point production SEO URLs to `b2b.aiseo.dpdns.org` until a new custom domain is active in Cloudflare Pages and returns HTTP 200.

## 2. Create Cloudflare D1 Database

Log in to Cloudflare:

```bash
pnpm dlx wrangler login
```

Create the D1 database:

```bash
pnpm dlx wrangler d1 create b2b-inquiries
```

Copy the returned `database_id` into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "b2b-inquiries"
database_id = "your-d1-database-id"
```

The binding name must remain `DB`.

## 3. Apply D1 Schema

Run the migration before accepting production inquiries:

```bash
pnpm dlx wrangler d1 execute b2b-inquiries --remote --file=migrations/001_schema.sql
```

This creates:

- `inquiries`
- `download_leads`
- `rfq_requests`

## 4. Create Cloudflare R2 Bucket

Create the bucket:

```bash
pnpm dlx wrangler r2 bucket create b2b-inquiry-files
```

Confirm `wrangler.toml` contains:

```toml
[[r2_buckets]]
binding = "FILES"
bucket_name = "b2b-inquiry-files"
```

The binding name must remain `FILES`.

## 5. Configure Resend

In Resend:

1. Add and verify the sending domain, for example `yourdomain.com`.
2. Add the required DNS records.
3. Wait until the domain status is verified.
4. Create an API key.

Use the verified Resend sender subdomain:

```env
FROM_EMAIL=inquiry@send.aiseopilot.com
NOTIFY_EMAIL=sales@aiseopilot.com
RESEND_API_KEY=re_xxx
```

Do not deploy with `FROM_EMAIL=inquiry@example.com`.

Follow-up task: add `reply_to=sales@aiseopilot.com` to all system emails so buyer replies go to the Enterprise WeChat mailbox instead of the Resend sender identity.

## 6. Configure Cloudflare Pages Environment Variables

In Cloudflare:

```text
Workers & Pages
→ Your Pages project
→ Settings
→ Environment variables
→ Production
```

Add:

```env
RESEND_API_KEY=re_xxx
NOTIFY_EMAIL=sales@aiseopilot.com
FROM_EMAIL=inquiry@send.aiseopilot.com
PUBLIC_SITE_URL=https://b2b-inquiry-station.pages.dev
SITE_URL=https://b2b-inquiry-station.pages.dev
NODE_VERSION=22.12.0
```

Store `RESEND_API_KEY` as a secret or encrypted variable when possible.

## 7. Configure Cloudflare Pages Build

Recommended Pages build settings:

```text
Framework preset: Astro
Build command: pnpm build
Build output directory: dist
Root directory: /
Node version: 22.12.0 or higher
```

The project requires Node `>=22.12.0`.

## 8. Recommended `wrangler.toml`

Keep resource bindings in `wrangler.toml`. Keep secrets in Cloudflare Pages environment variables.

```toml
name = "b2b-inquiry-station"
compatibility_date = "2026-05-15"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "b2b-inquiries"
database_id = "your-d1-database-id"

[[r2_buckets]]
binding = "FILES"
bucket_name = "b2b-inquiry-files"

[vars]
PUBLIC_SITE_URL = "http://localhost:4321"
SITE_URL = "http://localhost:4321"
FROM_EMAIL = "inquiry@send.aiseopilot.com"
```

## 9. Post-Deployment Verification

After deployment, verify:

- `https://b2b-inquiry-station.pages.dev/robots.txt`
- `https://b2b-inquiry-station.pages.dev/sitemap.xml`
- `https://b2b-inquiry-station.pages.dev/products/`
- `https://b2b-inquiry-station.pages.dev/get-a-quote/`

Check that:

- `robots.txt` uses the real sitemap URL.
- `sitemap.xml` uses the real production domain.
- Product pages output real canonical URLs.
- Test inquiry submissions create D1 records.
- File uploads create R2 objects.
- `NOTIFY_EMAIL` receives the inquiry notification.
- The buyer email receives the confirmation email.

## Execution Order

1. Confirm the production domain and sender domain.
2. Verify the sender domain in Resend.
3. Create the D1 database and update `database_id`.
4. Create the R2 bucket.
5. Configure Cloudflare Pages production environment variables.
6. Apply the D1 schema.
7. Deploy to Cloudflare Pages.
8. Submit a test inquiry and verify D1, R2, and Resend behavior.
