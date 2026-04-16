import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyRecipesResponse } from '../types/api';

const STORAGE_KEY = 'fridgechef.daily-recipes-cache';

type DailyRecipesCache = Record<string, DailyRecipesResponse>;

export class DailyRecipesRepository {
  async find(cacheKey: string): Promise<DailyRecipesResponse | null> {
    const cache = await this.load();
    return cache[cacheKey] ?? null;
  }

  async save(cacheKey: string, payload: DailyRecipesResponse): Promise<void> {
    const cache = await this.load();
    cache[cacheKey] = payload;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }

  private async load(): Promise<DailyRecipesCache> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as DailyRecipesCache;
    } catch {
      return {};
    }
  }
}

export const dailyRecipesRepository = new DailyRecipesRepository();