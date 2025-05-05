import { useFetcher } from '@remix-run/react';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui';

interface DeleteImageFormProps {
  id: string;
}

export default function DeleteImageForm({ id }: DeleteImageFormProps) {
  const fetcher = useFetcher();
  const formAction = `/admin/delete-image/${id}`;
  const isDeleting = fetcher.state !== 'idle' && fetcher.formMethod === 'POST' && fetcher.formAction === formAction;
  return (
    <fetcher.Form method="POST" action={formAction}>
      <Button type="submit" variant={'destructive'} size={'icon'} className="rounded-full">
        {isDeleting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
      </Button>
    </fetcher.Form>
  );
}
