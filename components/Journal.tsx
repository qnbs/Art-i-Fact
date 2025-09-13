

import React, { useState, useEffect, useMemo } from 'react';
import { JournalEntry, Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { JournalIcon, PlusCircleIcon, SparklesIcon, TrashIcon, CheckCircleIcon, BookOpenIcon, PencilIcon } from './IconComponents';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Button } from './ui/Button';
import { SpinnerIcon } from './IconComponents';

interface JournalProps {
    entries: JournalEntry[];
    galleries: Gallery[];
    activeEntryId?: string | null;
    onSelectEntry?: (id: string | null) => void;
    onUpdateEntry: (id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
    onDeleteEntry: (id: string) => void;
    onJournalResearch: (topic: string) => Promise<string>;
    activeAiTask: string | null;
    // FIX: Updated handleAiTask signature to match App.tsx definition.
    handleAiTask: <T>(taskName: string, taskFn: () => Promise<T>, options?: { onStart?: () => void; onEnd?: (result: T | undefined) => void; }) => Promise<T | undefined>;
}

const JournalEditor: React.FC<Omit<JournalProps, 'entries'> & { entry: JournalEntry }> = ({
    entry, galleries, onUpdateEntry, onJournalResearch, activeAiTask, handleAiTask
}) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState(entry.title);
    const [content, setContent] = useState(entry.content);
    const [researchTopic, setResearchTopic] = useState('');

    useEffect(() => {
        setTitle(entry.title);
        setContent(entry.content);
    }, [entry]);

    const handleSave = () => {
        onUpdateEntry(entry.id, { title, content });
    };

    const handleResearch = async () => {
        if (!researchTopic) return;
        // FIX: Removed the third argument from handleAiTask call to match the updated signature.
        const insights = await handleAiTask('journal', () => onJournalResearch(researchTopic));
        if (insights) {
            setContent(prev => `${prev}\n\n### ${t('journal.research.heading', { topic: researchTopic })}\n\n${insights}`);
            setResearchTopic('');
        }
    };

    const isDirty = title !== entry.title || content !== entry.content;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold bg-transparent focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md p-1 w-full"
                />
                {isDirty && (
                     <Button size="sm" onClick={handleSave}>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        {t('save')}
                    </Button>
                )}
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('journal.editor.placeholder')}
                className="w-full flex-grow bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md p-3 text-base resize-none mb-4"
            />
            <div className="flex-shrink-0 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                        placeholder={t('journal.research.placeholder')}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3"
                    />
                    <Button variant="secondary" onClick={handleResearch} disabled={!researchTopic || activeAiTask === 'journal'}>
                        {activeAiTask === 'journal' ? <SpinnerIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5" />}
                    </Button>
                </div>
                <div>
                     <h4 className="text-sm font-semibold mb-2">{t('journal.preview')}</h4>
                     <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
                        <MarkdownRenderer markdown={content} />
                     </div>
                </div>
            </div>
        </div>
    );
};

export const Journal: React.FC<JournalProps> = (props) => {
    const { t } = useTranslation();
    const { entries, activeEntryId, onSelectEntry, onDeleteEntry } = props;
    const activeEntry = useMemo(() => entries.find(e => e.id === activeEntryId), [entries, activeEntryId]);

    if (entries.length === 0) {
        return (
            <div className="flex-grow flex justify-center items-center text-center">
                <div className="text-gray-500 max-w-md p-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                    <JournalIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('journal.empty.title')}</h3>
                    <p>{t('journal.empty.prompt')}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-full gap-6">
            <div className="w-1/3 flex-shrink-0 flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="space-y-2">
                    {entries.map(entry => (
                        <button
                            key={entry.id}
                            onClick={() => onSelectEntry?.(entry.id)}
                            className={`w-full text-left p-3 rounded-md group transition-colors ${activeEntryId === entry.id ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <h4 className={`font-semibold truncate ${activeEntryId === entry.id ? 'text-amber-800 dark:text-amber-300' : ''}`}>{entry.title}</h4>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteEntry(entry.id); }}
                                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={t('remove')}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(entry.updatedAt).toLocaleDateString()}
                            </p>
                        </button>
                    ))}
                    </div>
                </div>
            </div>

            <div className="w-2/3 flex-grow">
                {activeEntry ? (
                    <JournalEditor {...props} entry={activeEntry} />
                ) : (
                     <div className="flex-grow flex justify-center items-center text-center">
                        <div className="text-gray-500 max-w-md p-8">
                            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('journal.select.title')}</h3>
                            <p>{t('journal.select.prompt')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};