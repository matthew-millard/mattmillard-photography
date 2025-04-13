import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
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
    <section className="flex gap-4 pt-4">
      {images && images.length > 0 ? (
        images.map(image => <img src={image.url} alt={image.alt} key={image.id} className="w-96 h-auto object-cover" />)
      ) : (
        <p>There is currently no images available</p>
      )}
    </section>
  );
}
