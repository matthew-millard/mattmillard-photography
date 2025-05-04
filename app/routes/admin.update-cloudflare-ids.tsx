import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { requireAdmin } from '~/.server/auth';
import { updateCloudflareIds } from '../../scripts/update-cloudflare-ids';
import { Button } from '~/components/ui';
import { H1, P } from '~/components/typography';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  await requireAdmin(request, DB);
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { DB } = context.cloudflare.env;
  await requireAdmin(request, DB);

  try {
    await updateCloudflareIds(DB);
    return new Response('Successfully updated Cloudflare IDs', { status: 200 });
  } catch (error) {
    console.error('Failed to update Cloudflare IDs:', error);
    return new Response('Failed to update Cloudflare IDs', { status: 500 });
  }
}

export default function UpdateCloudflareIdsRoute() {
  return (
    <div>
      <H1>Update Cloudflare IDs</H1>
      <P>This will update all existing images with their Cloudflare IDs extracted from the URLs.</P>
      <Form method="POST">
        <Button type="submit">Update Cloudflare IDs</Button>
      </Form>
    </div>
  );
}
