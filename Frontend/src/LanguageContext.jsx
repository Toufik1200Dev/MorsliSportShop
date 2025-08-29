import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from './translations';

const LanguageContext = createContext({
  currentLanguage: 'en',
  changeLanguage: () => {},
  t: () => {},
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const getDefaultLanguage = () => {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    const lang = (navigator.language || 'en').toLowerCase();
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('fr')) return 'fr';
    return 'en';
  };
  const [currentLanguage, setCurrentLanguage] = useState(getDefaultLanguage);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    
    // Update document direction for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  };

  const t = (key) => {
    return getTranslation(key, currentLanguage);
  };

  useEffect(() => {
    // Set initial document direction
    if (currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 