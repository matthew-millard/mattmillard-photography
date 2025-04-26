import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { data, Form, redirect, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { requireAnonymous } from '~/.server/auth';
import { adminSessionKey, adminSessionStorage } from '~/.server/sessions';
import { Button, FieldError, FormErrors, Input, Label } from '~/components/ui';
import { cn } from '~/lib/utils';
import { verifyPassword } from '~/utils/hash-password';

const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(1).max(25),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { DB } = context.cloudflare.env;
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: AdminLoginSchema.transform(async ({ email, password }, ctx) => {
      const ps = DB.prepare(`SELECT * FROM admins WHERE email = ?`).bind(email);
      const admin = await ps.first();

      if (!admin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email or password',
        });
        return z.NEVER;
      }

      const isValidPassword = await verifyPassword(admin.password as string, password);

      if (!isValidPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email or password',
        });
        return z.NEVER;
      }

      return { adminId: admin.id as string };
    }),
  });

  if (submission.status !== 'success') {
    return data(submission.reply(), { status: submission.status === 'error' ? 400 : 200 });
  }

  const { adminId } = submission.value;

  const cookieHeader = request.headers.get('Cookie');
  const adminSession = await adminSessionStorage.getSession(cookieHeader);
  adminSession.set(adminSessionKey, adminId);

  return redirect('/admin', {
    headers: {
      'Set-Cookie': await adminSessionStorage.commitSession(adminSession),
    },
  });
}

export default function AdminLoginRoute() {
  const [form, fields] = useForm({
    id: 'admin-login-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(AdminLoginSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AdminLoginSchema });
    },
  });

  const hasErrors = form.errors && form.errors.length > 0 ? true : false;

  return (
    <div
      className={cn(
        'my-4 md:my-12 mx-auto pt-7 pb-4 px-6 max-w-md rounded-lg space-y-6 shadow border',
        hasErrors ? 'border-destructive' : ''
      )}
    >
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-balance text-muted-foreground">Log in to access your admin dashboard</p>
      </div>
      <Form method="POST" {...getFormProps(form)} className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor={fields.email.id}>Email</Label>
          <Input {...getInputProps(fields.email, { type: 'email' })} autoFocus />
          <FieldError errors={fields.email.errors} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={fields.password.id}>Password</Label>
          <Input {...getInputProps(fields.password, { type: 'password' })} />
          <FieldError errors={fields.password.errors} />
        </div>
        <Button
          type="submit"
          variant={'secondary'}
          className={cn('w-full', hasErrors ? 'outline outline-destructive' : '')}
        >
          Log in
        </Button>
        <FormErrors errors={form.errors} />
      </Form>
    </div>
  );
}
