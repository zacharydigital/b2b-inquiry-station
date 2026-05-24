import { describe, expect, it } from 'vitest';
import {
  buildInquiryEmails,
  buildRfqNotificationEmail,
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
    expect(emails.notification.html).toContain('utm_source=google');
    expect(emails.notification.html).toContain('inquiries/machinery/file.pdf');
    expect(emails.confirmation.to).toBe('ana@example.com');
    expect(emails.confirmation.from).toBe('IndustryPro <inquiry@example.com>');
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
