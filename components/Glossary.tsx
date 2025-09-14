import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PageHeader } from './ui/PageHeader';
import { BookOpenIcon } from './IconComponents';

const GlossaryTerm: React.FC<{ term: string, definition: string }> = ({ term, definition }) => (
    <div className="mb-4 break-inside-avoid">
        <dt className="font-bold text-lg text-amber-600 dark:text-amber-400">{term}</dt>
        <dd className="ml-4 text-gray-700 dark:text-gray-300">{definition}</dd>
    </div>
);

const GlossaryCategory: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-2xl font-semibold border-b-2 border-amber-500/50 pb-2 mb-4">{title}</h3>
        <dl>
            {children}
        </dl>
    </div>
)

export const Glossary: React.FC = () => {
    const { t } = useTranslation();

    const techniques = [
        { term: t('glossary.chiaroscuro.term'), definition: t('glossary.chiaroscuro.def') },
        { term: t('glossary.impasto.term'), definition: t('glossary.impasto.def') },
        { term: t('glossary.sfumato.term'), definition: t('glossary.sfumato.def') },
        { term: t('glossary.tenebrism.term'), definition: t('glossary.tenebrism.def') },
        { term: t('glossary.pointillism.term'), definition: t('glossary.pointillism.def') },
        { term: t('glossary.fresco.term'), definition: t('glossary.fresco.def') },
    ];

    const eras = [
        { term: t('glossary.renaissance.term'), definition: t('glossary.renaissance.def') },
        { term: t('glossary.baroque.term'), definition: t('glossary.baroque.def') },
        { term: t('glossary.rococo.term'), definition: t('glossary.rococo.def') },
        { term: t('glossary.impressionism.term'), definition: t('glossary.impressionism.def') },
        { term: t('glossary.cubism.term'), definition: t('glossary.cubism.def') },
        { term: t('glossary.surrealism.term'), definition: t('glossary.surrealism.def') },
        { term: t('glossary.popart.term'), definition: t('glossary.popart.def') },
        { term: t('glossary.minimalism.term'), definition: t('glossary.minimalism.def') },
    ];
    
    const concepts = [
        { term: t('glossary.composition.term'), definition: t('glossary.composition.def') },
        { term: t('glossary.palette.term'), definition: t('glossary.palette.def') },
        { term: t('glossary.perspective.term'), definition: t('glossary.perspective.def') },
        { term: t('glossary.iconography.term'), definition: t('glossary.iconography.def') },
    ];


    return (
        <div className="max-w-4xl mx-auto">
            <GlossaryCategory title={t('glossary.category.techniques')}>
                {techniques.map(item => <GlossaryTerm key={item.term} {...item} />)}
            </GlossaryCategory>
            <GlossaryCategory title={t('glossary.category.eras')}>
                {eras.map(item => <GlossaryTerm key={item.term} {...item} />)}
            </GlossaryCategory>
            <GlossaryCategory title={t('glossary.category.concepts')}>
                {concepts.map(item => <GlossaryTerm key={item.term} {...item} />)}
            </GlossaryCategory>
        </div>
    );
};
