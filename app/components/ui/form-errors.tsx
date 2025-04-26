export default function FormErrors({ errors }: { errors: string[] | undefined }) {
  return (
    <ul className="text-destructive text-sm">
      {errors && errors.length > 0 ? (
        errors.map(error => (
          <li key={error} className="-mt-1">
            {error}
          </li>
        ))
      ) : (
        <li className="-mt-1">&nbsp;</li>
      )}
    </ul>
  );
}
