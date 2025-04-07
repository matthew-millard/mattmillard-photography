import { NavLink } from '@remix-run/react';
import { X, Menu } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Button, Logo, ThemeSwitch } from '~/components/ui';
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

type DrawerState = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({ isDrawerOpen, setIsDrawerOpen }: DrawerState) {
  const drawerState = { isDrawerOpen, setIsDrawerOpen };
  return (
    <div>
      <MobileHeader {...drawerState} />
      <DesktopHeader />
    </div>
  );
}

function MobileHeader({ isDrawerOpen, setIsDrawerOpen }: DrawerState) {
  const icon = isDrawerOpen ? <X /> : <Menu />;
  return (
    <header className="md:hidden flex justify-between items-center h-16 border-b">
      <Logo fontSize="sm" />
      <div className="grid grid-cols-2 gap-2">
        <ThemeSwitch />
        <Button type="button" variant={'outline'} size={'icon'} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          {icon}
        </Button>
      </div>
    </header>
  );
}

function DesktopHeader() {
  return (
    <header className="hidden md:flex justify-between items-center h-14 border-b">
      <Logo />
      <div className="flex">
        <nav>
          <ul className="flex">
            {links.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 font-light text-sm',
                    isActive ? 'text-active-foreground underline underline-offset-4' : undefined
                  )
                }
                prefetch="intent"
              >
                {link.name}
              </NavLink>
            ))}
          </ul>
        </nav>
        <ThemeSwitch />
      </div>
    </header>
  );
}
