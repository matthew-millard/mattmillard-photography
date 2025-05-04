import { type Categories } from '~/routes/admin.upload-images';

interface Options {
  metadata?: {
    category: Categories;
    altText?: string;
  };
  requireSignedURLs?: boolean;
}

interface CloudflareImagesResponse {
  result: {
    id: string;
    filename: string;
    metadata: Record<string, string>;
    uploaded: Date;
    requireSignedUrls: boolean;
    variants: string[];
  };
  success: boolean;
  errors: string[];
  messages: string[];
}

export async function uploadToCloudflareImages(file: File, accountId: string, apiToken: string, options: Options = {}) {
  const formData = new FormData();
  formData.append('file', file);

  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  });

  const data: CloudflareImagesResponse = await response.json();

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return data;
}

export async function deleteFromCloudflareImages(id: string, accountId: string, apiToken: string) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  return response;
}
