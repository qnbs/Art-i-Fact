
import React, { useState, useRef, ChangeEvent, useCallback } from 'react';
import type { Artwork } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useAI } from '../contexts/AIStatusContext';
import { SearchIcon, SparklesIcon, ArrowLeftIcon, ArrowUpTrayIcon, CameraIcon } from './IconComponents';
import { ArtworkItem } from './ArtworkItem';
import { Button } from './ui/Button';
import { ArtworkItemSkeleton } from './ui/ArtworkItemSkeleton';
import { PageHeader } from './ui/PageHeader';
import { RetryPrompt } from './ui/RetryPrompt';

interface ArtLibraryProps {
  onSearch: (term: string) => void;
  onAnalyzeImage: (file: File) => void;
  onViewArtworkDetails: (artwork: Artwork) => void;
  onShowCamera: () => void;
  artworks: Artwork[];
  isLoading: boolean;
  searchTerm: string;
  similarTo: Artwork | null;
  featuredArtworks: Artwork[];
}

const themeSuggestions = {
    'welcome.category.eras': [
        { labelKey: 'welcome.theme.renaissance_portraits', query: 'Renaissance-Porträts' },
        { labelKey: 'welcome.theme.baroque_chiaroscuro', query: 'Barockes Chiaroscuro' },
        { labelKey: 'welcome.theme.dutch_golden_age', query: 'Goldenes Zeitalter der Niederlande' },
        { labelKey: 'welcome.theme.romanticism_landscapes', query: 'Romantische Landschaften' },
        { labelKey: 'welcome.theme.impressionist_light', query: 'Impressionistisches Licht' },
        { labelKey: 'welcome.theme.post_impressionism_emotion', query: 'Post-Impressionistische Emotion' },
        { labelKey: 'welcome.theme.cubist_perspectives', query: 'Kubistische Perspektiven' },
        { labelKey: 'welcome.theme.surreal_dreams', query: 'Surreale Träume' },
        { labelKey: 'welcome.theme.abstract_expressionism', query: 'Abstrakter Expressionismus' },
        { labelKey: 'welcome.theme.pop_art_critique', query: 'Pop-Art-Kritik' },
    ],
    'welcome.category.techniques': [
        { labelKey: 'welcome.theme.impasto_texture', query: 'Impasto-Textur' },
        { labelKey: 'welcome.theme.sfumato_haze', query: 'Sfumato-Dunst' },
        { labelKey: 'welcome.theme.tenebrism_drama', query: 'Tenebrismus-Drama' },
        { labelKey: 'welcome.theme.pointillism_dots', query: 'Pointillismus-Punkte' },
        { labelKey: 'welcome.theme.fresco_murals', query: 'Fresken-Wandmalereien' },
    ],
    'welcome.category.subjects': [
        { labelKey: 'welcome.theme.mythological_heroes', query: 'Mythologische Helden' },
        { labelKey: 'welcome.theme.biblical_scenes', query: 'Biblische Szenen' },
        { labelKey: 'welcome.theme.historical_events', query: 'Historische Ereignisse' },
        { labelKey: 'welcome.theme.vanitas_mortality', query: 'Vanitas & Vergänglichkeit' },
        { labelKey: 'welcome.theme.unconventional_portraits', query: 'Unkonventionelle Porträts' },
        { labelKey: 'welcome.theme.dramatic_seascapes', query: 'Dramatische Seestücke' },
        { labelKey: 'welcome.theme.tranquil_gardens', query: 'Stille Gärten' },
        { labelKey: 'welcome.theme.urban_alienation', query: 'Urbane Entfremdung' },
    ],
    'welcome.category.concepts': [
        { labelKey: 'welcome.theme.order_and_chaos', query: 'Ordnung & Chaos' },
        { labelKey: 'welcome.theme.love_and_loss', query: 'Liebe & Verlust' },
        { labelKey: 'welcome.theme.power_and_conflict', query: 'Macht & Konflikt' },
        { labelKey: 'welcome.theme.joy_and_celebration', query: 'Freude & Feier' },
        { labelKey: 'welcome.theme.melancholy_and_solitude', query: 'Melancholie & Einsamkeit' },
        { labelKey: 'welcome.theme.geometric_abstraction', query: 'Geometrische Abstraktion' },
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
  onSearch, onAnalyzeImage, onViewArtworkDetails, onShowCamera,
  artworks, isLoading, searchTerm, similarTo,
  featuredArtworks,
}) => {
  const { t } = useTranslation();
  const { appSettings } = useAppSettings();
  const { aiError } = useAI();
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  }, [inputValue, onSearch]);

  const handleThematicSearch = useCallback((query: string) => {
    onSearch(query);
  }, [onSearch]);
  
  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyzeImage(e.target.files[0]);
    }
  }, [onAnalyzeImage]);

  const showResultsHeader = searchTerm || similarTo;

  const renderDiscoverHome = () => (
    <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 dark:text-gray-400 p-4">
        <SparklesIcon className="w-16 h-16 text-amber-500 dark:text-amber-400 mb-4" />
        <p className="max-w-xl mb-8" dangerouslySetInnerHTML={{ __html: t('welcome.subtitle') }} />
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
        
        {featuredArtworks.length > 0 && (
            <div className="w-full max-w-6xl mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Featured Artworks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {featuredArtworks.map(art => (
                        <ArtworkItem
                            key={art.id}
                            artwork={art}
                            onViewDetails={onViewArtworkDetails}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderResults = () => {
    if (aiError) {
        return <RetryPrompt message={aiError.message} onRetry={aiError.onRetry} />;
    }
    
    return artworks.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {artworks.map(art => (
          <ArtworkItem
            key={art.id}
            artwork={art}
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
  };
  
  const renderLoading = () => (
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: appSettings.aiResultsCount }).map((_, i) => <ArtworkItemSkeleton key={i} />)}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {!showResultsHeader && (
        <PageHeader title={t('artLibrary.title')} icon={<SearchIcon className="w-8 h-8" />}>
           <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <ArrowUpTrayIcon className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">{t('artLibrary.upload.button')}</span>
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <Button variant="secondary" onClick={onShowCamera}>
                <CameraIcon className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">{t('artLibrary.camera.button')}</span>
            </Button>
        </PageHeader>
      )}
      
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
