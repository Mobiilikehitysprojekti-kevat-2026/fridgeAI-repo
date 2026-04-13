# `src/` Folder Split For 3 People

This is the **simple version**.
Only the `src/` folders are divided between 3 people.

---

## Person 1

### `components/`

- `src/components/atoms/IconCircleButton.tsx`
- `src/components/molecules/AppBottomNav.tsx`
- `src/components/organisms/AskFridgeModal.tsx`

### `screens/`

- `src/screens/AnalysisLoadingScreen.tsx`
- `src/screens/CameraScreen.tsx`
- `src/screens/CompletionScreen.tsx`
- `src/screens/CookingModeScreen.tsx`
- `src/screens/IngredientsScreen.tsx`
- `src/screens/MealSuggestionsScreen.tsx`
- `src/screens/PantryHubScreen.tsx`
- `src/screens/RecipeScreen.tsx`
- `src/screens/RecipesHubScreen.tsx`
- `src/screens/SettingsScreen.tsx`

### `theme/`

- `src/theme/colors.ts`

### `i18n/`

- `src/i18n/index.ts`
- `src/i18n/resources.ts`

---

## Person 2

### `hooks/`

- `src/hooks/useAudioQueue.ts`
- `src/hooks/useCamera.ts`
- `src/hooks/useImageProcessor.ts`

### `navigation/`

- `src/navigation/RootNavigator.tsx`
- `src/navigation/types.ts`

### `config/`

- `src/config/env.ts`

### `utils/`

- `src/utils/errors.ts`
- `src/utils/recipeImageStorage.ts`

---

## Person 3

### `api/`

- `src/api/client.ts`
- `src/api/queryClient.ts`
- `src/api/useAnalyzeMutation.ts`
- `src/api/useAskFridgeMutation.ts`
- `src/api/useDailyRecipesQuery.ts`
- `src/api/useIngredientImagesQuery.ts`

### `repositories/`

- `src/repositories/DailyRecipesRepository.ts`
- `src/repositories/RecipeRepository.ts`

### `store/`

- `src/store/appShellStore.ts`
- `src/store/askFridgeSessionStore.ts`
- `src/store/cookingSessionStore.ts`
- `src/store/index.ts`
- `src/store/preferencesStore.ts`

### `types/`

- `src/types/api.ts`
- `src/types/image.ts`

---

## Short Summary

- **Person 1:** `components/`, `screens/`, `theme/`, `i18n/`
- **Person 2:** `hooks/`, `navigation/`, `config/`, `utils/`
- **Person 3:** `api/`, `repositories/`, `store/`, `types/`

