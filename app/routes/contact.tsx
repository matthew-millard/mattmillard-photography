import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { Button, ClientOnly, FieldError, Input, Label, Textarea, Turnstile, TurnstileFallback } from '~/components/ui';
import { Theme } from '~/components/ui/theme-switch';
import { useTheme } from '~/hooks';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';

const CF_TURNSTILE_KEY = 'cf-turnstile-response';

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

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE, CLOUDFLARE_TURNSTILE_SITE_KEY } = context.cloudflare.env;

  return { MODE, CLOUDFLARE_TURNSTILE_SITE_KEY };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get('name');
  console.log('name', name);
  const turnstileToken = formData.get(CF_TURNSTILE_KEY);
  console.log('turnStileToken', turnstileToken);
  return {};
}

export default function ContactRoute() {
  const { CLOUDFLARE_TURNSTILE_SITE_KEY } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const theme = (useTheme() as Theme) ?? 'auto';

  const [form, fields] = useForm({
    id: 'contact-form',
    constraint: getZodConstraint(ContactFormSchema),
    lastResult,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactFormSchema });
    },
  });

  return (
    <div className="py-4 md:py-20">
      <div className="mx-auto w-full sm:max-w-3xl">
        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
          <div className="grid p-0 md:grid-cols-2">
            <Form className="p-6 md:p-8 flex flex-col gap-y-12" method="POST" {...getFormProps(form)}>
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

                {/* Cloudflare Implicit Turnstile widget */}
                <ClientOnly fallback={<TurnstileFallback />}>
                  {() => <Turnstile siteKey={CLOUDFLARE_TURNSTILE_SITE_KEY} theme={theme} />}
                </ClientOnly>

                <div className="">
                  <Button variant={'secondary'} className="w-full">
                    Send message
                  </Button>
                </div>
              </div>
            </Form>
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
  );
}

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
