import { useAppStore } from '@/store/useAppStore';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type TranslationKey = keyof typeof en;

const translations = { en, ar } as const;

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const locale = language === 'ar' ? 'ar' : 'en';

  const t = (key: TranslationKey): string => {
    const value = translations[locale][key];
    return value ?? (en as Record<string, string>)[key] ?? key;
  };

  return { t, language };
}
