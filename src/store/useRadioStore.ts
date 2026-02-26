import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RadioStore {
  favorites: string[];
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

export const useRadioStore = create<RadioStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (stationId) =>
        set((state) => ({
          favorites: state.favorites.includes(stationId)
            ? state.favorites.filter((id) => id !== stationId)
            : [...state.favorites, stationId],
        })),

      isFavorite: (stationId) => get().favorites.includes(stationId),
    }),
    {
      name: 'radio-favorites-v2',
    }
  )
);
