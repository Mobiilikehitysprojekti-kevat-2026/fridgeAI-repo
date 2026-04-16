import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CalorieRecord, ConfidenceRecord } from '../types/api';

const CALORIE_HISTORY_KEY = 'fridgechef.stats.calories';
const CONFIDENCE_HISTORY_KEY = 'fridgechef.stats.confidence';
const MAX_HISTORY_ITEMS = 100;

export class StatsRepository {
  async saveMealCalories(calories: number): Promise<void> {
    const history = await this.getCalorieHistory();
    const newRecord: CalorieRecord = {
      date: new Date().toISOString(),
      calories,
    };
    const next = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(CALORIE_HISTORY_KEY, JSON.stringify(next));
  }

  async saveScanConfidence(confidence: number): Promise<void> {
    const history = await this.getConfidenceHistory();
    const newRecord: ConfidenceRecord = {
      date: new Date().toISOString(),
      confidence,
    };
    const next = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(CONFIDENCE_HISTORY_KEY, JSON.stringify(next));
  }

  async getCalorieHistory(): Promise<CalorieRecord[]> {
    return this.loadRecords<CalorieRecord>(CALORIE_HISTORY_KEY);
  }

  async getConfidenceHistory(): Promise<ConfidenceRecord[]> {
    return this.loadRecords<ConfidenceRecord>(CONFIDENCE_HISTORY_KEY);
  }

  private async loadRecords<T>(key: string): Promise<T[]> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }
}

export const statsRepository = new StatsRepository();
