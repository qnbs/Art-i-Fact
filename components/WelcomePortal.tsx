import React from 'react';
import { SparklesIcon } from './IconComponents.tsx';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { Button } from './ui/Button.tsx';
import { TutorialSteps } from './TutorialSteps.tsx';

interface WelcomePortalProps {
    onDone: () => void;
}

export const WelcomePortal: React.FC<WelcomePortalProps> = ({ onDone }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-transform duration-300 flex flex-col max-h-[90vh]">
                <div className="p-6 md:p-8 text-center border-b border-gray-200 dark:border-gray-800">
                    <SparklesIcon className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('welcome.title')}</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('welcome.subtitle')}</p>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto">
                    <TutorialSteps />
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 text-center">
                    <Button size="lg" onClick={onDone}>
                        {t('welcome.cta')}
                    </Button>
                </div>
            </div>
        </div>
    );
};