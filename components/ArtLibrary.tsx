

import React, { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useDebounce } from '../hooks/useDebounce.ts';
import * as wikimediaService from '../services/wikimediaService.ts';
import { featuredArtworks } from '../data/featuredArtworks.ts';
import { discoverInspirationPrompts } from '../data/inspiration.ts';

import { ArtworkItem } from './ArtworkItem.tsx';
import { SearchIcon } from './IconComponents.tsx';
import { ArtworkItemSkeleton } from './ui/ArtworkItemSkeleton.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { RetryPrompt } from './ui/RetryPrompt.tsx';
import { PageHeader } from './ui/PageHeader.tsx';

export const ArtLibrary: React.FC = () => {
    const { t } = useTranslation();
    const { handleViewArtworkDetails, handleInitiateAdd, initialDiscoverSearch } = useAppContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [artworks, setArtworks] = useState<Artwork[]>(featuredArtworks);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (initialDiscoverSearch) {
            setSearchTerm(initialDiscoverSearch);
        }
    }, [initialDiscoverSearch]);

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
                    <ArtworkItem key={artwork.id} artwork={artwork} onViewDetails={handleViewArtworkDetails} onInitiateAdd={handleInitiateAdd} />
                ))}
            </div>
        );
    };
    
    return (
        <div>
            <PageHeader
                title={t('discover.title')}
                subtitle={t('discover.subtitle')}
                icon={<SearchIcon className="w-8 h-8" />}
            />
            
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
                <div className="relative">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('discover.search.placeholder')}
                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-lg"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('discover.inspiration')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {discoverInspirationPrompts.map(prompt => (
                            <button 
                                key={prompt.prompt} 
                                onClick={() => setSearchTerm(prompt.prompt)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                            >
                                {prompt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">
                {isSearching && searchTerm ? t('discover.results.title', { query: searchTerm }) : t('discover.featured')}
            </h2>
            
            {renderContent()}
        </div>
    );
};