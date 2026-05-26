import {
  EMAIL_STYLES,
  escapeHtml,
  formatQuoteItems,
  generateId,
  getMailConfig,
  json,
  sendResendEmail,
  serviceUnavailable,
  validateInquiryEmail,
} from '../_shared.js';

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const email = data.email?.toString() || '';
    const name = data.name?.toString() || '';
    const company = data.company?.toString() || '';
    const country = data.country?.toString() || '';
    const items = Array.isArray(data.items) ? data.items : [];
    const industry = data.industry?.toString() || 'machinery';
    const locale = data.locale?.toString() || 'en';
    const sourcePage = data.source_page?.toString() || '';

    if (!name || !email || !country) {
      return json({ error: 'Name, email, and country are required.' }, 400);
    }

    if (!validateInquiryEmail(email)) {
      return json({ error: 'Invalid email address.' }, 400);
    }

    if (items.length === 0) {
      return json({ error: 'Cart is empty.' }, 400);
    }

    if (!env.DB) return serviceUnavailable();

    const inquiryId = generateId('rfq');
    const createdAt = Math.floor(Date.now() / 1000);
    const productSlugs = items.map((item) => item.slug || 'unknown').join(',');
    const idempotencyKey = data.idempotency_key?.toString() || inquiryId;

    await env.DB.prepare(
      `INSERT INTO rfq_requests (id, idempotency_key, industry, product_slugs, name, email, company, country, items_json, source_page, locale, status, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'new', ?12)`,
    )
      .bind(inquiryId, idempotencyKey, industry, productSlugs, name, email, company, country, JSON.stringify(items), sourcePage, locale, createdAt)
      .run();

    const mailConfig = getMailConfig(env, request.url);
    const itemSummary = formatQuoteItems(items);
    const notification = await sendResendEmail(mailConfig, {
      from: `IndustryPro Inquiry <${mailConfig.fromEmail}>`,
      to: mailConfig.notifyEmail,
      subject: `New batch RFQ from ${name}`,
      html: `<div style="${EMAIL_STYLES.root}">
        <h2>New batch RFQ</h2>
        <p><strong>ID:</strong> ${escapeHtml(inquiryId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Country:</strong> ${escapeHtml(country)}</p>
        <p><strong>Source:</strong> ${escapeHtml(sourcePage)}</p>
        <pre style="${EMAIL_STYLES.pre}">${escapeHtml(itemSummary)}</pre>
      </div>`,
    });

    if (!notification.ok) return serviceUnavailable();

    const confirmation = await sendResendEmail(mailConfig, {
      from: `IndustryPro <${mailConfig.fromEmail}>`,
      to: email,
      subject: 'We received your batch RFQ',
      html: `<div style="${EMAIL_STYLES.root}">
        <h2>Thank you for your RFQ, ${escapeHtml(name)}.</h2>
        <p>We received your request for ${items.length} ${items.length === 1 ? 'item' : 'items'} and will reply within 12 business hours.</p>
        <pre style="${EMAIL_STYLES.pre}">${escapeHtml(itemSummary)}</pre>
        <p>Your RFQ ID: <strong>${escapeHtml(inquiryId)}</strong></p>
      </div>`,
    });

    if (!confirmation.ok) return serviceUnavailable();

    return json({ success: true, id: inquiryId });
  } catch (error) {
    console.error('Quote cart function error:', error);
    return json({ error: 'Something went wrong.' }, 500);
  }
}
