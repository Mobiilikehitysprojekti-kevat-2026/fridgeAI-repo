export type Locale = 'en' | 'fi';

export type IngredientCategory =
  | 'vegetable'
  | 'protein'
  | 'dairy'
  | 'spice'
  | 'grain'
  | 'fruit'
  | 'other';

export interface IngredientDTO {
  id?: string;
  name: string;
  confidence: number;
  quantity?: string;
  category: IngredientCategory;
}

export interface RecipeStepDTO {
  stepNumber: number;
  instruction: string;
  durationSeconds?: number;
  tip?: string;
}

export interface NutritionDTO {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface RecipeDTO {
  id: string;
  title: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalTimeMinutes: number;
  servings: number;
  ingredients: IngredientDTO[];
  steps: RecipeStepDTO[];
  nutritionEstimate?: NutritionDTO;
}

export interface RecipeImageDTO {
  url: string;
  alt?: string;
  photographerName?: string;
  photographerUrl?: string;
  sourceUrl?: string;
}

export interface IngredientImageItemDTO {
  name: string;
  image?: RecipeImageDTO | null;
}

export interface AnalyzeRequest {
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png';
  locale: Locale;
}

export interface AnalyzeUploadPayload {
  image: {
    uri: string;
    mimeType: 'image/jpeg' | 'image/png';
  };
  locale: Locale;
}

export interface AnalyzeResponse {
  requestId: string;
  detectedIngredients: IngredientDTO[];
  suggestedRecipe: RecipeDTO;
  processingTimeMs: number;
}

export interface DailyRecipeItemDTO {
  recipe: RecipeDTO;
  image?: RecipeImageDTO | null;
}

export interface DailyRecipesResponse {
  generatedFor: string;
  items: DailyRecipeItemDTO[];
  slotEndsAt: string;
  slotStart: string;
}

export interface AskFridgeRequest {
  locale: Locale;
  pantryIngredients?: string[];
  prompt: string;
}

export interface AskFridgeSuggestionDTO {
  fitLabel: string;
  image?: RecipeImageDTO | null;
  recipe: RecipeDTO;
  summary: string;
}

export interface AskFridgeResponse {
  suggestions: AskFridgeSuggestionDTO[];
}

export interface IngredientImagesResponse {
  items: IngredientImageItemDTO[];
}

export interface RecipeGenerationRequest {
  ingredients: IngredientDTO[];
  locale: Locale;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface SavedRecipeRecord {
  imageUri?: string;
  recipe: RecipeDTO;
  savedAt: string;
}