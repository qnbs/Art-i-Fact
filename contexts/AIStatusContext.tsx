import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from './TranslationContext';
import { useToast } from './ToastContext';
import { useDynamicLoadingMessage } from '../hooks/useDynamicLoadingMessage';
import { loadingMessages } from '../i18n/loadingMessages';

export type AiTaskKey = keyof (typeof loadingMessages)['en'];

export interface AiError {
    message: string;
    onRetry: () => void;
}

interface AIStatusContextType {
  activeAiTask: AiTaskKey | null;
  loadingMessage: string;
  aiError: AiError | null;
  handleAiTask: <T>(
    taskName: AiTaskKey, 
    taskFn: () => Promise<T>, 
    options?: { onStart?: () => void, onEnd?: (result: T | undefined) => void }
  ) => Promise<T | undefined>;
  clearAiError: () => void;
}

const AIStatusContext = createContext<AIStatusContextType | undefined>(undefined);

export const AIStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, language } = useTranslation();
    const { showToast } = useToast();
    const [activeAiTask, setActiveAiTask] = useState<AiTaskKey | null>(null);
    const [aiError, setAiError] = useState<AiError | null>(null);

    const activeMessages = useMemo(() => {
        if (!activeAiTask) return [];
        const messageSet = loadingMessages[language][activeAiTask] || loadingMessages[language].generic;
        return messageSet;
    }, [activeAiTask, language]);

    const loadingMessage = useDynamicLoadingMessage(activeMessages, 2500, !!activeAiTask);
    
    const clearAiError = useCallback(() => setAiError(null), []);

    const handleAiTask = useCallback(async <T,>(
        taskName: AiTaskKey, 
        taskFn: () => Promise<T>, 
        options?: { onStart?: () => void, onEnd?: (result: T | undefined) => void }
    ): Promise<T | undefined> => {
        setAiError(null);
        setActiveAiTask(taskName);
        options?.onStart?.();
        try {
            const result = await taskFn();
            options?.onEnd?.(result);
            return result;
        } catch (error: any) {
            console.error(`AI Task "${taskName}" failed:`, error);
            const errorMessage = t('error.api.message');
            
            setAiError({
                message: errorMessage,
                onRetry: () => {
                    handleAiTask(taskName, taskFn, options);
                }
            });

            // Still show a toast for non-blocking feedback
            const toastMessage = t(`toast.error.${taskName}`) || t('toast.error.gemini');
            showToast(toastMessage + (error.message ? `: ${error.message}`: ''), 'error');

            options?.onEnd?.(undefined);
            return undefined;
        } finally {
            setActiveAiTask(null);
        }
    }, [t, showToast]);

  return (
    <AIStatusContext.Provider value={{ activeAiTask, loadingMessage, handleAiTask, aiError, clearAiError }}>
      {children}
    </AIStatusContext.Provider>
  );
};

export const useAI = (): AIStatusContextType => {
  const context = useContext(AIStatusContext);
  if (!context) {
    throw new Error('useAI must be used within an AIStatusProvider');
  }
  return context;
};