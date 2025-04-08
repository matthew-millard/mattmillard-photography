import { Copyright, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-3 text-sm font-light">
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
    </footer>
  );
}
