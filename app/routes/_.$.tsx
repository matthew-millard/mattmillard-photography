import { H1, H2 } from '~/components/typography';

export async function loader() {
  return new Response('Not found', { status: 404 });
}

export default function SplatRoute() {
  return (
    <div>
      <H1>404</H1>
      <H2>Page not found</H2>
    </div>
  );
}
