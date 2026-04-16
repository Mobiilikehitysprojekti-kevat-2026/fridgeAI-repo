import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

import type { AskFridgeSuggestionDTO } from '../types/api';

interface AskFridgeSessionState {
  lastSubmittedPrompt: string;
  localAssistantMessage: string | null;
  suggestions: AskFridgeSuggestionDTO[];
  clearSession: () => void;
  setLocalAssistantMessage: (prompt: string, message: string) => void;
  setPendingPrompt: (prompt: string) => void;
  setSuggestions: (prompt: string, suggestions: AskFridgeSuggestionDTO[]) => void;
}

const initialState = {
  lastSubmittedPrompt: '',
  localAssistantMessage: null,
  suggestions: [],
};

const memoryStorageState = new Map<string, string>();

const memoryStorage: StateStorage = {
  getItem: (name) => memoryStorageState.get(name) ?? null,
  removeItem: (name) => {
    memoryStorageState.delete(name);
  },
  setItem: (name, value) => {
    memoryStorageState.set(name, value);
  },
};

export const useAskFridgeSessionStore = create<AskFridgeSessionState>()(
  persist(
    (set) => ({
      ...initialState,
      clearSession: () => {
        set(() => initialState);
      },
      setLocalAssistantMessage: (prompt, message) => {
        set(() => ({
          lastSubmittedPrompt: prompt,
          localAssistantMessage: message,
          suggestions: [],
        }));
      },
      setPendingPrompt: (prompt) => {
        set(() => ({
          lastSubmittedPrompt: prompt,
          localAssistantMessage: null,
          suggestions: [],
        }));
      },
      setSuggestions: (prompt, suggestions) => {
        set(() => ({
          lastSubmittedPrompt: prompt,
          localAssistantMessage: null,
          suggestions,
        }));
      },
    }),
    {
      name: 'fridgechef.ask-fridge-session',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? memoryStorage : AsyncStorage,
      ),
    },
  ),
);