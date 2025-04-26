import { useRouteLoaderData } from '@remix-run/react';
import { loader } from '~/root';

export function useIsAdmin() {
  const data = useRouteLoaderData<typeof loader>('root');

  if (!data?.isAdmin) {
    return false;
  }

  return data?.isAdmin;
}
