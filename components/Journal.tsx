import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry, Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { JournalIcon, PlusCircleIcon, TrashIcon, SparklesIcon, SpinnerIcon, SearchIcon } from './IconComponents';

interface AIPopupProps {
    position: { top: number, left: number };
    onAction: (action: 'expand' | 'summarize' | 'improve' | 'research') => void;
    onClose: () => void;
}

const AIPopup: React.FC<AIPopupProps> = ({ position, onAction, onClose }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div 
            ref={popupRef}
            style={{ top: position.top, left: position.left }}
            className="absolute z-10 bg-gray-800 text-white rounded-lg shadow-lg p-1 flex items-center gap-1 animate-fade-in"
        >
            <button onClick={() => onAction('expand')} className="px-2 py-1 text-sm hover:bg-gray-700 rounded">{t('journal.ai.expand')}</button>
            <button onClick={() => onAction('summarize')} className="px-2 py-1 text-sm hover:bg-gray-700 rounded">{t('journal.ai.summarize')}</button>
            <button onClick={() => onAction('improve')} className="px-2 py-1 text-sm hover:bg-gray-700 rounded">{t('journal.ai.improve')}</button>
            <div className="w-px h-4 bg-gray-600"></div>
            <button onClick={() => onAction('research')} className="px-2 py-1 text-sm hover:bg-gray-700 rounded flex items-center gap-1"><SearchIcon className="w-4 h-4"/> {t('journal.ai.research')}</button>
        </div>
    );
};

interface JournalProps {
  entries: JournalEntry[];
  galleries: Gallery[];
  activeEntryId: string | null;
  onSelectEntry: (id: string) => void;
  onUpdateEntry: (id: string, updatedEntry: Partial<Omit<JournalEntry, 'id'>>) => void;
  onDeleteEntry: (id: string) => void;
  onProcessText: (text: string, action: 'expand' | 'summarize' | 'improve') => Promise<string>;
  onJournalResearch: (topic: string) => void;
  activeAiTask: string | null;
}

export const Journal: React.FC<JournalProps> = ({ 
    entries, galleries, activeEntryId, onSelectEntry, onUpdateEntry, onDeleteEntry, onProcessText, onJournalResearch, activeAiTask 
}) => {
  const { t } = useTranslation();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [selection, setSelection] = useState<{ text: string, start: number, end: number } | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number } | null>(null);

  const activeEntry = entries.find(e => e.id === activeEntryId);

  const handleDelete = () => {
      if(activeEntryId) {
          onDeleteEntry(activeEntryId);
      }
  }

  const handleUpdate = (field: 'title' | 'content' | 'linkedGalleryId', value: string) => {
      if (activeEntryId) {
          onUpdateEntry(activeEntryId, { [field]: value });
      }
  };

  const handleMouseUp = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText.trim().length > 10) {
        setSelection({ text: selectedText, start: textarea.selectionStart, end: textarea.selectionEnd });
        
        const rect = textarea.getBoundingClientRect();
        const startPos = textarea.selectionStart;
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.whiteSpace = 'pre-wrap';
        tempDiv.style.font = window.getComputedStyle(textarea).font;
        tempDiv.style.width = `${textarea.clientWidth}px`;
        tempDiv.textContent = textarea.value.substring(0, startPos);
        document.body.appendChild(tempDiv);

        const textMetrics = tempDiv.getBoundingClientRect();
        document.body.removeChild(tempDiv);
        
        setPopupPosition({ 
            top: rect.top + textMetrics.height - textarea.scrollTop, 
            left: rect.left + 5 
        });

    } else {
        setSelection(null);
        setPopupPosition(null);
    }
  };

  const handleAIAction = async (action: 'expand' | 'summarize' | 'improve' | 'research') => {
    if (!selection || !activeEntry) return;
    
    setPopupPosition(null);
    const originalText = activeEntry.content;
    
    if (action === 'research') {
        onJournalResearch(selection.text);
        setSelection(null);
        return;
    }

    try {
        const newText = await onProcessText(selection.text, action);
        const updatedContent = originalText.substring(0, selection.start) + newText + originalText.substring(selection.end);
        handleUpdate('content', updatedContent);
    } catch(e) {
      // Error is handled by a toast in App.tsx
    } finally {
      setSelection(null);
    }
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString(undefined, {
          year: 'numeric', month: 'long', day: 'numeric'
      });
  }
  
  const isProcessingText = activeAiTask === 'journal';
  
  const availableGalleries = activeEntry?.projectId 
    ? galleries.filter(g => g.projectId === activeEntry.projectId || !g.projectId) 
    : galleries;

  if (activeEntryId && activeEntry) {
    return ( // Editor View
         <div className="flex flex-col h-full bg-white/50 dark:bg-black/20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700/50">
            {popupPosition && selection && (
                <AIPopup position={popupPosition} onAction={handleAIAction} onClose={() => setPopupPosition(null)} />
            )}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0 flex items-center gap-4">
                <input 
                    ref={titleInputRef}
                    type="text"
                    value={activeEntry.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder={t('journal.title.placeholder')}
                    className="text-2xl font-bold bg-transparent focus:outline-none flex-grow"
                />
                <select 
                    value={activeEntry.linkedGalleryId || ''}
                    onChange={e => handleUpdate('linkedGalleryId', e.target.value)}
                    className="text-sm bg-gray-200 dark:bg-gray-700 rounded-md p-1 focus:outline-none"
                >
                    <option value="">{t('journal.linked.gallery.none')}</option>
                    {availableGalleries.map(g => (
                        <option key={g.id} value={g.id}>{g.title || t('gallery.new')}</option>
                    ))}
                </select>
                <button onClick={handleDelete} className="text-red-500 hover:text-red-700" title={t('remove')}>
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
            <div className="p-4 flex-grow relative">
                <textarea
                    ref={contentTextareaRef}
                    value={activeEntry.content}
                    onChange={(e) => handleUpdate('content', e.target.value)}
                    onMouseUp={handleMouseUp}
                    onBlur={() => {
                        setTimeout(() => {
                            if (!popupPosition) {
                                setSelection(null);
                            }
                        }, 200);
                    }}
                    placeholder={t('journal.content.placeholder')}
                    className="w-full h-full bg-transparent focus:outline-none resize-none leading-relaxed"
                    disabled={isProcessingText}
                    autoFocus
                />
                {isProcessingText && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
                        <SpinnerIcon className="w-8 h-8 text-amber-500" />
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700/50 text-xs text-gray-500 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-amber-500"/>
                <span>{t('journal.ai.tip')}</span>
            </div>
        </div>
    );
  }

  return ( // List View
    <div className="h-full bg-white/50 dark:bg-black/20 rounded-lg overflow-y-auto border border-gray-200 dark:border-gray-700/50">
        {entries.length === 0 ? (
            <p className="text-center text-gray-500 p-4">{t('journal.empty')}</p>
        ) : (
            <ul>
                {entries.map(entry => (
                    <li key={entry.id}>
                        <button
                            onClick={() => onSelectEntry(entry.id)}
                            className="w-full text-left p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{entry.title}</h3>
                            <p className="text-xs text-gray-500">{formatDate(entry.updatedAt)}</p>
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
};
