// FIX: Implemented full content for the ArtLibrary component.
import React, { useState, useRef, ChangeEvent } from 'react';
import type { Artwork } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { SearchIcon, SparklesIcon, ArrowLeftIcon, ArrowUpTrayIcon, CameraIcon } from './IconComponents';
import { ArtworkItem } from './ArtworkItem';
import { LoadingOverlay } from './ui/LoadingOverlay';
import { Button } from './ui/Button';

// FIX: Added ArtLibraryProps interface to define component props.
interface ArtLibraryProps {
  onSearch: (term: string) => void;
  onAnalyzeImage: (file: File) => void;
  onAddArtwork: (artwork: Artwork) => void;
  onViewArtworkDetails: (artwork: Artwork) => void;
  onShowCamera: () => void;
  artworks: Artwork[];
  isLoading: boolean;
  loadingMessage: string;
  searchTerm: string;
  similarTo: Artwork | null;
  onFindSimilar: (artwork: Artwork) => void;
  featuredArtworks: Artwork[];
}

const themeCategories = {
    'welcome.category.eras': ['baroque_chiaroscuro', 'impressionist_light', 'surreal_dreams', 'bauhaus_design', 'pop_art_critique'],
    'welcome.category.emotions': ['joy_celebration', 'melancholic_solitude', 'chaotic_harmony', 'vanitas_mortality'],
    'welcome.category.places': ['stormy_seascapes', 'urban_alienation', 'mystical_forests', 'manicured_gardens'],
    'welcome.category.themes': ['mythological_heroes', 'industrial_revolution', 'unconventional_portraits', 'geometric_abstraction']
};

const SearchResultHeader: React.FC<{ term?: string; similarTo?: Artwork | null; onBack: () => void }> = ({ term, similarTo, onBack }) => {
    const { t } = useTranslation();
    const title = similarTo 
        ? t('artLibrary.search.similarTo', { title: similarTo.title }) 
        : (term ? t('artLibrary.search.resultsFor', { term }) : t('artLibrary.title'));

    return (
        <div className="flex items-center mb-4">
            <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={t('artLibrary.backToDiscover')}>
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold truncate">{title}</h2>
        </div>
    );
};


export const ArtLibrary: React.FC<ArtLibraryProps> = ({
  onSearch, onAnalyzeImage, onAddArtwork, onViewArtworkDetails, onShowCamera,
  artworks, isLoading, loadingMessage, searchTerm, similarTo, onFindSimilar,
  featuredArtworks
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleThematicSearch = (themeKey: string) => {
    onSearch(t(themeKey));
  };
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyzeImage(e.target.files[0]);
    }
  };

  const showResultsHeader = searchTerm || similarTo;

  const renderDiscoverHome = () => (
    <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 dark:text-gray-400 p-4">
        <SparklesIcon className="w-16 h-16 text-amber-500 dark:text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('artLibrary.title')}</h2>
        <p className="max-w-xl mb-8">
            {t('welcome.subtitle')}
        </p>
        <div className="w-full max-w-4xl">
            {Object.entries(themeCategories).map(([categoryKey, themeKeys]) => (
                <div key={categoryKey} className="mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-3">{t(categoryKey)}</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {themeKeys.map(themeKey => {
                            const fullThemeKey = `welcome.theme.${themeKey}`;
                            return (
                                <button 
                                    key={themeKey}
                                    onClick={() => handleThematicSearch(fullThemeKey)}
                                    className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-all transform hover:scale-105"
                                >
                                    {t(fullThemeKey)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                {t('artLibrary.upload.button')}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <Button variant="secondary" onClick={onShowCamera}>
                <CameraIcon className="w-5 h-5 mr-2" />
                {t('artLibrary.camera.button')}
            </Button>
        </div>
        {featuredArtworks.length > 0 && (
            <div className="w-full max-w-6xl mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Featured Artworks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {featuredArtworks.map(art => (
                        <ArtworkItem
                            key={art.id}
                            artwork={art}
                            onAdd={onAddArtwork}
                            onViewDetails={onViewArtworkDetails}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderResults = () => (
    artworks.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {artworks.map(art => (
          <ArtworkItem
            key={art.id}
            artwork={art}
            onAdd={onAddArtwork}
            onViewDetails={onViewArtworkDetails}
          />
        ))}
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center text-center text-gray-500 h-full p-8">
        <SparklesIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {t('artLibrary.search.noResults')}
        </h3>
        <p className="max-w-md">
            {t('artLibrary.search.noResults.prompt')}
        </p>
      </div>
    )
  );

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/20 rounded-lg p-4 md:p-6">
      <div className="flex-shrink-0">
        {!showResultsHeader ? (
           <form onSubmit={handleSearch} className="mb-6 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('artLibrary.search.placeholder')}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon className="w-6 h-6 text-gray-400" />
            </div>
          </form>
        ) : (
            <SearchResultHeader term={searchTerm} similarTo={similarTo} onBack={() => onSearch('')} />
        )}
      </div>
     
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <LoadingOverlay message={loadingMessage} />
        ) : showResultsHeader ? (
          renderResults()
        ) : (
          renderDiscoverHome()
        )}
      </div>
    </div>
  );
};