import React from 'react';
import { cn } from '~/lib/utils';

const Label = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<'label'>>(
  ({ children, className, ...props }, ref) => (
    <label
      ref={ref}
      {...props}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
    >
      {children}
    </label>
  )
);

Label.displayName = 'Label';

export { Label };
