import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { LANGUAGE_LOCAL_STORAGE_KEY } from '../constants';
import { translations } from '../i18n/locales';

type Language = 'de' | 'en';
type TranslationContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) as Language) || 'de';
    } catch {
      return 'de';
    }
  });

  const t = useCallback((key: string, replacements?: { [key: string]: string }) => {
    let translation = translations[language]?.[key] || translations['de']?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
    }
    return translation;
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('app.title');
    try {
      localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, language);
    } catch (error) {
      console.warn("Could not save language preference:", error);
    }
  }, [language, t]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};