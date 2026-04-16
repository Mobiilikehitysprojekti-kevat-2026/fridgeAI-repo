import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RecipeDTO, SavedRecipeRecord } from '../types/api';
import { persistRecipeImageUri } from '../utils/recipeImageStorage';

const STORAGE_KEY = 'fridgechef.saved-recipes';
const MAX_RECIPES = 50;

export class RecipeRepository {
  async save(recipe: RecipeDTO, imageUri?: string): Promise<void> {
    const current = await this.findAllRecords();
    const existingRecord = current.find((item) => item.recipe.id === recipe.id);
    const persistedImageUri = await persistRecipeImageUri(imageUri ?? existingRecord?.imageUri);
    const next: SavedRecipeRecord[] = [
      {
        imageUri: persistedImageUri,
        recipe,
        savedAt: new Date().toISOString(),
      },
      ...current.filter((item) => item.recipe.id !== recipe.id),
    ].slice(0, MAX_RECIPES);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async findAll(): Promise<RecipeDTO[]> {
    const records = await this.findAllRecords();
    return records.map((record) => record.recipe);
  }

  async findAllRecords(): Promise<SavedRecipeRecord[]> {
    return this.loadRecords();
  }

  async findById(id: string): Promise<RecipeDTO | null> {
    const records = await this.loadRecords();
    return records.find((record) => record.recipe.id === id)?.recipe ?? null;
  }

  async delete(id: string): Promise<void> {
    const records = await this.loadRecords();
    const next = records.filter((record) => record.recipe.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async isSaved(id: string): Promise<boolean> {
    const records = await this.loadRecords();
    return records.some((record) => record.recipe.id === id);
  }

  private async loadRecords(): Promise<SavedRecipeRecord[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as SavedRecipeRecord[];
    } catch {
      return [];
    }
  }
}

export const recipeRepository = new RecipeRepository();