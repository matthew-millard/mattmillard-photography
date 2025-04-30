import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useInViewPort } from '~/hooks';
import { cn } from '~/lib/utils';
import { ImageRecord } from '~/routes/_index';
import { P } from '../typography';

export default function Image({ image }: { image: ImageRecord }) {
  const targetRef = useRef<HTMLImageElement>(null);
  const inViewPort = useInViewPort(targetRef, { threshold: 0.2 });
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

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
    <Link
      to={`?pid=${image.id}`}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      onFocus={() => setShowOverlay(true)}
      onBlur={() => setShowOverlay(false)}
      className="relative"
    >
      <img
        ref={targetRef}
        data-src={image.url}
        id={image.id}
        src={image.lqip_url}
        alt={image.alt_text ?? undefined}
        className={cn('w-full')}
      />
      {showOverlay && <ImageOverlay alt_text={image.alt_text} />}
    </Link>
  );
}

function ImageOverlay({ alt_text }: Pick<ImageRecord, 'alt_text'>) {
  return (
    <div className="absolute w-full h-full inset-0 grid items-end bg-black/50 overflow-y-scroll p-4">
      <P className="text-white/90">{alt_text}</P>
    </div>
  );
}
