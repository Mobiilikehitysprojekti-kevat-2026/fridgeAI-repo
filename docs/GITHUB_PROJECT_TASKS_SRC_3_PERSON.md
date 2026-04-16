# GitHub Project Tasks - `src/` Only - 3 People

This file is the **practical version** for your GitHub Project board.

Use it like this:

- create one card for each row
- set the assignee
- set the sprint
- copy the file list into the card description

This list follows:

- the `src/` split in [SRC_FOLDER_SPLIT_3_PERSON.md](/Users/dogan/Desktop/fridgeAI-repo/docs/SRC_FOLDER_SPLIT_3_PERSON.md)
- a 6 week Scrum plan
- 3 people working in parallel

---

## Sprint 1

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Set up theme tokens and initial mobile design system | Person 1 | `ui`, `theme` | `src/theme/colors.ts` |
| Set up i18n base and add first EN/FI resources | Person 1 | `i18n`, `ui` | `src/i18n/index.ts`, `src/i18n/resources.ts` |
| Create navigation types and root navigator skeleton | Person 2 | `navigation`, `mobile` | `src/navigation/RootNavigator.tsx`, `src/navigation/types.ts` |
| Create app environment configuration | Person 2 | `config`, `mobile` | `src/config/env.ts` |
| Create shared frontend DTOs and image types | Person 3 | `types`, `api` | `src/types/api.ts`, `src/types/image.ts` |
| Create frontend API client and query client | Person 3 | `api`, `mobile` | `src/api/client.ts`, `src/api/queryClient.ts` |
| Create store exports and preferences store | Person 3 | `store`, `persistence` | `src/store/index.ts`, `src/store/preferencesStore.ts` |

---

## Sprint 2

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Build reusable icon button and bottom navigation | Person 1 | `components`, `ui` | `src/components/atoms/IconCircleButton.tsx`, `src/components/molecules/AppBottomNav.tsx` |
| Build base Recipes, Pantry, and Settings screens | Person 1 | `screens`, `ui` | `src/screens/RecipesHubScreen.tsx`, `src/screens/PantryHubScreen.tsx`, `src/screens/SettingsScreen.tsx` |
| Build Camera screen UI and Analysis Loading screen UI | Person 1 | `screens`, `ui` | `src/screens/CameraScreen.tsx`, `src/screens/AnalysisLoadingScreen.tsx` |
| Implement camera permission and capture hook | Person 2 | `hooks`, `mobile` | `src/hooks/useCamera.ts` |
| Implement image processing hook | Person 2 | `hooks`, `mobile` | `src/hooks/useImageProcessor.ts` |
| Add frontend error normalization helpers | Person 2 | `utils`, `mobile` | `src/utils/errors.ts` |
| Create analyze mutation and app shell store foundation | Person 3 | `api`, `store` | `src/api/useAnalyzeMutation.ts`, `src/store/appShellStore.ts` |

---

## Sprint 3

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Build Ingredients screen UI | Person 1 | `screens`, `ui` | `src/screens/IngredientsScreen.tsx` |
| Build Meal Suggestions screen UI | Person 1 | `screens`, `ui` | `src/screens/MealSuggestionsScreen.tsx` |
| Expand translations for analysis and ingredient flow | Person 1 | `i18n`, `ui` | `src/i18n/resources.ts` |
| Connect camera flow to navigator and loading flow | Person 2 | `navigation`, `hooks` | `src/navigation/RootNavigator.tsx`, `src/hooks/useCamera.ts`, `src/hooks/useImageProcessor.ts` |
| Add local recipe image storage utility | Person 2 | `utils`, `persistence` | `src/utils/recipeImageStorage.ts` |
| Create recipe repository and daily recipes repository | Person 3 | `repositories`, `persistence` | `src/repositories/RecipeRepository.ts`, `src/repositories/DailyRecipesRepository.ts` |
| Add daily recipes query and update app shell state | Person 3 | `api`, `store` | `src/api/useDailyRecipesQuery.ts`, `src/store/appShellStore.ts` |

---

## Sprint 4

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Build Recipe detail screen | Person 1 | `screens`, `ui` | `src/screens/RecipeScreen.tsx` |
| Build Cooking Mode screen | Person 1 | `screens`, `ui` | `src/screens/CookingModeScreen.tsx` |
| Build Completion screen and polish suggestion card flow | Person 1 | `screens`, `ui` | `src/screens/CompletionScreen.tsx`, `src/screens/MealSuggestionsScreen.tsx` |
| Implement narration queue for cooking mode | Person 2 | `hooks`, `mobile` | `src/hooks/useAudioQueue.ts` |
| Polish navigation transitions between recipe, cooking, and completion | Person 2 | `navigation`, `mobile` | `src/navigation/RootNavigator.tsx` |
| Create cooking session store | Person 3 | `store`, `persistence` | `src/store/cookingSessionStore.ts` |
| Add ask-fridge mutation and update shared DTOs | Person 3 | `api`, `types` | `src/api/useAskFridgeMutation.ts`, `src/types/api.ts` |

---

## Sprint 5

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Build Ask Fridge modal UI | Person 1 | `components`, `ui` | `src/components/organisms/AskFridgeModal.tsx` |
| Expand RecipesHub UI for daily ideas and saved collection | Person 1 | `screens`, `ui` | `src/screens/RecipesHubScreen.tsx` |
| Expand PantryHub UI for add, edit, search, and empty states | Person 1 | `screens`, `ui` | `src/screens/PantryHubScreen.tsx` |
| Polish camera and image flow edge cases | Person 2 | `hooks`, `mobile` | `src/hooks/useCamera.ts`, `src/hooks/useImageProcessor.ts` |
| Finalize env and utility behavior for device testing | Person 2 | `config`, `utils` | `src/config/env.ts`, `src/utils/errors.ts`, `src/utils/recipeImageStorage.ts` |
| Add ingredient images query hook | Person 3 | `api`, `mobile` | `src/api/useIngredientImagesQuery.ts` |
| Create Ask Fridge session store and connect persistence | Person 3 | `store`, `persistence` | `src/store/askFridgeSessionStore.ts` |

---

## Sprint 6

| Title | Assignee | Labels | Files |
|---|---|---|---|
| Final UI polish across screens and shared components | Person 1 | `ui`, `polish` | `src/components/organisms/AskFridgeModal.tsx`, `src/screens/*.tsx`, `src/theme/colors.ts` |
| Final translation and text consistency pass | Person 1 | `i18n`, `polish` | `src/i18n/resources.ts`, `src/i18n/index.ts` |
| Final mobile flow cleanup and hook stabilization | Person 2 | `mobile`, `polish` | `src/hooks/*.ts`, `src/navigation/*.ts`, `src/utils/*.ts`, `src/config/env.ts` |
| Final API hook cleanup and query behavior polish | Person 3 | `api`, `polish` | `src/api/*.ts` |
| Final store and repository cleanup | Person 3 | `store`, `repositories` | `src/store/*.ts`, `src/repositories/*.ts`, `src/types/*.ts` |

---

## Copy-Paste Short Version

If you want the shortest direct split for GitHub:

### Person 1

- components
- screens
- theme
- i18n

### Person 2

- hooks
- navigation
- config
- utils

### Person 3

- api
- repositories
- store
- types

