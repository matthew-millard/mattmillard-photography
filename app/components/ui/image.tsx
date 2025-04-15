import { useEffect, useRef } from 'react';
import { useInViewPort } from '~/hooks';

export interface ImageProps {
  id: string;
  url: string;
  lqip_url: string;
  alt_text: string;
}

export default function Image({ image }: { image: ImageProps }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });

  useEffect(() => {
    if (inViewPort && targetRef.current) {
      const img = targetRef.current;
      if (img.dataset.src) {
        img.src = img.dataset.src;
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
      className="w-full h-auto"
    />
  );
}
