import { NavLink } from '@remix-run/react';
import { Logo } from '../ui';
import { classNames as cn } from '~/utils';

const links = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
  {
    name: 'Food',
    href: '/food',
  },
  {
    name: 'Drink',
    href: '/drink',
  },
  {
    name: 'People',
    href: '/people',
  },
  {
    name: 'Studio',
    href: '/studio',
  },
  {
    name: 'Interior',
    href: '/interior',
  },
];

export default function Header() {
  return (
    <div>
      <MobileHeader />
      <DesktopHeader />
    </div>
  );
}

function MobileHeader() {
  return <header className="md:hidden">This is mobile</header>;
}

function DesktopHeader() {
  return (
    <header className="hidden md:flex justify-between items-center h-14 border-b">
      <Logo />
      <nav>
        <ul className="flex">
          {links.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                cn('px-3 py-2', isActive ? 'text-active-foreground underline underline-offset-4' : undefined)
              }
              prefetch="intent"
            >
              {link.name}
            </NavLink>
          ))}
        </ul>
      </nav>
    </header>
  );
}
