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
  return (
    <dialog ref={ref} onClose={() => navigate('/')} className={cn('backdrop:bg-card/90', className)} {...props}>
      <img src={image?.url} alt={image?.alt_text} />
      <button
        autoFocus
        onClick={() => {
          if (ref && 'current' in ref) {
            ref.current?.close();
          }
        }}
        className="p-1 rounded-full absolute top-1 right-1 bg-black/50 text-white/80 text-sm font-thin"
      >
        <X />
      </button>
    </dialog>
  );
});

LightBox.displayName = 'LightBox';

export default LightBox;
