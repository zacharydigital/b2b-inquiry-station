import { getAllowedExtraFieldNames } from './verticals';

export interface MailEnv {
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  FROM_EMAIL?: string;
  PUBLIC_SITE_URL?: string;
  SITE_URL?: string;
}

export interface MailConfig {
  resendKey?: string;
  notifyEmail: string;
  fromEmail: string;
  siteUrl: string;
}

export interface QuoteItem {
  slug?: string;
  model?: string;
  title?: string;
  quantity?: number;
}

export interface InquiryEmailInput {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  productSlug: string;
  productName: string;
  quantity: string;
  message: string;
  inquiryType: string;
  sourcePage: string;
  utmSource: string;
  locale: string;
  cartItems: string;
  attachmentKey: string | null;
  extraFields: Record<string, string>;
}

export interface RfqEmailInput {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  industry: string;
  locale: string;
  sourcePage: string;
  items: QuoteItem[];
}

export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const disposableDomains = new Set([
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
]);

export function validateInquiryEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return false;

  const domain = normalized.split('@')[1];
  return !disposableDomains.has(domain);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getMailConfig(env: MailEnv, requestOrigin = 'http://localhost:4321'): MailConfig {
  return {
    resendKey: env.RESEND_API_KEY || undefined,
    notifyEmail: env.NOTIFY_EMAIL || 'inquiry@example.com',
    fromEmail: env.FROM_EMAIL || 'inquiry@example.com',
    siteUrl: env.PUBLIC_SITE_URL || env.SITE_URL || requestOrigin,
  };
}

export function formatQuoteItems(items: QuoteItem[]): string {
  return items
    .map((item, index) => {
      const slugOrModel = item.model || item.slug || 'Unknown model';
      const title = item.title || item.slug || 'Unknown product';
      const quantity = item.quantity || 1;
      return `${index + 1}. ${slugOrModel} - ${title} - Qty: ${quantity}`;
    })
    .join('\n');
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value || '-')}</strong></td></tr>`;
}

function formatExtraFieldLabel(name: string): string {
  return name
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function collectInquiryExtraFields(formData: FormData, vertical: string): Record<string, string> {
  const allowedNames = getAllowedExtraFieldNames(vertical);
  const extraFields: Record<string, string> = {};

  for (const name of allowedNames) {
    const value = formData.get(name);
    if (typeof value === 'string' && value.trim()) {
      extraFields[name] = value.trim();
    }
  }

  return extraFields;
}

export function buildInquiryEmails(input: InquiryEmailInput, config: MailConfig): {
  notification: EmailPayload;
  confirmation: EmailPayload;
} {
  const product = input.productName || input.productSlug || 'General inquiry';
  const contextRows = [
    row('Inquiry ID', input.id),
    row('Type', input.inquiryType),
    row('Name', input.name),
    row('Email', input.email),
    row('Company', input.company),
    row('Country', input.country),
    row('Phone / WhatsApp', input.phone),
    row('Product', product),
    row('Quantity', input.quantity),
    row('Locale', input.locale),
    row('UTM Source', input.utmSource),
    row('Source Page', input.sourcePage),
    row('Attachment', input.attachmentKey || ''),
  ].join('');

  const cartBlock = input.cartItems
    ? `<h3>Quote Cart</h3><pre style="white-space:pre-wrap;background:#f7f7f6;padding:12px;border-radius:6px">${escapeHtml(input.cartItems)}</pre>`
    : '';
  const extraRows = Object.entries(input.extraFields || {})
    .map(([label, value]) => row(formatExtraFieldLabel(label), value))
    .join('');
  const extraBlock = extraRows
    ? `<h3>Additional Requirements</h3><table cellpadding="0" cellspacing="0">${extraRows}</table>`
    : '';

  return {
    notification: {
      from: `IndustryPro Inquiry <${config.fromEmail}>`,
      to: config.notifyEmail,
      subject: `New Inquiry: ${product} from ${input.country || 'Unknown country'}`,
      html: `<div style="font-family:Arial,sans-serif;color:#2D2C2B">
        <h2>New B2B Inquiry</h2>
        <table cellpadding="0" cellspacing="0">${contextRows}</table>
        <h3>Requirements</h3>
        <p>${escapeHtml(input.message || '-')}</p>
        ${extraBlock}
        ${cartBlock}
      </div>`,
    },
    confirmation: {
      from: `IndustryPro <${config.fromEmail}>`,
      to: input.email,
      subject: 'We received your inquiry - reply within 12 hours',
      html: `<div style="font-family:Arial,sans-serif;color:#2D2C2B">
        <h2>Thank you for your inquiry, ${escapeHtml(input.name)}.</h2>
        <p>We received your request for <strong>${escapeHtml(product)}</strong>. Our sales engineer will reply within 12 business hours.</p>
        <p>Your inquiry ID: <strong>${escapeHtml(input.id)}</strong></p>
        <p>If you need to add drawings or urgent details, reply directly to this email.</p>
        <hr />
        <p style="color:#666;font-size:12px">No spam. No reselling. NDA available.</p>
      </div>`,
    },
  };
}

export function buildRfqNotificationEmail(input: RfqEmailInput, config: MailConfig): EmailPayload {
  const itemList = formatQuoteItems(input.items);
  const itemCount = input.items.length;

  return {
    from: `IndustryPro Inquiry <${config.fromEmail}>`,
    to: config.notifyEmail,
    subject: `Batch RFQ from ${input.name || input.country} - ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
    html: `<div style="font-family:Arial,sans-serif;color:#2D2C2B">
      <h2>Batch RFQ Received</h2>
      <table cellpadding="0" cellspacing="0">
        ${row('RFQ ID', input.id)}
        ${row('Name', input.name)}
        ${row('Email', input.email)}
        ${row('Company', input.company)}
        ${row('Country', input.country)}
        ${row('Industry', input.industry)}
        ${row('Locale', input.locale)}
        ${row('Source Page', input.sourcePage)}
      </table>
      <h3>Items</h3>
      <pre style="white-space:pre-wrap;background:#f7f7f6;padding:12px;border-radius:6px">${escapeHtml(itemList)}</pre>
    </div>`,
  };
}
