import React, { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useDebounce } from '../hooks/useDebounce.ts';
import * as wikimediaService from '../services/wikimediaService.ts';
import { featuredArtworks } from '../data/featuredArtworks.ts';
import { discoverInspirationPrompts } from '../data/inspiration.ts';

import { ArtworkItem } from './ArtworkItem.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { SearchIcon } from './IconComponents.tsx';
import { ArtworkItemSkeleton } from './ui/ArtworkItemSkeleton.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { RetryPrompt } from './ui/RetryPrompt.tsx';

interface ArtLibraryProps {
    onViewDetails: (artwork: Artwork) => void;
    onInitiateAdd: (artwork: Artwork) => void;
    initialSearchQuery?: string;
}

export const ArtLibrary: React.FC<ArtLibraryProps> = ({ onViewDetails, onInitiateAdd, initialSearchQuery }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [artworks, setArtworks] = useState<Artwork[]>(featuredArtworks);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (initialSearchQuery) {
            setSearchTerm(initialSearchQuery);
        }
    }, [initialSearchQuery]);

    const handleSearch = useCallback(async (query: string) => {
        if (!query) {
            setArtworks(featuredArtworks);
            setIsSearching(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setIsSearching(true);
        setError(null);
        try {
            const results = await wikimediaService.searchWikimedia(query);
            setArtworks(results);
        } catch (err) {
            console.error("Search failed:", err);
            setError(t('discover.error'));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, handleSearch]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => <ArtworkItemSkeleton key={i} />)}
                </div>
            );
        }

        if (error) {
            return <RetryPrompt message={error} onRetry={() => handleSearch(searchTerm)} />;
        }
        
        if (artworks.length === 0 && isSearching) {
            return (
                <EmptyState
                    icon={<SearchIcon className="w-16 h-16" />}
                    title={t('discover.results.none')}
                    message={t('discover.results.none')}
                />
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {artworks.map(artwork => (
                    <ArtworkItem key={artwork.id} artwork={artwork} onViewDetails={onViewDetails} />
                ))}
            </div>
        );
    };
    
    return (
        <div className="flex flex-col h-full">
             <PageHeader 
                title={t('discover.title')} 
                subtitle={t('discover.subtitle')}
                icon={<SearchIcon className="w-8 h-8" />}
            />

            <div className="mb-6 relative">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('discover.search.placeholder')}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-lg"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

             <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('studio.inspiration')}</h3>
                <div className="flex flex-wrap gap-2">
                    {discoverInspirationPrompts.map(prompt => (
                        <button 
                            key={prompt.prompt} 
                            onClick={() => setSearchTerm(prompt.prompt)}
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-xs rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                        >
                            {prompt.label}
                        </button>
                    ))}
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">
                {isSearching && searchTerm ? t('discover.results.title', { query: searchTerm }) : t('discover.featured')}
            </h2>
            
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};