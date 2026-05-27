-- B2B Inquiry Station: inquiry lead scoring
-- Cloudflare D1

ALTER TABLE inquiries ADD COLUMN lead_score INTEGER;
ALTER TABLE inquiries ADD COLUMN lead_grade TEXT;
