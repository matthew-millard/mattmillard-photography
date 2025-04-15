import { useEffect, useRef, useState } from 'react';
import { useInViewPort } from '~/hooks';
import { cn } from '~/lib/utils';

export interface ImageProps {
  id: string;
  url: string;
  lqip_url: string;
  alt_text: string;
}

export default function Image({ image }: { image: ImageProps }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });
  const [hasBeenInViewPort, setHasBeenInViewPort] = useState<boolean>(false);

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
    <img
      ref={targetRef}
      data-src={image.url}
      id={image.id}
      src={image.lqip_url}
      alt={image.alt_text}
      className={cn(
        'w-full h-auto transition-all duration-700 ease-out transform',
        hasBeenInViewPort ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-70'
      )}
    />
  );
}
