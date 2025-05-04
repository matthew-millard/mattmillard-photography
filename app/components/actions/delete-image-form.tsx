import { useFetcher } from '@remix-run/react';
import { Trash } from 'lucide-react';
import { Button } from '~/components/ui';

interface DeleteImageFormProps {
  id: string;
}

export default function DeleteImageForm({ id }: DeleteImageFormProps) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="POST" action={`/admin/delete-image/${id}`}>
      <Button type="submit" variant={'link'} size={'icon'} className="text-destructive-foreground bg-destructive">
        <Trash />
      </Button>
    </fetcher.Form>
  );
}
