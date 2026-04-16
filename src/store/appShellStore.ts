import { create } from 'zustand';

import { statsRepository } from '../repositories/StatsRepository';
import type { AnalyzeResponse, IngredientDTO } from '../types/api';

function normalizePantryIngredient(ingredient: IngredientDTO, index: number): IngredientDTO {
  return {
    ...ingredient,
    id: ingredient.id ?? `${ingredient.name}-${index}`,
  };
}

interface AppShellState {
  latestAnalysis: AnalyzeResponse | null;
  pantryIngredients: IngredientDTO[];
  sourceImageUri: string | null;
  selectedIngredients: IngredientDTO[];
  setLatestAnalysis: (analysis: AnalyzeResponse, sourceImageUri: string) => void;
  setPantryIngredients: (ingredients: IngredientDTO[]) => void;
  upsertPantryIngredient: (ingredient: IngredientDTO) => void;
  removePantryIngredient: (ingredientId: string) => void;
  setSelectedIngredients: (ingredients: IngredientDTO[]) => void;
  clearLatestAnalysis: () => void;
}

export const useAppShellStore = create<AppShellState>((set) => ({
  latestAnalysis: null,
  pantryIngredients: [],
  sourceImageUri: null,
  selectedIngredients: [],
  setLatestAnalysis: (analysis, sourceImageUri) => {
    // Log confidence for stats
    if (analysis.detectedIngredients.length > 0) {
      const avgConfidence =
        analysis.detectedIngredients.reduce((acc, curr) => acc + curr.confidence, 0) /
        analysis.detectedIngredients.length;
      statsRepository.saveScanConfidence(avgConfidence);
    }

    set(() => ({
      latestAnalysis: analysis,
      selectedIngredients: analysis.detectedIngredients,
      sourceImageUri,
    }));
  },
  setPantryIngredients: (ingredients) =>
    set(() => ({
      pantryIngredients: ingredients.map(normalizePantryIngredient),
    })),
  upsertPantryIngredient: (ingredient) =>
    set((state) => {
      const ingredientId = ingredient.id ?? ingredient.name;
      const existingIndex = state.pantryIngredients.findIndex(
        (item) => (item.id ?? item.name) === ingredientId,
      );

      if (existingIndex === -1) {
        return {
          pantryIngredients: [
            normalizePantryIngredient(
              {
                ...ingredient,
                id: ingredientId,
              },
              state.pantryIngredients.length,
            ),
            ...state.pantryIngredients,
          ],
        };
      }

      return {
        pantryIngredients: state.pantryIngredients.map((item, index) =>
          (item.id ?? item.name) === ingredientId
            ? normalizePantryIngredient(
                {
                  ...item,
                  ...ingredient,
                  id: ingredientId,
                },
                index,
              )
            : item,
        ),
      };
    }),
  removePantryIngredient: (ingredientId) =>
    set((state) => ({
      pantryIngredients: state.pantryIngredients.filter(
        (ingredient) => (ingredient.id ?? ingredient.name) !== ingredientId,
      ),
    })),
  setSelectedIngredients: (ingredients) =>
    set(() => ({
      selectedIngredients: ingredients,
    })),
  clearLatestAnalysis: () =>
    set(() => ({
      latestAnalysis: null,
      selectedIngredients: [],
      sourceImageUri: null,
    })),
}));