import { RefObject, useEffect } from 'react';

interface UseDialogProps {
  condition: unknown;
  ref: RefObject<HTMLDialogElement>;
}

export default function useDialog({ condition, ref }: UseDialogProps) {
  useEffect(() => {
    if (condition) {
      ref.current?.showModal();
      if (typeof window !== 'undefined' && window.document) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [condition, ref]);
}
