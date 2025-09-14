import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { useDynamicLoadingMessage } from '../hooks/useDynamicLoadingMessage.ts';
import { loadingMessages } from '../i18n/loadingMessages.ts';
import { useTranslation } from './TranslationContext.tsx';
import { useToast } from './ToastContext.tsx';

export type AiTask = 'deepDive' | 'critique' | 'audioGuide' | 'trailer' | 'journal' | 'enhance' | 'studioGenerate' | 'remix' | null;

interface AiError {
    message: string;
    onRetry: () => void;
}

interface EndTaskOptions {
    onEnd?: (result: any) => void;
}

interface AIStatusContextType {
    activeAiTask: AiTask;
    loadingMessage: string;
    aiError: AiError | null;
    handleAiTask: <T>(taskName: NonNullable<AiTask>, taskFn: () => Promise<T>, options?: EndTaskOptions) => Promise<T | undefined>;
}

const AIStatusContext = createContext<AIStatusContextType | undefined>(undefined);

export const AIStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language, t } = useTranslation();
    const { showToast } = useToast();
    const [activeAiTask, setActiveAiTask] = useState<AiTask>(null);
    const [aiError, setAiError] = useState<AiError | null>(null);

    const messages = useMemo(() => activeAiTask ? loadingMessages[language][activeAiTask] || loadingMessages[language].generic : [], [activeAiTask, language]);
    const loadingMessage = useDynamicLoadingMessage(messages, 2500, !!activeAiTask);

    // FIX: Removed the generic <T> from the function implementation inside useCallback to fix TSX parsing errors.
    // The generic signature from AIStatusContextType will still be applied to consumers of the context.
    const handleAiTask = useCallback(
        async (taskName: NonNullable<AiTask>, taskFn: () => Promise<any>, options: EndTaskOptions = {}): Promise<any> => {
            setActiveAiTask(taskName);
            setAiError(null);
            try {
                const result = await taskFn();
                setActiveAiTask(null);
                if (options.onEnd) {
                    options.onEnd(result);
                }
                return result;
            } catch (error: any) {
                console.error(`AI Task "${taskName}" failed:`, error);
                const errorMessage = t('toast.error.gemini');
                showToast(errorMessage, 'error');
                setAiError({
                    message: errorMessage,
                    onRetry: () => {
                        handleAiTask(taskName, taskFn, options);
                    },
                });
                setActiveAiTask(null);
                if (options.onEnd) {
                    options.onEnd(undefined); // Indicate failure
                }
                return undefined;
            }
        },
        [language, t, showToast]
    );

    const value = { activeAiTask, loadingMessage, aiError, handleAiTask };

    return (
        <AIStatusContext.Provider value={value}>
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
