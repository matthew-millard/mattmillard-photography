import { getFormProps, getInputProps, getTextareaProps, type SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react';
import { useRef } from 'react';
import { z } from 'zod';
import { Button, ClientOnly, FieldError, FormErrors, Input, Label, Textarea, TurnstileFallback } from '~/components/ui';
import { Theme } from '~/components/ui/theme-switch';
import { useIsPending, useTheme, useFormReset } from '~/hooks';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';
import { Turnstile, TurnstileServerValidationResponse } from '@marsidev/react-turnstile';
import { GenericErrorBoundary } from '~/components/error-boundaries';

const CF_TURNSTILE_KEY = 'cf-turnstile-response';
const MY_EMAIL = 'contact@mattmillard.photography';
const MY_BUSINESS_NAME = 'Matt Millard Photography';
const MY_NAME = 'Matt Millard';

const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character long' })
    .max(25, { message: `Must be 25 characters or less` }),
  email: z.string().email(),
  message: z
    .string()
    .trim()
    .min(3, { message: 'Must be at least 3 characters' })
    .max(1000, { message: 'Must be 1000 characters or less' }),
  [CF_TURNSTILE_KEY]: z.string().optional(),
});

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const isProduction = data?.MODE === 'production';
  const baseUrl = isProduction ? `https://${domain}` : 'http://localhost:5173';
  const title = `Contact | ${siteName}`;
  const description =
    'Get in touch for photography enquiries, collaborations or to find out my availability and pricing.';
  const url = `${baseUrl}${location.pathname}`;
  return [
    // Basic metadata
    { title },
    { name: 'description', content: description },
    { name: 'author', content: author },

    // Add Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:site_name', content: siteName },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: altText },

    // X (Twitter) Card Metadata
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@_MattMillard' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: altText },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE, CLOUDFLARE_TURNSTILE_SITE_KEY } = context.cloudflare.env;

  return { MODE, CLOUDFLARE_TURNSTILE_SITE_KEY };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ContactFormSchema });

  if (submission.status !== 'success') {
    return submission.reply({
      formErrors: ['Form has errors'],
    });
  }

  const { [CF_TURNSTILE_KEY]: turnstileToken, email, message, name } = submission.value;

  const { MODE, CLOUDFLARE_TURNSTILE_SECRET_KEY, MAILJET_API_KEY, MAILJET_SECRET_KEY } = context.cloudflare.env;
  const isProduction = MODE === 'production';

  const dummySecretKey = '1x0000000000000000000000000000000AA';
  const secretKey = isProduction ? CLOUDFLARE_TURNSTILE_SECRET_KEY : dummySecretKey;

  // Validate the token by calling the
  // "/siteverify" API endpoint.
  const body = new FormData();
  body.append('secret', secretKey);
  body.append('response', turnstileToken as string);
  if (isProduction) {
    const ip = request.headers.get('CF-Connecting-IP');
    body.append('remoteip', ip as string);
  }

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await fetch(url, {
    body,
    method: 'POST',
  });

  const outcome: TurnstileServerValidationResponse = await result.json();

  if (!outcome.success) {
    throw new Response('The provided Turnstile token was not valid! Nice try Mr Robot 🤖', { status: 401 });
  }

  // Send email using MailJet REST API
  const mailjetUrl = 'https://api.mailjet.com/v3.1/send';
  const auth = btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`);

  try {
    const emailResponse = await fetch(mailjetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: MY_EMAIL,
              Name: MY_BUSINESS_NAME,
            },
            To: [
              {
                Email: MY_EMAIL,
                Name: MY_BUSINESS_NAME,
              },
            ],
            Subject: `Message from ${name}`,
            TextPart: `You received a message from ${name}: ${message}. Their email is ${email}.`,
          },
          {
            From: {
              Email: MY_EMAIL,
              Name: MY_BUSINESS_NAME,
            },
            To: [{ Email: email, Name: name }],
            Subject: 'Thank you for your message',
            TextPart: `Hi ${name},\n\nThank you for reaching out. I've received your message and will get back to you as soon as possible.\n\nIf you have any urgent enquiries, please don't hesitate to contact me directly at ${MY_EMAIL}.\n\nBest regards,\n${MY_NAME}`,
            HTMLPart: `
              <h3>Thank you for your message</h3>
              <p>Hi ${name},</p>
              <p>Thank you for reaching out. I've received your message and will get back to you as soon as possible.</p>
              <p>If you have any urgent enquiries, please don't hesitate to contact me directly at ${MY_EMAIL}.</p>
              <p>Best regards,<br>${MY_NAME}<br></p>
            `,
          },
        ],
      }),
    });

    const emailResult = await emailResponse.json();
    console.log('email response', emailResult);
  } catch (error) {
    console.error(error);
    return new Response('Failed to send email', { status: 500 });
  }

  return { ok: true };
}

export default function ContactRoute() {
  const { MODE, CLOUDFLARE_TURNSTILE_SITE_KEY } = useLoaderData<typeof loader>();
  const dummySiteKey = '1x00000000000000000000AA'; // Visible and always passes
  const siteKey = MODE === 'production' ? CLOUDFLARE_TURNSTILE_SITE_KEY : dummySiteKey;
  const lastResult = useActionData<typeof action>();
  const theme = (useTheme() as Theme) ?? 'auto';
  const fetcher = useFetcher<typeof action>();
  const isPending = useIsPending();
  const formRef = useRef<HTMLFormElement>(null);

  useFormReset({ fetcher, formRef });

  const [form, fields] = useForm({
    id: 'contact-form',
    constraint: getZodConstraint(ContactFormSchema),
    lastResult: lastResult as SubmissionResult<string[]> | null | undefined,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactFormSchema });
    },
  });

  return (
    <div>
      <div className="py-4 md:py-12">
        <div className="mx-auto w-full sm:max-w-3xl">
          <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
            <div className="grid md:grid-cols-2">
              <fetcher.Form
                className="p-6 md:p-8 flex flex-col gap-y-8"
                method="POST"
                {...getFormProps(form)}
                ref={formRef}
              >
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold">Contact me</h1>
                  <p className="text-balance text-muted-foreground">
                    Get in touch for photography enquiries, collaborations or to find out my availability and pricing.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor={fields.name.id}>Name</Label>
                    <Input
                      {...getInputProps(fields.name, { type: 'text' })}
                      autoFocus
                      placeholder="Henri Cartier-Bresson"
                    />
                    <FieldError errors={fields.name.errors} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={fields.email.id}>Email</Label>
                    <Input {...getInputProps(fields.email, { type: 'email' })} placeholder="name@example.com" />
                    <FieldError errors={fields.email.errors} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={fields.message.id}>Message</Label>
                    <Textarea
                      {...getTextareaProps(fields.message)}
                      rows={4}
                      placeholder="Tell me about your project or event..."
                    />
                    <FieldError errors={fields.message.errors} />
                  </div>

                  {/* Cloudflare Turnstile widget */}
                  <div className="pb-4">
                    <ClientOnly fallback={<TurnstileFallback />}>
                      {() => <Turnstile siteKey={siteKey} options={{ size: 'flexible', theme }} />}
                    </ClientOnly>
                  </div>

                  <Button variant={'secondary'} className="w-full">
                    {isPending ? 'Sending...' : 'Send message'}
                  </Button>
                  <FormErrors errors={form.errors} />
                </div>
              </fetcher.Form>
              <div className="hidden md:block">
                <img
                  src="https://imagedelivery.net/AbeialkEo72QKV7n-TqWVA/2792b91d-7f3b-4562-d020-a87f60fb4c00/public"
                  alt="Matt Millard"
                  className="bg-muted h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}
