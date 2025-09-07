import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const TutorialStep: React.FC<{ title: string; content: string; }> = ({ title, content }) => (
    <div className="mb-4 p-4 bg-white dark:bg-gray-900/70 rounded-lg animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <h4 className="font-semibold text-lg text-amber-600 dark:text-amber-400 mb-2">{title}</h4>
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
    </div>
);

export const TutorialSteps: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <TutorialStep title={t('help.tutorial.step1.title')} content={t('help.tutorial.step1.content')} />
            <TutorialStep title={t('help.tutorial.step2.title')} content={t('help.tutorial.step2.content')} />
            <TutorialStep title={t('help.tutorial.step3.title')} content={t('help.tutorial.step3.content')} />
            <TutorialStep title={t('help.tutorial.step4.title')} content={t('help.tutorial.step4.content')} />
            <TutorialStep title={t('help.tutorial.step5.title')} content={t('help.tutorial.step5.content')} />
            <TutorialStep title={t('help.tutorial.step6.title')} content={t('help.tutorial.step6.content')} />
        </>
    );
};