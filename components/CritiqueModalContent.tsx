
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import type { GalleryCritique } from '../types';

export const CritiqueModalContent: React.FC<{ critiqueResult: GalleryCritique }> = ({ critiqueResult }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-2">{t('gallery.critique.modal.critique')}</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300 italic">"{critiqueResult.critique}"</p>
            <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-2">{t('gallery.critique.modal.suggestions')}</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {critiqueResult.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};
