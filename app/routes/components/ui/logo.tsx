import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <Link to="/" prefetch="intent">
      <span className="text-2xl">Matt Millard Photography</span>
    </Link>
  );
}
