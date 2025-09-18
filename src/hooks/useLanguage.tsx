import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export type Language = 'en' | 'ar' | 'fr';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  
  const currentLanguage = i18n.language as Language;
  const isRTL = currentLanguage === 'ar';
  
  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };
  
  useEffect(() => {
    // Update HTML dir and lang attributes
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [isRTL, currentLanguage]);
  
  return {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
  };
};