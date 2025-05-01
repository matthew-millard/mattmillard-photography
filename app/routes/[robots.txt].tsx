import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE } = context.cloudflare.env;
  const baseUrl = MODE === 'production' ? 'https://mattmillard.photography' : 'http://localhost:5173';

  const robotText = `# https://mattmillard.photography/robots.txt

# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robotText, {
    headers: {
      'Content-Type': 'text/plain',
    },
    status: 200,
  });
}
