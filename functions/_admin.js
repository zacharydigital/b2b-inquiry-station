export function extractAdminToken(requestUrl, authorization = '') {
  const url = new URL(requestUrl);
  const bearerPrefix = 'Bearer ';
  if (authorization.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }
  return url.searchParams.get('token')?.trim() || '';
}

export function validateAdminRequest(request, env = {}) {
  const isProduction = Boolean(env.CF_PAGES || env.PUBLIC_SITE_URL?.startsWith('https://'));
  const configuredToken = env.ADMIN_TOKEN || (!isProduction ? 'local-admin' : '');

  if (!configuredToken) {
    return { ok: false, status: 404, error: 'Not found.' };
  }

  const token = extractAdminToken(request.url, request.headers.get('authorization') || '');
  if (!token || token !== configuredToken) {
    return { ok: false, status: 403, error: 'Forbidden.' };
  }

  return { ok: true, status: 200 };
}

function cleanValue(value, maxLength = 160) {
  const trimmed = value?.trim() || '';
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseDateStart(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) ? Math.floor(time / 1000) : undefined;
}

function parseDateEnd(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T23:59:59.999Z`);
  return Number.isFinite(time) ? Math.floor(time / 1000) : undefined;
}

export function parseInquiryAdminFilters(requestUrl, options = {}) {
  const url = new URL(requestUrl);
  const defaultLimit = options.defaultLimit || 25;
  const maxLimit = options.maxLimit || 100;
  const page = parsePositiveInt(url.searchParams.get('page'), 1);
  const requestedLimit = parsePositiveInt(url.searchParams.get('limit'), defaultLimit);

  return {
    status: cleanValue(url.searchParams.get('status'), 40),
    industry: cleanValue(url.searchParams.get('industry'), 60),
    productSlug: cleanValue(url.searchParams.get('product_slug'), 120),
    email: cleanValue(url.searchParams.get('email'), 160),
    from: parseDateStart(url.searchParams.get('from')),
    to: parseDateEnd(url.searchParams.get('to')),
    page,
    limit: Math.min(requestedLimit, maxLimit),
  };
}

function buildWhere(filters) {
  const clauses = [];
  const binds = [];

  if (filters.status) {
    clauses.push('status = ?');
    binds.push(filters.status);
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

function normalizeRow(row = {}) {
  const createdAt = Number(row.created_at || 0);
  return {
    id: row.id || '',
    created_at: createdAt,
    created_at_iso: createdAt ? new Date(createdAt * 1000).toISOString() : '',
    status: row.status || '',
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

export async function queryAdminInquiries(db, filters) {
  const where = buildWhere(filters);
  const offset = (filters.page - 1) * filters.limit;
  const countRow = await db
    .prepare(`SELECT COUNT(*) AS total FROM inquiries ${where.sql}`)
    .bind(...where.binds)
    .first();

  const rows = await db
    .prepare(
      `SELECT id, created_at, status, industry, inquiry_type, product_slug, product_name, name, email, company, country, phone, quantity, message, source_page, utm_source, locale, attachment_key, extra_fields
       FROM inquiries ${where.sql}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...where.binds, filters.limit, offset)
    .all();

  return {
    items: (rows.results || []).map(normalizeRow),
    page: filters.page,
    limit: filters.limit,
    total: Number(countRow?.total || 0),
  };
}

const CSV_HEADERS = [
  'id',
  'created_at',
  'status',
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
];

export function escapeCsvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildInquiriesCsv(rows) {
  const lines = [
    CSV_HEADERS.map(escapeCsvCell).join(','),
    ...rows.map((row) => CSV_HEADERS.map((header) => escapeCsvCell(row[header])).join(',')),
  ];
  return `${lines.join('\n')}\n`;
}

export function getCsvFilename(date = new Date()) {
  return `inquiries-${date.toISOString().slice(0, 10)}.csv`;
}
