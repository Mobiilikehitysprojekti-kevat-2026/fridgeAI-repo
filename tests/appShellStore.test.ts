import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { useAppShellStore } from '../src/store/appShellStore';

describe('useAppShellStore', () => {
  beforeEach(() => {
    useAppShellStore.setState({
      latestAnalysis: null,
      pantryIngredients: [],
      selectedIngredients: [],
      sourceImageUri: null,
    });
  });

  it('keeps pantry ingredients when clearing the latest scan session', () => {
    useAppShellStore.getState().setPantryIngredients([
      {
        category: 'vegetable',
        confidence: 1,
        name: 'Tomato',
      },
    ]);
    useAppShellStore.getState().setSelectedIngredients([
      {
        category: 'protein',
        confidence: 1,
        name: 'Egg',
      },
    ]);
    useAppShellStore.setState({
      latestAnalysis: {
        detectedIngredients: [],
        processingTimeMs: 1,
        requestId: 'req-1',
        suggestedRecipe: {
          cuisine: 'Test',
          difficulty: 'easy',
          id: 'recipe-1',
          ingredients: [],
          servings: 1,
          steps: [{ instruction: 'Cook.', stepNumber: 1 }],
          title: 'Recipe',
          totalTimeMinutes: 5,
        },
      },
      sourceImageUri: 'file:///scan.jpg',
    });

    useAppShellStore.getState().clearLatestAnalysis();

    const state = useAppShellStore.getState();
    assert.equal(state.latestAnalysis, null);
    assert.equal(state.sourceImageUri, null);
    assert.equal(state.selectedIngredients.length, 0);
    assert.equal(state.pantryIngredients.length, 1);
    assert.equal(state.pantryIngredients[0]?.name, 'Tomato');
  });

  it('can add, update, and remove pantry ingredients', () => {
    useAppShellStore.getState().upsertPantryIngredient({
      category: 'other',
      confidence: 1,
      id: 'manual-1',
      name: 'Oats',
      quantity: '1 bag',
    });

    let state = useAppShellStore.getState();
    assert.equal(state.pantryIngredients.length, 1);
    assert.equal(state.pantryIngredients[0]?.name, 'Oats');

    useAppShellStore.getState().upsertPantryIngredient({
      category: 'grain',
      confidence: 1,
      id: 'manual-1',
      name: 'Rolled Oats',
      quantity: '2 bags',
    });

    state = useAppShellStore.getState();
    assert.equal(state.pantryIngredients.length, 1);
    assert.equal(state.pantryIngredients[0]?.name, 'Rolled Oats');
    assert.equal(state.pantryIngredients[0]?.quantity, '2 bags');

    useAppShellStore.getState().removePantryIngredient('manual-1');

    state = useAppShellStore.getState();
    assert.equal(state.pantryIngredients.length, 0);
  });
});
