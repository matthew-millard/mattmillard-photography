import { useEffect } from 'react';
import { FetcherWithComponents } from '@remix-run/react';
import { SubmissionResult } from '@conform-to/react';

type SuccessResponse = { ok: boolean };
type FormData = SuccessResponse | SubmissionResult<string[]> | undefined;

interface UseFormResetProps {
  fetcher: FetcherWithComponents<FormData>;
  formRef: React.RefObject<HTMLFormElement>;
}

export function useFormReset({ fetcher, formRef }: UseFormResetProps) {
  useEffect(() => {
    if (fetcher?.data && 'ok' in fetcher.data) {
      formRef.current?.reset();
    }
  }, [fetcher.data, formRef]);
}
