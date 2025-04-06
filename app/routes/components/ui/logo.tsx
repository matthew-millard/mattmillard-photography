import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <Link to="/" prefetch="intent">
      <span className="text-lg">Matt Millard Photography</span>
    </Link>
  );
}
