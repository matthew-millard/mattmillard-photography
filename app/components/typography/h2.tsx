import React, { ComponentPropsWithoutRef } from 'react';
import { cn } from '~/lib/utils';

const H2 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h2'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2 className={cn('text-xl text-muted-foreground font-semibold tracking-tight', className)} {...props} ref={ref}>
        {children}
      </h2>
    );
  }
);

H2.displayName = 'H2';

export default H2;
