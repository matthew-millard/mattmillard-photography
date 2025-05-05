import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { data } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useRef } from 'react';
import { GenericErrorBoundary } from '~/components/error-boundaries';
import { PageHeader } from '~/components/layout';
import { P } from '~/components/typography';
import { Image, LightBox } from '~/components/ui';
import { useDialog } from '~/hooks';
import { altText, author, domain, imageUrl, siteName, title } from '~/metadata';

export interface ImageRecord {
  id: string;
  cloudflare_id: string;
  url: string;
  lqip_url: string;
  alt_text: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const isProduction = data?.MODE === 'production';
  const baseUrl = isProduction ? `https://${domain}` : 'http://localhost:5173';
  const description = 'Food, drink and hospitality photographer base in Ottawa, Canada.';
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

  const { env } = context.cloudflare;
  const { DB } = env;
  const query = DB.prepare(
    `
    SELECT * 
    FROM images 
    WHERE category = ?
  `
  ).bind('collection');
  const dbResponse = await query.all<ImageRecord>();

  if (!dbResponse.success) {
    throw new Error('Failed to fetch images from database.');
  }

  const MODE = env.MODE;

  const { results: images } = dbResponse;

  let selectedImage;
  if (selectedImageId) {
    selectedImage = images.find(image => image.id === selectedImageId);
  }

  return data({ MODE, images, selectedImage });
}

export default function Index() {
  const { images, selectedImage } = useLoaderData<typeof loader>();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useDialog({ condition: selectedImage, ref: dialogRef });

  return (
    <div>
      <section>
        {/* <Avatar src={imageUrl} alt={altText} className="md:hidden my-3 ml-2" /> */}
        <PageHeader title="Collection" description="Food, drink and hospitality photographer based in Ottawa, Canada" />
      </section>
      <section className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 py-4">
        {images && images.length > 0 ? (
          images.map(image => (
            <div key={image.id} className="break-inside-avoid mb-4 md:mb-6">
              <Image image={image} />
            </div>
          ))
        ) : (
          <P>There is currently no images available</P>
        )}
      </section>
      {selectedImage && <LightBox ref={dialogRef} image={selectedImage} />}
    </div>
  );
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}
