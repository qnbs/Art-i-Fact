import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { TutorialSteps } from './TutorialSteps';
import { BookOpenIcon, ChevronRightIcon, CommandLineIcon, MagicWandIcon, ArrowPathIcon, SparklesIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon } from './IconComponents';
import { Glossary } from './Glossary';
import { PageHeader } from './ui/PageHeader';

const TipItem: React.FC<{ icon: React.ReactNode; title: string; content: string; }> = ({ icon, title, content }) => (
    <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-4 text-amber-500 dark:text-amber-400">{icon}</div>
        <div>
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h4>
            <p className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    </div>
);

export const Help: React.FC<{}> = () => {
    const { t } = useTranslation();
    const [showGlossary, setShowGlossary] = useState(false);

    if (showGlossary) {
        return <Glossary onBack={() => setShowGlossary(false)} />;
    }
    
    return (
        <div className="flex flex-col h-full animate-fade-in space-y-8">
            <PageHeader title={t('help.title')} icon={<QuestionMarkCircleIcon className="w-8 h-8" />} />
            
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('help.tutorial.title')}</h3>
                <TutorialSteps />
            </div>

            <div
                onClick={() => setShowGlossary(true)}
                className="p-6 bg-white dark:bg-gray-900/70 rounded-lg shadow-md cursor-pointer group hover:bg-amber-50 dark:hover:bg-gray-800/80 transition-colors duration-200"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowGlossary(true); }}
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
            
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('help.advanced.title')}</h3>
                <div className="bg-white dark:bg-gray-900/70 rounded-lg shadow-md divide-y divide-gray-200 dark:divide-gray-800">
                    <TipItem icon={<CommandLineIcon className="w-8 h-8"/>} title={t('help.advanced.tip1.title')} content={t('help.advanced.tip1.content')} />
                    <TipItem icon={<MagicWandIcon className="w-8 h-8"/>} title={t('help.advanced.tip2.title')} content={t('help.advanced.tip2.content')} />
                    <TipItem icon={<ArrowPathIcon className="w-8 h-8"/>} title={t('help.advanced.tip3.title')} content={t('help.advanced.tip3.content')} />
                    <TipItem icon={<SparklesIcon className="w-8 h-8"/>} title={t('help.advanced.tip4.title')} content={t('help.advanced.tip4.content')} />
                    <TipItem icon={<ArrowDownTrayIcon className="w-8 h-8"/>} title={t('help.advanced.tip5.title')} content={t('help.advanced.tip5.content')} />
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('help.philosophy.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{t('help.philosophy.content')}</p>
            </div>
        </div>
    );
};