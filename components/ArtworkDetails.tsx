import React from 'react';
import type { Artwork, Gallery, DeepDive, AppSettings } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';

import { SparklesIcon, SearchIcon, ChatBubbleLeftEllipsisIcon, PlusCircleIcon, TrashIcon, PencilIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { ColorPalette } from './ColorPalette.tsx';
import { AccordionItem } from './ui/AccordionItem.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface ArtworkDetailsProps {
    artwork: Artwork;
    activeGallery?: Gallery | null;
    language: 'de' | 'en';
    onClose: () => void;
    onFindSimilar: (artwork: Artwork) => void;
    onInitiateAddToGallery: (artwork: Artwork) => void;
    onRemoveFromGallery?: (artworkId: string) => void;
    onAddComment: (artworkId: string, comment: string) => void;
    onThematicSearch: (themes: string[]) => void;
    onStartChat: (artwork: Artwork) => void;
}

const DetailRow: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => {
    if (!value || value.length === 0) return null;
    return (
        <div className="text-sm">
            <span className="font-semibold text-gray-500 dark:text-gray-400">{label}: </span>
            <span className="text-gray-700 dark:text-gray-300">
                {Array.isArray(value) ? value.join(', ') : value}
            </span>
        </div>
    );
};

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ artwork, activeGallery, language, onClose, onFindSimilar, onInitiateAddToGallery, onRemoveFromGallery, onAddComment, onThematicSearch, onStartChat }) => {
    const { t } = useTranslation();
    const { handleAiTask } = useAI();
    const { appSettings } = useAppContext();
    const [deepDive, setDeepDive] = React.useState<DeepDive | null>(null);
    const [isEditingComment, setIsEditingComment] = React.useState(false);
    const [comment, setComment] = React.useState(artwork.comment || '');

    const isInActiveGallery = activeGallery && activeGallery.artworks.some(a => a.id === artwork.id);

    const handleDeepDive = () => {
        handleAiTask<DeepDive>('deepDive', () => gemini.generateDeepDive(artwork, appSettings, language), {
            onEnd: (result) => result && setDeepDive(result),
        });
    };
    
    const handleSaveComment = () => {
        onAddComment(artwork.id, comment);
        setIsEditingComment(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 flex-shrink-0">
                <ImageWithFallback
                    src={artwork.imageUrl}
                    fallbackText={artwork.title}
                    alt={artwork.title}
                    className="w-full h-auto object-contain rounded-lg shadow-lg max-h-[70vh]"
                />
            </div>
            <div className="md:w-1/2">
                <h2 className="text-2xl font-bold">{artwork.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">{artwork.artist}</p>
                {artwork.year && <p className="text-sm text-gray-500">{artwork.year}</p>}
                
                <div className="my-4 flex flex-wrap gap-2">
                    <Button onClick={handleDeepDive} variant="secondary" size="sm">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        {t('artwork.details.deepDive')}
                    </Button>
                    <Button onClick={() => { onFindSimilar(artwork); onClose(); }} variant="secondary" size="sm">
                        <SearchIcon className="w-4 h-4 mr-2" />
                        {t('artwork.details.findSimilar')}
                    </Button>
                     <Button onClick={() => onStartChat(artwork)} variant="secondary" size="sm">
                        <ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2" />
                        {t('artwork.details.chat')}
                    </Button>
                </div>

                <p className="text-base text-gray-800 dark:text-gray-200 my-4">{artwork.description}</p>

                <div className="space-y-1 text-sm">
                    <DetailRow label="Medium" value={artwork.medium} />
                    <DetailRow label="Dimensions" value={artwork.dimensions} />
                    <DetailRow label="License" value={artwork.license} />
                    <DetailRow label="Tags" value={artwork.tags} />
                     {artwork.sourceUrl && (
                        <div className="text-sm">
                            <a href={artwork.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                                View Source
                            </a>
                        </div>
                    )}
                </div>

                <ColorPalette colors={artwork.colorPalette || []} />

                {isInActiveGallery && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex justify-between items-center">
                            {t('modal.details.notes')}
                            {!isEditingComment && (
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingComment(true)}>
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                            )}
                        </h4>
                        {isEditingComment ? (
                            <div>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="secondary" size="sm" onClick={() => { setIsEditingComment(false); setComment(artwork.comment || ''); }}>{t('cancel')}</Button>
                                    <Button size="sm" onClick={handleSaveComment}>{t('save')}</Button>
                                </div>
                            </div>
                        ) : (
                             artwork.comment ? (
                                <p className="text-sm italic text-gray-600 dark:text-gray-400">"{artwork.comment}"</p>
                            ) : (
                                <p className="text-sm text-gray-500">No notes yet.</p>
                            )
                        )}
                    </div>
                )}


                {deepDive && (
                    <div className="mt-4 space-y-2">
                        <AccordionItem title="Symbolism & Iconography">
                            <p>{deepDive.symbolism}</p>
                        </AccordionItem>
                        <AccordionItem title="Historical Context">
                            <p>{deepDive.artistContext}</p>
                        </AccordionItem>
                        <AccordionItem title="Technique & Composition">
                            <p>{deepDive.technique}</p>
                        </AccordionItem>
                    </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    {isInActiveGallery && onRemoveFromGallery ? (
                         <Button variant="danger" className="w-full" onClick={() => { onRemoveFromGallery(artwork.id); onClose(); }}>
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Remove from "{activeGallery.title}"
                        </Button>
                    ) : (
                        <Button className="w-full" onClick={() => onInitiateAddToGallery(artwork)}>
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            {t('modal.details.addToGallery')}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
