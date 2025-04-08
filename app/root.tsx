import './styles/tailwind.css';
import './styles/fonts.css';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { DesktopHeader, MobileHeader, Drawer, Footer } from './components/ui';
import { updateThemeActionIntent } from './components/ui/theme-switch';
import { getThemeFromCookie, updateTheme } from './.server/theme';
import { useTheme } from './hooks';
import { useState } from 'react';

export const links: LinksFunction = () => [];

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = getThemeFromCookie(request);
  return { theme };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case updateThemeActionIntent:
      return updateTheme(formData);
    default:
      throw new Response('Invalid intent', { status: 400 });
  }
}
export function Layout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const drawerState = { isDrawerOpen, setIsDrawerOpen };
  const theme = useTheme();

  return (
    <html lang="en" className={`${theme}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>

      <body>
        <Drawer {...drawerState} />
        <div className="container min-h-screen flex flex-col">
          <MobileHeader {...drawerState} />
          <DesktopHeader />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
