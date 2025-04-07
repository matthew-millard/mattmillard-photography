import { NavLink } from '@remix-run/react';
import { X, EllipsisVertical } from 'lucide-react';
import { Button, Logo, ThemeSwitch } from '~/components/ui';
import { cn } from '~/lib/utils';
import { type DrawerState } from './drawer';
import { links } from '~/navigation-links';

export function MobileHeader({ isDrawerOpen, setIsDrawerOpen }: DrawerState) {
  const icon = isDrawerOpen ? <X /> : <EllipsisVertical />;
  return (
    <header className="md:hidden flex justify-between items-center h-16 border-b">
      <Logo fontSize="sm" />
      <div className="grid grid-cols-2">
        <ThemeSwitch />
        <Button type="button" variant={'ghost'} size={'icon'} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          {icon}
        </Button>
      </div>
    </header>
  );
}

export function DesktopHeader() {
  return (
    <header className="hidden md:flex justify-between items-center h-16 border-b">
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
