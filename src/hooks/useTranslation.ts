import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type TranslationKey = keyof typeof en;

const translations = { en, ar } as const;

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const locale = language === 'ar' ? 'ar' : 'en';

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      let value = translations[locale][key] ?? (en as Record<string, string>)[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          const strValue = (typeof v === 'number' && locale === 'ar') 
            ? new Intl.NumberFormat('ar-EG').format(v) 
            : String(v);
          value = value.replace(new RegExp(`{{${k}}}`, 'g'), strValue);
        });
      }
      return value;
    },
    [locale]
  );

  return { t, language };
}
