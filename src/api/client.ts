import { API_BASE_URL } from '../config/env';
import type { ApiError } from '../types/api';

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ApiError;
    return {
      code: payload.code ?? `HTTP_${response.status}`,
      details: payload.details,
      message: payload.message ?? response.statusText,
    };
  } catch {
    return {
      code: `HTTP_${response.status}`,
      message: response.statusText || 'Request failed',
    };
  }
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return (await response.json()) as TResponse;
}

export async function postMultipart<TResponse>(path: string, body: FormData): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body,
    method: 'POST',
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return (await response.json()) as TResponse;
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return (await response.json()) as TResponse;
}
