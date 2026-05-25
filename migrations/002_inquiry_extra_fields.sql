-- B2B Inquiry Station: vertical-specific inquiry metadata
-- Cloudflare D1

ALTER TABLE inquiries ADD COLUMN extra_fields TEXT;
