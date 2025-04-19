import React from 'react';
import { cn } from '~/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'border rounded-md shadow-sm text-base md:text-sm border-input bg-transparent px-3 py-1 transition-colors',
        className
      )}
      {...props}
    ></textarea>
  )
);

Textarea.displayName = 'Textarea';

export { Textarea };
