import { useMutation } from '@tanstack/react-query';

import { postMultipart } from './client';
import type { AnalyzeUploadPayload, AnalyzeResponse, ApiError } from '../types/api';

function buildUploadFileName(uri: string, mimeType: AnalyzeUploadPayload['image']['mimeType']) {
  const matchedExtension = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)?.[1];
  const fallbackExtension = mimeType === 'image/png' ? 'png' : 'jpg';
  const extension = matchedExtension?.toLowerCase() ?? fallbackExtension;

  return `ingredients-upload.${extension}`;
}

export async function uploadAnalyzeImage(
  payload: AnalyzeUploadPayload,
): Promise<AnalyzeResponse> {
  const body = new FormData();
  const fileName = buildUploadFileName(payload.image.uri, payload.image.mimeType);
  const filePart = {
    name: fileName,
    type: payload.image.mimeType,
    uri: payload.image.uri,
  } as unknown as Blob;

  body.append('locale', payload.locale);
  body.append('image', filePart);

  return postMultipart<AnalyzeResponse>('/analyze', body);
}

export function useAnalyzeMutation() {
  return useMutation<AnalyzeResponse, ApiError, AnalyzeUploadPayload>({
    mutationFn: uploadAnalyzeImage,
  });
}
