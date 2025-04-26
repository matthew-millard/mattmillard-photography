import React from 'react';
import { cn } from '~/lib/utils';

const H1 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h1'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <h1 ref={ref} className={cn('text-2xl font-bold tracking-tight leading-7', className)} {...props}>
        {children}
      </h1>
    );
  }
);

H1.displayName = 'H1';

export default H1;
