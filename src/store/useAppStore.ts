import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: {
    id: number;
    name: string;
    server: string;
    surah_list: string;
  }[];
}

interface PlayerState {
  isPlaying: boolean;
  currentSurah: number | null;
  currentAyah: number | null;
  currentReciter: Reciter | null;
  audioUrl: string | null;
  volume: number;
  playbackRate: number;
  repeatMode: 'none' | 'ayah' | 'surah';
}

interface AppState {
  // Language & Theme
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
  
  // Quran Data
  surahs: Surah[];
  reciters: Reciter[];
  favorites: number[];
  bookmarks: { surah: number; ayah: number }[];
  recentReads: { surah: number; ayah: number; timestamp: number }[];
  
  // Player
  player: PlayerState;
  
  // Location
  location: { latitude: number; longitude: number; city: string } | null;
  
  // Actions
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleTheme: () => void;
  setSurahs: (surahs: Surah[]) => void;
  setReciters: (reciters: Reciter[]) => void;
  toggleFavorite: (surahNumber: number) => void;
  addBookmark: (surah: number, ayah: number) => void;
  removeBookmark: (surah: number, ayah: number) => void;
  addRecentRead: (surah: number, ayah: number) => void;
  setPlayer: (player: Partial<PlayerState>) => void;
  setLocation: (location: { latitude: number; longitude: number; city: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State - Arabic as default
      language: 'ar',
      direction: 'rtl',
      theme: 'light',
      surahs: [],
      reciters: [],
      favorites: [],
      bookmarks: [],
      recentReads: [],
      player: {
        isPlaying: false,
        currentSurah: null,
        currentAyah: null,
        currentReciter: null,
        audioUrl: null,
        volume: 1,
        playbackRate: 1,
        repeatMode: 'none',
      },
      location: null,
      
      // Actions
      setLanguage: (lang) => set({ 
        language: lang, 
        direction: lang === 'ar' ? 'rtl' : 'ltr' 
      }),
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        set({ theme: newTheme });
      },
      
      setSurahs: (surahs) => set({ surahs }),
      setReciters: (reciters) => set({ reciters }),
      
      toggleFavorite: (surahNumber) => {
        const favorites = get().favorites;
        const newFavorites = favorites.includes(surahNumber)
          ? favorites.filter(n => n !== surahNumber)
          : [...favorites, surahNumber];
        set({ favorites: newFavorites });
      },
      
      addBookmark: (surah, ayah) => {
        const bookmarks = get().bookmarks;
        if (!bookmarks.find(b => b.surah === surah && b.ayah === ayah)) {
          set({ bookmarks: [...bookmarks, { surah, ayah }] });
        }
      },
      
      removeBookmark: (surah, ayah) => {
        set({ 
          bookmarks: get().bookmarks.filter(b => !(b.surah === surah && b.ayah === ayah)) 
        });
      },
      
      addRecentRead: (surah, ayah) => {
        const recentReads = get().recentReads.filter(r => r.surah !== surah);
        recentReads.unshift({ surah, ayah, timestamp: Date.now() });
        set({ recentReads: recentReads.slice(0, 10) });
      },
      
      setPlayer: (playerUpdate) => set({ 
        player: { ...get().player, ...playerUpdate } 
      }),
      
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'rafiq-muslim-storage',
      partialize: (state) => ({
        language: state.language,
        direction: state.direction,
        theme: state.theme,
        favorites: state.favorites,
        bookmarks: state.bookmarks,
        recentReads: state.recentReads,
        location: state.location,
      }),
    }
  )
);
