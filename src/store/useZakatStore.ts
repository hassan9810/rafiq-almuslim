import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ZakatType, NisabBasis } from '@/lib/zakatCalculator';

export interface ZakatPayment {
  id: string;
  date: string; // ISO string
  amount: number;
  type: ZakatType;
  currency: string;
  note?: string;
}

/** A user-defined line item feeding the combined total. */
export interface CustomItem {
  id: string;
  label: string;
  amount: number;
  deductible: boolean; // true = a liability/debt to subtract
}

interface ZakatStore {
  // Settings
  currency: string;
  nisabBasis: NisabBasis;
  goldPricePerGram: number; // 24k
  silverPricePerGram: number;
  fitrMealPrice: number;

  // Live-price metadata
  pricesUpdatedAt: string | null; // ISO
  priceSource: string | null;
  autoFetchPrices: boolean;

  // Hawl (lunar-year) tracking
  hawlStartDate: string | null; // ISO date wealth first reached nisab

  // Custom line items for the combined total
  customItems: CustomItem[];

  // History
  payments: ZakatPayment[];

  // Actions — settings
  setSettings: (
    settings: Partial<
      Pick<
        ZakatStore,
        | 'currency'
        | 'nisabBasis'
        | 'goldPricePerGram'
        | 'silverPricePerGram'
        | 'fitrMealPrice'
        | 'autoFetchPrices'
      >
    >
  ) => void;
  setLivePrices: (goldPerGram: number, silverPerGram: number, source: string) => void;
  setHawlStart: (iso: string | null) => void;

  // Actions — custom items
  addCustomItem: (item: Omit<CustomItem, 'id'>) => void;
  updateCustomItem: (id: string, patch: Partial<Omit<CustomItem, 'id'>>) => void;
  removeCustomItem: (id: string) => void;

  // Actions — history
  addPayment: (payment: Omit<ZakatPayment, 'id'>) => void;
  removePayment: (id: string) => void;
  clearPayments: () => void;
}

const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const useZakatStore = create<ZakatStore>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      nisabBasis: 'gold',
      goldPricePerGram: 65,
      silverPricePerGram: 0.8,
      fitrMealPrice: 10,

      pricesUpdatedAt: null,
      priceSource: null,
      autoFetchPrices: true,

      hawlStartDate: null,

      customItems: [],
      payments: [],

      setSettings: (settings) => set({ ...settings }),

      setLivePrices: (goldPerGram, silverPerGram, source) =>
        set({
          goldPricePerGram: goldPerGram,
          // keep an existing manual silver value if the live source returned 0
          silverPricePerGram: silverPerGram > 0 ? silverPerGram : get().silverPricePerGram,
          pricesUpdatedAt: new Date().toISOString(),
          priceSource: source,
        }),

      setHawlStart: (iso) => set({ hawlStartDate: iso }),

      addCustomItem: (item) =>
        set({ customItems: [...get().customItems, { ...item, id: uid('ci') }] }),

      updateCustomItem: (id, patch) =>
        set({
          customItems: get().customItems.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        }),

      removeCustomItem: (id) =>
        set({ customItems: get().customItems.filter((c) => c.id !== id) }),

      addPayment: (payment) =>
        set({ payments: [{ ...payment, id: uid('zakat') }, ...get().payments] }),

      removePayment: (id) =>
        set({ payments: get().payments.filter((p) => p.id !== id) }),

      clearPayments: () => set({ payments: [] }),
    }),
    {
      name: 'zakat-store',
    }
  )
);
