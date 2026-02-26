import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('404')}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('pageNotFound')}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {t('returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
