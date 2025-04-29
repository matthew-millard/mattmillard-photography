import { useEffect, useRef, useState } from 'react';
import { useInViewPort } from '~/hooks';
import { cn } from '~/lib/utils';
import { ImageRecord } from '~/routes/_index';
import LightBox from './lightbox';
import { X } from 'lucide-react';
import { Button } from '~/components/ui';

export interface ImageProps extends ImageRecord {}

export default function Image({ image }: { image: ImageProps }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const lightBoxRef = useRef<HTMLDialogElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });
  const [hasBeenInViewPort, setHasBeenInViewPort] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLightBox, setShowLightBox] = useState<boolean>(false);

  //   Once the image has come into viewport, swap the lqip_url (blurred) for the high res url. Then remove the data-src attribute
  useEffect(() => {
    if (inViewPort && targetRef.current) {
      const img = targetRef.current;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        setHasBeenInViewPort(true);
        img.removeAttribute('data-src');
      }
    }
  }, [inViewPort]);

  useEffect(() => {
    if (showLightBox && typeof window !== 'undefined') {
      lightBoxRef.current?.showModal();
    }
  }, [showLightBox]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      onFocus={() => setShowOverlay(true)}
      onBlur={() => setShowOverlay(false)}
      tabIndex={0}
      onClick={() => setShowLightBox(true)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          setShowLightBox(true);
        }
      }}
      role="button"
    >
      <img
        ref={targetRef}
        data-src={image.url}
        id={image.id}
        src={image.lqip_url}
        alt={image.alt_text ?? undefined}
        className={cn(
          'w-full transition-all duration-700 ease-out transform',
          hasBeenInViewPort ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-70'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300 ease-out',
          showOverlay ? 'bg-gradient-to-t from-black/80 to-black/40 opacity-100' : 'bg-black/60 opacity-0'
        )}
      >
        <div className="w-full h-full flex items-end justify-center">
          <span className="text-white text-sm md:text-base font-thin p-4">{image.alt_text}</span>
        </div>
      </div>

      <LightBox onClose={() => setShowLightBox(false)} ref={lightBoxRef} className="overflow-visible">
        <Button
          type="button"
          variant={'ghost'}
          size={'icon'}
          onClick={() => {
            lightBoxRef.current?.close();
          }}
          className="absolute -right-4 -top-4 bg-muted rounded-full"
        >
          <X className="text-muted-foreground" />
        </Button>
        <img src={image.url} alt={image.alt_text ?? undefined} className="w-full h-full" />
      </LightBox>
    </div>
  );
}
