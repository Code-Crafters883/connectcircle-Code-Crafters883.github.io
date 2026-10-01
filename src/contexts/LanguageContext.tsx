import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, getTranslations, TranslationsType } from '../translations';

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: TranslationsType;
  showLanguageSelection: boolean;
  setShowLanguageSelection: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'connectcircle_language_selected';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    return (saved === 'ur' || saved === 'en') ? saved : 'en';
  });

  const [showLanguageSelection, setShowLanguageSelection] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_LANG_KEY);
  });

  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const t = getTranslations(language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    setShowLanguageSelection(false);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ur') {
      document.body.classList.add('font-urdu');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-urdu');
    }
  }, [language, direction]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        t,
        showLanguageSelection,
        setShowLanguageSelection,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
