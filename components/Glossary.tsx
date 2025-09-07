import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { AccordionItem } from './ui/AccordionItem';
import { ArrowLeftIcon, BookOpenIcon } from './IconComponents';

interface GlossaryProps {
    onBack: () => void;
}

const glossaryCategories = {
    'periods': ['gothic', 'renaissance', 'baroque', 'rococo', 'neoclassicism', 'romanticism', 'realism'],
    'movements': ['impressionism', 'postimpressionism', 'artnouveau', 'fauvism', 'expressionism', 'cubism', 'futurism', 'dadaism', 'surrealism', 'bauhaus', 'abstractexpressionism', 'popart', 'minimalism'],
    'techniques': ['chiaroscuro', 'sfumato', 'impasto', 'fresco', 'perspective'],
    'concepts': ['composition', 'colorpalette', 'stilllife', 'allegory', 'abstract']
};

export const Glossary: React.FC<GlossaryProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <BookOpenIcon className="w-8 h-8 text-amber-500 dark:text-amber-400 mr-3" />
                <h2 className="text-2xl font-bold">{t('help.glossary.title')}</h2>
            </div>
            
            <div className="overflow-y-auto pr-2">
                {Object.entries(glossaryCategories).map(([categoryKey, termKeys]) => (
                    <div key={categoryKey} className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 px-2">{t(`help.glossary.${categoryKey}.title`)}</h3>
                        <div className="bg-white dark:bg-gray-900/70 rounded-lg p-2">
                             {termKeys.map(termKey => (
                                <AccordionItem key={termKey} title={t(`help.glossary.${categoryKey}.${termKey}.term`)}>
                                    <p>{t(`help.glossary.${categoryKey}.${termKey}.def`)}</p>
                                </AccordionItem>
                             ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};