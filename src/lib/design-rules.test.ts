import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return listSourceFiles(path);
    return /\.(astro|ts)$/.test(path) ? [path] : [];
  });
}

describe('B2B inquiry design system guardrails', () => {
  it('does not style inquiry conversion CTAs with btn-primary', () => {
    const inquiryTerms = /(Request a Quote|Send RFQ|Get OEM Quote|Request Sample|Start RFQ|Get a Quote|Quote Now)/;
    const violations: string[] = [];

    for (const file of listSourceFiles(join(root, 'src'))) {
      const rel = relative(root, file);
      if (rel === 'src/pages/design-system/index.astro') continue;
      if (rel === 'src/lib/design-rules.test.ts') continue;
      const source = readFileSync(file, 'utf8');
      const ctaTags = source.match(/<(a|button)[^>]*class="[^"]*btn-primary[^"]*"[^>]*>[\s\S]*?<\/\1>/g) || [];
      ctaTags.forEach((tag) => {
        if (inquiryTerms.test(tag)) violations.push(rel);
      });
    }

    expect(violations).toEqual([]);
  });

  it('keeps D1 inquiry fields aligned with migrations and insert statements', () => {
    const requiredFields = ['extra_fields', 'lead_score', 'lead_grade'];
    const checkedFiles = [
      'migrations/002_inquiry_extra_fields.sql',
      'migrations/003_inquiry_lead_score.sql',
      'src/pages/api/inquiry.ts',
      'functions/api/inquiry.js',
      'src/lib/admin-inquiries.ts',
      'functions/_admin.js',
    ];

    for (const field of requiredFields) {
      const filesContainingField = checkedFiles.filter((file) => readFileSync(join(root, file), 'utf8').includes(field));
      expect(filesContainingField.length, `${field} should appear in schema/API/admin files`).toBeGreaterThanOrEqual(3);
    }
  });
});
