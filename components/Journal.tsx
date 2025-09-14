import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { JournalEntry, Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { useAI } from '../contexts/AIStatusContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../contexts/ToastContext';
import { JournalIcon, SparklesIcon, TrashIcon, CheckCircleIcon, BookOpenIcon, PencilIcon, SpinnerIcon, PlusCircleIcon } from './IconComponents';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { PageHeader } from './ui/PageHeader';
import { RetryPrompt } from './ui/RetryPrompt';
import * as gemini from '../services/geminiService';

interface JournalProps {
    entries: JournalEntry[];
    galleries: Gallery[];
    language: 'de' | 'en';
    activeEntryId?: string | null;
    onSelectEntry?: (id: string | null) => void;
    onUpdateEntry: (id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
    onDeleteEntry: (id: string) => void;
    onNewEntry: () => string;
}

const JournalEditor: React.FC<Omit<JournalProps, 'entries' | 'galleries' | 'onNewEntry'> & { entry: JournalEntry }> = ({
    entry, onUpdateEntry, language
}) => {
    const { t } = useTranslation();
    const { handleAiTask, activeAiTask, aiError, loadingMessage } = useAI();
    const { appSettings } = useAppSettings();
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
        const currentContent = content;
        const topicForHeader = researchTopic;
        setResearchTopic('');

        await handleAiTask('journal', async () => {
            const resultStream = await gemini.generateJournalInsightsStream(topicForHeader, appSettings, language);
            
            let isHeaderAdded = false;
            const appendHeader = () => {
                if (!isHeaderAdded) {
                    setContent(prev => `${prev}\n\n### ${t('journal.research.heading', { topic: topicForHeader })}\n\n`);
                    isHeaderAdded = true;
                }
            };

            for await (const chunk of resultStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    appendHeader();
                    setContent(prev => `${prev}${chunkText}`);
                }
                
                const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (groundingChunks && groundingChunks.length > 0) {
                    const sources = groundingChunks
                        .map((c: any) => c.web?.uri)
                        .filter((uri: string | undefined): uri is string => !!uri)
                        .filter((uri: string, index: number, self: string[]) => self.indexOf(uri) === index);
                    
                    if (sources.length > 0) {
                        appendHeader();
                        const sourcesTitle = language === 'de' ? 'Quellen' : 'Sources';
                        let sourcesText = `\n\n---\n**${sourcesTitle}:**\n`;
                        sources.forEach((source: string) => {
                            sourcesText += `- ${source}\n`;
                        });
                        setContent(prev => `${prev}\n${sourcesText}`);
                    }
                }
            }
            return true;
        }, {
            onEnd: (result) => {
                if (result === undefined) {
                    setContent(currentContent);
                } else {
                     onUpdateEntry(entry.id, { title, content });
                }
            }
        });
    };

    const isDirty = title !== entry.title || content !== entry.content;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave}
                    className="text-2xl font-bold bg-transparent focus:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800 rounded-md p-1 w-full"
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
                onBlur={handleSave}
                placeholder={t('journal.editor.placeholder')}
                className="w-full flex-grow bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md p-3 text-base resize-none mb-4"
            />
            <div className="flex-shrink-0 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleResearch() }}
                        placeholder={t('journal.research.placeholder')}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 px-3"
                    />
                    <Button variant="secondary" onClick={handleResearch} disabled={!researchTopic || activeAiTask === 'journal'}>
                        {activeAiTask === 'journal' ? <SpinnerIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5" />}
                    </Button>
                </div>
                {activeAiTask === 'journal' && <p className="text-sm text-center text-gray-500 dark:text-gray-400 animate-pulse">{loadingMessage}</p>}
                <div>
                     <h4 className="text-sm font-semibold mb-2">{t('journal.preview')}</h4>
                     <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
                        {aiError && activeAiTask === null ? (
                           <RetryPrompt message={aiError.message} onRetry={aiError.onRetry} />
                        ) : (
                           <MarkdownRenderer markdown={content} />
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export const Journal: React.FC<JournalProps> = (props) => {
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();
    const { entries, onDeleteEntry, onNewEntry } = props;
    
    const [internalActiveEntryId, setInternalActiveEntryId] = useState<string | null>(null);

    const isControlled = props.activeEntryId !== undefined;
    const activeEntryId = isControlled ? props.activeEntryId : internalActiveEntryId;
    const onSelectEntry = isControlled ? props.onSelectEntry! : setInternalActiveEntryId;

    useEffect(() => {
        if (!isControlled && activeEntryId && !entries.find(e => e.id === activeEntryId)) {
            setInternalActiveEntryId(null);
        }
    }, [entries, activeEntryId, isControlled]);
    
    useEffect(() => {
        if (!activeEntryId && entries.length > 0 && !isControlled) {
            setInternalActiveEntryId(entries[0].id);
        }
    }, [entries, activeEntryId, isControlled]);

    const activeEntry = useMemo(() => entries.find(e => e.id === activeEntryId), [entries, activeEntryId]);

    const handleDelete = useCallback((e: React.MouseEvent, entryId: string, entryTitle: string) => {
        e.stopPropagation();
        showModal(
            t('journal.delete.confirm', { title: entryTitle }),
            <>
                <p>{t('journal.delete.confirm', { title: entryTitle })}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                    <Button variant="danger" onClick={() => {
                        onDeleteEntry(entryId);
                        if (activeEntryId === entryId) {
                            onSelectEntry(null);
                        }
                        showToast(t('toast.journal.deleted'), 'success');
                        hideModal();
                    }}>{t('remove')}</Button>
                </div>
            </>
        );
    }, [showModal, hideModal, t, onDeleteEntry, activeEntryId, onSelectEntry, showToast]);
    
    const handleNew = () => {
        const newId = onNewEntry();
        onSelectEntry(newId);
    }

    if (entries.length === 0 && !isControlled) {
        return (
            <div className="h-full">
                <PageHeader title={t('journal.title')} icon={<JournalIcon className="w-8 h-8" />} >
                    <Button onClick={handleNew}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        {t('journal.new')}
                    </Button>
                </PageHeader>
                <EmptyState 
                    icon={<JournalIcon className="w-16 h-16" />}
                    title={t('journal.empty.title')}
                    message={t('journal.empty.prompt')}
                >
                     <Button onClick={handleNew}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        {t('journal.new')}
                    </Button>
                </EmptyState>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            {!isControlled && <PageHeader title={t('journal.title')} icon={<JournalIcon className="w-8 h-8" />} >
                <Button onClick={handleNew}>
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {t('journal.new')}
                </Button>
            </PageHeader>}

            <div className="flex flex-col md:flex-row h-full gap-6 flex-grow">
                <div className="w-full md:w-1/3 md:h-full flex-shrink-0 flex flex-col">
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="space-y-2">
                        {entries.map(entry => (
                            <button
                                key={entry.id}
                                onClick={() => onSelectEntry(entry.id)}
                                className={`w-full text-left p-3 rounded-md group transition-colors ${activeEntryId === entry.id ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold truncate ${activeEntryId === entry.id ? 'text-amber-800 dark:text-amber-300' : ''}`}>{entry.title}</h4>
                                     <button
                                        onClick={(e) => handleDelete(e, entry.id, entry.title)}
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

                <div className="w-full md:w-2/3 md:h-full flex-grow">
                    {activeEntry ? (
                        <JournalEditor {...props} entry={activeEntry} />
                    ) : (
                         <div className="flex-grow flex justify-center items-center text-center h-full">
                            <div className="text-gray-500 max-w-md p-8">
                                <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('journal.select.title')}</h3>
                                <p>{t('journal.select.prompt')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
