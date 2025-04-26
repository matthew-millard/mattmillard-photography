import React from 'react';
import { cn } from '~/lib/utils';

const P = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('text-base font-normal tracking-tight leading-7', className)} {...props}>
        {children}
      </p>
    );
  }
);

P.displayName = 'P';

export default P;
