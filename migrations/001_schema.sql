-- B2B Inquiry Station: Initial Schema
-- Cloudflare D1

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  industry TEXT NOT NULL,
  product_slug TEXT,
  product_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  country TEXT,
  phone TEXT,
  quantity TEXT,
  message TEXT,
  inquiry_type TEXT DEFAULT 'single',
  source_page TEXT,
  utm_source TEXT,
  locale TEXT DEFAULT 'en',
  cart_items TEXT,
  attachment_key TEXT,
  status TEXT DEFAULT 'new',
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_inquiries_industry ON inquiries(industry);
CREATE INDEX idx_inquiries_created ON inquiries(created_at);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_product ON inquiries(product_slug);

CREATE TABLE IF NOT EXISTS download_leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  product_slug TEXT,
  file_type TEXT,
  industry TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_downloads_industry ON download_leads(industry);

CREATE TABLE IF NOT EXISTS rfq_requests (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  product_slugs TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  country TEXT NOT NULL,
  items_json TEXT NOT NULL,
  source_page TEXT,
  locale TEXT DEFAULT 'en',
  status TEXT DEFAULT 'new',
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_rfq_industry ON rfq_requests(industry);
CREATE INDEX idx_rfq_created ON rfq_requests(created_at);
CREATE INDEX idx_rfq_status ON rfq_requests(status);
