import { redirect } from '@remix-run/cloudflare';
import { adminSessionKey, adminSessionStorage } from './sessions';

export interface Admin {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  created_at: string;
  updated_at: string;
}

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

  const admin = await ps.first<Admin>();

  console.log('admin', admin);

  if (!admin) {
    throw new Response('Not authorised', { status: 401 });
  }

  return admin;
}

export async function requireAnonymous(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const adminSession = await adminSessionStorage.getSession(cookieHeader);
  const isAdmin = adminSession.has(adminSessionKey);

  if (isAdmin) {
    throw redirect('/admin');
  }

  return;
}
