import { useEffect, useRef, useState } from 'react';
import { useInViewPort } from '~/hooks';
import { cn } from '~/lib/utils';
import { ImageRecord } from '~/routes/_index';

export interface ImageProps extends ImageRecord {}

export default function Image({ image }: { image: ImageProps }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });
  const [hasBeenInViewPort, setHasBeenInViewPort] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState(false);

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

  return (
    <div className="relative" onMouseEnter={() => setShowOverlay(true)} onMouseLeave={() => setShowOverlay(false)}>
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
          <span className="text-white text-sm md:text-base p-4">{image.alt_text}</span>
        </div>
      </div>
    </div>
  );
}
