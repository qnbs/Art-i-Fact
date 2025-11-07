import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { locales, Locale, Language } from '../i18n/locales.ts';
import { LANGUAGE_LOCAL_STORAGE_KEY, APP_SETTINGS_LOCAL_STORAGE_KEY } from '../constants.ts';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, key: string): string | undefined => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
        // Priority 1: Direct user setting from localStorage
        const savedLang = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) as Language;
        if (savedLang === 'de' || savedLang === 'en') {
            return savedLang;
        }

        // Priority 2: Setting from the AppSettings object in localStorage
        const settingsItem = localStorage.getItem(APP_SETTINGS_LOCAL_STORAGE_KEY);
        if (settingsItem) {
            const settings = JSON.parse(settingsItem);
            if (settings.aiContentLanguage && settings.aiContentLanguage !== 'ui') {
                return settings.aiContentLanguage;
            }
        }

        // Priority 3: Fallback to browser language if available
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'de') {
            return 'de';
        }

        return 'en'; // Final fallback
    } catch {
        return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_LOCAL_STORAGE_KEY, lang);
    } catch (error) {
        console.warn('Could not save language preference:', error);
    }
    setLanguageState(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const locale: Locale = (locales as any)[language] || locales.en;
    let translation = getNestedTranslation(locale, key);

    if (translation === undefined) {
      console.warn(`Translation for key '${key}' not found. Returning key.`);
      return key;
    }
    
    if (typeof translation !== 'string') {
        console.warn(`Translation for key '${key}' resolved to an object or was not found. Returning key.`);
        return key;
    }

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation!.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }

    return translation;
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};