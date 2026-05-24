import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import {
  buildRfqNotificationEmail,
  escapeHtml,
  formatQuoteItems,
  getMailConfig,
  validateInquiryEmail,
  type MailEnv,
  type QuoteItem,
} from '../../lib/inquiry';

function generateId(): string {
  return `rfq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isProduction(): boolean {
  return !!(process.env.CF_PAGES);
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const email = data.email?.toString() || '';
    const name = data.name?.toString() || '';
    const company = data.company?.toString() || '';
    const country = data.country?.toString() || '';
    const items = Array.isArray(data.items) ? data.items as QuoteItem[] : [];
    const industry = data.industry?.toString() || 'machinery';
    const locale = data.locale?.toString() || 'en';
    const sourcePage = data.source_page?.toString() || '';

    if (!name || !email || !country) {
      return new Response(JSON.stringify({ error: 'Name, email, and country are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!validateInquiryEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const inquiryId = generateId();
    const createdAt = Math.floor(Date.now() / 1000);

    const productSlugs = items.map((i) => i.slug || 'unknown').join(',');

    // Single atomic RFQ row — no partial inserts, idempotency via dedup key
    const idempotencyKey = data.idempotency_key?.toString() || inquiryId;
    const db = locals.runtime?.env?.DB;
    if (db) {
      await (db as D1Database)
        .prepare(
          `INSERT INTO rfq_requests (id, idempotency_key, industry, product_slugs, name, email, company, country, items_json, source_page, locale, status, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'new', ?12)`,
        )
        .bind(inquiryId, idempotencyKey, industry, productSlugs, name, email, company, country, JSON.stringify(items), sourcePage, locale, createdAt)
        .run();
    } else if (isProduction()) {
      console.error(`RFQ ${inquiryId}: DB binding missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send notification
    const runtimeEnv = (locals.runtime?.env || {}) as MailEnv;
    const mailConfig = getMailConfig({
      RESEND_API_KEY: runtimeEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY,
      NOTIFY_EMAIL: runtimeEnv.NOTIFY_EMAIL || import.meta.env.NOTIFY_EMAIL,
      FROM_EMAIL: runtimeEnv.FROM_EMAIL || import.meta.env.FROM_EMAIL,
      PUBLIC_SITE_URL: runtimeEnv.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL,
      SITE_URL: runtimeEnv.SITE_URL || import.meta.env.SITE_URL,
    }, new URL(request.url).origin);

    if (mailConfig.resendKey) {
      const resend = new Resend(mailConfig.resendKey);
      await resend.emails.send(buildRfqNotificationEmail({
        id: inquiryId,
        name,
        email,
        company,
        country,
        industry,
        locale,
        sourcePage,
        items,
      }, mailConfig));
      await resend.emails.send({
        from: `IndustryPro <${mailConfig.fromEmail}>`,
        to: email,
        subject: 'We received your batch RFQ',
        html: `<div style="font-family:Arial,sans-serif;color:#2D2C2B">
          <h2>Thank you for your RFQ, ${escapeHtml(name)}.</h2>
          <p>We received your request for ${items.length} ${items.length === 1 ? 'item' : 'items'} and will reply within 12 business hours.</p>
          <pre style="white-space:pre-wrap;background:#f7f7f6;padding:12px;border-radius:6px">${escapeHtml(formatQuoteItems(items))}</pre>
          <p>Your RFQ ID: <strong>${escapeHtml(inquiryId)}</strong></p>
        </div>`,
      });
    } else if (isProduction()) {
      console.error(`RFQ ${inquiryId}: RESEND_API_KEY missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: inquiryId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Quote cart error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
