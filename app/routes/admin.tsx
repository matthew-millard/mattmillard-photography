import { Outlet } from '@remix-run/react';

export default function AdminRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
