import React, { useState, useRef, useEffect } from 'react';
import type { Artwork, AppSettings } from '../types';
import { ArtworkItem } from './ArtworkItem';
import { Welcome } from './Welcome';
import { SparklesIcon, SearchIcon, CloseIcon, CameraIcon, Cog6ToothIcon, ArrowUpTrayIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { useDynamicLoadingMessage } from '../hooks/useDynamicLoadingMessage';

const SkeletonItem: React.FC = () => (
    <div className="group relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 aspect-[3/4]">
      <div className="w-full h-full animate-pulse"></div>
    </div>
);

interface DiscoverSettingsPopoverProps {
    settings: AppSettings;
    onUpdateSettings: (settings: Partial<AppSettings>) => void;
    onClose: () => void;
}

const DiscoverSettingsPopover: React.FC<DiscoverSettingsPopoverProps> = ({ settings, onUpdateSettings, onClose }) => {
    const { t } = useTranslation();
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={popoverRef} className="absolute top-full mt-2 right-0 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 p-4 animate-fade-in">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">{t('settings.discover.title')}</h4>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.discover.creativity')}</label>
                <div className="flex gap-2">
                    <button onClick={() => onUpdateSettings({ aiCreativity: 'focused' })} className={`flex-1 text-sm py-1 px-2 rounded-md transition-colors ${settings.aiCreativity === 'focused' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t('settings.discover.creativity.focused')}</button>
                    <button onClick={() => onUpdateSettings({ aiCreativity: 'exploratory' })} className={`flex-1 text-sm py-1 px-2 rounded-md transition-colors ${settings.aiCreativity === 'exploratory' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t('settings.discover.creativity.exploratory')}</button>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.discover.results')}</label>
                <div className="flex gap-2">
                    {[8, 12, 16].map(count => (
                        <button key={count} onClick={() => onUpdateSettings({ aiResultsCount: count as 8 | 12 | 16 })} className={`flex-1 text-sm py-1 px-2 rounded-md transition-colors ${settings.aiResultsCount === count ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{count}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface DiscoverProps {
  artworks: Artwork[];
  onSearch: (prompt: string | string[]) => void;
  activeAiTask: string | null;
  onAnalyzeImage: (file: File) => void;
  onOpenCamera: () => void;
  error: string | null;
  onArtworkAdd: (artwork: Artwork) => void;
  onArtworkViewDetails: (artwork: Artwork) => void;
  refinements: string[];
  styleSpotlight: { style: string; description: string } | null;
  onClearSearch: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const ArtLibrary: React.FC<DiscoverProps> = ({ 
    artworks, onSearch, activeAiTask, onAnalyzeImage, onOpenCamera, error, onArtworkAdd, 
    onArtworkViewDetails, refinements, styleSpotlight, onClearSearch, settings, onUpdateSettings 
}) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showVisionMenu, setShowVisionMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visionButtonRef = useRef<HTMLDivElement>(null);
  
  const isLoading = activeAiTask === 'discover';

  const loadingMessages = [
    t('ai.loading.1'), t('ai.loading.2'), t('ai.loading.3'), t('ai.loading.4'), t('ai.loading.5'),
    t('ai.loading.6'), t('ai.loading.7')
  ];
  const loadingMessage = useDynamicLoadingMessage(loadingMessages, 2500, isLoading);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (visionButtonRef.current && !visionButtonRef.current.contains(event.target as Node)) {
            setShowVisionMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '') {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tagsFromPaste = pastedText.split(/[,;]/).map(tag => tag.trim()).filter(Boolean);
    if (tagsFromPaste.length > 0) {
        const newUniqueTags = tagsFromPaste.filter(t => !tags.includes(t));
        setTags([...tags, ...newUniqueTags]);
        setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalTags = [...tags];
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
        finalTags.push(newTag);
    }
    
    if (finalTags.length > 0) {
      onSearch(finalTags);
      setTags(finalTags);
      setInputValue('');
    }
  };

  const handleThemeClick = (clickedTheme: string) => {
    const newTags = [clickedTheme];
    setTags(newTags);
    setInputValue('');
    onSearch(newTags);
  };

  const handleClear = () => {
    setTags([]);
    setInputValue('');
    onClearSearch();
  };

  const handleImageAnalyzeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAnalyzeImage(file);
    }
    if(event.target) event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/20 rounded-lg p-4 md:p-6 overflow-y-auto">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4 text-amber-500 dark:text-amber-400 flex items-center">
          <SearchIcon className="w-7 h-7 mr-2" />
          {t('discover.title')}
        </h2>

        <form onSubmit={handleSubmit} className="relative mb-4">
          <div className="w-full bg-gray-100 dark:bg-gray-900/70 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all focus-within:shadow-lg focus-within:shadow-amber-500/20 flex flex-wrap items-center gap-2 min-h-[70px]">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full pl-3 pr-2 py-1 text-sm font-medium animate-fade-in">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(index)} className="ml-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200" aria-label={`Remove ${tag}`}>
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onPaste={handlePaste}
                placeholder={tags.length === 0 ? t('discover.placeholder') : t('discover.placeholder.continue')}
                className="flex-grow bg-transparent focus:outline-none p-1 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
                aria-label={t('discover.searchLabel')}
              />
          </div>
          <div className="absolute right-3 top-[50%] -translate-y-1/2 flex items-center gap-1.5">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowSettings(s => !s)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
                    aria-label={t('settings.discover.title')}
                >
                    <Cog6ToothIcon className="w-5 h-5" />
                </button>
                {showSettings && <DiscoverSettingsPopover settings={settings} onUpdateSettings={onUpdateSettings} onClose={() => setShowSettings(false)} />}
            </div>
            {(tags.length > 0 || artworks.length > 0) && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
                aria-label={t('discover.clearSearch')}
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
            <div ref={visionButtonRef} className="relative">
                <button
                    type="button"
                    onClick={() => setShowVisionMenu(s => !s)}
                    disabled={isLoading}
                    className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('discover.vision.title')}
                  >
                    <CameraIcon className="w-5 h-5" />
                </button>
                {showVisionMenu && (
                    <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 p-2 animate-fade-in">
                        <button onClick={() => { handleImageAnalyzeClick(); setShowVisionMenu(false); }} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <ArrowUpTrayIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            {t('discover.vision.button')}
                        </button>
                        <button onClick={() => { onOpenCamera(); setShowVisionMenu(false); }} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <CameraIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            {t('discover.vision.live')}
                        </button>
                    </div>
                )}
            </div>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              type="submit"
              disabled={isLoading || (tags.length === 0 && !inputValue.trim())}
              className="bg-amber-600 text-white rounded-full px-4 py-2 flex items-center font-semibold hover:bg-amber-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
            >
              <SparklesIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">{t('discover.curate')}</span>
            </button>
          </div>
        </form>
      </div>
      
      {isLoading && (
        <div className="flex flex-col flex-grow items-center justify-center text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-pulse">{loadingMessage}</p>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {Array.from({ length: settings.aiResultsCount }).map((_, index) => <SkeletonItem key={index} />)}
            </div>
        </div>
      )}

      {error && <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg flex-shrink-0 mb-4">{error}</div>}

      {!isLoading && refinements.length > 0 && (
        <div className="mb-6 flex-shrink-0 animate-fade-in">
          <h3 className="text-md font-semibold text-amber-600 dark:text-amber-500 mb-2">{t('discover.refine')}</h3>
          <div className="flex flex-wrap gap-2">
            {refinements.map(theme => (
              <button 
                key={theme} 
                onClick={() => handleThemeClick(theme)}
                disabled={isLoading}
                className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-colors"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isLoading && styleSpotlight && (
          <div className="mb-6 flex-shrink-0 p-4 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 rounded-r-lg animate-fade-in">
              <h3 className="text-md font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  {t('discover.styleSpotlight')} {styleSpotlight.style}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{styleSpotlight.description}</p>
              <button
                  onClick={() => handleThemeClick(styleSpotlight.style)}
                  disabled={isLoading}
                  className="bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
              >
                  {t('discover.exploreStyle', { style: styleSpotlight.style })}
              </button>
          </div>
      )}

      {!isLoading && artworks.length === 0 && !error && (
        <Welcome onThemeSelect={handleThemeClick} />
      )}

      {!isLoading && artworks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4 flex-grow overflow-y-auto">
            {artworks.map(art => (
            <ArtworkItem 
                key={art.id} 
                artwork={art} 
                onAdd={onArtworkAdd}
                onViewDetails={onArtworkViewDetails}
            />
            ))}
        </div>
      )}
    </div>
  );
};