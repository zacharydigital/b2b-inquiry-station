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

const ALLOWED_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'dwg', 'step', 'igs', 'x_t']);
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/vnd.dwg', 'application/octet-stream']);
const EXTRA_FIELDS_BY_VERTICAL = {
  machinery: ['application', 'target_specification', 'annual_demand', 'delivery_time'],
  materials: [
    'material_grade',
    'application',
    'request_type',
    'target_specification',
    'packaging_requirement',
    'destination_port',
    'regulatory_requirement',
    'monthly_demand',
    'company_type',
  ],
  'consumer-oem': [
    'product_interest',
    'logo_or_packaging_needed',
    'target_market',
    'reference_link',
    'expected_unit_price',
    'required_certifications',
    'sales_channel',
  ],
};

function collectExtraFields(formData, vertical) {
  const names = EXTRA_FIELDS_BY_VERTICAL[vertical] || EXTRA_FIELDS_BY_VERTICAL.machinery;
  const extraFields = {};
  for (const name of names) {
    const value = formData.get(name);
    if (typeof value === 'string' && value.trim()) {
      extraFields[name] = value.trim();
    }
  }
  return extraFields;
}

function extractLargestNumber(value = '') {
  const matches = value.match(/\d+(?:[,.]\d+)?/g) || [];
  return matches.reduce((max, match) => {
    const parsed = Number.parseFloat(match.replace(',', ''));
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
}

function calculateLeadScore(input) {
  const inquiryType = (input.inquiryType || '').toLowerCase();
  const messageLength = (input.message || '').trim().length;
  const quantityNumber = extractLargestNumber(input.quantity);
  const extraCount = Object.values(input.extraFields || {}).filter(Boolean).length;

  let score = 10;
  if (input.country?.trim()) score += 10;
  if (input.company?.trim()) score += 12;
  if (input.phone?.trim()) score += 8;
  if ((input.quantity || '').trim()) score += 8;
  if (quantityNumber >= 1000) score += 14;
  else if (quantityNumber >= 100) score += 10;
  else if (quantityNumber >= 10) score += 5;
  if (messageLength >= 120) score += 15;
  else if (messageLength >= 40) score += 10;
  else if (messageLength >= 12) score += 5;
  if (input.attachmentKey) score += 12;
  if (extraCount >= 3) score += 10;
  else if (extraCount >= 1) score += 5;
  if (['quote', 'bulk quote', 'oem', 'odm', 'private label', 'technical proposal'].includes(inquiryType)) score += 10;
  if (input.vertical === 'materials' && ['coa', 'sds', 'technical consultation'].includes(inquiryType)) score += 6;
  if (input.vertical === 'consumer-oem' && ['oem', 'odm', 'private label'].includes(inquiryType)) score += 8;

  const capped = Math.max(0, Math.min(100, score));
  return { score: capped, grade: capped >= 70 ? 'hot' : capped >= 40 ? 'warm' : 'cold' };
}

export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();

    if ((formData.get('website_url') || '').toString().length > 0) {
      return json({ success: true });
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
    const extraFields = collectExtraFields(formData, industry);

    if (!name || !email || !country) {
      return json({ error: 'Name, email, and country are required.' }, 400);
    }

    if (!validateInquiryEmail(email)) {
      return json({ error: 'Invalid email address.' }, 400);
    }

    const inquiryId = generateId('inq');
    const createdAt = Math.floor(Date.now() / 1000);
    let attachmentKey = null;
    const file = formData.get('file');

    if (file && file.size > 0) {
      if (!env.FILES) return serviceUnavailable();
      if (file.size > 10 * 1024 * 1024) return json({ error: 'File exceeds 10MB limit.' }, 400);

      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(ext)) {
        return json({ error: 'Unsupported file type.' }, 400);
      }

      const key = `inquiries/${industry}/${new Date().toISOString().slice(0, 10)}/${createdAt}-${productSlug || 'general'}-${inquiryId}.${ext}`;
      await env.FILES.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
      });
      attachmentKey = key;
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

    if (!env.DB) return serviceUnavailable();

    await env.DB.prepare(
      `INSERT INTO inquiries (id, industry, product_slug, product_name, name, email, company, country, phone, quantity, message, inquiry_type, source_page, utm_source, locale, cart_items, attachment_key, extra_fields, lead_score, lead_grade, status, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, 'new', ?21)`,
    )
      .bind(
        inquiryId,
        industry,
        productSlug,
        productName,
        name,
        email,
        company,
        country,
        phone,
        quantity,
        message,
        inquiryType,
        sourcePage,
        utmSource,
        locale,
        cartItems,
        attachmentKey,
        JSON.stringify(extraFields),
        lead.score,
        lead.grade,
        createdAt,
      )
      .run();

    const mailConfig = getMailConfig(env, request.url);
    const notification = await sendResendEmail(mailConfig, {
      from: `IndustryPro Inquiry <${mailConfig.fromEmail}>`,
      to: mailConfig.notifyEmail,
      subject: `New ${inquiryType.toUpperCase()} inquiry from ${name}`,
      html: `<div style="${EMAIL_STYLES.root}">
        <h2>New inquiry</h2>
        <p><strong>ID:</strong> ${escapeHtml(inquiryId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Country:</strong> ${escapeHtml(country)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Product:</strong> ${escapeHtml(productName || productSlug)}</p>
        <p><strong>Quantity:</strong> ${escapeHtml(quantity)}</p>
        <p><strong>Lead:</strong> ${escapeHtml(lead.grade)} (${escapeHtml(String(lead.score))}/100)</p>
        <p><strong>Source:</strong> ${escapeHtml(sourcePage)}</p>
        <p><strong>UTM Source:</strong> ${escapeHtml(utmSource)}</p>
        <p><strong>Attachment:</strong> ${escapeHtml(attachmentKey || 'None')}</p>
        <p><strong>Extra Fields:</strong> ${escapeHtml(JSON.stringify(extraFields))}</p>
        <pre style="${EMAIL_STYLES.pre}">${escapeHtml(message)}</pre>
      </div>`,
    });

    if (!notification.ok) return serviceUnavailable();

    const confirmation = await sendResendEmail(mailConfig, {
      from: `IndustryPro <${mailConfig.fromEmail}>`,
      to: email,
      subject: 'We received your inquiry',
      html: `<div style="${EMAIL_STYLES.root}">
        <h2>Thank you, ${escapeHtml(name)}.</h2>
        <p>We received your inquiry and will reply within 12 business hours.</p>
        <p>Your inquiry ID: <strong>${escapeHtml(inquiryId)}</strong></p>
      </div>`,
    });

    if (!confirmation.ok) return serviceUnavailable();

    return new Response(null, { status: 302, headers: { Location: '/thank-you/' } });
  } catch (error) {
    console.error('Inquiry function error:', error);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
