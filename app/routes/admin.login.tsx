import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs } from '@remix-run/cloudflare';
import { data, Form, redirect, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { adminSessionKey, adminSessionStorage } from '~/.server/sessions';
import { Button, Input, Label } from '~/components/ui';
import { verifyPassword } from '~/utils/hash-password';

const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(1).max(25),
});

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

  return (
    <Form method="POST" {...getFormProps(form)}>
      <div>
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input {...getInputProps(fields.email, { type: 'email' })} autoFocus />
      </div>
      <div>
        <Label htmlFor={fields.password.id}>Password</Label>
        <Input {...getInputProps(fields.password, { type: 'password' })} />
      </div>
      <Button type="submit" variant={'secondary'}>
        Log in
      </Button>
    </Form>
  );
}
