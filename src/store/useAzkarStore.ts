import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AzkarCategory = 'morning' | 'evening' | 'sleep' | 'travel' | 'general';

export interface CategoryProgress {
  counts: Record<string, number>; // dhikr id (string for JSON) -> count
  currentIndex: number;
}

export interface AzkarDayState {
  tasbihCount: number;
  byCategory: Record<AzkarCategory, CategoryProgress>;
}

/** For updates, byCategory can be partial (only one category). */
export type AzkarDayStateUpdate = Omit<Partial<AzkarDayState>, 'byCategory'> & {
  byCategory?: Partial<Record<AzkarCategory, CategoryProgress>>;
};

const emptyCategoryProgress = (): CategoryProgress => ({
  counts: {},
  currentIndex: 0,
});

const emptyDayState = (): AzkarDayState => ({
  tasbihCount: 0,
  byCategory: {
    morning: emptyCategoryProgress(),
    evening: emptyCategoryProgress(),
    sleep: emptyCategoryProgress(),
    travel: emptyCategoryProgress(),
    general: emptyCategoryProgress(),
  },
});

interface AzkarStoreState {
  /** Progress per Islamic day key (YYYY-MM-DD). New day = new key, old keys kept for history. */
  savedByDay: Record<string, AzkarDayState>;
  setDayState: (dayKey: string, state: AzkarDayStateUpdate) => void;
  getDayState: (dayKey: string) => AzkarDayState;
  clearOldDays: (keepDayKeys: Set<string>) => void;
}

export const useAzkarStore = create<AzkarStoreState>()(
  persist(
    (set, get) => ({
      savedByDay: {},

      setDayState: (dayKey, state) => {
        set((prev) => {
          const existing = prev.savedByDay[dayKey] ?? emptyDayState();
          const next: AzkarDayState = {
            tasbihCount: state.tasbihCount !== undefined ? state.tasbihCount : existing.tasbihCount,
            byCategory: { ...existing.byCategory },
          };
          if (state.byCategory) {
            for (const cat of Object.keys(state.byCategory) as AzkarCategory[]) {
              const incoming = state.byCategory[cat];
              if (incoming)
                next.byCategory[cat] = {
                  counts: { ...(incoming.counts ?? {}) },
                  currentIndex: incoming.currentIndex ?? 0,
                };
            }
          }
          return {
            savedByDay: { ...prev.savedByDay, [dayKey]: next },
          };
        });
      },

      getDayState: (dayKey) => {
        const day = get().savedByDay[dayKey];
        if (!day) return emptyDayState();
        return {
          tasbihCount: day.tasbihCount,
          byCategory: {
            morning: { ...emptyCategoryProgress(), ...day.byCategory?.morning },
            evening: { ...emptyCategoryProgress(), ...day.byCategory?.evening },
            sleep: { ...emptyCategoryProgress(), ...day.byCategory?.sleep },
            travel: { ...emptyCategoryProgress(), ...day.byCategory?.travel },
            general: { ...emptyCategoryProgress(), ...day.byCategory?.general },
          },
        };
      },

      clearOldDays: (keepDayKeys) => {
        set((prev) => {
          const next = { ...prev.savedByDay };
          for (const key of Object.keys(next)) {
            if (!keepDayKeys.has(key)) delete next[key];
          }
          return { savedByDay: next };
        });
      },
    }),
    {
      name: 'rafiq-azkar-storage',
      partialize: (s) => ({ savedByDay: s.savedByDay }),
    }
  )
);
