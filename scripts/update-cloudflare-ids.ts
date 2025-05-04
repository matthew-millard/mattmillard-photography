import { D1Database } from '@cloudflare/workers-types';
import { ImageRecord } from '~/routes/_index';

function extractCloudflareId(url: string): string {
  // URL format: https://imagedelivery.net/{account-hash}/{cloudflare-id}/public
  const parts = url.split('/');
  return parts[parts.length - 2]; // Get the second-to-last part
}

export async function updateCloudflareIds(DB: D1Database) {
  // Get all images
  const query = DB.prepare('SELECT * FROM images');
  const result = await query.all<ImageRecord>();

  if (!result.success) {
    throw new Error('Failed to fetch images from database');
  }

  const images = result.results;
  console.log(`Found ${images.length} images to update`);

  // Update each image with its Cloudflare ID
  for (const image of images) {
    const cloudflareId = extractCloudflareId(image.url);
    console.log(`Updating image ${image.id} with Cloudflare ID: ${cloudflareId}`);

    const updateQuery = DB.prepare('UPDATE images SET cloudflare_id = ? WHERE id = ?').bind(cloudflareId, image.id);

    const updateResult = await updateQuery.run();
    if (!updateResult.success) {
      console.error(`Failed to update image ${image.id}:`, updateResult.error);
    }
  }

  console.log('Finished updating Cloudflare IDs');
}
