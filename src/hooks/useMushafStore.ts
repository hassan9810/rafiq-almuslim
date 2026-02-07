import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MushafEdition, mushafEditions } from '@/lib/mushafApi';

interface MushafBookmark {
  page: number;
  surah?: number;
  ayah?: number;
  note?: string;
  timestamp: number;
}

interface MushafSettings {
  fontSize: number;
  showTranslation: boolean;
  showTafsir: boolean;
  showTashkeel: boolean;
  translationEdition: string;
  tafsirEdition: string;
  nightMode: boolean;
  autoScroll: boolean;
  audioSync: boolean;
}

interface MushafState {
  // Current reading state
  currentPage: number;
  currentEdition: MushafEdition;
  viewMode: 'single' | 'double';
  zoom: number;
  isFullscreen: boolean;
  
  // Audio state
  isPlaying: boolean;
  currentReciterId: number | null;
  currentSurah: number | null;
  currentAyah: number | null;
  playbackRate: number;
  volume: number;
  repeatMode: 'none' | 'ayah' | 'surah' | 'page';
  
  // User data
  bookmarks: MushafBookmark[];
  lastReadPage: number;
  readingHistory: { page: number; timestamp: number }[];
  
  // Settings
  settings: MushafSettings;
  
  // Actions
  setCurrentPage: (page: number) => void;
  setCurrentEdition: (edition: MushafEdition) => void;
  setViewMode: (mode: 'single' | 'double') => void;
  setZoom: (zoom: number) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  
  // Audio actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentReciterId: (id: number | null) => void;
  setCurrentSurah: (surah: number | null) => void;
  setCurrentAyah: (ayah: number | null) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setRepeatMode: (mode: 'none' | 'ayah' | 'surah' | 'page') => void;
  
  // Bookmark actions
  addBookmark: (bookmark: Omit<MushafBookmark, 'timestamp'>) => void;
  removeBookmark: (page: number) => void;
  isBookmarked: (page: number) => boolean;
  
  // Settings actions
  updateSettings: (settings: Partial<MushafSettings>) => void;
  
  // History actions
  addToHistory: (page: number) => void;
}

export const useMushafStore = create<MushafState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPage: 1,
      currentEdition: mushafEditions[0],
      viewMode: 'single',
      zoom: 100,
      isFullscreen: false,
      
      isPlaying: false,
      currentReciterId: null,
      currentSurah: null,
      currentAyah: null,
      playbackRate: 1,
      volume: 1,
      repeatMode: 'none',
      
      bookmarks: [],
      lastReadPage: 1,
      readingHistory: [],
      
      settings: {
        fontSize: 24,
        showTranslation: false,
        showTafsir: false,
        showTashkeel: true,
        translationEdition: 'en.sahih',
        tafsirEdition: 'ar.muyassar',
        nightMode: false,
        autoScroll: true,
        audioSync: true
      },
      
      // Page actions
      setCurrentPage: (page) => {
        set({ currentPage: page, lastReadPage: page });
        get().addToHistory(page);
      },
      setCurrentEdition: (edition) => set({ currentEdition: edition }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(200, zoom)) }),
      setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
      
      // Audio actions
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentReciterId: (id) => set({ currentReciterId: id }),
      setCurrentSurah: (surah) => set({ currentSurah: surah }),
      setCurrentAyah: (ayah) => set({ currentAyah: ayah }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      
      // Bookmark actions
      addBookmark: (bookmark) => {
        const bookmarks = get().bookmarks;
        if (!bookmarks.find(b => b.page === bookmark.page)) {
          set({ 
            bookmarks: [...bookmarks, { ...bookmark, timestamp: Date.now() }]
          });
        }
      },
      removeBookmark: (page) => {
        set({ 
          bookmarks: get().bookmarks.filter(b => b.page !== page) 
        });
      },
      isBookmarked: (page) => {
        return get().bookmarks.some(b => b.page === page);
      },
      
      // Settings actions
      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } });
      },
      
      // History actions
      addToHistory: (page) => {
        const history = get().readingHistory.filter(h => h.page !== page);
        history.unshift({ page, timestamp: Date.now() });
        set({ readingHistory: history.slice(0, 50) });
      }
    }),
    {
      name: 'mushaf-storage',
      partialize: (state) => ({
        currentPage: state.currentPage,
        currentEdition: state.currentEdition,
        viewMode: state.viewMode,
        zoom: state.zoom,
        bookmarks: state.bookmarks,
        lastReadPage: state.lastReadPage,
        readingHistory: state.readingHistory,
        settings: state.settings,
        currentReciterId: state.currentReciterId,
        playbackRate: state.playbackRate,
        volume: state.volume
      })
    }
  )
);
