export default function FormErrors({ errors }: { errors: string[] | undefined }) {
  return (
    <ul className="text-destructive text-sm">
      {errors && errors.length > 0 ? (
        errors.map(error => (
          <li key={error} className="">
            {error}
          </li>
        ))
      ) : (
        <li>&nbsp;</li>
      )}
    </ul>
  );
}
