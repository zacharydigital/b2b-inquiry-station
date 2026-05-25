export interface AdminAuthEnv {
  ADMIN_TOKEN?: string;
  CF_PAGES?: string;
}

export interface AdminAuthResult {
  ok: boolean;
  status: number;
  error?: string;
}

export interface InquiryAdminFilters {
  status?: string;
  leadGrade?: string;
  industry?: string;
  productSlug?: string;
  email?: string;
  from?: number;
  to?: number;
  page: number;
  limit: number;
}

export interface InquiryAdminRow {
  id: string;
  created_at: number;
  created_at_iso: string;
  status: string;
  lead_score: number | null;
  lead_grade: string;
  industry: string;
  inquiry_type: string;
  product_slug: string;
  product_name: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  quantity: string;
  message: string;
  source_page: string;
  utm_source: string;
  locale: string;
  attachment_key: string;
  extra_fields: string;
}

export interface InquiryAdminResult {
  items: InquiryAdminRow[];
  page: number;
  limit: number;
  total: number;
}

interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  first<T = unknown>(): Promise<T | null>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

const CSV_HEADERS = [
  'id',
  'created_at',
  'status',
  'lead_score',
  'lead_grade',
  'industry',
  'inquiry_type',
  'product_slug',
  'product_name',
  'name',
  'email',
  'company',
  'country',
  'phone',
  'quantity',
  'message',
  'source_page',
  'utm_source',
  'locale',
  'attachment_key',
  'extra_fields',
] as const;

function cleanValue(value: string | null, maxLength = 160): string | undefined {
  const trimmed = value?.trim() || '';
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDateStart(value: string | null): number | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) ? Math.floor(time / 1000) : undefined;
}

function parseDateEnd(value: string | null): number | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T23:59:59.999Z`);
  return Number.isFinite(time) ? Math.floor(time / 1000) : undefined;
}

export function extractAdminToken(url: URL, authorization: string | null): string {
  const bearerPrefix = 'Bearer ';
  if (authorization?.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }
  return url.searchParams.get('token')?.trim() || '';
}

export function validateAdminRequest(
  url: URL,
  authorization: string | null,
  env: AdminAuthEnv,
  isProduction = false,
): AdminAuthResult {
  const configuredToken = env.ADMIN_TOKEN || (!isProduction ? 'local-admin' : '');

  if (!configuredToken) {
    return { ok: false, status: 404, error: 'Not found.' };
  }

  const token = extractAdminToken(url, authorization);
  if (!token || token !== configuredToken) {
    return { ok: false, status: 403, error: 'Forbidden.' };
  }

  return { ok: true, status: 200 };
}

export function parseInquiryAdminFilters(
  url: URL,
  options: { defaultLimit?: number; maxLimit?: number } = {},
): InquiryAdminFilters {
  const defaultLimit = options.defaultLimit || 25;
  const maxLimit = options.maxLimit || 100;
  const page = parsePositiveInt(url.searchParams.get('page'), 1);
  const requestedLimit = parsePositiveInt(url.searchParams.get('limit'), defaultLimit);

  return {
    status: cleanValue(url.searchParams.get('status'), 40),
    leadGrade: cleanValue(url.searchParams.get('lead_grade'), 20),
    industry: cleanValue(url.searchParams.get('industry'), 60),
    productSlug: cleanValue(url.searchParams.get('product_slug'), 120),
    email: cleanValue(url.searchParams.get('email'), 160),
    from: parseDateStart(url.searchParams.get('from')),
    to: parseDateEnd(url.searchParams.get('to')),
    page,
    limit: Math.min(requestedLimit, maxLimit),
  };
}

function buildWhere(filters: InquiryAdminFilters): { sql: string; binds: unknown[] } {
  const clauses: string[] = [];
  const binds: unknown[] = [];

  if (filters.status) {
    clauses.push('status = ?');
    binds.push(filters.status);
  }
  if (filters.leadGrade) {
    clauses.push('lead_grade = ?');
    binds.push(filters.leadGrade);
  }
  if (filters.industry) {
    clauses.push('industry = ?');
    binds.push(filters.industry);
  }
  if (filters.productSlug) {
    clauses.push('product_slug = ?');
    binds.push(filters.productSlug);
  }
  if (filters.email) {
    clauses.push('email LIKE ?');
    binds.push(`%${filters.email}%`);
  }
  if (filters.from) {
    clauses.push('created_at >= ?');
    binds.push(filters.from);
  }
  if (filters.to) {
    clauses.push('created_at <= ?');
    binds.push(filters.to);
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    binds,
  };
}

function normalizeRow(row: Partial<InquiryAdminRow>): InquiryAdminRow {
  const createdAt = Number(row.created_at || 0);
  return {
    id: row.id || '',
    created_at: createdAt,
    created_at_iso: createdAt ? new Date(createdAt * 1000).toISOString() : '',
    status: row.status || '',
    lead_score: row.lead_score == null ? null : Number(row.lead_score),
    lead_grade: row.lead_grade || '',
    industry: row.industry || '',
    inquiry_type: row.inquiry_type || '',
    product_slug: row.product_slug || '',
    product_name: row.product_name || '',
    name: row.name || '',
    email: row.email || '',
    company: row.company || '',
    country: row.country || '',
    phone: row.phone || '',
    quantity: row.quantity || '',
    message: row.message || '',
    source_page: row.source_page || '',
    utm_source: row.utm_source || '',
    locale: row.locale || '',
    attachment_key: row.attachment_key || '',
    extra_fields: row.extra_fields || '',
  };
}

export async function queryAdminInquiries(
  db: D1DatabaseLike,
  filters: InquiryAdminFilters,
): Promise<InquiryAdminResult> {
  const where = buildWhere(filters);
  const offset = (filters.page - 1) * filters.limit;
  const countRow = await db
    .prepare(`SELECT COUNT(*) AS total FROM inquiries ${where.sql}`)
    .bind(...where.binds)
    .first<{ total: number }>();

  const rows = await db
    .prepare(
      `SELECT id, created_at, status, lead_score, lead_grade, industry, inquiry_type, product_slug, product_name, name, email, company, country, phone, quantity, message, source_page, utm_source, locale, attachment_key, extra_fields
       FROM inquiries ${where.sql}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...where.binds, filters.limit, offset)
    .all<InquiryAdminRow>();

  return {
    items: (rows.results || []).map(normalizeRow),
    page: filters.page,
    limit: filters.limit,
    total: Number(countRow?.total || 0),
  };
}

export function escapeCsvCell(value: unknown): string {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildInquiriesCsv(rows: InquiryAdminRow[]): string {
  const lines = [
    CSV_HEADERS.map(escapeCsvCell).join(','),
    ...rows.map((row) => CSV_HEADERS.map((header) => escapeCsvCell(row[header])).join(',')),
  ];
  return `${lines.join('\n')}\n`;
}

export function getCsvFilename(date = new Date()): string {
  return `inquiries-${date.toISOString().slice(0, 10)}.csv`;
}
