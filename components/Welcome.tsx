
import React from 'react';
import { SparklesIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';

interface WelcomeProps {
    onThemeSelect: (theme: string) => void;
}

const themeCategories = {
    'welcome.category.eras': ['baroque', 'impressionism', 'surrealism', 'bauhaus', 'popart'],
    'welcome.category.emotions': ['joy', 'loneliness', 'chaos', 'vanitas'],
    'welcome.category.places': ['sea', 'urban', 'forests', 'gardens'],
    'welcome.category.themes': ['mythology', 'industrial', 'portraits', 'abstract']
};


export const Welcome: React.FC<WelcomeProps> = ({ onThemeSelect }) => {
  const { t } = useTranslation();
  return (
    <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 dark:text-gray-400 p-4 rounded-lg bg-gray-100 dark:bg-gray-900/30">
        <SparklesIcon className="w-16 h-16 text-amber-500 dark:text-amber-400 animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('welcome.title')}</h2>
        <p className="max-w-xl mb-8">
            {t('welcome.subtitle')}
        </p>
        <div className="w-full max-w-4xl">
            {Object.entries(themeCategories).map(([categoryKey, themeKeys]) => (
                <div key={categoryKey} className="mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-3">{t(categoryKey)}</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {themeKeys.map(themeKey => {
                            const fullThemeKey = `welcome.theme.${themeKey}`;
                            const translatedTheme = t(fullThemeKey);
                            return (
                                <button 
                                    key={themeKey}
                                    onClick={() => onThemeSelect(translatedTheme)}
                                    className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-all transform hover:scale-105"
                                >
                                    {translatedTheme}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};