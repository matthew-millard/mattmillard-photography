import { ActionFunctionArgs } from '@remix-run/cloudflare';
import { z } from 'zod';
import { requireAdmin } from '~/.server/auth';
import { deleteFromCloudflareImages } from '~/.server/images';
import { GenericErrorBoundary } from '~/components/error-boundaries';

const ValidRouteParamsSchema = z.object({
  pid: z.string().min(1).max(50),
});

export async function loader() {
  throw new Response('Method Not Allowed', { status: 405 });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const { DB, CLOUDFLARE_IMAGES_ACCOUNT_ID, CLOUDFLARE_IMAGES_API_TOKEN } = context.cloudflare.env;
  await requireAdmin(request, DB);

  const { pid } = ValidRouteParamsSchema.parse(params);

  // Get the Cloudflare ID from the database
  const getImageQuery = DB.prepare('SELECT cloudflare_id FROM images WHERE id = ?').bind(pid);
  const imageResponse = await getImageQuery.first<{ cloudflare_id: string }>();

  if (!imageResponse || !imageResponse.cloudflare_id) {
    return new Response('Image not found', { status: 404 });
  }

  try {
    // Delete from Cloudflare Images
    const response = await deleteFromCloudflareImages(
      imageResponse.cloudflare_id,
      CLOUDFLARE_IMAGES_ACCOUNT_ID,
      CLOUDFLARE_IMAGES_API_TOKEN
    );

    if (!response.ok) {
      throw new Error(`Failed to delete image from Cloudflare: ${response.statusText}`);
    }

    // If Cloudflare deletion was successful, delete from database
    const deleteQuery = DB.prepare('DELETE FROM images WHERE id = ?').bind(pid);
    const dbResponse = await deleteQuery.run();

    if (!dbResponse.success) {
      throw new Error(`Failed to delete image from database: ${dbResponse.error}`);
    }

    return new Response('Image deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(error instanceof Error ? error.message : 'An unknown error occurred', { status: 500 });
  }
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}
