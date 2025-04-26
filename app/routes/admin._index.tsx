import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { requireAdmin } from '~/.server/auth';
import { Button } from '~/components/ui';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  await requireAdmin(request, DB);
  return {};
}

export default function AdminIndexRoute() {
  return (
    <div>
      <h1>Admin index route</h1>
      <Form action="/admin/logout" method="POST">
        <Button type="submit" variant={'secondary'}>
          Log out
        </Button>
      </Form>
    </div>
  );
}
