import {
  EMAIL_STYLES,
  escapeHtml,
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
    const productSlug = data.product_slug?.toString() || '';
    const fileType = data.file_type?.toString() || 'datasheet';
    const industry = data.industry?.toString() || 'machinery';

    if (!validateInquiryEmail(email)) {
      return json({ error: 'A valid business email is required.' }, 400);
    }

    if (!env.DB) return serviceUnavailable();

    const leadId = generateId('dl');
    const createdAt = Math.floor(Date.now() / 1000);

    await env.DB.prepare(
      `INSERT INTO download_leads (id, email, product_slug, file_type, industry, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
      .bind(leadId, email, productSlug, fileType, industry, createdAt)
      .run();

    const mailConfig = getMailConfig(env, request.url);
    const safeFileType = escapeHtml(fileType);
    const safeProductSlug = escapeHtml(productSlug);
    const emailResult = await sendResendEmail(mailConfig, {
      from: `IndustryPro <${mailConfig.fromEmail}>`,
      to: email,
      subject: `Your ${safeFileType} is ready`,
      html: `<div style="${EMAIL_STYLES.root}">
        <h2>Your download is ready</h2>
        <p>Click below to download your ${safeFileType}:</p>
        <a href="${mailConfig.siteUrl}/downloads/${safeFileType}-${safeProductSlug}.pdf"
          style="${EMAIL_STYLES.cta}">
          Download ${safeFileType}
        </a>
        <hr />
        <p style="${EMAIL_STYLES.footer}">No spam - No reselling - GDPR compliant</p>
      </div>`,
    });

    if (!emailResult.ok) return serviceUnavailable();

    return json({ success: true });
  } catch (error) {
    console.error('Download gate function error:', error);
    return json({ error: 'Something went wrong.' }, 500);
  }
}
