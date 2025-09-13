import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`bg-gray-200 dark:bg-gray-800/50 rounded-md animate-pulse ${className}`} />
    );
};
