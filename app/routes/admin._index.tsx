import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { requireAdmin } from '~/.server/auth';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  await requireAdmin(request, DB);
  return {};
}

export default function AdminIndexRoute() {
  return <h1>Admin index route</h1>;
}
