import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { PageHeader } from '~/components/layout';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE } = context.cloudflare.env;
  return { MODE };
}

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const isProduction = data?.MODE === 'production';
  const baseUrl = isProduction ? `https://${domain}` : 'http://localhost:5173';
  const title = `Studio | ${siteName}`;
  const description = 'Snaps taken inside the studio.';
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

export default function StudioRoute() {
  return (
    <section>
      <PageHeader title="Studio" description="Snaps taken inside the studio" />
    </section>
  );
}
