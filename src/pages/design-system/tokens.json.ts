import type { APIRoute } from 'astro';
import { getDesignTokenExport } from '../../lib/design-tokens';

export const GET: APIRoute = () => new Response(JSON.stringify(getDesignTokenExport(), null, 2), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
});
