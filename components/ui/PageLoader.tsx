
import React from 'react';
import { SpinnerIcon } from '../IconComponents';

interface PageLoaderProps {
    message: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message }) => {
    return (
        <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-600 dark:text-gray-400 p-8 h-full">
            <SpinnerIcon className="w-12 h-12 text-amber-500 mb-4" />
            {message && <p className="text-lg">{message}</p>}
        </div>
    );
};
