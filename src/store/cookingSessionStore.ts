import { create } from 'zustand';

import { statsRepository } from '../repositories/StatsRepository';
import type { Locale, RecipeDTO } from '../types/api';

type CookingStatus = 'idle' | 'cooking' | 'paused' | 'completed';

interface CookingSessionState {
  recipe: RecipeDTO | null;
  currentStepIndex: number;
  status: CookingStatus;
  isTTSEnabled: boolean;
  locale: Locale;
  startSession: (recipe: RecipeDTO, locale: Locale, initialStepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePause: () => void;
  toggleTTS: () => void;
  reset: () => void;
}

const defaultStepIndex = 0;

export const useCookingSessionStore = create<CookingSessionState>((set) => ({
  recipe: null,
  currentStepIndex: 0,
  status: 'idle',
  isTTSEnabled: false,
  locale: 'en',
  startSession: (recipe, locale, initialStepIndex = defaultStepIndex) =>
    set(() => ({
      locale,
      recipe,
      currentStepIndex: Math.min(initialStepIndex, recipe.steps.length - 1),
      status: 'cooking',
    })),
  nextStep: () =>
    set((state) => {
      if (!state.recipe) {
        return state;
      }

      const nextIndex = Math.min(
        state.currentStepIndex + 1,
        state.recipe.steps.length - 1,
      );

      const isCompleted = nextIndex === state.recipe.steps.length - 1;

      if (isCompleted && state.status !== 'completed' && state.recipe.nutritionEstimate) {
        statsRepository.saveMealCalories(state.recipe.nutritionEstimate.calories);
      }

      return {
        currentStepIndex: nextIndex,
        status: isCompleted ? 'completed' : 'cooking',
      };
    }),
  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      status: 'cooking',
    })),
  togglePause: () =>
    set((state) => ({
      status: state.status === 'paused' ? 'cooking' : 'paused',
    })),
  toggleTTS: () =>
    set((state) => ({
      isTTSEnabled: !state.isTTSEnabled,
    })),
  reset: () =>
    set(() => ({
      recipe: null,
      currentStepIndex: 0,
      locale: 'en',
      status: 'idle',
      isTTSEnabled: false,
    })),
}));