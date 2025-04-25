import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { COOKIE_PREFIX } from './config';

const adminAuthSessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${COOKIE_PREFIX}_admin_auth_session`,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: ['supersecret'],
    secure: true,
  },
});

export { adminAuthSessionStorage };
