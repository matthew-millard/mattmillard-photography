import { H1 } from '~/components/typography';

export async function loader() {
  return new Response('Not found', { status: 404 });
}

export default function SplatRoute() {
  return <H1>Not Found</H1>;
}
