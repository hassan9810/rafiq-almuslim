import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const { theme } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="container py-24">
      <main className="text-center text-muted-foreground">
        <p>{t('noItemsToDisplay')}</p>
      </main>
    </div>
  );
};

export default Index;