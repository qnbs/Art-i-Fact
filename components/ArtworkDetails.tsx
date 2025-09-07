import React, { useState, useCallback } from 'react';
import type { Artwork, Gallery, DeepDive } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { generateDeepDive } from '../services/geminiService';
import { ColorPalette } from './ColorPalette';
import { AccordionItem } from './ui/AccordionItem';
import { Button } from './ui/Button';
import { JournalIcon, ChatBubbleLeftEllipsisIcon } from './IconComponents';

interface ArtworkDetailsProps {
    artwork: Artwork;
    activeGallery: Gallery | null;
    onFindSimilar: (artwork: Artwork) => void;
    onInitiateAddToGallery: (artwork: Artwork) => void;
    onRemoveFromGallery: (artworkId: string) => void;
    onAddComment: (artworkId: string, comment: string) => void;
    onThematicSearch: (themes: string[]) => void;
    onStartChat: (artwork: Artwork) => void;
    onClose: () => void;
    showToast: (message: string) => void;
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
    artwork,
    activeGallery,
    onFindSimilar,
    onInitiateAddToGallery,
    onRemoveFromGallery,
    onAddComment,
    onThematicSearch,
    onStartChat,
    onClose,
    showToast,
}) => {
    const { t } = useTranslation();
    const [deepDive, setDeepDive] = useState<DeepDive | null>(null);
    const [isLoadingDeepDive, setIsLoadingDeepDive] = useState(false);

    const isInGallery = activeGallery?.artworks.some(a => a.id === artwork.id) ?? false;
    const galleryArtwork = activeGallery?.artworks.find(a => a.id === artwork.id);

    const handleGenerateDeepDive = useCallback(async () => {
        if (deepDive) return;
        setIsLoadingDeepDive(true);
        try {
            const analysis = await generateDeepDive(artwork);
            setDeepDive(analysis);
        } catch (err: any) {
            showToast(t('toast.gallery.deepDiveError'));
        } finally {
            setIsLoadingDeepDive(false);
        }
    }, [artwork, deepDive, showToast, t]);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full md:w-1/3 rounded-lg object-cover aspect-[3/4]" loading="lazy"/>
            <div className="text-gray-700 dark:text-gray-300 flex-grow">
                <p className="text-lg"><span className="font-semibold text-gray-900 dark:text-gray-100">{t('modal.details.artist')}:</span> {artwork.artist}</p>
                <p className="text-lg"><span className="font-semibold text-gray-900 dark:text-gray-100">{t('modal.details.year')}:</span> {artwork.year}</p>
                {artwork.description && <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{artwork.description}</p>}
                {artwork.colorPalette && <ColorPalette colors={artwork.colorPalette} />}

                {artwork.tags && artwork.tags.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('modal.details.tags')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {artwork.tags.map(tag => (
                                <button
                                key={tag}
                                onClick={() => {
                                    onThematicSearch([tag]);
                                    onClose();
                                }}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-3 py-1 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-colors"
                                >
                                {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isInGallery && (
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('modal.details.notes')}</label>
                        <textarea 
                            defaultValue={galleryArtwork?.comment}
                            onChange={(e) => onAddComment(artwork.id, e.target.value)}
                            placeholder={t('modal.details.notes.placeholder')}
                            className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white h-24"
                        />
                    </div>
                )}
                
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700/50 pt-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <JournalIcon className="w-5 h-5 mr-2" />
                            {t('modal.details.deepDive')}
                        </h4>
                        {!deepDive && (
                            <Button
                                size="sm"
                                onClick={handleGenerateDeepDive}
                                disabled={isLoadingDeepDive}
                            >
                                {isLoadingDeepDive ? t('gallery.suggestions.analyzing') : t('generate')}
                            </Button>
                        )}
                    </div>
                    {isLoadingDeepDive && (
                        <div className="flex justify-center items-center py-4">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {deepDive && (
                        <div className="mt-2">
                            <AccordionItem title={t('modal.details.deepDive.symbolism')}>
                                {deepDive.symbolism}
                            </AccordionItem>
                            <AccordionItem title={t('modal.details.deepDive.artistContext')}>
                                {deepDive.artistContext}
                            </AccordionItem>
                            <AccordionItem title={t('modal.details.deepDive.technique')}>
                                {deepDive.technique}
                            </AccordionItem>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    <Button onClick={() => { onFindSimilar(artwork); onClose(); }}>{t('modal.details.findSimilar')}</Button>
                    {isInGallery 
                        ? <Button variant="danger" onClick={() => onRemoveFromGallery(artwork.id)}>{t('modal.details.removeFromGallery')}</Button>
                        : <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { onInitiateAddToGallery(artwork); onClose(); }}>{t('modal.details.addToGallery')}</Button>
                    }
                    <Button variant="secondary" onClick={() => { onClose(); onStartChat(artwork); }}>
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
                        {t('chat.button')}
                    </Button>
                </div>
            </div>
        </div>
    );
};