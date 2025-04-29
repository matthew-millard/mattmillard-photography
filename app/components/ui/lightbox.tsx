import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '~/lib/utils';

interface LightBoxProps extends ComponentPropsWithoutRef<'dialog'> {}

const LightBox = forwardRef<HTMLDialogElement, LightBoxProps>(({ children, className, ...props }, ref) => {
  return (
    <dialog ref={ref} className={cn('backdrop:bg-card/90', className)} {...props}>
      {children}
    </dialog>
  );
});

LightBox.displayName = 'LightBox';

export default LightBox;
