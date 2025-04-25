import { redirect } from '@remix-run/cloudflare';
import { adminAuthSessionStorage } from './sessions';

export async function getAdminId(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const adminSession = await adminAuthSessionStorage.getSession(cookieHeader);

  const adminId = adminSession.get('adminId'); // make a const, no to magic strings
  return adminId;
}

export async function requireAdmin(request: Request, DB: D1Database) {
  const adminId = await getAdminId(request);

  if (!adminId) {
    throw redirect('/admin/login');
  }

  const admin = await DB.prepare(`SELECT * FROM admins WHERE id=${adminId}`).first();

  if (!admin) {
    throw redirect('/admin/login');
  }

  return admin;
}
