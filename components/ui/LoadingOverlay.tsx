import React from 'react';
import { SpinnerIcon } from '../IconComponents.tsx';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-600 dark:text-gray-400 p-8 animate-fade-in">
      <SpinnerIcon className="w-16 h-16 text-amber-500 mb-6" />
      <p className="text-lg animate-pulse max-w-md">{message}</p>
    </div>
  );
};