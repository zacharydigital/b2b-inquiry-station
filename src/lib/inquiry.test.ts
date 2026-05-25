import { describe, expect, it } from 'vitest';
import {
  buildInquiryEmails,
  buildRfqNotificationEmail,
  calculateLeadScore,
  collectInquiryExtraFields,
  formatQuoteItems,
  getMailConfig,
  validateInquiryEmail,
} from './inquiry';

describe('validateInquiryEmail', () => {
  it('rejects invalid and disposable email domains', () => {
    expect(validateInquiryEmail('bad-email')).toBe(false);
    expect(validateInquiryEmail('buyer@mailinator.com')).toBe(false);
    expect(validateInquiryEmail('buyer@example.com')).toBe(true);
  });
});

describe('getMailConfig', () => {
  it('uses configured sender, notify inbox, and site URL', () => {
    const config = getMailConfig({
      RESEND_API_KEY: 're_123',
      NOTIFY_EMAIL: 'sales@example.com',
      FROM_EMAIL: 'inquiry@example.com',
      PUBLIC_SITE_URL: 'https://factory.example.com',
    });

    expect(config).toEqual({
      resendKey: 're_123',
      notifyEmail: 'sales@example.com',
      fromEmail: 'inquiry@example.com',
      siteUrl: 'https://factory.example.com',
    });
  });

  it('falls back without using placeholder sender domains', () => {
    const config = getMailConfig({});

    expect(config.fromEmail).toBe('inquiry@example.com');
    expect(config.fromEmail).not.toContain('yourdomain.com');
  });
});

describe('buildInquiryEmails', () => {
  it('builds notification and confirmation emails with conversion context', () => {
    const emails = buildInquiryEmails(
      {
        id: 'inq_1',
        name: 'Ana <Buyer>',
        email: 'ana@example.com',
        company: 'Acme Importers',
        country: 'Mexico',
        phone: '+52 555',
        productSlug: 'planetary-gearbox-hg-series',
        productName: 'Planetary Gearbox HG-220',
        quantity: '120 pcs',
        message: 'Need CIF quote',
        inquiryType: 'single',
        sourcePage: 'https://factory.example.com/products/planetary-gearbox-hg-series/?utm_source=google',
        utmSource: 'google',
        locale: 'en',
        cartItems: '',
        attachmentKey: 'inquiries/machinery/file.pdf',
        extraFields: {},
        leadScore: 74,
        leadGrade: 'hot',
      },
      {
        resendKey: 're_123',
        notifyEmail: 'sales@example.com',
        fromEmail: 'inquiry@example.com',
        siteUrl: 'https://factory.example.com',
      },
    );

    expect(emails.notification.from).toBe('IndustryPro Inquiry <inquiry@example.com>');
    expect(emails.notification.to).toBe('sales@example.com');
    expect(emails.notification.subject).toContain('Planetary Gearbox HG-220');
    expect(emails.notification.html).toContain('Ana &lt;Buyer&gt;');
    expect(emails.notification.html).toContain('120 pcs');
    expect(emails.notification.html).toContain('hot');
    expect(emails.notification.html).toContain('74/100');
    expect(emails.notification.html).toContain('utm_source=google');
    expect(emails.notification.html).toContain('inquiries/machinery/file.pdf');
    expect(emails.confirmation.to).toBe('ana@example.com');
    expect(emails.confirmation.from).toBe('IndustryPro <inquiry@example.com>');
  });

  it('escapes and renders allowed vertical extra fields in notification emails', () => {
    const emails = buildInquiryEmails(
      {
        id: 'inq_2',
        name: 'Maya',
        email: 'maya@example.com',
        company: 'SafeChem',
        country: 'Malaysia',
        phone: '',
        productSlug: '',
        productName: 'Industrial Solvent',
        quantity: '2 tons',
        message: 'Need documents',
        inquiryType: 'sample',
        sourcePage: 'https://factory.example.com/products/solvent/',
        utmSource: '',
        locale: 'en',
        cartItems: '',
        attachmentKey: null,
        extraFields: {
          request_type: 'COA <urgent>',
          regulatory_requirement: 'REACH & RoHS',
        },
      },
      {
        resendKey: 're_123',
        notifyEmail: 'sales@example.com',
        fromEmail: 'inquiry@example.com',
        siteUrl: 'https://factory.example.com',
      },
    );

    expect(emails.notification.html).toContain('Additional Requirements');
    expect(emails.notification.html).toContain('COA &lt;urgent&gt;');
    expect(emails.notification.html).toContain('REACH &amp; RoHS');
  });
});

describe('calculateLeadScore', () => {
  it('grades high-intent B2B inquiries as hot', () => {
    const result = calculateLeadScore({
      company: 'Acme Importers',
      country: 'Mexico',
      phone: '+52 555',
      quantity: '1200 pcs',
      message: 'Need OEM quote with logo packaging, target delivery, and certification documents for retail launch.',
      inquiryType: 'OEM',
      vertical: 'consumer-oem',
      attachmentKey: 'inquiries/oem/ref.pdf',
      extraFields: {
        logo_or_packaging_needed: 'Logo and packaging',
        target_market: 'Mexico retail',
        reference_link: 'https://example.com/ref',
      },
    });

    expect(result).toEqual({ score: 100, grade: 'hot' });
  });

  it('keeps thin inquiries cold', () => {
    expect(calculateLeadScore({ country: 'US' })).toEqual({ score: 20, grade: 'cold' });
  });
});

describe('collectInquiryExtraFields', () => {
  it('keeps allowed vertical fields and ignores unknown form fields', () => {
    const form = new FormData();
    form.set('request_type', 'COA');
    form.set('regulatory_requirement', 'REACH');
    form.set('admin_notes', 'should not be accepted');

    expect(collectInquiryExtraFields(form, 'materials')).toEqual({
      request_type: 'COA',
      regulatory_requirement: 'REACH',
    });
  });
});

describe('formatQuoteItems', () => {
  it('normalizes quote cart items for email and database context', () => {
    const result = formatQuoteItems([
      { slug: 'hg', model: 'HG-220', title: 'Planetary Gearbox', quantity: 2 },
      { slug: 'sm', title: 'Servo Motor' },
    ]);

    expect(result).toBe('1. HG-220 - Planetary Gearbox - Qty: 2\n2. sm - Servo Motor - Qty: 1');
  });
});

describe('buildRfqNotificationEmail', () => {
  it('builds an RFQ notification from cart data', () => {
    const email = buildRfqNotificationEmail(
      {
        id: 'rfq_1',
        name: 'Luis',
        email: 'luis@example.com',
        company: 'TecnoMex',
        country: 'Mexico',
        industry: 'machinery',
        locale: 'es',
        sourcePage: 'https://factory.example.com/contact/',
        items: [{ slug: 'hg', model: 'HG-220', title: 'Planetary Gearbox', quantity: 3 }],
      },
      {
        resendKey: 're_123',
        notifyEmail: 'sales@example.com',
        fromEmail: 'inquiry@example.com',
        siteUrl: 'https://factory.example.com',
      },
    );

    expect(email.from).toBe('IndustryPro Inquiry <inquiry@example.com>');
    expect(email.to).toBe('sales@example.com');
    expect(email.subject).toContain('1 item');
    expect(email.html).toContain('HG-220');
    expect(email.html).toContain('https://factory.example.com/contact/');
  });
});
