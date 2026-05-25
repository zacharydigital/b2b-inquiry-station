import { describe, expect, it } from 'vitest';
import {
  buildInquiriesCsv,
  escapeCsvCell,
  extractAdminToken,
  getCsvFilename,
  parseInquiryAdminFilters,
  validateAdminRequest,
  type InquiryAdminRow,
} from './admin-inquiries';

function makeUrl(path: string): URL {
  return new URL(path, 'https://factory.example.com');
}

const row: InquiryAdminRow = {
  id: 'inq_1',
  created_at: 1_779_724_800,
  created_at_iso: '2026-05-25T00:00:00.000Z',
  status: 'new',
  industry: 'materials',
  inquiry_type: 'sample',
  product_slug: 'pa66-gf30',
  product_name: 'PA66 GF30',
  name: 'Ana',
  email: 'ana@example.com',
  company: 'Acme',
  country: 'Mexico',
  phone: '+52',
  quantity: '2 tons',
  message: 'Need "COA", SDS\nand bulk price',
  source_page: 'https://factory.example.com/products/pa66-gf30/',
  utm_source: 'google',
  locale: 'en',
  attachment_key: 'inquiries/materials/file.pdf',
  extra_fields: '{"request_type":"COA"}',
};

describe('admin inquiry auth', () => {
  it('extracts token from query string and bearer headers', () => {
    expect(extractAdminToken(makeUrl('/admin?token=abc'), null)).toBe('abc');
    expect(extractAdminToken(makeUrl('/admin?token=abc'), 'Bearer from-header')).toBe('from-header');
  });

  it('allows the configured token and rejects missing or wrong tokens', () => {
    expect(validateAdminRequest(makeUrl('/admin?token=secret'), null, { ADMIN_TOKEN: 'secret' }, true).ok).toBe(true);
    expect(validateAdminRequest(makeUrl('/admin'), null, { ADMIN_TOKEN: 'secret' }, true)).toMatchObject({
      ok: false,
      status: 403,
    });
    expect(validateAdminRequest(makeUrl('/admin?token=wrong'), null, { ADMIN_TOKEN: 'secret' }, true)).toMatchObject({
      ok: false,
      status: 403,
    });
  });

  it('hides admin APIs in production when ADMIN_TOKEN is missing', () => {
    expect(validateAdminRequest(makeUrl('/admin?token=anything'), null, {}, true)).toMatchObject({
      ok: false,
      status: 404,
    });
  });

  it('uses a local development fallback token outside production', () => {
    expect(validateAdminRequest(makeUrl('/admin?token=local-admin'), null, {}, false).ok).toBe(true);
  });
});

describe('parseInquiryAdminFilters', () => {
  it('parses filters with default pagination', () => {
    const filters = parseInquiryAdminFilters(
      makeUrl('/api/admin/inquiries.json?status=new&industry=materials&product_slug=pa66-gf30&email=ana&from=2026-05-01&to=2026-05-25'),
    );

    expect(filters).toMatchObject({
      status: 'new',
      industry: 'materials',
      productSlug: 'pa66-gf30',
      email: 'ana',
      page: 1,
      limit: 25,
    });
    expect(filters.from).toBeGreaterThan(0);
    expect(filters.to).toBeGreaterThan(filters.from || 0);
  });

  it('limits page size and ignores invalid dates', () => {
    const filters = parseInquiryAdminFilters(makeUrl('/api/admin/inquiries.json?page=3&limit=999&from=bad&to=also-bad'));

    expect(filters.page).toBe(3);
    expect(filters.limit).toBe(100);
    expect(filters.from).toBeUndefined();
    expect(filters.to).toBeUndefined();
  });
});

describe('buildInquiriesCsv', () => {
  it('escapes CSV cells and includes headers', () => {
    const csv = buildInquiriesCsv([row]);

    expect(csv).toContain('"id","created_at","status"');
    expect(csv).toContain('"Need ""COA"", SDS\nand bulk price"');
    expect(csv).toContain('"{""request_type"":""COA""}"');
  });

  it('guards against spreadsheet formula injection', () => {
    expect(escapeCsvCell('=IMPORTXML("https://bad.example")')).toBe('"\'=IMPORTXML(""https://bad.example"")"');
    expect(escapeCsvCell('+SUM(1,2)')).toBe('"\'+SUM(1,2)"');
    expect(escapeCsvCell('-10')).toBe('"\'-10"');
    expect(escapeCsvCell('@cmd')).toBe('"\'@cmd"');
  });

  it('generates stable export filenames from dates', () => {
    expect(getCsvFilename(new Date('2026-05-25T12:00:00.000Z'))).toBe('inquiries-2026-05-25.csv');
  });
});
