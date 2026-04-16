import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getJson } from './client';
import { queryClient } from './queryClient';
import { dailyRecipesRepository } from '../repositories/DailyRecipesRepository';
import type { ApiError, DailyRecipesResponse, Locale } from '../types/api';

interface UseDailyRecipesQueryOptions {
  locale: Locale;
  ingredients?: string[];
}

const DAILY_RECIPE_SLOT_MS = 30 * 60 * 1000;
const pendingPrefetches = new Set<string>();

function getSlotStart(date = new Date()) {
  return new Date(Math.floor(date.getTime() / DAILY_RECIPE_SLOT_MS) * DAILY_RECIPE_SLOT_MS);
}

function toSlotKey(date: Date) {
  return date.toISOString();
}

function getNextSlotKey(slotStart: string) {
  return new Date(new Date(slotStart).getTime() + DAILY_RECIPE_SLOT_MS).toISOString();
}

function getNextSlotDelay() {
  return DAILY_RECIPE_SLOT_MS - (Date.now() % DAILY_RECIPE_SLOT_MS) + 120;
}

function buildDailyRecipesQueryKey(locale: Locale, slotStart: string, ingredientsKey: string) {
  return ['daily-recipes', locale, slotStart, ingredientsKey] as const;
}

function buildDailyRecipesCacheKey(locale: Locale, slotStart: string, ingredientsKey: string) {
  return buildDailyRecipesQueryKey(locale, slotStart, ingredientsKey).join('|');
}

function buildDailyRecipesParams(locale: Locale, slotStart: string, ingredients: string[]) {
  const params = new URLSearchParams({
    locale,
    slotStart,
  });

  if (ingredients.length > 0) {
    params.set('ingredients', ingredients.join(','));
  }

  return params;
}

async function fetchDailyRecipesSlot(
  locale: Locale,
  slotStart: string,
  ingredients: string[],
): Promise<DailyRecipesResponse> {
  const params = buildDailyRecipesParams(locale, slotStart, ingredients);
  return getJson<DailyRecipesResponse>(`/daily-recipes?${params.toString()}`);
}

function prefetchDailyRecipesSlot(locale: Locale, slotStart: string, ingredients: string[]) {
  const ingredientsKey = ingredients.join(',');
  const cacheKey = buildDailyRecipesCacheKey(locale, slotStart, ingredientsKey);

  if (pendingPrefetches.has(cacheKey)) {
    return;
  }

  pendingPrefetches.add(cacheKey);

  void (async () => {
    const cached = await dailyRecipesRepository.find(cacheKey);
    const queryKey = buildDailyRecipesQueryKey(locale, slotStart, ingredientsKey);

    if (cached) {
      queryClient.setQueryData(queryKey, cached);
      return;
    }

    const fresh = await fetchDailyRecipesSlot(locale, slotStart, ingredients);
    await dailyRecipesRepository.save(cacheKey, fresh);
    queryClient.setQueryData(queryKey, fresh);
  })()
    .catch(() => {
      return undefined;
    })
    .finally(() => {
      pendingPrefetches.delete(cacheKey);
    });
}

export function useDailyRecipesQuery({
  locale,
  ingredients = [],
}: UseDailyRecipesQueryOptions) {
  const [activeSlotStart, setActiveSlotStart] = useState(() => toSlotKey(getSlotStart()));
  const trimmedIngredients = useMemo(() => ingredients.filter(Boolean).slice(0, 8), [ingredients]);
  const ingredientsKey = trimmedIngredients.join(',');
  const queryKey = useMemo(
    () => buildDailyRecipesQueryKey(locale, activeSlotStart, ingredientsKey),
    [activeSlotStart, ingredientsKey, locale],
  );
  const cacheKey = useMemo(
    () => buildDailyRecipesCacheKey(locale, activeSlotStart, ingredientsKey),
    [activeSlotStart, ingredientsKey, locale],
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextSlot = () => {
      timeoutId = setTimeout(() => {
        setActiveSlotStart(toSlotKey(getSlotStart()));
        scheduleNextSlot();
      }, getNextSlotDelay());
    };

    scheduleNextSlot();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return useQuery<DailyRecipesResponse, ApiError>({
    gcTime: 1000 * 60 * 60 * 3,
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      const cached = await dailyRecipesRepository.find(cacheKey);
      const nextSlotStart = getNextSlotKey(activeSlotStart);

      if (cached) {
        void fetchDailyRecipesSlot(locale, activeSlotStart, trimmedIngredients)
          .then(async (fresh) => {
            await dailyRecipesRepository.save(cacheKey, fresh);
            queryClient.setQueryData(queryKey, fresh);
          })
          .catch(() => {
            return undefined;
          });

        prefetchDailyRecipesSlot(locale, nextSlotStart, trimmedIngredients);
        return cached;
      }

      const fresh = await fetchDailyRecipesSlot(locale, activeSlotStart, trimmedIngredients);
      await dailyRecipesRepository.save(cacheKey, fresh);
      prefetchDailyRecipesSlot(locale, nextSlotStart, trimmedIngredients);
      return fresh;
    },
    queryKey,
    retry: 2,
    staleTime: DAILY_RECIPE_SLOT_MS,
  });
}