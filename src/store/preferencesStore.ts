import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { initialLocale } from '../i18n';
import type { Locale } from '../types/api';

interface PreferencesState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: initialLocale,
      setLocale: (locale) => {
        set(() => ({
          locale,
        }));
      },
    }),
    {
      name: 'fridgechef.preferences',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);