import { Link } from '@remix-run/react';

interface LogoProps {
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
}

export default function Logo({ fontSize = 'lg' }: LogoProps) {
  return (
    <Link to="/" prefetch="intent">
      <span className={`text-${fontSize}`}>Matt Millard Photography</span>
    </Link>
  );
}
