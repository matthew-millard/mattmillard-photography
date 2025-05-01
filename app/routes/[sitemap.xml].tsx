import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE } = context.cloudflare.env;

  const staticPages = [
    { loc: '/', lastmod: '2025-05-01', changefreq: 'weekly', priority: 0.7 },
    {
      loc: '/contact/',
      lastmod: '2025-05-01',
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: '/food/',
      lastmod: '2025-05-01',
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/drink/',
      lastmod: '2025-05-01',
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/people/',
      lastmod: '2025-05-01',
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/studio/',
      lastmod: '2025-05-01',
      changefreq: 'yearly',
      priority: 0.7,
    },
    {
      loc: '/interior/',
      lastmod: '2025-05-01',
      changefreq: 'weekly',
      priority: 0.7,
    },
  ];

  const baseUrl = MODE === 'production' ? 'https://mattmillard.photography' : 'http://localhost:5173';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          page => `
        <url>
          <loc>${baseUrl}${page.loc}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`;

  try {
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for a day
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    throw new Response('Internal server error', { status: 500 });
  }
}
