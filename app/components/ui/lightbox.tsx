import { useNavigate } from '@remix-run/react';
import { X } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '~/lib/utils';
import { ImageRecord } from '~/routes/_index';

interface LightBoxProps extends ComponentPropsWithoutRef<'dialog'> {
  image: ImageRecord;
}

const LightBox = forwardRef<HTMLDialogElement, LightBoxProps>(({ image, className, ...props }, ref) => {
  const navigate = useNavigate();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (ref && 'current' in ref && event.target === ref.current) {
      ref.current?.close();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      onClose={() => navigate('.', { preventScrollReset: true })}
      className={cn('backdrop:bg-card/90', className)}
      {...props}
      onClick={handleBackdropClick}
    >
      <form method="dialog">
        <img src={image?.url} alt={image?.alt_text} />
        <button
          autoFocus
          className="p-1 rounded-full absolute top-1 right-1 bg-black/50 text-white/80 text-sm font-thin"
          aria-label="Close lightbox"
        >
          <X />
        </button>
      </form>
    </dialog>
  );
});

LightBox.displayName = 'LightBox';

export default LightBox;
