import assert from 'node:assert/strict';
import { after, beforeEach, describe, it } from 'node:test';

import { useAskFridgeSessionStore } from '../src/store/askFridgeSessionStore';

describe('useAskFridgeSessionStore', () => {
  beforeEach(async () => {
    useAskFridgeSessionStore.getState().clearSession();
    await useAskFridgeSessionStore.persist.clearStorage();
  });

  after(async () => {
    await useAskFridgeSessionStore.persist.clearStorage();
  });

  it('stores suggestions for the active ask fridge chat', () => {
    useAskFridgeSessionStore.getState().setPendingPrompt('Use my pantry');
    useAskFridgeSessionStore.getState().setSuggestions('Use my pantry', [
      {
        fitLabel: 'Great fit',
        image: {
          url: 'https://example.com/tortilla.jpg',
        },
        recipe: {
          cuisine: 'Spanish',
          difficulty: 'easy',
          id: 'recipe-1',
          ingredients: [],
          servings: 2,
          steps: [{ instruction: 'Cook.', stepNumber: 1 }],
          title: 'Quick Spanish tortilla',
          totalTimeMinutes: 20,
        },
        summary: 'Fast and pantry friendly.',
      },
    ]);

    const state = useAskFridgeSessionStore.getState();
    assert.equal(state.lastSubmittedPrompt, 'Use my pantry');
    assert.equal(state.localAssistantMessage, null);
    assert.equal(state.suggestions.length, 1);
    assert.equal(state.suggestions[0]?.recipe.title, 'Quick Spanish tortilla');
  });

  it('clears stale suggestions when the pantry is empty', () => {
    useAskFridgeSessionStore.getState().setSuggestions('Wrap ideas', [
      {
        fitLabel: 'Good fit',
        recipe: {
          cuisine: 'Mexican',
          difficulty: 'easy',
          id: 'recipe-2',
          ingredients: [],
          servings: 1,
          steps: [{ instruction: 'Serve.', stepNumber: 1 }],
          title: 'Bean and avocado wrap',
          totalTimeMinutes: 10,
        },
        summary: 'Fresh and quick.',
      },
    ]);

    useAskFridgeSessionStore
      .getState()
      .setLocalAssistantMessage('Use my pantry', 'Your pantry is empty. Add a few items first.');

    const state = useAskFridgeSessionStore.getState();
    assert.equal(state.lastSubmittedPrompt, 'Use my pantry');
    assert.equal(state.suggestions.length, 0);
    assert.match(state.localAssistantMessage ?? '', /empty/i);
  });
});
