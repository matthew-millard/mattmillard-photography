import { LoaderCircle } from 'lucide-react';

export function TurnstileFallback() {
  return (
    <div className="h-[65px] w-full text-muted-foreground flex justify-center items-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
