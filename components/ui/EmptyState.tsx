import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children }) => (
    <div className="flex-grow flex justify-center items-center text-center h-full">
        <div className="text-gray-500 max-w-md p-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="mb-6">{message}</p>
            {children}
        </div>
    </div>
);
