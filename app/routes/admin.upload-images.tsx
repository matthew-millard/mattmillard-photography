import { getFormProps, getInputProps, getSelectProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  ActionFunctionArgs,
  unstable_parseMultipartFormData as parseMultipartFormData,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  LoaderFunctionArgs,
} from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { z } from 'zod';
import { requireAdmin } from '~/.server/auth';
import { uploadToCloudflareImages } from '~/.server/images';
import { Button } from '~/components/ui';

const CATEGORIES = ['food', 'drink', 'people', 'studio', 'interior', 'collection'] as const;
export type Categories = (typeof CATEGORIES)[number];

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(file => ['image/png', 'image/jpeg', 'image/gif', 'image/WebP', 'image/svg+xml'].includes(file.type), {
    message: 'Invalid image file type',
  });

const IMAGE_CATEGORY_SCHEMA = z
  .string({ message: 'Please select a category' })
  .refine(category => CATEGORIES.includes(category as Categories), {
    message: 'Invalid image category',
  });

const UPLOAD_IMAGE_FILES_SCHEMA = z.object({
  files: z
    .array(IMAGE_SCHEMA)
    .min(1, 'At least 1 image file is required')
    .refine(files => files.every(file => file.size < MAX_IMAGE_FILE_SIZE), {
      message: 'Image file size must be less than 5MB',
    }),
  category: IMAGE_CATEGORY_SCHEMA,
  altText: z.string().optional(),
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  await requireAdmin(request, DB);
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { DB, CLOUDFLARE_IMAGES_ACCOUNT_ID, CLOUDFLARE_IMAGES_API_TOKEN } = context.cloudflare.env;
  await requireAdmin(request, DB);
  const uploadHandler = createMemoryUploadHandler({ maxPartSize: MAX_IMAGE_FILE_SIZE });
  const formData = await parseMultipartFormData(request, uploadHandler);

  const submission = parseWithZod(formData, {
    schema: UPLOAD_IMAGE_FILES_SCHEMA,
  });

  if (submission.status !== 'success') {
    return new Response(JSON.stringify(submission.reply()), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { category, files, altText } = submission.value;

  const results = [];
  for (const file of files) {
    try {
      const data = await uploadToCloudflareImages(file, CLOUDFLARE_IMAGES_ACCOUNT_ID, CLOUDFLARE_IMAGES_API_TOKEN, {
        metadata: { category: category as Categories, altText },
      });

      const url = data.result.variants.find(str => str.endsWith('public'));
      const lqip_url = data.result.variants.find(str => str.endsWith('placeholder'));

      if (!url || !lqip_url) {
        throw new Error('Failed to get image URLs from Cloudflare');
      }

      // Store metadata in D1
      const preparedStatement = DB.prepare(
        `INSERT INTO images (id, cloudflare_id, url, lqip_url, category, alt_text) VALUES (?,?,?,?,?,?)`
      ).bind(crypto.randomUUID(), data.result.id, url, lqip_url, category, altText ?? null);

      const dbResponse = await preparedStatement.run();

      if (!dbResponse.success) {
        throw new Error(`Failed to upload image to database: ${dbResponse.error}`);
      }

      results.push({ success: true, filename: file.name });
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      results.push({
        success: false,
        filename: file.name,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  // Check if any uploads failed
  const failedUploads = results.filter(result => !result.success);
  if (failedUploads.length > 0) {
    return new Response(
      JSON.stringify({
        message: 'Some images failed to upload',
        results,
      }),
      { status: 207 } // 207 Multi-Status
    );
  }

  return new Response(
    JSON.stringify({
      message: 'All images uploaded successfully',
      results,
    }),
    { status: 200 }
  );
}

export default function UploadImagesRoute() {
  const [form, fields] = useForm({
    id: 'upload-images',
    constraint: getZodConstraint(UPLOAD_IMAGE_FILES_SCHEMA),
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UPLOAD_IMAGE_FILES_SCHEMA });
    },
  });
  return (
    <div>
      <div>
        <h1>Upload images</h1>
        <Form method="POST" encType="multipart/form-data" {...getFormProps(form)}>
          <div>
            <label htmlFor={fields.files.id}>Choose images to upload (JPG, PNG, WebP, GIF, SVG)</label>
            <input {...getInputProps(fields.files, { type: 'file' })} multiple />
          </div>
          <div>
            <label htmlFor={fields.altText.id}>Alt Text</label>
            <input {...getInputProps(fields.altText, { type: 'text' })} />
          </div>
          <div>
            <label htmlFor={fields.category.id}>Choose a category</label>
            <select {...getSelectProps(fields.category)}>
              <option value="">--Select category--</option>
              <option value="collection">Collection</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="people">People</option>
              <option value="studio">Studio</option>
              <option value="interior">Interior</option>
            </select>
          </div>
          {/* Todo: update UI - input field errors */}
          <div>
            <ul className="text-destructive text-sm">
              {Object.values(form.allErrors)
                .flat()
                .map(error => (
                  <li key={error}>{error}</li>
                ))}
            </ul>
          </div>
          <Button type="submit" variant={'secondary'}>
            Upload
          </Button>
        </Form>
      </div>
    </div>
  );
}
