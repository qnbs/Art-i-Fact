
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useModal } from '../contexts/ModalContext';
import { AccordionItem } from './ui/AccordionItem';
import { PageHeader } from './ui/PageHeader';
import { QuestionMarkCircleIcon, SparklesIcon, BookOpenIcon } from './IconComponents';
import { TutorialSteps } from './TutorialSteps';
import { Glossary } from './Glossary';
import { Button } from './ui/Button';

const HelpSection: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({ title, icon, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-3 text-amber-500 dark:text-amber-400">{icon}</span>
            {title}
        </h3>
        <div className="p-4 md:p-6 bg-white/50 dark:bg-black/20 rounded-lg space-y-4">
            {children}
        </div>
    </div>
);

export const Help: React.FC = () => {
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();

    const openGlossary = () => {
        showModal(t('glossary.title'), <Glossary />);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={t('help.title')} icon={<QuestionMarkCircleIcon className="w-8 h-8" />} />
            
            <div className="mb-8">
                <Button onClick={openGlossary} variant="secondary" className="w-full">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    {t('help.glossary.button')}
                </Button>
            </div>

            <HelpSection title={t('help.tutorial.title')} icon={<SparklesIcon className="w-6 h-6" />}>
                <TutorialSteps />
            </HelpSection>

            <HelpSection title={t('help.tips.title')} icon={<SparklesIcon className="w-6 h-6" />}>
                <AccordionItem title={t('help.tips.tip1.title')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.tips.tip1.content') }} />
                </AccordionItem>
                 <AccordionItem title={t('help.tips.tip2.title')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.tips.tip2.content') }} />
                </AccordionItem>
                 <AccordionItem title={t('help.tips.tip3.title')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.tips.tip3.content') }} />
                </AccordionItem>
                 <AccordionItem title={t('help.tips.tip4.title')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.tips.tip4.content') }} />
                </AccordionItem>
            </HelpSection>

            <HelpSection title={t('help.faq.title')} icon={<QuestionMarkCircleIcon className="w-6 h-6" />}>
                <AccordionItem title={t('help.faq.q1.q')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.faq.q1.a') }} />
                </AccordionItem>
                <AccordionItem title={t('help.faq.q2.q')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.faq.q2.a') }} />
                </AccordionItem>
                <AccordionItem title={t('help.faq.q3.q')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.faq.q3.a') }} />
                </AccordionItem>
                    <AccordionItem title={t('help.faq.q4.q')}>
                    <p dangerouslySetInnerHTML={{ __html: t('help.faq.q4.a') }} />
                </AccordionItem>
            </HelpSection>
            
            <HelpSection title={t('help.philosophy.title')} icon={<SparklesIcon className="w-6 h-6" />}>
                 <p className="text-gray-700 dark:text-gray-300">{t('help.philosophy.content')}</p>
            </HelpSection>


            <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-4 mt-8">
                <p><strong>Art-i-Fact</strong> {t('settings.about.version')}</p>
                <p>&copy; {new Date().getFullYear()}. {t('settings.about.license')}</p>
            </div>
        </div>
    );
};
