import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlanState {
  planDays: number;
  startDate: string;
  startPage: number;
  endPage: number;
  completedDays: number[];
}

interface ReadingPlanStore {
  plan: PlanState | null;
  startPlan: (days: number, startPage?: number, endPage?: number) => void;
  resetPlan: () => void;
  toggleDay: (dayIndex: number) => void;
}

export const useReadingPlanStore = create<ReadingPlanStore>()(
  persist(
    (set, get) => ({
      plan: null,

      startPlan: (days, startPage = 1, endPage = 604) =>
        set({
          plan: {
            planDays: days,
            startDate: new Date().toISOString().split('T')[0],
            startPage,
            endPage,
            completedDays: [],
          },
        }),

      resetPlan: () => set({ plan: null }),

      toggleDay: (dayIndex) => {
        const { plan } = get();
        if (!plan) return;
        const completed = plan.completedDays.includes(dayIndex)
          ? plan.completedDays.filter((d) => d !== dayIndex)
          : [...plan.completedDays, dayIndex];
        set({ plan: { ...plan, completedDays: completed } });
      },
    }),
    {
      name: 'rafiq-reading-plan',
    }
  )
);
