import { json, serviceUnavailable } from '../../_shared.js';
import {
  parseInquiryAdminFilters,
  queryAdminInquiries,
  validateAdminRequest,
} from '../../_admin.js';

export async function onRequestGet({ request, env }) {
  const auth = validateAdminRequest(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  if (!env.DB) return serviceUnavailable('DB binding is not configured for this environment.');

  try {
    const filters = parseInquiryAdminFilters(request.url);
    const result = await queryAdminInquiries(env.DB, filters);
    return json(result);
  } catch (error) {
    console.error('Admin inquiries JSON function error:', error);
    return json({ error: 'Unable to load inquiries.' }, 500);
  }
}
