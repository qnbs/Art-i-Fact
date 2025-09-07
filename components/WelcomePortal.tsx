import React from 'react';
import { SparklesIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { TutorialSteps } from './TutorialSteps';

interface WelcomePortalProps {
    onEnter: () => void;
}

export const WelcomePortal: React.FC<WelcomePortalProps> = ({ onEnter }) => {
  const { t } = useTranslation();

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-200 flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center p-4 mb-4">
                <SparklesIcon className="w-12 h-12 text-amber-500 dark:text-amber-400 mr-4" />
                <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 tracking-wider">
                    Art-i-Fact
                </h1>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('welcome.portal.subtitle')}
            </p>
            
            <div className="text-left mb-10 bg-white/50 dark:bg-black/20 rounded-lg p-4 md:p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t('help.tutorial.title')}</h3>
                <div className="max-h-[40vh] overflow-y-auto pr-2">
                    <TutorialSteps />
                </div>
            </div>

            <button
                onClick={onEnter}
                className="bg-amber-600 text-white rounded-full px-8 py-3 flex items-center justify-center font-semibold hover:bg-amber-700 transition-colors text-lg mx-auto transform hover:scale-105"
            >
                {t('welcome.portal.enter')}
            </button>
        </div>
    </div>
  );
};