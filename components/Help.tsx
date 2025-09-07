import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { TutorialSteps } from './TutorialSteps';
import { BookOpenIcon, ChevronRightIcon } from './IconComponents';

interface HelpProps {
    onOpenGlossary: () => void;
}

export const Help: React.FC<HelpProps> = ({ onOpenGlossary }) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('help.tutorial.title')}</h3>
                <TutorialSteps />
            </div>

            <div
                onClick={onOpenGlossary}
                className="mt-4 p-6 bg-white dark:bg-gray-900/70 rounded-lg shadow-md cursor-pointer group hover:bg-amber-50 dark:hover:bg-gray-800/80 transition-colors duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenGlossary(); }}
                aria-label={t('help.glossary.open')}
            >
                 <div className="flex items-center justify-between">
                    <div className="flex items-center pr-4">
                        <BookOpenIcon className="w-8 h-8 text-amber-500 dark:text-amber-400 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{t('help.glossary.title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('help.glossary.description')}</p>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-7 h-7 text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-transform transform group-hover:translate-x-1 flex-shrink-0" />
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('help.philosophy.title')}</h3>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{t('help.philosophy.content')}</p>
            </div>
        </div>
    );
};