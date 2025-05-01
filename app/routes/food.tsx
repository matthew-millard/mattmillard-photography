import { LoaderFunctionArgs, MetaFunction, data } from '@remix-run/cloudflare';
import { PageHeader } from '~/components/layout';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';
import { ImageRecord } from './_index';
import { useLoaderData } from '@remix-run/react';
import { Image, LightBox } from '~/components/ui';
import { GenericErrorBoundary } from '~/components/error-boundaries';
import { useRef } from 'react';
import { useDialog } from '~/hooks';

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const isProduction = data?.MODE === 'production';
  const baseUrl = isProduction ? `https://${domain}` : 'http://localhost:5173';
  const title = `Food | ${siteName}`;
  const description = 'A collection of photos taken in restaurant.';
  const url = `${baseUrl}${location.pathname}`;
  return [
    // Basic metadata
    { title },
    { name: 'description', content: description },
    { name: 'author', content: author },

    // Add Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: siteName },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: altText },

    // X (Twitter) Card Metadata
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@_MattMillard' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: altText },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const selectedImageId = url.searchParams.get('pid');

  const { MODE, DB } = context.cloudflare.env;

  const query = DB.prepare(`SELECT * FROM images WHERE category = ?`).bind('food');
  const dbResponse = await query.all<ImageRecord>();

  if (!dbResponse.success) {
    throw new Error('Failed to fetch images from database');
  }

  const { results: images } = dbResponse;

  let selectedImage;
  if (selectedImageId) {
    selectedImage = images.find(image => image.id === selectedImageId);
  }

  return data({ MODE, images, selectedImage });
}

export default function FoodRoute() {
  const { images, selectedImage } = useLoaderData<typeof loader>();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useDialog({ condition: selectedImage, ref: dialogRef });

  return (
    <div>
      <PageHeader title="Food" description="A collection of photos taken in restaurant" />
      <section className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 py-4">
        {images && images.length > 0 ? (
          images.map(image => (
            <div key={image.id} className="break-inside-avoid mb-4 md:mb-6">
              <Image image={image} />
            </div>
          ))
        ) : (
          <p>There is currently no images available</p>
        )}
      </section>
      {selectedImage && <LightBox ref={dialogRef} image={selectedImage} />}
    </div>
  );
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}
