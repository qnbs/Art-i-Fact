import React from 'react';
import { SpinnerIcon } from '../IconComponents.tsx';
import { RetryPrompt } from './RetryPrompt.tsx';
import type { AiError } from '../../contexts/AIStatusContext.tsx';
import { useTranslation } from '../../contexts/TranslationContext.tsx';

interface LoadingOverlayProps {
  message: string;
  isActive: boolean;
  error: AiError | null;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, isActive, error }) => {
  const { t } = useTranslation();
  if (!isActive && !error) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-[200] flex justify-center items-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
    >
      <div className="text-center text-white">
        {error ? (
           <RetryPrompt title={t('toast.error.taskFailed')} message={error.message} onRetry={error.onRetry} />
        ) : (
          <>
            <SpinnerIcon className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <p className="text-xl font-semibold animate-pulse max-w-md">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};