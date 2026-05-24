# Remaining Optimization Plan

This document records the current unfinished priorities for turning this project into a deployable, high-conversion B2B export inquiry website template.

## P0: Deployment Readiness

- Complete production values in `wrangler.toml`: `database_id`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, `FROM_EMAIL`, `PUBLIC_SITE_URL`, and `SITE_URL`.
- Create the Cloudflare D1 database and apply `migrations/001_schema.sql`.
- Verify the sender domain in Resend. Do not deploy with `inquiry@example.com` as the production sender.
- Set the real domain in Cloudflare Pages environment variables so canonical URLs, JSON-LD, `robots.txt`, and `sitemap.xml` do not fall back to `https://example.com`.
- Configure a Git remote such as `origin` before syncing or deploying from the repository.

## P1: Content Trust and E-E-A-T

- Replace placeholder certificate numbers, client logos, and sample case studies with verifiable buyer evidence.
- Replace `/static/placeholder.jpg` assets with real product photos, factory photos, QC process images, packaging images, and downloadable documents.
- Remove or replace named customer logos such as Siemens, ABB, Bosch, Rockwell, and Schneider unless there is authorization or verifiable cooperation evidence.
- Replace placeholder contact information such as `+1-XXX-XXX-XXXX` and `inquiry@example.com` with real company contact details.

## P1: Product and SEO System

- Expand the product catalog beyond the current sample products in `src/lib/products.ts`.
- Decide whether product data should remain in TypeScript or move fully into content files under `src/content/machinery/products/`.
- Connect existing product content files, such as `planetary-gearbox-hg220.md`, to the PLP/PDP rendering pipeline.
- Make PLP filters URL/query-aware and indexable where useful, instead of purely presentational.
- Add SEO landing page types for industries, applications, solutions, and product alternatives/comparisons.

## P1: Conversion Loop

- Add a basic lead management/admin view for inquiries, RFQs, and download leads.
- Add `reply_to=sales@aiseopilot.com` to inquiry, RFQ, download-gate, and buyer confirmation emails so replies reach the Enterprise WeChat mailbox.
- Provide real PDF/download assets for `/downloads/...pdf` links used by the download-gate flow.
- Improve RFQ cart conversion with saved drafts, product comparison-to-RFQ actions, lead scoring, and optional CRM/Webhook forwarding.
- Upgrade the thank-you page with next-step guidance, recommended products, downloads, WhatsApp/meeting links, and trust reinforcement.

## P2: Engineering and Template Productization

- Centralize brand, company, navigation, contact, and trust settings into shared site/company config modules.
- Complete multilingual content coverage for PLP, PDP, About, Compare, Certifications, Contact, and RFQ pages.
- Add end-to-end tests for inquiry submission, RFQ cart submission, download gate, and production failure behavior when Cloudflare bindings are missing.
- Add a deployment check script that detects missing production environment variables, unapplied D1 migrations, placeholder domains, placeholder contact details, and placeholder assets.

## Recommended Next Step

Start with deployment readiness and placeholder cleanup. These items directly affect whether the template can be safely deployed to Cloudflare Pages without broken lead capture, misleading trust claims, or incorrect SEO URLs.
