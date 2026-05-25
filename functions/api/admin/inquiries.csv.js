import { json, serviceUnavailable } from '../../_shared.js';
import {
  buildInquiriesCsv,
  getCsvFilename,
  parseInquiryAdminFilters,
  queryAdminInquiries,
  validateAdminRequest,
} from '../../_admin.js';

export async function onRequestGet({ request, env }) {
  const auth = validateAdminRequest(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  if (!env.DB) return serviceUnavailable('DB binding is not configured for this environment.');

  try {
    const filters = parseInquiryAdminFilters(request.url, { defaultLimit: 1000, maxLimit: 1000 });
    const result = await queryAdminInquiries(env.DB, { ...filters, page: 1 });
    const csv = buildInquiriesCsv(result.items);

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${getCsvFilename()}"`,
      },
    });
  } catch (error) {
    console.error('Admin inquiries CSV function error:', error);
    return json({ error: 'Unable to export inquiries.' }, 500);
  }
}
