import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { Button, Input, Label, Textarea } from '~/components/ui';
import { altText, author, domain, imageUrl, siteName } from '~/metadata';

export async function loader({ context }: LoaderFunctionArgs) {
  const { MODE } = context.cloudflare.env;
  return { MODE };
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('request', request);
  return {};
}

export default function ContactRoute() {
  return (
    <div className="py-4">
      <div className="mx-auto w-full sm:max-w-3xl">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="grid p-0 sm:grid-cols-2">
            <Form className="p-6 md:p-8 flex flex-col gap-y-12" method="POST">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold">Contact me</h1>
                <p className="text-balance text-muted-foreground">
                  Get in touch for photography enquiries, collaborations or to find out my availability and pricing.
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required autoFocus placeholder="name@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={4} required />
                </div>
                <div className="">
                  <Button variant={'secondary'} className="w-full">
                    Send message
                  </Button>
                </div>
              </div>
            </Form>
            <div className="hidden md:block bg-muted">
              <img
                src="https://imagedelivery.net/AbeialkEo72QKV7n-TqWVA/2792b91d-7f3b-4562-d020-a87f60fb4c00/public"
                alt="Matt Millard"
                className="bg-muted w-full md:w-[400px] md:h-[500px] object-cover"
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
