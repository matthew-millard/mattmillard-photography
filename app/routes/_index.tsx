import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { altText, author, domain, imageUrl, siteName, title } from '~/metadata';

export async function loader({ context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare;
  const { DB } = env;
  const preparedStatement = DB.prepare(`SELECT * FROM images`);
  // ORDER BY created_at DESC LIMIT 10
  const dbResponse = await preparedStatement.all();

  if (!dbResponse.success) {
    throw new Error('Error gathering images from database');
  }

  const MODE = env.MODE;

  const { results } = dbResponse;

  return { MODE, results };
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

export default function Index() {
  const { results: images } = useLoaderData<typeof loader>();

  return (
    <section className="columns-2 md:columns-3 lg:columns-4 gap-4 py-4">
      {images && images.length > 0 ? (
        images.map(image => (
          <div key={image.id} className="break-inside-avoid mb-4">
            <img src={image.url} alt={image.alt_text} className="w-full h-auto" loading="lazy" />
          </div>
        ))
      ) : (
        <p>There is currently no images available</p>
      )}
    </section>
  );
}
