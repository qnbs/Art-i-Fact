import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    children?: React.ReactNode; // For action buttons
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, children }) => {
    return (
        <div className="flex-shrink-0 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50">
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="mr-4 text-amber-500 dark:text-amber-400">{icon}</div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                        {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
                    </div>
                </div>
                {children && <div className="flex items-center gap-2">{children}</div>}
            </div>
        </div>
    );
};