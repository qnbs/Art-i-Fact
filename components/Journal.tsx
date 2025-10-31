import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { JournalEntry } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';
import { useDebounce } from '../hooks/useDebounce.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
import { JournalIcon, PlusCircleIcon, SparklesIcon } from './IconComponents.tsx';
import { EmptyState } from './ui/EmptyState.tsx';

interface JournalProps {
    entries: JournalEntry[];
    language: 'de' | 'en';
    activeEntryId?: string | null;
    onSelectEntry: (id: string) => void;
    onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
    onDeleteEntry: (id: string) => void;
    onNewEntry: () => Promise<string>;
}

export const Journal: React.FC<JournalProps> = ({ entries, language, activeEntryId: externalActiveId, onSelectEntry, onUpdateEntry, onNewEntry }) => {
    const { t } = useTranslation();
    const { settings } = useAppContext();
    const { handleAiTask } = useAI();
    const [internalActiveId, setInternalActiveId] = useState<string | null>(null);

    const activeEntryId = externalActiveId ?? internalActiveId;
    const activeEntry = entries.find(e => e.id === activeEntryId);
    
    useEffect(() => {
        if (!activeEntryId && entries.length > 0) {
            handleSelectEntry(entries[0].id);
        }
    }, [entries, activeEntryId]);

    const handleSelectEntry = (id: string) => {
        onSelectEntry(id);
        setInternalActiveId(id);
    }
    
    const debouncedContent = useDebounce(activeEntry?.content, 1000);

    useEffect(() => {
        if (settings.autoSaveJournal && activeEntry && debouncedContent !== undefined) {
             onUpdateEntry(activeEntry.id, { content: debouncedContent });
        }
    }, [debouncedContent, activeEntry, onUpdateEntry, settings.autoSaveJournal]);

    const handleGetInsights = useCallback(async () => {
        if (!activeEntry) return;

        if (settings.streamJournalResponses) {
            let fullText = '';
            try {
                const stream = await gemini.generateJournalInsightsStream(activeEntry.title, settings, language);
                for await (const chunk of stream) {
                    fullText += chunk.text;
                    onUpdateEntry(activeEntry.id, { content: fullText });
                }
            } catch(e) {
                console.error(e);
            }
        } else {
            handleAiTask('journal', () => gemini.generateJournalInsights(activeEntry.title, settings, language), {
                onEnd: (result) => {
                    if (result) {
                        onUpdateEntry(activeEntry.id, { content: result.text });
                    }
                }
            });
        }
    }, [activeEntry, settings, language, onUpdateEntry, handleAiTask]);

    if (entries.length === 0) {
        return (
            <EmptyState
                icon={<JournalIcon className="w-16 h-16"/>}
                title={t('journal.empty.title')}
                message={t('journal.empty.prompt')}
            >
                <Button onClick={onNewEntry}>
                    <PlusCircleIcon className="w-5 h-5 mr-2"/>
                    {t('journal.new')}
                </Button>
            </EmptyState>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={t('view.journal')} icon={<JournalIcon className="w-8 h-8"/>}>
                <Button onClick={onNewEntry} size="sm">
                    <PlusCircleIcon className="w-4 h-4 mr-1"/>
                    {t('journal.new')}
                </Button>
            </PageHeader>
            <div className="flex-grow flex gap-6 overflow-hidden">
                {/* Entry List */}
                <div className="w-1/3 flex-shrink-0 overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {entries.map(entry => (
                            <li key={entry.id}>
                                <button onClick={() => handleSelectEntry(entry.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${activeEntryId === entry.id ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                                    <h3 className="font-semibold truncate">{entry.title}</h3>
                                    <p className="text-xs text-gray-500 truncate">{entry.content?.substring(0, 50) || 'No content'}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Editor */}
                <div className="w-2/3 flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    {activeEntry ? (
                        <>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                <input
                                    type="text"
                                    value={activeEntry.title}
                                    onChange={(e) => onUpdateEntry(activeEntry.id, { title: e.target.value })}
                                    className="text-xl font-bold bg-transparent w-full focus:outline-none"
                                />
                                <Button onClick={handleGetInsights} variant="secondary" size="sm">
                                    <SparklesIcon className="w-4 h-4 mr-1" />
                                    {t('journal.getInsights')}
                                </Button>
                            </div>
                            <div className="flex-grow flex overflow-hidden">
                                <textarea
                                    value={activeEntry.content}
                                    onChange={(e) => onUpdateEntry(activeEntry.id, { content: e.target.value })}
                                    className="w-1/2 h-full p-4 resize-none bg-transparent focus:outline-none border-r border-gray-200 dark:border-gray-800"
                                    placeholder={t('journal.placeholder')}
                                />
                                <div className="w-1/2 h-full p-4 overflow-y-auto">
                                    <MarkdownRenderer markdown={activeEntry.content} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            {t('journal.selectPrompt')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};