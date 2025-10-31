import React from 'react';
import type { Artwork, Gallery, DeepDive } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';

import { SparklesIcon, SearchIcon, ChatBubbleLeftEllipsisIcon, PlusCircleIcon, TrashIcon, PencilIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { ColorPalette } from './ColorPalette.tsx';
import { AccordionItem } from './ui/AccordionItem.tsx';

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
    const [deepDive, setDeepDive] = React.useState<DeepDive | null>(null);
    const [isEditingComment, setIsEditingComment] = React.useState(false);
    const [comment, setComment] = React.useState(artwork.comment || '');

    const isInActiveGallery = activeGallery && activeGallery.artworks.some(a => a.id === artwork.id);

    const handleGenerateDeepDive = () => {
        handleAiTask<DeepDive>('deepDive', () => gemini.generateDeepDive(artwork, { aiCreativity: 'balanced' } as any, language), {
            onEnd: (result) => result && setDeepDive(result)
        });
    };
    
    const handleSaveComment = () => {
        onAddComment(artwork.id, comment);
        setIsEditingComment(false);
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex-shrink-0">
                <ImageWithFallback 
                    src={artwork.imageUrl}
                    fallbackText={artwork.title}
                    alt={artwork.title}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
                <ColorPalette colors={artwork.colorPalette || []} />
            </div>

            <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold">{artwork.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">{artwork.artist}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{artwork.year}</p>

                <div className="my-4 space-y-1">
                    <DetailRow label="Medium" value={artwork.medium} />
                    <DetailRow label="Dimensions" value={artwork.dimensions} />
                </div>
                
                {artwork.description && <p className="text-base my-4">{artwork.description}</p>}

                {isInActiveGallery && (
                    <div className="my-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300">{t('modal.details.notes')}</h4>
                        {isEditingComment ? (
                            <div className="mt-2">
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button size="sm" variant="secondary" onClick={() => setIsEditingComment(false)}>{t('cancel')}</Button>
                                    <Button size="sm" onClick={handleSaveComment}>{t('save')}</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="group flex items-start justify-between">
                                <p className="text-gray-700 dark:text-gray-300 italic mt-1">
                                    {artwork.comment ? `"${artwork.comment}"` : "Add a personal note..."}
                                </p>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingComment(true)} className="opacity-0 group-hover:opacity-100">
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}


                <div className="space-y-2 mt-4">
                     <Button onClick={() => onStartChat(artwork)} variant="secondary" className="w-full">
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
                        Chat about this Artwork
                    </Button>
                     <Button onClick={() => onFindSimilar(artwork)} variant="secondary" className="w-full">
                        <SearchIcon className="w-5 h-5 mr-2" />
                        Find Similar Art
                    </Button>
                    {isInActiveGallery ? (
                        onRemoveFromGallery && <Button onClick={() => { onRemoveFromGallery(artwork.id); onClose(); }} variant="danger" className="w-full">
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Remove from Gallery
                        </Button>
                    ) : (
                         <Button onClick={() => onInitiateAddToGallery(artwork)} className="w-full">
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                           {t('modal.details.addToGallery')}
                        </Button>
                    )}
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700/50 pt-4">
                     {!deepDive && (
                        <Button onClick={handleGenerateDeepDive} variant="secondary" className="w-full bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate AI Deep Dive
                        </Button>
                    )}
                    {deepDive && (
                        <div className="space-y-2 animate-fade-in">
                            <AccordionItem title="Iconography & Symbolism">
                                <p>{deepDive.symbolism}</p>
                            </AccordionItem>
                             <AccordionItem title="Artist & Historical Context">
                                <p>{deepDive.artistContext}</p>
                            </AccordionItem>
                             <AccordionItem title="Technique & Composition">
                                <p>{deepDive.technique}</p>
                            </AccordionItem>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
