import { createCookieSessionStorage } from '@remix-run/cloudflare';
import { COOKIE_PREFIX } from './config';

export const adminSessionKey = 'adminSessionId';

const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${COOKIE_PREFIX}_admin-session`,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: ['supersecret'],
    secure: true,
  },
});

export { adminSessionStorage };
