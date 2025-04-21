export default function FieldError({ errors }: { errors: string[] | undefined }) {
  return (
    <ul className="text-destructive text-xs -mt-1">
      {errors && errors.length > 0 ? (
        errors.map(error => (
          <li key={error}>
            <p>{error}</p>
          </li>
        ))
      ) : (
        <p>&nbsp;</p>
      )}
    </ul>
  );
}
