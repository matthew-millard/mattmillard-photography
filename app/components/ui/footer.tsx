import { Copyright, ExternalLink, UserCog } from 'lucide-react';
import { Button } from './button';
import { Link } from '@remix-run/react';
import Tooltip from './tooltip';
import { useIsAdmin } from '~/hooks';

export default function Footer() {
  const isAdmin = useIsAdmin();
  return (
    <footer className="border-t py-3 text-sm font-light flex items-center">
      <div>
        <div className="flex gap-1">
          <p className="">Built by me - Code on</p>
          <a
            href="https://github.com/matthew-millard/mattmillard-photography"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 flex items-center font-normal gap-1"
          >
            Github <ExternalLink size={14} />
          </a>
        </div>
        <div className="flex items-center ml-auto gap-1 text-secondary-foreground">
          <Copyright size={12} />
          <small>Matt Millard Photography 2025</small>
        </div>
      </div>

      <Tooltip label={isAdmin ? 'Go to Admin Dashboard' : 'Sign in to Admin'} side="left">
        <Link to={isAdmin ? '/admin' : '/admin/login'} prefetch="intent" className="ml-auto">
          <Button type="button" variant={'ghost'} size={'icon'}>
            <UserCog />
          </Button>
        </Link>
      </Tooltip>
    </footer>
  );
}
