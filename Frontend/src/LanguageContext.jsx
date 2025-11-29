import { createContext, useContext, useState, useEffect } from 'react';
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

// Helper function outside component to avoid TDZ issues
const getDefaultLanguage = () => {
  try {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    return 'fr'; // Default to French
  } catch {
    return 'fr';
  }
};

export const LanguageProvider = ({ children }) => {
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