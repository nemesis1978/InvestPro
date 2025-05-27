import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, TranslationKey } from '../lib/i18n/translations';

type Language = 'en';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language] = useState<Language>('en');
  const [translations] = useState<Translations>(en);

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};