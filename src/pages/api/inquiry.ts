import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import {
  buildInquiryEmails,
  calculateLeadScore,
  collectInquiryExtraFields,
  getMailConfig,
  validateInquiryEmail,
  type MailEnv,
} from '../../lib/inquiry';

function generateId(): string {
  return `inq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isProduction(): boolean {
  return !!(process.env.CF_PAGES);
}

export const GET: APIRoute = async () => new Response(JSON.stringify({ error: 'Method not allowed.' }), {
  status: 405,
  headers: {
    'Content-Type': 'application/json',
    'Allow': 'POST',
  },
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();

    // Honeypot check
    const honeypot = formData.get('website_url');
    if (honeypot && honeypot.toString().length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const email = formData.get('email')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const company = formData.get('company')?.toString() || '';
    const country = formData.get('country')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const quantity = formData.get('quantity')?.toString() || '';
    const message = formData.get('message')?.toString() || '';
    const inquiryType = formData.get('inquiry_type')?.toString() || 'single';
    const productSlug = formData.get('product_slug')?.toString() || '';
    const productName = formData.get('product_name')?.toString() || '';
    const industry = formData.get('industry')?.toString() || 'machinery';
    const sourcePage = formData.get('source_page')?.toString() || '';
    const utmSource = formData.get('utm_source')?.toString() || '';
    const locale = formData.get('locale')?.toString() || 'en';
    const cartItems = formData.get('cart_items')?.toString() || '';
    const extraFields = collectInquiryExtraFields(formData, industry);

    // Field validation
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

    const inquiryId = generateId();
    const createdAt = Math.floor(Date.now() / 1000);

    // File upload handling
    let attachmentKey: string | null = null;
    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'File exceeds 10MB limit.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/vnd.dwg',
        'application/octet-stream',
      ];
      const ext = file.name.split('.').pop() || 'bin';
      if (
        !allowedTypes.includes(file.type) &&
        !['pdf', 'jpg', 'jpeg', 'png', 'dwg', 'step', 'igs', 'x_t'].includes(ext.toLowerCase())
      ) {
        return new Response(JSON.stringify({ error: 'Unsupported file type.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const key = `inquiries/${industry}/${new Date().toISOString().slice(0, 10)}/${createdAt}-${productSlug}-${inquiryId}.${ext}`;
      // R2 upload if binding available
      if (locals.runtime?.env?.FILES) {
        await (locals.runtime.env.FILES as R2Bucket).put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type },
        });
        attachmentKey = key;
      } else if (isProduction()) {
        console.error(`Inquiry ${inquiryId}: FILES binding missing in production`);
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const lead = calculateLeadScore({
      company,
      country,
      phone,
      quantity,
      message,
      inquiryType,
      vertical: industry,
      attachmentKey,
      extraFields,
    });

    // D1 write — fail closed in production
    const db = locals.runtime?.env?.DB;
    if (db) {
      await (db as D1Database)
        .prepare(
          `INSERT INTO inquiries (id, industry, product_slug, product_name, name, email, company, country, phone, quantity, message, inquiry_type, source_page, utm_source, locale, cart_items, attachment_key, extra_fields, lead_score, lead_grade, status, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, 'new', ?21)`,
        )
        .bind(
          inquiryId, industry, productSlug, productName, name, email, company, country, phone,
          quantity, message, inquiryType, sourcePage, utmSource, locale, cartItems, attachmentKey,
          JSON.stringify(extraFields), lead.score, lead.grade, createdAt,
        )
        .run();
    } else if (isProduction()) {
      console.error(`Inquiry ${inquiryId}: DB binding missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resend email — fail closed in production
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
      const emails = buildInquiryEmails({
        id: inquiryId,
        name,
        email,
        company,
        country,
        phone,
        productSlug,
        productName,
        quantity,
        message,
        inquiryType,
        sourcePage,
        utmSource,
        locale,
        cartItems,
        attachmentKey,
        extraFields,
        leadScore: lead.score,
        leadGrade: lead.grade,
      }, mailConfig);
      await resend.emails.send(emails.notification);
      await resend.emails.send(emails.confirmation);
    } else if (isProduction()) {
      console.error(`Inquiry ${inquiryId}: RESEND_API_KEY missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Browser form submissions (multipart/form-data) redirect to thank-you page
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/thank-you/' },
      });
    }
    return new Response(JSON.stringify({ success: true, id: inquiryId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
