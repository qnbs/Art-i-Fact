import React, { useState, useCallback } from 'react';
import type { Artwork, Gallery, DeepDive } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import { useAppSettings } from '../contexts/AppSettingsContext.tsx';
import { generateDeepDive } from '../services/geminiService.ts';
import { ColorPalette } from './ColorPalette.tsx';
import { AccordionItem } from './ui/AccordionItem.tsx';
import { Button } from './ui/Button.tsx';
import { JournalIcon, ChatBubbleLeftEllipsisIcon, SpinnerIcon } from './IconComponents.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';

interface ArtworkDetailsProps {
    artwork: Artwork;
    activeGallery: Gallery | null;
    language: 'de' | 'en';
    onFindSimilar: (artwork: Artwork) => void;
    onInitiateAddToGallery: (artwork: Artwork) => void;
    onRemoveFromGallery: (artworkId: string) => void;
    onAddComment: (artworkId: string, comment: string) => void;
    onThematicSearch: (themes: string[]) => void;
    onStartChat: (artwork: Artwork) => void;
    onClose: () => void;
}

const Fact: React.FC<{ label: string; value: string | undefined; }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{label}</h4>
            <p className="text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    );
};


export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
    artwork,
    activeGallery,
    language,
    onFindSimilar,
    onInitiateAddToGallery,
    onRemoveFromGallery,
    onAddComment,
    onThematicSearch,
    onStartChat,
    onClose,
}) => {
    const { t } = useTranslation();
    const { handleAiTask, activeAiTask, loadingMessage } = useAI();
    const { appSettings } = useAppSettings();
    const [deepDive, setDeepDive] = useState<DeepDive | null>(null);

    const isLoadingDeepDive = activeAiTask === 'deepDive';
    const isInGallery = activeGallery?.artworks.some(a => a.id === artwork.id) ?? false;
    const galleryArtwork = activeGallery?.artworks.find(a => a.id === artwork.id);

    const handleGenerateDeepDive = useCallback(async () => {
        if (deepDive) return;
        const analysis = await handleAiTask('deepDive', () => generateDeepDive(artwork, appSettings, language)) as DeepDive | undefined;
        if (analysis) {
            setDeepDive(analysis);
        }
    }, [artwork, deepDive, handleAiTask, appSettings, language]);

    const createAttributionHtml = () => {
        if (!artwork.license) return null;
        const licenseUrlMap: Record<string, string> = {
            "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
            "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
            "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
            "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
            "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
            "Public domain": "https://en.wikipedia.org/wiki/Public_domain"
        };
        const licenseUrl = licenseUrlMap[artwork.license] || '#';
        const artistHtml = artwork.sourceUrl ? `<a href="${artwork.sourceUrl}" target="_blank" rel="noopener noreferrer" class="hover:underline text-amber-600 dark:text-amber-500"><strong>${artwork.artist}</strong></a>` : `<strong>${artwork.artist}</strong>`;
        const licenseHtml = `<a href="${licenseUrl}" target="_blank" rel="noopener noreferrer" class="hover:underline text-amber-600 dark:text-amber-500">${artwork.license}</a>`;
        return {__html: `${t('modal.details.attribution')}: ${artistHtml} / ${licenseHtml} / Wikimedia Commons`};
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
                <ImageWithFallback 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    fallbackText={artwork.title}
                    className="w-full rounded-lg object-contain shadow-lg" 
                    loading="lazy"
                />
                 {artwork.sourceUrl && (
                    <div className="mt-2 text-xs text-gray-500">
                        {artwork.imageUrl && artwork.imageUrl !== artwork.sourceUrl ? (
                            <>
                                <a href={artwork.imageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate">
                                    {t('modal.details.imageFile')}
                                </a>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                <a href={artwork.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate">
                                    {t('modal.details.infoPage')}
                                </a>
                            </>
                        ) : (
                            <a href={artwork.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate">
                                {t('modal.details.source')}: {new URL(artwork.sourceUrl).hostname}
                            </a>
                        )}
                    </div>
                )}
                 {createAttributionHtml() && (
                    <div 
                        className="mt-2 text-xs text-gray-600 dark:text-gray-400"
                        dangerouslySetInnerHTML={createAttributionHtml()!}
                    />
                )}
                {artwork.colorPalette && <ColorPalette colors={artwork.colorPalette} />}
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 flex-grow">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{artwork.title}</h3>
                <p className="text-xl text-gray-500 dark:text-gray-400 mt-1">{artwork.artist}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 my-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <Fact label="Year" value={artwork.year} />
                    <Fact label={t('modal.details.medium')} value={artwork.medium} />
                    <Fact label={t('modal.details.dimensions')} value={artwork.dimensions} />
                    <Fact label={t('modal.details.location')} value={artwork.location} />
                </div>

                <div className="space-y-4 text-sm">
                    {artwork.description && (
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{t('modal.details.about')}</h4>
                            <p className="leading-relaxed">{artwork.description}</p>
                        </div>
                    )}
                    {artwork.historicalContext && (
                         <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{t('modal.details.context')}</h4>
                            <p className="leading-relaxed">{artwork.historicalContext}</p>
                        </div>
                    )}
                </div>


                {artwork.tags && artwork.tags.length > 0 && (
                    <div className="mt-6">
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
                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('modal.details.notes')}</label>
                        <textarea 
                            defaultValue={galleryArtwork?.comment}
                            onBlur={(e) => onAddComment(artwork.id, e.target.value)}
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
                                isLoading={isLoadingDeepDive}
                            >
                                {isLoadingDeepDive ? t('gallery.suggestions.analyzing') : t('generate')}
                            </Button>
                        )}
                    </div>
                    {isLoadingDeepDive && (
                        <div className="py-4 text-center" role="status" aria-label={loadingMessage}>
                            <SpinnerIcon className="w-8 h-8 text-amber-500 mx-auto" />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{loadingMessage}</p>
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

                <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700/50 pt-4">
                    <Button onClick={() => onFindSimilar(artwork)}>{t('modal.details.findSimilar')}</Button>
                    {isInGallery 
                        ? <Button variant="danger" onClick={() => onRemoveFromGallery(artwork.id)}>{t('modal.details.removeFromGallery')}</Button>
                        : <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onInitiateAddToGallery(artwork)}>{t('modal.details.addToGallery')}</Button>
                    }
                    <Button variant="secondary" onClick={() => { onStartChat(artwork); }}>
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
                        {t('chat.button')}
                    </Button>
                </div>
            </div>
        </div>
    );
};