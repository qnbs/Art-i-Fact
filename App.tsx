import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ArtLibrary } from './components/ArtLibrary';
import { Studio } from './components/Studio';
import { GalleryCreator } from './components/GalleryCreator';
import { GalleryManager } from './components/GalleryManager';
import { Journal } from './components/Journal';
import { Workspace } from './components/Workspace';
import { BottomNavBar } from './components/BottomNavBar';
import { Setup } from './components/Setup';
import { Header } from './components/Header';
import { ExhibitionMode } from './components/ExhibitionMode';
import { Help } from './components/Help';
import { CameraAnalysisModal } from './components/CameraAnalysisModal';
import { ChatModal } from './components/ChatModal';
import { Toast } from './components/ui/Toast';
import { ArtworkDetails } from './components/ArtworkDetails';
import { CritiqueModalContent } from './components/CritiqueModalContent';
import { WelcomePortal } from './components/WelcomePortal';
import { AddToGalleryModal } from './components/AddToGalleryModal';
import { Glossary } from './components/Glossary';
import { ProfileView } from './components/ProfileView';
import { CommandPalette, Command } from './components/CommandPalette';
import { Button } from './components/ui/Button';
import { SpinnerIcon } from './components/IconComponents';
import { useDynamicLoadingMessage } from './hooks/useDynamicLoadingMessage';
import { 
    generateArtworksForTheme, 
    findSimilarArtworks, 
    suggestGalleryAdditions, 
    generateThemeRefinements,
    detectDominantStyle,
    generateStyleDescription,
    identifyArtworkInLibrary,
    generateGalleryIntroStream,
    generateAudioGuide,
    generateGalleryCritique,
    suggestGalleryTitle,
    suggestGalleryDescription,
    generateImageFromPrompt,
    remixImage,
    enhanceImagePrompt,
    suggestGalleryOrder,
    processJournalText,
    researchTopic,
    generateGalleryVideo,
    checkVideoOperationStatus,
} from './services/geminiService';
import { realArtworks } from './data/realArtworks';
import type { Artwork, Gallery, AppSettings, UserData, Project, Profile, ResearchResult } from './types';
import { useGallery } from './hooks/useGallery';
import { useTheme } from './hooks/useTheme';
import { useProfile } from './hooks/useProfile';
import { useJournal } from './hooks/useJournal';
import { useProjects } from './hooks/useProjects';
import { useAppSettings } from './hooks/useAppSettings';
import { useTranslation } from './contexts/TranslationContext';
import { useModal } from './contexts/ModalContext';
import { WELCOME_PORTAL_SEEN_KEY } from './constants';


const App: React.FC = () => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useModal();
  const [libraryArtworks, setLibraryArtworks] = useState<Artwork[]>([]);
  const { galleries, activeGallery, setActiveGalleryId, createNewGallery, deleteGallery, updateActiveGallery, addArtworkToGallery, removeArtworkFromActiveGallery, reorderArtworksInActiveGallery, addCommentToArtwork, clearAllGalleries, importGalleries } = useGallery();
  const { profile, updateProfile, setProfile } = useProfile();
  const { journal, addEntry, updateEntry, deleteEntry, setJournal } = useJournal();
  const { projects, createProject, deleteProject, clearAllProjects, setProjects } = useProjects();
  const { appSettings, updateAppSettings, setAppSettings } = useAppSettings();
  const [theme, toggleTheme] = useTheme();
  
  const [error, setError] = useState<string | null>(null);
  const [activeAiTask, setActiveAiTask] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile'>('workspace');
  const [helpSubView, setHelpSubView] = useState<'main' | 'glossary'>('main');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeJournalEntryId, setActiveJournalEntryId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<Artwork[]>([]);
  const [refinements, setRefinements] = useState<string[]>([]);
  const [styleSpotlight, setStyleSpotlight] = useState<{ style: string; description: string } | null>(null);
  
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [publicExhibitionData, setPublicExhibitionData] = useState<Gallery | null>(null);
  
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [chatArtwork, setChatArtwork] = useState<Artwork | null>(null);
  const [artworkToAdd, setArtworkToAdd] = useState<Artwork | null>(null);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [videoGenerationState, setVideoGenerationState] = useState<{ operation: any; galleryId: string } | null>(null);

  const importFileRef = useRef<HTMLInputElement>(null);
  const urlChecked = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const [hasSeenWelcomePortal, setHasSeenWelcomePortal] = useState(() => {
    try {
      return localStorage.getItem(WELCOME_PORTAL_SEEN_KEY) === 'true';
    } catch {
      return false;
    }
  });
  
  const [isGalleryEditing, setIsGalleryEditing] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const galleriesInProject = galleries.filter(g => g.projectId === activeProjectId);
  const journalInProject = journal.filter(j => j.projectId === activeProjectId);
  
  // Calculate user stats
  const galleriesCurated = galleries.length;
  const allArtworks = galleries.flatMap(g => g.artworks);
  const artworksDiscovered = new Set(allArtworks.filter(a => !a.isGenerated).map(a => a.id)).size;
  const aiArtworksCreated = new Set(allArtworks.filter(a => a.isGenerated).map(a => a.id)).size;


  const handleEnterApp = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_PORTAL_SEEN_KEY, 'true');
    } catch (e) {
      console.warn("Could not save welcome portal status:", e);
    }
    setHasSeenWelcomePortal(true);
  }, []);

  useEffect(() => {
    if (urlChecked.current) return;
    urlChecked.current = true;
    
    const params = new URLSearchParams(window.location.search);
    const viewData = params.get('view');
    const galleryData = params.get('gallery');

    let handled = false;

    if (viewData) {
        try {
            const decodedData = atob(viewData);
            const sharedGallery: Gallery = JSON.parse(decodedData);
            setPublicExhibitionData(sharedGallery);
            handled = true;
        } catch (e) {
            console.error("Failed to parse view link data:", e);
        }
    } else if (galleryData) {
        try {
            const decodedData = atob(galleryData);
            const sharedGallery: Gallery = JSON.parse(decodedData);
            const newId = createNewGallery(sharedGallery);
            setActiveGalleryId(newId);
            if (sharedGallery.curatorProfile) {
              updateProfile(sharedGallery.curatorProfile);
            }
            setActiveView('gallery');
            showToast(t('toast.gallery.sharedLoaded'));
            handled = true;
        } catch (e) {
            console.error("Failed to parse shared gallery data:", e);
        }
    }

    if (handled) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [t, createNewGallery, setActiveGalleryId, updateProfile, showToast]);

  useEffect(() => {
    const mainEl = mainRef.current;
    const headerEl = document.querySelector('header');
    if (!mainEl || !headerEl) return;

    const handleScroll = () => {
        if (mainEl.scrollTop > 10) {
            headerEl.classList.add('shadow-md', 'dark:shadow-black/20', 'transition-shadow');
        } else {
            headerEl.classList.remove('shadow-md', 'dark:shadow-black/20');
        }
    };
    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const videoLoadingMessages = [
    t('ai.loading.video.1'), t('ai.loading.video.2'), t('ai.loading.video.3'), t('ai.loading.video.4'), t('ai.loading.video.5'),
  ];
  const videoLoadingMessage = useDynamicLoadingMessage(videoLoadingMessages, 4000, !!videoGenerationState);

  useEffect(() => {
    if (!videoGenerationState) return;

    const poll = async () => {
        try {
            const updatedOperation = await checkVideoOperationStatus(videoGenerationState.operation);
            if (updatedOperation.done) {
                const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    const videoUrl = URL.createObjectURL(blob);
                    
                    updateActiveGallery(g => g.id === videoGenerationState.galleryId ? { ...g, trailerVideoUrl: videoUrl } : g);
                    
                    hideModal(); // Hide loading modal
                    showModal(t('gallery.video.modal.success.title'), (
                        <div className="text-center">
                            <p className="mb-4">{t('gallery.video.modal.success.prompt')}</p>
                            <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg" />
                        </div>
                    ));
                }
                setVideoGenerationState(null);
            } else {
                setVideoGenerationState(prev => prev ? { ...prev, operation: updatedOperation } : null);
                setTimeout(poll, 10000); // Poll every 10 seconds
            }
        } catch(e) {
            console.error(e);
            showToast(t('toast.gallery.videoError'));
            setVideoGenerationState(null);
            hideModal();
        }
    };

    const timeoutId = setTimeout(poll, 1000);

    return () => clearTimeout(timeoutId);
  }, [videoGenerationState, t, showToast, hideModal, showModal, updateActiveGallery]);

  
  const executeAISearch = useCallback(async (searchFn: () => Promise<Artwork[]>, promptOrThemes: (string[] | string) = []) => {
    setActiveAiTask('discover');
    setError(null);
    setActiveView('discover');
    setRefinements([]);
    setLibraryArtworks([]);
    setStyleSpotlight(null);
    try {
      const results = await searchFn();
      setLibraryArtworks(results);

      if (results.length > 0) {
        const hasContent = Array.isArray(promptOrThemes) ? promptOrThemes.length > 0 : !!promptOrThemes.trim();
        
        const [refinementSuggestions, dominantStyle] = await Promise.all([
            hasContent ? generateThemeRefinements(promptOrThemes, results) : Promise.resolve([]),
            detectDominantStyle(results)
        ]);

        setRefinements(refinementSuggestions);

        if (dominantStyle) {
            const description = await generateStyleDescription(dominantStyle);
            setStyleSpotlight({ style: dominantStyle, description });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLibraryArtworks([]);
    } finally {
      setActiveAiTask(null);
    }
  }, [appSettings]);
  
  const handleImageAnalysis = useCallback(async (file: File) => {
    setActiveAiTask('discover');
    setError(null);
    setActiveView('discover');
    setRefinements([]);
    setLibraryArtworks([]);
    setStyleSpotlight(null);

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                if (!reader.result) throw new Error("File could not be read.");
                
                const base64String = (reader.result as string).split(',')[1];
                const identifiedArtwork = await identifyArtworkInLibrary(base64String, file.type);
                
                if (identifiedArtwork) {
                    showToast(t('toast.vision.analyzed', { title: identifiedArtwork.title, artist: identifiedArtwork.artist }));
                    await executeAISearch(() => findSimilarArtworks(identifiedArtwork), identifiedArtwork.title);
                } else {
                     setError("Could not identify this artwork in our curated library.");
                     setActiveAiTask(null);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to analyze image.');
                setActiveAiTask(null); 
            }
        };
        reader.onerror = () => {
            setError('Failed to read image file.');
            setActiveAiTask(null);
        };
        // FIX: Corrected typo from readDataURL to readAsDataURL
        reader.readAsDataURL(file);
    } catch (err: any) {
        setError(err.message || 'Failed to process image file.');
        setActiveAiTask(null);
    }
  }, [executeAISearch, t, showToast]);


  const handleThematicSearch = useCallback((prompt: string[] | string) => {
      if ((Array.isArray(prompt) && prompt.length === 0) || (typeof prompt === 'string' && !prompt.trim())) return;
      executeAISearch(() => generateArtworksForTheme(prompt, appSettings), prompt);
  }, [executeAISearch, appSettings]);

  const handleFindSimilar = useCallback((artwork: Artwork) => {
    executeAISearch(() => findSimilarArtworks(artwork), artwork.title);
  }, [executeAISearch]);

  const handleClearSearch = useCallback(() => {
    setLibraryArtworks([]);
    setRefinements([]);
    setStyleSpotlight(null);
    setError(null);
  }, []);

  const handleInitiateAddToGallery = useCallback((artwork: Artwork) => {
      if (galleries.length === 1 && activeGallery?.id === galleries[0].id) {
          if (addArtworkToGallery(artwork, galleries[0].id)) {
              showToast(t('toast.gallery.added', { title: artwork.title }));
          } else {
              showToast(t('toast.gallery.alreadyExists'));
          }
      } else {
          setArtworkToAdd(artwork);
      }
  }, [galleries, activeGallery, addArtworkToGallery, t, showToast]);

  const handleSelectGalleryForAdd = useCallback((galleryId: string) => {
    if (artworkToAdd) {
        const gallery = galleries.find(g => g.id === galleryId);
        if (addArtworkToGallery(artworkToAdd, galleryId)) {
            showToast(t('toast.gallery.addedTo', { title: artworkToAdd.title, gallery: gallery?.title || '' }));
        } else {
            showToast(t('toast.gallery.alreadyExists'));
        }
    }
    setArtworkToAdd(null);
  }, [artworkToAdd, galleries, addArtworkToGallery, t, showToast]);

  const handleCreateAndAdd = useCallback(() => {
      if (artworkToAdd) {
          const newId = createNewGallery({ artworks: [artworkToAdd] }, activeProjectId || undefined);
          setActiveGalleryId(newId);
          showToast(t('toast.gallery.createdAndAdded', { title: artworkToAdd.title }));
          setActiveView('gallery');
      }
      setArtworkToAdd(null);
  }, [artworkToAdd, createNewGallery, activeProjectId, t, setActiveGalleryId, showToast]);
    
  const handleRemoveFromGallery = useCallback((artworkId: string) => {
      removeArtworkFromActiveGallery(artworkId);
      hideModal();
  }, [removeArtworkFromActiveGallery, hideModal]);

  const handleShare = useCallback(() => {
    if (!activeGallery || !activeGallery.title.trim() || activeGallery.artworks.length === 0) {
        showModal(
            t('modal.share.error.title'),
            <p className="text-amber-600 dark:text-yellow-300">{t('modal.share.error.description')}</p>
        );
        return;
    }

    const galleryWithProfile = { ...activeGallery, curatorProfile: profile };
    const galleryData = JSON.stringify(galleryWithProfile);
    const encodedData = btoa(galleryData);
    const dataUrl = `${window.location.origin}${window.location.pathname}?gallery=${encodedData}`;
    const exhibitUrl = `${window.location.origin}${window.location.pathname}?view=${encodedData}`;

    const ShareInput: React.FC<{ url: string }> = ({ url }) => (
      <div className="flex items-center gap-2">
          <input 
            type="text" 
            readOnly 
            value={url} 
            onFocus={(e) => e.target.select()}
            className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
          />
           <Button 
                onClick={() => {
                    navigator.clipboard.writeText(url);
                    showToast(t('toast.linkCopied'));
                }} 
                size="sm"
            >
                {t('modal.share.copyLink')}
            </Button>
      </div>
    );

    showModal(
      t('modal.share.title'),
      (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">{t('modal.share.exhibitLink.title')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('modal.share.exhibitLink.desc')}</p>
            <ShareInput url={exhibitUrl} />
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">{t('modal.share.dataLink.title')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('modal.share.dataLink.desc')}</p>
            <ShareInput url={dataUrl} />
          </div>
        </div>
      )
    );
  }, [activeGallery, profile, t, showModal, showToast]);
  
  const handleViewDetails = useCallback((artwork: Artwork) => {
    showModal(
      artwork.title,
      <ArtworkDetails
        artwork={artwork}
        activeGallery={activeGallery}
        onFindSimilar={handleFindSimilar}
        onInitiateAddToGallery={handleInitiateAddToGallery}
        onRemoveFromGallery={handleRemoveFromGallery}
        onAddComment={addCommentToArtwork}
        onThematicSearch={handleThematicSearch}
        onStartChat={setChatArtwork}
        onClose={hideModal}
        showToast={showToast}
      />
    );
  }, [showModal, hideModal, activeGallery, handleFindSimilar, handleInitiateAddToGallery, handleRemoveFromGallery, addCommentToArtwork, handleThematicSearch, showToast]);
  
  const handleGenerateSuggestions = useCallback(async () => {
      if (!activeGallery || !activeGallery.title.trim()) {
        showToast(t('toast.gallery.titleRequired'));
        return;
      }
      setActiveAiTask('suggestions');
      setSuggestions([]);
      try {
        const results = await suggestGalleryAdditions(activeGallery);
        setSuggestions(results);
      } catch (err: any) {
        showToast(t('gallery.suggestions.error'));
      } finally {
        setActiveAiTask(null);
      }
  }, [activeGallery, t, showToast]);

  const handleGenerateIntro = useCallback(async () => {
    if (!activeGallery || !activeGallery.title.trim() || activeGallery.artworks.length === 0) {
        showToast(t('toast.gallery.titleRequired'));
        return;
    }
    setActiveAiTask('intro');
    updateActiveGallery(g => ({ ...g, curatorIntro: '' }));
    try {
        const stream = generateGalleryIntroStream(activeGallery);
        let fullText = '';
        for await (const chunk of stream) {
            fullText += chunk;
            updateActiveGallery(g => ({ ...g, curatorIntro: fullText }));
        }
    } catch (err: any) {
        showToast(t('toast.gallery.introError'));
        updateActiveGallery(g => ({ ...g, curatorIntro: '' }));
    } finally {
        setActiveAiTask(null);
    }
  }, [activeGallery, updateActiveGallery, t, showToast]);

  const handleGenerateAudioGuide = useCallback(async () => {
    if (!activeGallery || !activeGallery.title.trim() || activeGallery.artworks.length < 3) {
        showToast(activeGallery.artworks.length < 3 ? t('gallery.audioGuide.needsArt') : t('toast.gallery.titleRequired'));
        return;
    }
    setActiveAiTask('audioGuide');
    try {
        const audioGuide = await generateAudioGuide(activeGallery);
        updateActiveGallery(g => ({ ...g, audioGuide }));
        showToast(t('toast.gallery.audioGuideSuccess'));
    } catch (err: any) {
        showToast(t('toast.gallery.audioGuideError'));
    } finally {
        setActiveAiTask(null);
    }
}, [activeGallery, updateActiveGallery, t, showToast]);

  const handleGenerateCritique = useCallback(async () => {
    if (!activeGallery || !activeGallery.title.trim() || activeGallery.artworks.length < 3) {
        showToast(activeGallery.artworks.length < 3 ? t('gallery.audioGuide.needsArt') : t('toast.gallery.titleRequired'));
        return;
    }
    setActiveAiTask('critique');
    try {
        const critiqueResult = await generateGalleryCritique(activeGallery);
        showModal(t('gallery.critique.modal.title'), <CritiqueModalContent critiqueResult={critiqueResult} />);
    } catch (err: any) {
        showToast(t('toast.gallery.critiqueError'));
    } finally {
        setActiveAiTask(null);
    }
  }, [activeGallery, showModal, t, showToast]);
  
  const handleSuggestTitle = useCallback(async () => {
      if (!activeGallery || activeGallery.artworks.length === 0) return;
      setActiveAiTask('title');
      try {
          const title = await suggestGalleryTitle(activeGallery);
          updateActiveGallery(g => ({...g, title}));
      } catch (err) {
          showToast(t('toast.gallery.suggestError'));
      } finally {
          setActiveAiTask(null);
      }
  }, [activeGallery, updateActiveGallery, t, showToast]);

  const handleSuggestDescription = useCallback(async () => {
      if (!activeGallery || activeGallery.artworks.length === 0) return;
      setActiveAiTask('description');
      try {
          const description = await suggestGalleryDescription(activeGallery);
          updateActiveGallery(g => ({...g, description}));
      } catch (err) {
          showToast(t('toast.gallery.suggestError'));
      } finally {
          setActiveAiTask(null);
      }
  }, [activeGallery, updateActiveGallery, t, showToast]);

  const handleAddSuggestion = useCallback((artwork: Artwork) => {
    handleInitiateAddToGallery(artwork);
    setSuggestions(prev => prev.filter(s => s.id !== artwork.id));
  }, [handleInitiateAddToGallery]);
  
  const handleRemixImage = useCallback(async (base64Image: string, prompt: string): Promise<string> => {
    try {
        const result = await remixImage(base64Image, 'image/jpeg', prompt);
        showToast(t('toast.studio.remixSuccess'));
        return result;
    } catch(e: any) {
        showToast(e.message || t('toast.studio.generateError'));
        throw e;
    }
  }, [t, showToast]);

  const handleEnhancePrompt = useCallback(async (prompt: string): Promise<string> => {
    try {
        const result = await enhanceImagePrompt(prompt);
        return result;
    } catch (e: any) {
        showToast(e.message || t('toast.studio.generateError'));
        throw e;
    }
  }, [t, showToast]);

  const handleClearCache = useCallback(() => {
    showModal(
        t('settings.clearCache.modal.title'),
        (
            <div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('settings.clearCache.modal.prompt')}</p>
                <div className="flex justify-end gap-4">
                    <Button variant="secondary" onClick={hideModal}>{t('settings.clearCache.modal.cancel')}</Button>
                    <Button variant="danger" onClick={() => {
                        clearAllProjects();
                        clearAllGalleries();
                        hideModal();
                        showToast(t('toast.gallery.cleared'));
                        setActiveView('workspace');
                    }}>{t('settings.clearCache.modal.confirm')}</Button>
                </div>
            </div>
        )
    );
  }, [clearAllGalleries, clearAllProjects, t, showModal, hideModal, showToast]);

    const handleExportAllData = useCallback(() => {
        try {
            const userData: UserData = {
                projects: projects,
                galleries: galleries,
                profile: profile,
                settings: appSettings,
                journal: journal,
            };
            const dataStr = JSON.stringify(userData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `art-i-fact_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(t('toast.data.exportSuccess'));
        } catch (error) {
            console.error("Failed to export all data:", error);
            showToast(t('toast.data.exportError'));
        }
    }, [projects, galleries, profile, appSettings, journal, t, showToast]);
    
    const handleImportAllData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read");
                const importedData: UserData = JSON.parse(text);

                if (!importedData || !Array.isArray(importedData.galleries) || !importedData.profile || !importedData.settings) {
                    throw new Error("Invalid backup file format");
                }

                showModal(t('settings.data.import.modal.title'), (
                    <div>
                        <p className="mb-4">{t('settings.data.import.modal.prompt')}</p>
                        <div className="flex justify-end gap-4">
                             <Button onClick={() => {
                                setProjects(prev => [...prev, ...(importedData.projects || [])]);
                                importGalleries(importedData.galleries, 'merge');
                                setProfile(importedData.profile);
                                setAppSettings(importedData.settings);
                                setJournal(prev => [...prev, ...(importedData.journal || [])]);
                                hideModal();
                                showToast(t('toast.data.importSuccess'));
                            }}>{t('settings.data.import.modal.merge')}</Button>
                            <Button variant="danger" onClick={() => {
                                setProjects(importedData.projects || []);
                                importGalleries(importedData.galleries, 'replace');
                                setProfile(importedData.profile);
                                setAppSettings(importedData.settings);
                                setJournal(importedData.journal || []);
                                hideModal();
                                showToast(t('toast.data.importSuccess'));
                            }}>{t('settings.data.import.modal.replace')}</Button>
                        </div>
                    </div>
                ));
            } catch (error) {
                console.error("Failed to import data:", error);
                showToast(t('toast.data.importError'));
            }
        };
        reader.readAsText(file);
        if(event.target) event.target.value = '';
    }, [importGalleries, setProfile, setAppSettings, setJournal, setProjects, showModal, hideModal, t, showToast]);


  const handleCloseToast = useCallback(() => {
    setToastMessage(null);
  }, []);
  
  const handleNewProject = useCallback(() => {
    let title = '';
    let description = '';
    showModal(t('project.new.modal.title'), 
      <div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{t('project.new.modal.description')}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('project.title.label')}</label>
            <input type="text" placeholder={t('project.title.placeholder')} onChange={(e) => title = e.target.value} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('project.description.label')}</label>
            <textarea placeholder={t('project.description.placeholder')} onChange={(e) => description = e.target.value} rows={3} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
          <Button onClick={() => {
            if (title.trim()) {
              const newId = createProject(title, description);
              setActiveProjectId(newId);
              setActiveView('gallery');
              hideModal();
              showToast(t('toast.project.created', { title }));
            }
          }}>{t('create')}</Button>
        </div>
      </div>
    );
  }, [t, showModal, hideModal, createProject, showToast]);
  
  const handleDeleteProject = useCallback((id: string) => {
      const projectToDelete = projects.find(p => p.id === id);
      if (!projectToDelete) return;
      showModal(t('project.delete.confirm.title'), <div>
          <p>{t('project.delete.confirm.message', { title: projectToDelete.title })}</p>
          <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
              <Button variant="danger" onClick={() => {
                  deleteProject(id);
                  if (activeProjectId === id) {
                      setActiveProjectId(null);
                      setActiveGalleryId(null);
                      setActiveView('workspace');
                  }
                  hideModal();
                  showToast(t('toast.project.deleted'));
              }}>{t('remove')}</Button>
          </div>
      </div>);
  }, [projects, activeProjectId, t, showModal, hideModal, deleteProject, setActiveGalleryId, showToast]);

  const handleDeleteEntry = useCallback((id: string) => {
    showModal(
        t('journal.delete.confirm.title'),
        <div>
            <p>{t('journal.delete.confirm.message')}</p>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                <Button variant="danger" onClick={() => {
                    deleteEntry(id);
                    hideModal();
                }}>{t('remove')}</Button>
            </div>
        </div>
    );
  }, [deleteEntry, t, showModal, hideModal]);

  const handleDeleteGallery = useCallback((id: string) => {
    const galleryToDelete = galleries.find(g => g.id === id);
    if (!galleryToDelete) return;
    showModal(t('gallery.manager.delete.confirm.title'), <div>
        <p>{t('gallery.manager.delete.confirm.message', { title: galleryToDelete.title || t('gallery.new') })}</p>
        <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
            <Button variant="danger" onClick={() => {
                deleteGallery(id);
                hideModal();
            }}>{t('remove')}</Button>
        </div>
    </div>);
  }, [galleries, t, showModal, hideModal, deleteGallery]);

  const handleSelectProject = useCallback((id: string) => {
      setActiveProjectId(id);
      setActiveView('gallery');
  }, []);

  const handleSmartReorder = useCallback(async () => {
    if (!activeGallery || activeGallery.artworks.length < 3) {
      showToast(t('gallery.audioGuide.needsArt'));
      return;
    }
    setActiveAiTask('reorder');
    try {
      const { reasoning, orderedIds } = await suggestGalleryOrder(activeGallery);
      const reorderedArtworks = orderedIds.map(id => activeGallery.artworks.find(art => art.id === id)).filter(Boolean) as Artwork[];
      
      showModal(t('gallery.reorder.modal.title'), (
          <div>
              <p className="mb-2 font-semibold">{t('gallery.reorder.modal.reason')}</p>
              <p className="mb-4 text-gray-600 dark:text-gray-400 italic">"{reasoning}"</p>
              <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                  <Button onClick={() => {
                      reorderArtworksInActiveGallery(reorderedArtworks);
                      hideModal();
                  }}>{t('gallery.reorder.modal.confirm')}</Button>
              </div>
          </div>
      ));
    } catch (e: any) {
        showToast(t('toast.gallery.reorderError'));
    } finally {
        setActiveAiTask(null);
    }
  }, [activeGallery, t, showModal, hideModal, reorderArtworksInActiveGallery, showToast]);
  
  const handleProcessJournalText = useCallback(async (text: string, action: 'expand' | 'summarize' | 'improve'): Promise<string> => {
      setActiveAiTask('journal');
      try {
          const result = await processJournalText(text, action);
          return result;
      } catch (e: any) {
          showToast(t('toast.journal.processError'));
          throw e;
      } finally {
          setActiveAiTask(null);
      }
  }, [t, showToast]);

  const handleJournalResearch = useCallback(async (topic: string) => {
    if (!activeJournalEntryId) return;
    setActiveAiTask('journal');
    try {
        const result = await researchTopic(topic);
        showModal(t('journal.research.modal.title'), (
            <div className="max-h-[70vh] overflow-y-auto">
                <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-2">{t('journal.research.modal.summary', { topic })}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{result.summary}</p>
                {result.sources.length > 0 && (
                    <>
                        <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400 mb-2">{t('journal.research.modal.sources')}</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            {result.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{source.title}</a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <div className="flex justify-end mt-6">
                    <Button onClick={() => {
                        const activeEntry = journal.find(e => e.id === activeJournalEntryId);
                        if (activeEntry) {
                            const formattedSources = result.sources.map(s => `- [${s.title}](${s.uri})`).join('\n');
                            const researchText = `\n\n---\n\n### Research on: ${topic}\n\n${result.summary}\n\n**Sources:**\n${formattedSources}`;
                            updateEntry(activeJournalEntryId, { content: activeEntry.content + researchText });
                        }
                        hideModal();
                    }}>{t('journal.research.modal.insert')}</Button>
                </div>
            </div>
        ));
    } catch(e: any) {
        showToast(e.message);
    } finally {
        setActiveAiTask(null);
    }
  }, [activeJournalEntryId, journal, showModal, hideModal, updateEntry, t, showToast]);
  
  const handleCreateNewGallery = useCallback(() => {
    const newId = createNewGallery({}, activeProjectId || undefined);
    setActiveGalleryId(newId);
    setIsGalleryEditing(false);
  }, [createNewGallery, activeProjectId, setActiveGalleryId]);

  const handleNewJournalEntry = useCallback(() => {
    const newId = addEntry(activeProjectId || undefined);
    setActiveJournalEntryId(newId);
  }, [addEntry, activeProjectId]);

  const handleGenerateVideo = useCallback(async () => {
    if (!activeGallery || activeGallery.artworks.length < 3) {
        showToast(t('gallery.audioGuide.needsArt'));
        return;
    }
    setActiveAiTask('video');
    try {
        const operation = await generateGalleryVideo(activeGallery);
        setVideoGenerationState({ operation, galleryId: activeGallery.id });
        showModal(t('gallery.video.modal.title'), (
            <div className="text-center p-8">
                <SpinnerIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">{videoLoadingMessage}</p>
            </div>
        ));
    } catch (e: any) {
        showToast(e.message);
        setActiveAiTask(null);
    }
  }, [activeGallery, showModal, t, videoLoadingMessage, showToast]);

    // Command Palette logic
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setCommandPaletteOpen(isOpen => !isOpen);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const allCommands = useMemo<Command[]>(() => {
        const navigationCommands: Command[] = [
            { id: 'nav-workspace', title: t('commandPalette.action.goToWorkspace'), category: t('commandPalette.category.navigation'), action: () => setActiveView('workspace') },
            { id: 'nav-discover', title: t('commandPalette.action.goToDiscover'), category: t('commandPalette.category.navigation'), action: () => setActiveView('discover') },
            { id: 'nav-studio', title: t('commandPalette.action.goToStudio'), category: t('commandPalette.category.navigation'), action: () => setActiveView('studio') },
            { id: 'nav-galleries', title: t('commandPalette.action.goToGalleries'), category: t('commandPalette.category.navigation'), action: () => setActiveView('gallery') },
            { id: 'nav-journal', title: t('commandPalette.action.goToJournal'), category: t('commandPalette.category.navigation'), action: () => setActiveView('journal') },
            { id: 'nav-profile', title: t('commandPalette.action.goToProfile'), category: t('commandPalette.category.navigation'), action: () => setActiveView('profile') },
            { id: 'nav-settings', title: t('commandPalette.action.goToSettings'), category: t('commandPalette.category.navigation'), action: () => setActiveView('setup') },
            { id: 'nav-help', title: t('commandPalette.action.goToHelp'), category: t('commandPalette.category.navigation'), action: () => setActiveView('help') },
        ];

        const actionCommands: Command[] = [
            { id: 'action-new-gallery', title: t('commandPalette.action.newGallery'), category: t('commandPalette.category.action'), action: () => { setActiveView('gallery'); handleCreateNewGallery(); } },
            { id: 'action-new-journal', title: t('commandPalette.action.newJournalEntry'), category: t('commandPalette.category.action'), action: () => { setActiveView('journal'); handleNewJournalEntry(); } },
            { id: 'action-new-project', title: t('commandPalette.action.newProject'), category: t('commandPalette.category.action'), action: handleNewProject },
            { id: 'action-toggle-theme', title: t('commandPalette.action.toggleTheme'), category: t('commandPalette.category.action'), action: toggleTheme },
        ];
        
        const galleryCommands: Command[] = galleries.map(g => ({
            id: `gallery-${g.id}`,
            title: t('commandPalette.action.openGallery', { title: g.title || t('gallery.new') }),
            category: t('commandPalette.category.gallery'),
            action: () => { setActiveGalleryId(g.id); setActiveView('gallery'); }
        }));
        
        const journalCommands: Command[] = journal.map(j => ({
            id: `journal-${j.id}`,
            title: t('commandPalette.action.editJournal', { title: j.title || 'Untitled' }),
            category: t('commandPalette.category.journal'),
            action: () => { setActiveJournalEntryId(j.id); setActiveView('journal'); }
        }));
        
        const artworkCommands: Command[] = realArtworks.map(a => ({
            id: `artwork-${a.id}`,
            title: t('commandPalette.action.viewArtwork', { title: a.title }),
            category: t('commandPalette.category.artwork'),
            action: () => handleViewDetails(a)
        }));

        return [...navigationCommands, ...actionCommands, ...galleryCommands, ...journalCommands, ...artworkCommands];
    }, [t, galleries, journal, handleCreateNewGallery, handleNewJournalEntry, handleNewProject, toggleTheme, setActiveGalleryId, setActiveJournalEntryId, handleViewDetails]);


  const renderActiveView = () => {
    switch (activeView) {
      case 'workspace':
        return (
          <Workspace 
            projects={projects}
            onNewProject={handleNewProject}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            galleryCountByProject={(id) => galleries.filter(g => g.projectId === id).length}
            journalCountByProject={(id) => journal.filter(j => j.projectId === id).length}
          />
        );
      case 'discover':
        return (
          <ArtLibrary 
            artworks={libraryArtworks}
            onSearch={handleThematicSearch}
            activeAiTask={activeAiTask}
            onAnalyzeImage={handleImageAnalysis}
            onOpenCamera={() => setIsCameraModalOpen(true)}
            error={error}
            onArtworkAdd={handleInitiateAddToGallery}
            onArtworkViewDetails={handleViewDetails}
            refinements={refinements}
            styleSpotlight={styleSpotlight}
            onClearSearch={handleClearSearch}
            settings={appSettings}
            onUpdateSettings={updateAppSettings}
          />
        );
      case 'studio':
        return (
            <Studio
                onGenerateImage={generateImageFromPrompt}
                onRemixImage={handleRemixImage}
                onEnhancePrompt={handleEnhancePrompt}
                onInitiateAdd={handleInitiateAddToGallery}
                activeAiTask={activeAiTask}
                setActiveAiTask={setActiveAiTask}
                showToast={showToast}
            />
        );
      case 'gallery':
        return activeGallery ? (
          <GalleryCreator 
            gallery={activeGallery}
            onUpdateGallery={updateActiveGallery}
            onRemoveArtwork={handleRemoveFromGallery}
            onReorderArtworks={reorderArtworksInActiveGallery}
            onViewArtworkDetails={handleViewDetails}
            onGenerateSuggestions={handleGenerateSuggestions}
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
            onGenerateIntro={handleGenerateIntro}
            onGenerateAudioGuide={handleGenerateAudioGuide}
            onGenerateCritique={handleGenerateCritique}
            onGenerateVideo={handleGenerateVideo}
            onSuggestTitle={handleSuggestTitle}
            onSuggestDescription={handleSuggestDescription}
            onSmartReorder={handleSmartReorder}
            activeAiTask={activeAiTask}
            isEditing={isGalleryEditing}
            setActiveView={setActiveView as (view: 'discover') => void}
          />
        ) : (
          <GalleryManager 
            galleries={activeProjectId ? galleriesInProject : galleries}
            onCreateNew={handleCreateNewGallery}
            onSelectGallery={setActiveGalleryId}
            onDeleteGallery={handleDeleteGallery}
          />
        );
      case 'journal':
        return (
          <Journal
            entries={activeProjectId ? journalInProject : journal}
            galleries={galleries}
            activeEntryId={activeJournalEntryId}
            onSelectEntry={setActiveJournalEntryId}
            onUpdateEntry={updateEntry}
            onDeleteEntry={handleDeleteEntry}
            onProcessText={handleProcessJournalText}
            onJournalResearch={handleJournalResearch}
            activeAiTask={activeAiTask}
          />
        );
      case 'profile':
        return (
            <ProfileView 
                profile={profile}
                setActiveView={setActiveView}
                stats={{
                    galleriesCurated,
                    artworksDiscovered,
                    aiArtworksCreated
                }}
            />
        );
      case 'setup':
        return (
          <Setup 
            theme={theme} 
            onToggleTheme={toggleTheme} 
            onClearCache={handleClearCache} 
            profile={profile}
            onUpdateProfile={updateProfile}
            onShowToast={showToast}
            appSettings={appSettings}
            onUpdateAppSettings={updateAppSettings}
            onExportAllData={handleExportAllData}
            onTriggerImport={() => importFileRef.current?.click()}
          />
        );
      case 'help':
        if (helpSubView === 'glossary') {
            return <Glossary onBack={() => setHelpSubView('main')} />;
        }
        return <Help onOpenGlossary={() => setHelpSubView('glossary')} />;
      default:
        return null;
    }
  };


  if (publicExhibitionData) {
    return (
        <ExhibitionMode 
            artworks={publicExhibitionData.artworks} 
            audioGuide={publicExhibitionData.audioGuide} 
            onClose={() => setPublicExhibitionData(null)}
            settings={appSettings}
            isPublicView={true}
            galleryTitle={publicExhibitionData.title}
            curatorProfile={publicExhibitionData.curatorProfile}
        />
    );
  }

  if (!hasSeenWelcomePortal) {
    return <WelcomePortal onEnter={handleEnterApp} />;
  }
  
  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-200 flex">
      <div className="relative flex flex-col w-full max-w-7xl mx-auto h-screen">
        <Header
            activeView={activeView}
            setActiveView={setActiveView}
            activeGallery={activeGallery}
            onNewProject={activeView === 'workspace' ? handleNewProject : undefined}
            onCreateNewGallery={activeView === 'gallery' && !activeGallery ? handleCreateNewGallery : undefined}
            onNewJournalEntry={activeView === 'journal' && !activeJournalEntryId ? handleNewJournalEntry : undefined}
            onGoBack={
                (activeView === 'gallery' && !!activeGallery) ? () => { setActiveGalleryId(null); setIsGalleryEditing(false); } :
                (activeView === 'journal' && !!activeJournalEntryId) ? () => setActiveJournalEntryId(null) :
                undefined
            }
            isGalleryEditing={isGalleryEditing}
            onToggleGalleryEditing={() => setIsGalleryEditing(p => !p)}
            onExhibit={activeView === 'gallery' && !!activeGallery ? () => setIsExhibitionMode(true) : undefined}
            onShare={activeView === 'gallery' && !!activeGallery ? handleShare : undefined}
        />
        <main ref={mainRef} role="main" className="flex-1 overflow-y-auto">
            <div className="h-full p-4 md:p-6 pb-20">
              {renderActiveView()}
              {activeView === 'setup' && <input type="file" ref={importFileRef} onChange={handleImportAllData} className="hidden" accept="application/json" />}
            </div>
        </main>
        <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={handleCloseToast} />}
      <AddToGalleryModal
        isOpen={!!artworkToAdd}
        onClose={() => setArtworkToAdd(null)}
        galleries={galleries}
        onSelectGallery={handleSelectGalleryForAdd}
        onCreateAndAdd={handleCreateAndAdd}
      />
      {isExhibitionMode && activeGallery && activeGallery.artworks.length > 0 && (
          <ExhibitionMode 
            artworks={activeGallery.artworks} 
            audioGuide={activeGallery.audioGuide} 
            onClose={() => setIsExhibitionMode(false)}
            settings={appSettings}
          />
      )}
      {isCameraModalOpen && <CameraAnalysisModal onCapture={handleImageAnalysis} onClose={() => setIsCameraModalOpen(false)} />}
      {chatArtwork && <ChatModal artwork={chatArtwork} onClose={() => setChatArtwork(null)} />}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={allCommands}
      />
    </div>
  );
};

export default App;
