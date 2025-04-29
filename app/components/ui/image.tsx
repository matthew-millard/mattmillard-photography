import { Link } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { useInViewPort } from '~/hooks';
import { cn } from '~/lib/utils';
import { ImageRecord } from '~/routes/_index';

export default function Image({ image }: { image: ImageRecord }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });

  //   Once the image has come into viewport, swap the lqip_url (blurred) for the high res url. Then remove the data-src attribute
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
    <Link to={`?pid=${image.id}`}>
      <img
        ref={targetRef}
        data-src={image.url}
        id={image.id}
        src={image.lqip_url}
        alt={image.alt_text ?? undefined}
        className={cn('w-full')}
      />
    </Link>
  );
}
