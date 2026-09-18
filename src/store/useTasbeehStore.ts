import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomDhikr {
  id: string;
  ar: string;
  en: string;
  target: number;
}

interface TasbeehStats {
  totalToday: number;
  totalAllTime: number;
  dailyGoal: number;
  streak: number;
  lastDate: string;
  history: { date: string; count: number }[];
  selectedDhikr: string;
  currentCount: number;
  customAdhkar: CustomDhikr[];
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

interface TasbeehStore extends TasbeehStats {
  setStats: (stats: Partial<TasbeehStats>) => void;
  /** Call at the start of each session / render to roll over the day if needed */
  rolloverDay: () => void;
  addCustomDhikr: (dhikr: Omit<CustomDhikr, 'id'>) => void;
  removeCustomDhikr: (id: string) => void;
  editCustomDhikr: (id: string, updates: Partial<Omit<CustomDhikr, 'id'>>) => void;
}

export const useTasbeehStore = create<TasbeehStore>()(
  persist(
    (set, get) => ({
      totalToday: 0,
      totalAllTime: 0,
      dailyGoal: 100,
      streak: 0,
      lastDate: getToday(),
      history: [],
      selectedDhikr: 'subhanallah',
      currentCount: 0,
      customAdhkar: [],

      setStats: (partial) => set(partial),

      addCustomDhikr: (dhikr) => {
        const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set({ customAdhkar: [...get().customAdhkar, { ...dhikr, id }] });
      },

      removeCustomDhikr: (id) => {
        const state = get();
        const updated = state.customAdhkar.filter(d => d.id !== id);
        const patch: Partial<TasbeehStats> = { customAdhkar: updated };
        // If the removed dhikr was selected, reset to default
        if (state.selectedDhikr === id) {
          patch.selectedDhikr = 'subhanallah';
          patch.currentCount = 0;
        }
        set(patch);
      },

      editCustomDhikr: (id, updates) => {
        set({
          customAdhkar: get().customAdhkar.map(d =>
            d.id === id ? { ...d, ...updates } : d
          ),
        });
      },

      rolloverDay: () => {
        const state = get();
        const today = getToday();
        if (state.lastDate !== today) {
          const updates: Partial<TasbeehStats> = {
            lastDate: today,
            totalToday: 0,
            currentCount: 0,
          };

          // Save yesterday to history
          if (state.lastDate && state.totalToday > 0) {
            updates.history = [
              { date: state.lastDate, count: state.totalToday },
              ...(state.history || []),
            ].slice(0, 30);
          }

          // Update streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (state.lastDate === yesterday.toISOString().split('T')[0]) {
            updates.streak = (state.streak || 0) + 1;
          } else {
            updates.streak = 0;
          }

          set(updates);
        }
      },
    }),
    {
      name: 'tasbeeh-stats',
    }
  )
);
