import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { adminSessionStorage } from '~/.server/sessions';

export async function loader() {
  throw redirect('/admin');
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const adminSession = await adminSessionStorage.getSession(cookieHeader);

  return redirect('/admin/login', {
    headers: {
      'Set-Cookie': await adminSessionStorage.destroySession(adminSession),
    },
  });
}
