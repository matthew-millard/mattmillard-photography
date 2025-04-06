import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE } = context.cloudflare.env;
  return { MODE };
}

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const isProduction = data?.MODE === 'production';
  const baseUrl = isProduction ? `https://${domain}` : 'http://localhost:5173';
  const title = `Contact | ${siteName}`;
  const description =
    'Get in touch for photography enquiries, collaborations or to find out my availability and pricing.';
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

export default function ContactRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Contact route</h1>
    </div>
  );
}
