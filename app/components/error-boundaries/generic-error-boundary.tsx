import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { H1, H2, P } from '../typography';

export default function GenericErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <H1>
          {error.status} {error.statusText}
        </H1>
        <P>{error.data}</P>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <H1>Error</H1>
        <H2>{error.message}</H2>
        <P>Stack trace:</P>
        <P>{error.stack}</P>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
