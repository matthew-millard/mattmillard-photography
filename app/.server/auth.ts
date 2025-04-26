import { redirect } from '@remix-run/cloudflare';
import { adminSessionKey, adminSessionStorage } from './sessions';

export async function getAdminId(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const adminSession = await adminSessionStorage.getSession(cookieHeader);

  const adminId = adminSession.get(adminSessionKey);
  return adminId;
}

export async function requireAdmin(request: Request, DB: D1Database) {
  const adminId = await getAdminId(request);

  if (!adminId) {
    throw redirect('/admin/login');
  }

  const ps = DB.prepare(`SELECT * FROM admins WHERE id = ?`).bind(adminId);

  const admin = await ps.first();

  if (!admin) {
    throw new Response('Not authorised', { status: 401 });
  }

  return;
}
