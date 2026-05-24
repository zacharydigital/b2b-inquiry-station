import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { escapeHtml, getMailConfig, validateInquiryEmail, type MailEnv } from '../../lib/inquiry';

function generateId(): string {
  return `dl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isProduction(): boolean {
  return !!(process.env.CF_PAGES);
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const email = data.email?.toString() || '';
    const productSlug = data.product_slug?.toString() || '';
    const fileType = data.file_type?.toString() || 'datasheet';
    const industry = data.industry?.toString() || 'machinery';

    if (!validateInquiryEmail(email)) {
      return new Response(JSON.stringify({ error: 'A valid business email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const leadId = generateId();
    const createdAt = Math.floor(Date.now() / 1000);

    // D1 write
    if (locals.runtime?.env?.DB) {
      await (locals.runtime.env.DB as D1Database)
        .prepare(
          `INSERT INTO download_leads (id, email, product_slug, file_type, industry, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
        )
        .bind(leadId, email, productSlug, fileType, industry, createdAt)
        .run();
    } else if (isProduction()) {
      console.error(`Download lead ${leadId}: DB binding missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email with download link
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
      const safeFileType = escapeHtml(fileType);
      const safeProductSlug = escapeHtml(productSlug);
      await resend.emails.send({
        from: `IndustryPro <${mailConfig.fromEmail}>`,
        to: email,
        subject: `Your ${safeFileType} is ready`,
        html: `<div style="font-family:sans-serif">
          <h2>Your download is ready</h2>
          <p>Click below to download your ${safeFileType}:</p>
          <a href="${mailConfig.siteUrl}/downloads/${safeFileType}-${safeProductSlug}.pdf"
             style="display:inline-block;background:#E8651A;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
            Download ${safeFileType}
          </a>
          <hr />
          <p style="color:#666;font-size:12px">No spam · No reselling · GDPR compliant</p>
        </div>`,
      });
    } else if (isProduction()) {
      console.error(`Download lead ${leadId}: RESEND_API_KEY missing in production`);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Download gate error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
