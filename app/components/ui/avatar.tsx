import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '~/lib/utils';

const Avatar = forwardRef<HTMLImageElement, ComponentPropsWithoutRef<'img'>>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        {...props}
        className={cn('w-12 h-12 object-cover rounded-full shadow-lg ring-2 ring-border', className)}
      />
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
