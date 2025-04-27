import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/.server/auth';
import { PageHeader } from '~/components/layout';
import { Button } from '~/components/ui';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  const admin = await requireAdmin(request, DB);
  return { admin };
}

export default function AdminIndexRoute() {
  const { admin } = useLoaderData<typeof loader>();
  return (
    <div className="p-4 border rounded-lg shadow">
      <div className="space-y-3">
        <PageHeader title="Admin Dashboard" description={`You are logged in as ${admin.firstName} ${admin.lastName}`} />
        <Link to="/admin/upload-images">
          <Button variant={'secondary'}>Upload Images</Button>
        </Link>
        <Form action="/admin/logout" method="POST">
          <Button type="submit" variant={'secondary'}>
            Log out
          </Button>
        </Form>
      </div>
    </div>
  );
}
