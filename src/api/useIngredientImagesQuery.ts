import { useQuery } from '@tanstack/react-query';

import { getJson } from './client';
import type { ApiError, IngredientImagesResponse, Locale } from '../types/api';

interface UseIngredientImagesQueryOptions {
  locale: Locale;
  names: string[];
}

export function useIngredientImagesQuery({
  locale,
  names,
}: UseIngredientImagesQueryOptions) {
  const normalizedNames = Array.from(
    new Set(
      names
        .map((name) => name.trim())
        .filter(Boolean)
        .slice(0, 8),
    ),
  ).sort((left, right) => left.localeCompare(right));

  const params = new URLSearchParams({
    locale,
  });

  if (normalizedNames.length > 0) {
    params.set('names', normalizedNames.join(','));
  }

  return useQuery<IngredientImagesResponse, ApiError>({
    enabled: normalizedNames.length > 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    queryFn: () => getJson<IngredientImagesResponse>(`/ingredient-images?${params.toString()}`),
    queryKey: ['ingredient-images', locale, normalizedNames.join(',')],
    retry: 1,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
}