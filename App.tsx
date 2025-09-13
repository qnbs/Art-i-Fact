

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SideNavBar } from './components/SideNavBar';
import { BottomNavBar } from './components/BottomNavBar';
import { Header } from './components/Header';
import { ArtLibrary } from './components/ArtLibrary';
import { Studio } from './components/Studio';
import { Workspace } from './components/Workspace';
import { ProjectView } from './components/ProjectView';
import { GalleryView } from './components/GalleryView';
import { Journal } from './components/Journal';
import { ProfileView } from './components/ProfileView';
import { Setup } from './components/Setup';
import { Help } from './components/Help';
import { WelcomePortal } from './components/WelcomePortal';
import { AddToGalleryModal } from './components/AddToGalleryModal';
import { ArtworkDetails } from './components/ArtworkDetails';
import { ChatModal } from './components/ChatModal';
import { CameraAnalysisModal } from './components/CameraAnalysisModal';
import { CommandPalette, Command } from './components/CommandPalette';
import { GalleryCreator } from './components/GalleryCreator';
import { GalleryManager } from './components/GalleryManager';
import { ExhibitionMode } from './components/ExhibitionMode';
import { Toast } from './components/ui/Toast';
import { useTheme } from './hooks/useTheme';
import { useGallery } from './hooks/useGallery';
import { useProjects } from './hooks/useProjects';
import { useJournal } from './hooks/useJournal';
import { useProfile } from './hooks/useProfile';
import { useAppSettings } from './hooks/useAppSettings';
import { useModal } from './contexts/ModalContext';
import { useTranslation } from './contexts/TranslationContext';
import { useDynamicLoadingMessage } from './hooks/useDynamicLoadingMessage';
import * as gemini from './services/geminiService';
import type { Artwork, Gallery, JournalEntry, Project, ShareableGalleryData } from './types';
import { WELCOME_PORTAL_SEEN_KEY } from './constants';
import { Cog6ToothIcon, CommandLineIcon, GalleryIcon, HomeIcon, JournalIcon, PaintBrushIcon, QuestionMarkCircleIcon, SearchIcon, UserCircleIcon } from './components/IconComponents';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

const App: React.FC = () => {
    const { t } = useTranslation();
    const [theme, toggleTheme] = useTheme();
    const { showModal, hideModal } = useModal();
    const [activeView, setActiveView] = useState<ActiveView>('discover');

    // State Hooks
    const { profile, updateProfile, setProfile } = useProfile();
    const { appSettings, updateAppSettings, setAppSettings } = useAppSettings();
    const { projects, createProject, updateProject, deleteProject, clearAllProjects, setProjects } = useProjects();
    const { galleries, createNewGallery, deleteGallery, updateActiveGallery, addArtworkToGallery, removeArtworkFromActiveGallery, reorderArtworksInActiveGallery, addCommentToArtwork, clearAllGalleries, importGalleries, setGalleries, activeGallery, activeGalleryId, setActiveGalleryId } = useGallery();
    const { journalEntries, createNewJournalEntry, deleteJournalEntry, updateJournalEntry, clearAllJournalEntries, setJournalEntries, unlinkGallery } = useJournal();
    
    // UI State
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [activeAiTask, setActiveAiTask] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOME_PORTAL_SEEN_KEY));
    
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [similarTo, setSimilarTo] = useState<Artwork | null>(null);
    
    const [artworkToAdd, setArtworkToAdd] = useState<Artwork | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [publicGalleryData, setPublicGalleryData] = useState<ShareableGalleryData | null>(null);


    const loadingMessages = useMemo(() => [
        t('loading.gemini.1'), t('loading.gemini.2'), t('loading.gemini.3'), t('loading.gemini.4')
    ], [t]);
    const loadingMessage = useDynamicLoadingMessage(loadingMessages, 3000, !!activeAiTask);

    // Effect to fetch featured artworks on initial load
    useEffect(() => {
        const fetchFeaturedArtworks = async () => {
            const results = await gemini.findArtworks("Most famous paintings in history high resolution", 10);
            if (results) {
                setFeaturedArtworks(results);
            }
        };
        fetchFeaturedArtworks();
    }, []);

    // Effect to handle shared gallery links
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash.startsWith('#view=')) {
                try {
                    const encodedData = window.location.hash.substring(6);
                    const decodedJson = atob(encodedData);
                    const data: ShareableGalleryData = JSON.parse(decodedJson);
                    if (data.gallery && data.profile) {
                        setPublicGalleryData(data);
                    }
                } catch (error) {
                    console.error("Failed to parse shared gallery data:", error);
                    window.location.hash = ''; // Clear invalid hash
                }
            }
        };
        
        handleHashChange(); // Check on initial load
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Derived State
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === activeProjectId), [galleries, activeProjectId]);
    const projectJournalEntries = useMemo(() => journalEntries.filter(j => j.projectId === activeProjectId), [journalEntries, activeProjectId]);

    // Handlers
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3100);
    };

    const handleAiTask = useCallback(async <T,>(
        taskName: string, 
        taskFn: () => Promise<T>, 
        options?: { onStart?: () => void, onEnd?: (result: T | undefined) => void }
    ): Promise<T | undefined> => {
        setActiveAiTask(taskName);
        options?.onStart?.();
        try {
            const result = await taskFn();
            options?.onEnd?.(result);
            return result;
        } catch (error: any) {
            console.error(`AI Task "${taskName}" failed:`, error);
            showToast(t('toast.error.gemini') + (error.message ? `: ${error.message}`: ''));
            options?.onEnd?.(undefined);
            return undefined;
        } finally {
            setActiveAiTask(null);
        }
    }, [t]);
    
    // Data Search/Analysis
    const handleSearch = useCallback(async (term: string) => {
        setSearchTerm(term);
        setSimilarTo(null);
        if (!term) {
            setArtworks([]);
            return;
        }
        const results = await handleAiTask('search', () => gemini.findArtworks(term, appSettings.aiResultsCount));
        if (results) setArtworks(results);
    }, [appSettings.aiResultsCount, handleAiTask]);

    const handleFindSimilar = useCallback((artwork: Artwork) => {
        setSearchTerm('');
        setSimilarTo(artwork);
        handleAiTask('similar', async () => {
            const results = await gemini.findArtworks(`artworks similar to ${artwork.title} by ${artwork.artist}`, appSettings.aiResultsCount);
            if (results) setArtworks(results.filter(a => a.id !== artwork.id));
        });
        setActiveView('discover');
    }, [appSettings.aiResultsCount, handleAiTask]);

    const handleAnalyzeImage = useCallback(async (file: File) => {
        const result = await handleAiTask('analyze', () => gemini.analyzeImage(file));
        if (result) {
            setArtworks([result]);
            setSearchTerm(result.title);
            setSimilarTo(null);
        } else {
            showToast(t('toast.error.imageRecognition'));
        }
    }, [handleAiTask, t]);

    // Gallery Management
    const initiateAddToGallery = useCallback((artwork: Artwork) => {
        setArtworkToAdd(artwork);
        setAddModalOpen(true);
    }, []);

    const handleSelectGalleryForAdd = (galleryId: string) => {
        if (artworkToAdd) {
            const success = addArtworkToGallery(artworkToAdd, galleryId);
            showToast(success ? t('toast.gallery.artworkAdded') : t('toast.gallery.artworkExists'));
        }
        setAddModalOpen(false);
        setArtworkToAdd(null);
    };

    const handleCreateAndAdd = () => {
        if (artworkToAdd) {
            const newId = createNewGallery({ artworks: [artworkToAdd], title: t('gallery.newUntitled'), projectId: activeProjectId || undefined });
            setActiveGalleryId(newId);
            setActiveView('gallery');
            showToast(t('toast.gallery.createdWithArt'));
        }
        setAddModalOpen(false);
        setArtworkToAdd(null);
    };

    const handleDeleteGallery = useCallback((galleryId: string) => {
        const galleryToDelete = galleries.find(g => g.id === galleryId);
        if (!galleryToDelete) return;

        if (window.confirm(t('gallery.manager.delete.confirm', { title: galleryToDelete.title }))) {
            deleteGallery(galleryId);
            unlinkGallery(galleryId);
        }
    }, [galleries, deleteGallery, unlinkGallery, t]);

    // Modal Handlers
    const handleStartChat = (artwork: Artwork) => {
        showModal(t('chat.modal.title', { title: artwork.title }), <ChatModal artwork={artwork} />);
    };
    
    const handleShowCamera = () => {
        showModal(t('camera.modal.title'), <CameraAnalysisModal onCapture={handleAnalyzeImage} onClose={hideModal} />);
    };
    
    const handleViewDetails = (artwork: Artwork) => {
        showModal(
            artwork.title,
            <ArtworkDetails
                artwork={artwork}
                activeGallery={activeGallery}
                onFindSimilar={handleFindSimilar}
                onInitiateAddToGallery={initiateAddToGallery}
                onRemoveFromGallery={removeArtworkFromActiveGallery}
                onAddComment={addCommentToArtwork}
                onThematicSearch={(tags) => { handleSearch(tags.join(', ')); setActiveView('discover'); }}
                onStartChat={handleStartChat}
                onClose={hideModal}
                showToast={showToast}
            />
        );
    };

    const handleNewProject = () => {
        showModal(t('workspace.newProject'), <GalleryCreator onSave={({ title, description }) => {
            const newId = createProject(title, description);
            setActiveProjectId(newId);
            setActiveView('project');
            hideModal();
        }} onCancel={hideModal} />)
    };
    
    const handleDeleteProject = (id: string, title: string) => {
        if(window.confirm(t('workspace.delete.confirm', { title }))) {
            // This hook updates project state and localStorage for all related items
            deleteProject(id, galleries, journalEntries);
            // Manually update React state for galleries and journals to sync the UI
            setGalleries(prev => prev.filter(g => g.projectId !== id));
            setJournalEntries(prev => prev.filter(j => j.projectId !== id));
            showToast(t('toast.project.deleted'));
        }
    };
    
    const handleNewGalleryForProject = () => {
        if (!activeProjectId) return;
        const newId = createNewGallery({ projectId: activeProjectId, title: t('gallery.newUntitled') });
        setActiveGalleryId(newId);
        setActiveView('gallery');
    };
    
    const handleNewJournalEntryForProject = (): string => {
        if (!activeProjectId) return '';
        return createNewJournalEntry({ projectId: activeProjectId, title: t('journal.newUntitled') });
    }

    const handleEnter = () => {
        localStorage.setItem(WELCOME_PORTAL_SEEN_KEY, 'true');
        setShowWelcome(false);
    };

    // App Commands
    const commands: Command[] = useMemo(() => [
        { id: 'view_workspace', title: t('nav.workspace'), category: t('nav.category'), icon: <HomeIcon className="w-5 h-5"/>, action: () => setActiveView('workspace') },
        { id: 'view_discover', title: t('nav.discover'), category: t('nav.category'), icon: <SearchIcon className="w-5 h-5"/>, action: () => setActiveView('discover') },
        { id: 'view_studio', title: t('nav.studio'), category: t('nav.category'), icon: <PaintBrushIcon className="w-5 h-5"/>, action: () => setActiveView('studio') },
        { id: 'view_journal', title: t('nav.journal'), category: t('nav.category'), icon: <JournalIcon className="w-5 h-5"/>, action: () => setActiveView('journal') },
        { id: 'view_profile', title: t('nav.profile'), category: t('nav.category'), icon: <UserCircleIcon className="w-5 h-5"/>, action: () => setActiveView('profile') },
        { id: 'view_settings', title: t('nav.settings'), category: t('nav.category'), icon: <Cog6ToothIcon className="w-5 h-5"/>, action: () => setActiveView('setup') },
        { id: 'view_help', title: t('nav.help'), category: t('nav.category'), icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, action: () => setActiveView('help') },
        { id: 'toggle_theme', title: t('command.toggleTheme'), category: t('command.category.general'), icon: <CommandLineIcon className="w-5 h-5"/>, action: toggleTheme },
        ...projects.map(p => ({ id: `proj_${p.id}`, title: t('command.openProject', { title: p.title }), category: t('command.category.projects'), icon: <HomeIcon className="w-5 h-5"/>, action: () => { setActiveProjectId(p.id); setActiveView('project') }})),
        ...galleries.map(g => ({
            id: `gal_${g.id}`,
            title: t('command.openGallery', { title: g.title }),
            category: t('command.category.galleries'),
            icon: <GalleryIcon className="w-5 h-5"/>,
            action: () => {
                if (g.projectId) {
                    setActiveProjectId(g.projectId);
                    setActiveView('project');
                } else {
                    setActiveProjectId(null); // Ensure we clear project context for standalone galleries
                    setActiveView('gallery');
                }
                setActiveGalleryId(g.id);
            }
        })),
    ], [t, toggleTheme, projects, galleries, setActiveGalleryId, setActiveProjectId]);


    // Render Logic
    const renderActiveView = () => {
        if (activeGalleryId) {
            return <GalleryView
                gallery={activeGallery!}
                profile={profile}
                onClose={() => setActiveGalleryId(null)}
                onUpdate={updateActiveGallery}
                onRemoveArtwork={removeArtworkFromActiveGallery}
                onReorderArtworks={reorderArtworksInActiveGallery}
                onViewDetails={handleViewDetails}
                onInitiateAdd={initiateAddToGallery}
                onFindSimilar={handleFindSimilar}
                handleAiTask={handleAiTask}
                showToast={showToast}
                appSettings={appSettings}
            />
        }

        if (activeProjectId && activeProject) {
            return <ProjectView
                project={activeProject}
                onUpdateProject={updateProject}
                galleries={projectGalleries}
                journalEntries={projectJournalEntries}
                onNewGallery={handleNewGalleryForProject}
                onSelectGallery={(id) => setActiveGalleryId(id)}
                onDeleteGallery={handleDeleteGallery}
                onUpdateJournalEntry={updateJournalEntry}
                onDeleteJournalEntry={deleteJournalEntry}
                onNewJournalEntry={handleNewJournalEntryForProject}
                onJournalResearch={async (topic) => {
                    const insights = await handleAiTask('journal', () => gemini.generateJournalInsights(topic));
                    return insights || '';
                }}
                activeAiTask={activeAiTask}
                handleAiTask={handleAiTask}
            />
        }

        switch (activeView) {
            case 'workspace':
                return <Workspace 
                    projects={projects} 
                    onNewProject={handleNewProject}
                    onSelectProject={(id) => setActiveProjectId(id)}
                    onDeleteProject={handleDeleteProject}
                    galleryCountByProject={(id) => galleries.filter(g => g.projectId === id).length}
                    journalCountByProject={(id) => journalEntries.filter(j => j.projectId === id).length}
                />;
            case 'discover':
                return <ArtLibrary 
                    onSearch={handleSearch}
                    onAnalyzeImage={handleAnalyzeImage}
                    onAddArtwork={initiateAddToGallery}
                    onViewArtworkDetails={handleViewDetails}
                    onShowCamera={handleShowCamera}
                    artworks={artworks}
                    isLoading={activeAiTask === 'search' || activeAiTask === 'similar' || activeAiTask === 'analyze'}
                    loadingMessage={loadingMessage}
                    searchTerm={searchTerm}
                    similarTo={similarTo}
                    onFindSimilar={handleFindSimilar}
                    featuredArtworks={featuredArtworks}
                    appSettings={appSettings}
                />;
            case 'studio':
                return <Studio 
                    onGenerateImage={(p, ar) => handleAiTask('studio', () => gemini.generateImage(p, ar)) as Promise<string>}
                    onRemixImage={(b64, p) => handleAiTask('remix', () => gemini.remixImage(b64, p)) as Promise<string>}
                    onEnhancePrompt={(p) => handleAiTask('enhance', () => gemini.enhancePrompt(p)) as Promise<string>}
                    onInitiateAdd={initiateAddToGallery}
                    activeAiTask={activeAiTask}
                    showToast={showToast}
                    handleAiTask={handleAiTask}
                    loadingMessage={loadingMessage}
                />
            case 'gallery':
                return <GalleryManager
                    galleries={galleries.filter(g => !g.projectId)}
                    onCreateNew={() => {
                        const newId = createNewGallery({ title: t('gallery.newUntitled') });
                        setActiveGalleryId(newId);
                    }}
                    onSelectGallery={(id) => setActiveGalleryId(id)}
                    onDeleteGallery={(id, title) => handleDeleteGallery(id)}
                    isProjectView={false}
                />;
            case 'journal':
                 return <Journal
                    entries={journalEntries.filter(j => !j.projectId)} // Only show non-project entries here
                    galleries={galleries}
                    onUpdateEntry={updateJournalEntry}
                    onDeleteEntry={deleteJournalEntry}
                    onJournalResearch={async (topic) => {
                        const insights = await handleAiTask('journal', () => gemini.generateJournalInsights(topic));
                        return insights || '';
                    }}
                    activeAiTask={activeAiTask}
                    handleAiTask={handleAiTask}
                />;
            case 'profile':
                return <ProfileView 
                    profile={profile} 
                    setActiveView={(v) => setActiveView(v)}
                    stats={{
                        galleriesCurated: galleries.length,
                        artworksDiscovered: galleries.reduce((sum, g) => sum + g.artworks.filter(a => !a.isGenerated).length, 0),
                        aiArtworksCreated: galleries.reduce((sum, g) => sum + g.artworks.filter(a => a.isGenerated).length, 0),
                    }}
                />;
            case 'setup':
                return <Setup 
                    theme={theme} onToggleTheme={toggleTheme} 
                    onClearCache={() => { if(window.confirm(t('settings.galleryCache.confirm'))) { clearAllGalleries(); showToast(t('toast.cacheCleared'))} }}
                    profile={profile} onUpdateProfile={updateProfile} onShowToast={showToast}
                    appSettings={appSettings} onUpdateAppSettings={updateAppSettings}
                    onExportAllData={() => {
                        const allData = { projects, galleries, journalEntries, profile, appSettings };
                        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `art-i-fact_backup_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    onTriggerImport={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'application/json';
                        input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try {
                                    const data = JSON.parse(event.target?.result as string);
                                    if (window.confirm(t('settings.data.import.confirm'))) {
                                        setProjects(data.projects || []);
                                        setGalleries(data.galleries || []);
                                        setJournalEntries(data.journalEntries || []);
                                        setProfile(data.profile || profile);
                                        setAppSettings(data.appSettings || appSettings);
                                        showToast(t('toast.dataImported'));
                                    }
                                } catch (err) {
                                    showToast(t('toast.error.import'));
                                }
                            };
                            reader.readAsText(file);
                        };
                        input.click();
                    }}
                />;
            case 'help':
                return <Help />;
            default:
                return <div>{t('error.viewNotFound')}</div>;
        }
    };
    
    if (publicGalleryData) {
        return (
            <ExhibitionMode 
                artworks={publicGalleryData.gallery.artworks}
                onClose={() => {
                    setPublicGalleryData(null);
                    window.location.hash = ''; // Clear hash on close
                }}
                settings={appSettings}
                isPublicView={true}
                galleryTitle={publicGalleryData.gallery.title}
                curatorProfile={publicGalleryData.profile}
            />
        );
    }

    if (showWelcome) {
        return <WelcomePortal onEnter={handleEnter} />;
    }

    return (
        <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
            <SideNavBar activeView={activeView} setActiveView={setActiveView} galleryItemCount={galleries.length} />
            <main className="flex-1 flex flex-col h-screen">
                <Header 
                    activeView={activeView}
                    isProjectView={!!activeProjectId}
                    isGalleryView={!!activeGalleryId}
                    onNewGallery={handleNewGalleryForProject}
                    onNewJournalEntry={() => createNewJournalEntry()}
                    onNewProject={handleNewProject}
                    onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                    onNavigateBack={() => {
                        if (activeGalleryId) setActiveGalleryId(null);
                        else if (activeProjectId) setActiveProjectId(null);
                    }}
                />
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    {renderActiveView()}
                </div>
                <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
            </main>

            {/* Modals & Overlays */}
            {isAddModalOpen && <AddToGalleryModal 
                galleries={galleries}
                onSelectGallery={handleSelectGalleryForAdd}
                onCreateAndAdd={handleCreateAndAdd}
                onClose={() => setAddModalOpen(false)}
                isOpen={isAddModalOpen}
                activeProjectId={activeProjectId}
            />}
            <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} commands={commands} />
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
            <div id="command-palette-root"></div>
        </div>
    );
};

export default App;
