import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../../contexts/TranslationContext.tsx';
import { Button } from './Button.tsx';
import { ArrowPathIcon } from '../IconComponents.tsx';

interface RetryPromptProps {
    message: string;
    onRetry: () => void;
    title?: string;
}

export const RetryPrompt: React.FC<RetryPromptProps> = ({ message, onRetry, title }) => {
    const { t } = useTranslation();
    return (
        <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-600 dark:text-gray-400 p-8 h-full">
             <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title || t('error.api.title')}</h3>
            <p className="max-w-md mb-6">{message}</p>
            <Button onClick={onRetry} variant="secondary">
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                {t('retry')}
            </Button>
        </div>
    );
};