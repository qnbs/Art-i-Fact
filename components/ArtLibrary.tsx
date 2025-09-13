import React, { useState, useRef, ChangeEvent } from 'react';
import type { Artwork, AppSettings } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { SearchIcon, SparklesIcon, ArrowLeftIcon, ArrowUpTrayIcon, CameraIcon } from './IconComponents';
import { ArtworkItem } from './ArtworkItem';
import { Button } from './ui/Button';
import { ArtworkItemSkeleton } from './ui/ArtworkItemSkeleton';

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
  appSettings: AppSettings;
}

const themeSuggestions = {
    'welcome.category.eras': [
        { labelKey: 'welcome.theme.renaissance_portraits', query: 'High Renaissance portraits by Leonardo da Vinci, Raphael, Titian' },
        { labelKey: 'welcome.theme.baroque_chiaroscuro', query: 'Baroque painting chiaroscuro Caravaggio Gentileschi' },
        { labelKey: 'welcome.theme.dutch_golden_age', query: 'Dutch Golden Age painting Vermeer Rembrandt' },
        { labelKey: 'welcome.theme.romanticism_landscapes', query: 'Romanticism landscape painting Caspar David Friedrich, J. M. W. Turner' },
        { labelKey: 'welcome.theme.impressionist_light', query: 'Impressionist paintings light Monet, Renoir, Degas' },
        { labelKey: 'welcome.theme.post_impressionism_emotion', query: 'Post-Impressionism paintings emotion Van Gogh, Cézanne, Gauguin' },
        { labelKey: 'welcome.theme.cubist_perspectives', query: 'Cubism paintings Picasso, Braque' },
        { labelKey: 'welcome.theme.surreal_dreams', query: 'Surrealist paintings dreams Dalí, Magritte, Ernst' },
        { labelKey: 'welcome.theme.abstract_expressionism', query: 'Abstract Expressionism action painting Pollock, de Kooning' },
        { labelKey: 'welcome.theme.pop_art_critique', query: 'Pop Art consumer culture Warhol, Lichtenstein' },
    ],
    'welcome.category.techniques': [
        { labelKey: 'welcome.theme.impasto_texture', query: 'Impasto oil painting thick texture Van Gogh, Rembrandt' },
        { labelKey: 'welcome.theme.sfumato_haze', query: 'Sfumato technique paintings Leonardo da Vinci' },
        { labelKey: 'welcome.theme.tenebrism_drama', query: 'Tenebrism dramatic lighting Caravaggio, Ribera' },
        { labelKey: 'welcome.theme.pointillism_dots', query: 'Pointillism paintings Seurat, Signac' },
        { labelKey: 'welcome.theme.fresco_murals', query: 'Italian Renaissance fresco murals Michelangelo, Raphael' },
    ],
    'welcome.category.subjects': [
        { labelKey: 'welcome.theme.mythological_heroes', query: 'Mythological Greek heroes paintings Rubens, Titian' },
        { labelKey: 'welcome.theme.biblical_scenes', query: 'Biblical scenes paintings Caravaggio, Rembrandt' },
        { labelKey: 'welcome.theme.historical_events', query: 'Famous historical event paintings Jacques-Louis David, Delacroix' },
        { labelKey: 'welcome.theme.vanitas_mortality', query: 'Vanitas still life paintings skull candle' },
        { labelKey: 'welcome.theme.unconventional_portraits', query: 'Unconventional portraits Francis Bacon, Lucian Freud' },
        { labelKey: 'welcome.theme.dramatic_seascapes', query: 'Dramatic stormy seascape paintings J. M. W. Turner' },
        { labelKey: 'welcome.theme.tranquil_gardens', query: 'Paintings of tranquil gardens Monet, Klimt' },
        { labelKey: 'welcome.theme.urban_alienation', query: 'Paintings of urban alienation Edward Hopper' },
    ],
    'welcome.category.concepts': [
        { labelKey: 'welcome.theme.order_and_chaos', query: 'Paintings depicting order and chaos Kandinsky, Pollock' },
        { labelKey: 'welcome.theme.love_and_loss', query: 'Paintings about love and loss Pre-Raphaelite Brotherhood' },
        { labelKey: 'welcome.theme.power_and_conflict', query: 'Paintings depicting power and conflict Goya, Picasso' },
        { labelKey: 'welcome.theme.joy_and_celebration', query: 'Paintings of joy and celebration Renoir, Matisse' },
        { labelKey: 'welcome.theme.melancholy_and_solitude', query: 'Paintings of melancholy and solitude Caspar David Friedrich, Edward Hopper' },
        { labelKey: 'welcome.theme.geometric_abstraction', query: 'Geometric abstraction paintings Mondrian, Malevich' },
    ],
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
  featuredArtworks, appSettings,
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

  const handleThematicSearch = (query: string) => {
    onSearch(query);
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
            {Object.entries(themeSuggestions).map(([categoryKey, themes]) => (
                <div key={categoryKey} className="mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-3">{t(categoryKey)}</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {themes.map(theme => {
                            return (
                                <button 
                                    key={theme.labelKey}
                                    onClick={() => handleThematicSearch(theme.query)}
                                    className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-all transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                >
                                    {t(theme.labelKey)}
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
  
  const renderLoading = () => (
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: appSettings.aiResultsCount }).map((_, i) => <ArtworkItemSkeleton key={i} />)}
    </div>
  )

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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
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
          renderLoading()
        ) : showResultsHeader ? (
          renderResults()
        ) : (
          renderDiscoverHome()
        )}
      </div>
    </div>
  );
};
