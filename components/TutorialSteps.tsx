import React from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { SearchIcon, HomeIcon, GalleryIcon, PaintBrushIcon, JournalIcon, PresentationChartBarIcon } from './IconComponents.tsx';

const TutorialStep: React.FC<{ icon: React.ReactNode; title: string; content: string; delay: number }> = ({ icon, title, content, delay }) => (
    <div 
        className="flex items-start mb-4 p-4 bg-white dark:bg-gray-900/70 rounded-lg animate-fade-in"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
        <div className="flex-shrink-0 mr-4 text-amber-500 dark:text-amber-400">{icon}</div>
        <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1">{title}</h4>
            <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    </div>
);

export const TutorialSteps: React.FC = () => {
    const { t } = useTranslation();
    
    const steps = [
        { icon: <HomeIcon className="w-8 h-8"/>, title: t('help.tutorial.step1.title'), content: t('help.tutorial.step1.content') },
        { icon: <SearchIcon className="w-8 h-8"/>, title: t('help.tutorial.step2.title'), content: t('help.tutorial.step2.content') },
        { icon: <GalleryIcon className="w-8 h-8"/>, title: t('help.tutorial.step3.title'), content: t('help.tutorial.step3.content') },
        { icon: <PaintBrushIcon className="w-8 h-8"/>, title: t('help.tutorial.step4.title'), content: t('help.tutorial.step4.content') },
        { icon: <JournalIcon className="w-8 h-8"/>, title: t('help.tutorial.step5.title'), content: t('help.tutorial.step5.content') },
        { icon: <PresentationChartBarIcon className="w-8 h-8"/>, title: t('help.tutorial.step6.title'), content: t('help.tutorial.step6.content') },
    ];
    
    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <TutorialStep key={index} {...step} delay={index * 100} />
            ))}
        </div>
    );
};
