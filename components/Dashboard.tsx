
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PresentationChartBarIcon } from './IconComponents';

// A placeholder Dashboard component. This can be expanded later to show
// stats, recent activity, or other summary information.
export const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
            <h2 className="text-2xl font-bold flex items-center mb-4">
                <PresentationChartBarIcon className="w-6 h-6 mr-3 text-amber-500" />
                {t('dashboard.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                {t('dashboard.welcome')}
            </p>
            {/* Future content like charts, recent items, etc. can go here */}
        </div>
    );
};
