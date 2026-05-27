const DISPOSABLE_DOMAINS = new Set(['mailinator.com', 'tempmail.com', '10minutemail.com']);

export const EMAIL_THEME_TOKENS = {
  fontFamily: 'Arial, sans-serif',
  bodyText: '#2D2C2B',
  mutedText: '#666666',
  canvas: '#ffffff',
  ctaBg: '#e85d1c',
  ctaText: '#ffffff',
  preBg: '#f4f4f4',
  border: '#e0e0e0',
  radius: '6px',
  buttonPadding: '12px 24px',
  smallTextSize: '12px',
};

export const EMAIL_STYLES = {
  root: `font-family:${EMAIL_THEME_TOKENS.fontFamily};color:${EMAIL_THEME_TOKENS.bodyText}`,
  pre: `white-space:pre-wrap;background:${EMAIL_THEME_TOKENS.preBg};padding:12px;border-radius:${EMAIL_THEME_TOKENS.radius}`,
  cta: `display:inline-block;background:${EMAIL_THEME_TOKENS.ctaBg};color:${EMAIL_THEME_TOKENS.ctaText};padding:${EMAIL_THEME_TOKENS.buttonPadding};border-radius:${EMAIL_THEME_TOKENS.radius};text-decoration:none`,
  footer: `color:${EMAIL_THEME_TOKENS.mutedText};font-size:${EMAIL_THEME_TOKENS.smallTextSize}`,
};

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function validateInquiryEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const domain = normalized.split('@')[1] || '';

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) && !DISPOSABLE_DOMAINS.has(domain);
}

export function getMailConfig(env, requestUrl) {
  return {
    resendKey: env.RESEND_API_KEY || '',
    notifyEmail: env.NOTIFY_EMAIL || 'sales@aiseopilot.com',
    fromEmail: env.FROM_EMAIL || 'inquiry@send.aiseopilot.com',
    siteUrl: env.PUBLIC_SITE_URL || env.SITE_URL || new URL(requestUrl).origin,
  };
}

export async function sendResendEmail(config, payload) {
  if (!config.resendKey) {
    return { ok: false, status: 503, error: 'RESEND_API_KEY is missing.' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, error: await response.text() };
  }

  return { ok: true, status: response.status };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatQuoteItems(items) {
  return items
    .map((item, index) => {
      const title = item.title || item.model || item.slug || `Item ${index + 1}`;
      const quantity = item.quantity ? ` - Qty: ${item.quantity}` : '';
      const note = item.note ? ` - Note: ${item.note}` : '';

      return `${index + 1}. ${title}${quantity}${note}`;
    })
    .join('\n');
}

export function serviceUnavailable(message = 'Service temporarily unavailable.') {
  return json({ error: message }, 503);
}
