import { useLanguage } from "@/hooks/useLanguage";

export const SkipLinks = () => {
  const { t } = useLanguage();

  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-50 bg-primary text-primary-foreground px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {t('accessibility.skipToContent')}
      </a>
      <a
        href="#main-navigation"
        className="absolute top-0 left-24 z-50 bg-primary text-primary-foreground px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {t('accessibility.skipToNavigation')}
      </a>
    </div>
  );
};