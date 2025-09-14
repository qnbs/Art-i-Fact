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
import { ExhibitionMode } from './components/ExhibitionMode';
import { useTheme } from './hooks/useTheme';
import { useGallery } from './hooks/useGallery';
import { useProjects } from './hooks/useProjects';
import { useJournal } from './hooks/useJournal';
import { useModal } from './contexts/ModalContext';
import { useToast } from './contexts/ToastContext';
import { useAI } from './contexts/AIStatusContext';
import { useTranslation } from './contexts/TranslationContext';
import { useProfile } from './contexts/ProfileContext';
import { useAppSettings } from './contexts/AppSettingsContext';
import * as gemini from './services/geminiService';
import type { Artwork, ShareableGalleryData } from './types';
import { WELCOME_PORTAL_SEEN_KEY } from './constants';
import { Button } from './components/ui/Button';
import { Cog6ToothIcon, CommandLineIcon, GalleryIcon, HomeIcon, JournalIcon, PaintBrushIcon, QuestionMarkCircleIcon, SearchIcon, UserCircleIcon } from './components/IconComponents';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

interface NavigationState {
    view: ActiveView;
    projectId: string | null;
    galleryId: string | null;
}

const App: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();
    const [theme, toggleTheme] = useTheme();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();
    const { handleAiTask, activeAiTask } = useAI();
    const { profile, setProfile } = useProfile();
    const { appSettings, setAppSettings } = useAppSettings();
    
    // Navigation State
    const [currentView, setCurrentView] = useState<ActiveView>('discover');
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [currentGalleryId, setCurrentGalleryId] = useState<string | null>(null);
    const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>([]);

    // Data Hooks
    const { projects, createProject, updateProject, deleteProject, setProjects } = useProjects();
    const { galleries, createNewGallery, deleteGallery, updateActiveGallery, addArtworkToGallery, removeArtworkFromActiveGallery, reorderArtworksInActiveGallery, addCommentToArtwork, setGalleries } = useGallery(currentGalleryId);
    const { journalEntries, createNewJournalEntry, deleteJournalEntry, updateJournalEntry, setJournalEntries, unlinkGallery } = useJournal();
    
    // UI State
    const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOME_PORTAL_SEEN_KEY));
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [similarTo, setSimilarTo] = useState<Artwork | null>(null);
    const [artworkToAdd, setArtworkToAdd] = useState<Artwork | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [publicGalleryData, setPublicGalleryData] = useState<ShareableGalleryData | null>(null);

    // Effect to fetch featured artworks on initial load
    useEffect(() => {
        const fetchFeaturedArtworks = async () => {
            try {
                const results = await gemini.findArtworks("Most famous paintings in history high resolution", 10);
                if (results) {
                    setFeaturedArtworks(results);
                }
            } catch (error) {
                console.error("Failed to fetch featured artworks:", error);
                // Non-critical, so no toast shown to user
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
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Derived State
    const activeProject = useMemo(() => projects.find(p => p.id === currentProjectId), [projects, currentProjectId]);
    const activeGallery = useMemo(() => galleries.find(g => g.id === currentGalleryId), [galleries, currentGalleryId]);
    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === currentProjectId), [galleries, currentProjectId]);
    const projectJournalEntries = useMemo(() => journalEntries.filter(j => j.projectId === currentProjectId), [journalEntries, currentProjectId]);

    // Navigation Logic
    const navigateTo = useCallback((state: Partial<NavigationState>) => {
        const currentState: NavigationState = { view: currentView, projectId: currentProjectId, galleryId: currentGalleryId };
        
        // Push to history only if it's a significant change (e.g., entering a project/gallery)
        if ((state.projectId && state.projectId !== currentState.projectId) || (state.galleryId && state.galleryId !== currentState.galleryId)) {
            setNavigationHistory(prev => [...prev, currentState]);
        }

        setCurrentView(state.view ?? currentView);
        setCurrentProjectId(state.projectId !== undefined ? state.projectId : currentProjectId);
        setCurrentGalleryId(state.galleryId !== undefined ? state.galleryId : currentGalleryId);
    }, [currentView, currentProjectId, currentGalleryId]);

    const navigateBack = useCallback(() => {
        if (navigationHistory.length > 0) {
            const lastState = navigationHistory[navigationHistory.length - 1];
            setNavigationHistory(prev => prev.slice(0, -1));
            setCurrentView(lastState.view);
            setCurrentProjectId(lastState.projectId);
            setCurrentGalleryId(lastState.galleryId);
        } else {
             // Default back behavior if history is empty
            if (currentGalleryId) setCurrentGalleryId(null);
            else if (currentProjectId) setCurrentProjectId(null);
            else setCurrentView('discover'); // Fallback to a default view
        }
    }, [navigationHistory, currentGalleryId, currentProjectId]);
    
    // Data Search/Analysis Handlers
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
        navigateTo({ view: 'discover' });
    }, [appSettings.aiResultsCount, handleAiTask, navigateTo]);

    const handleAnalyzeImage = useCallback(async (file: File) => {
        const result = await handleAiTask('analyze', () => gemini.analyzeImage(file));
        if (result) {
            setArtworks([result]);
            setSearchTerm(result.title);
            setSimilarTo(null);
        } else {
            showToast(t('toast.error.imageRecognition'), 'error');
        }
    }, [handleAiTask, t, showToast]);

    // Gallery Management Handlers
    const initiateAddToGallery = useCallback((artwork: Artwork) => {
        setArtworkToAdd(artwork);
        setAddModalOpen(true);
    }, []);

    const handleSelectGalleryForAdd = useCallback((galleryId: string) => {
        if (artworkToAdd) {
            const success = addArtworkToGallery(artworkToAdd, galleryId);
            showToast(success ? t('toast.gallery.artworkAdded') : t('toast.gallery.artworkExists'), success ? 'success' : 'info');
        }
        setAddModalOpen(false);
        setArtworkToAdd(null);
    }, [artworkToAdd, addArtworkToGallery, showToast, t]);

    const handleCreateAndAdd = useCallback(() => {
        if (artworkToAdd) {
            const newId = createNewGallery({ artworks: [artworkToAdd], title: t('gallery.newUntitled'), projectId: currentProjectId || undefined });
            navigateTo({ galleryId: newId });
            showToast(t('toast.gallery.createdWithArt'), 'success');
        }
        setAddModalOpen(false);
        setArtworkToAdd(null);
    }, [artworkToAdd, createNewGallery, t, currentProjectId, navigateTo, showToast]);

    const handleDeleteGallery = useCallback((galleryId: string) => {
        const galleryToDelete = galleries.find(g => g.id === galleryId);
        if (!galleryToDelete) return;

        showModal(
            t('gallery.manager.delete.confirm', { title: galleryToDelete.title }),
            <>
                <p>{t('gallery.manager.delete.confirm', { title: galleryToDelete.title })}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                    <Button variant="danger" onClick={() => {
                        deleteGallery(galleryId);
                        unlinkGallery(galleryId);
                        showToast(t('toast.gallery.deleted'), 'success');
                        hideModal();
                    }}>{t('remove')}</Button>
                </div>
            </>
        );
    }, [galleries, deleteGallery, unlinkGallery, t, showToast, showModal, hideModal]);

    // Modal Handlers
    const handleStartChat = useCallback((artwork: Artwork) => {
        showModal(t('chat.modal.title', { title: artwork.title }), <ChatModal artwork={artwork} language={language} />);
    }, [showModal, t, language]);
    
    const handleShowCamera = useCallback(() => {
        showModal(t('camera.modal.title'), <CameraAnalysisModal onCapture={handleAnalyzeImage} onClose={hideModal} />);
    }, [showModal, t, handleAnalyzeImage, hideModal]);
    
    const handleViewDetails = useCallback((artwork: Artwork) => {
        showModal(
            artwork.title,
            <ArtworkDetails
                artwork={artwork}
                activeGallery={activeGallery}
                onFindSimilar={handleFindSimilar}
                onInitiateAddToGallery={initiateAddToGallery}
                onRemoveFromGallery={removeArtworkFromActiveGallery}
                onAddComment={addCommentToArtwork}
                onThematicSearch={(tags) => { handleSearch(tags.join(', ')); navigateTo({ view: 'discover' }); }}
                onStartChat={handleStartChat}
                onClose={hideModal}
                language={language}
            />
        );
    }, [activeGallery, handleFindSimilar, initiateAddToGallery, removeArtworkFromActiveGallery, addCommentToArtwork, handleSearch, navigateTo, handleStartChat, hideModal, language, showModal]);

    const handleNewProject = useCallback(() => {
        showModal(t('workspace.newProject'), <GalleryCreator onSave={({ title, description }) => {
            const newId = createProject(title, description);
            navigateTo({ view: 'project', projectId: newId, galleryId: null });
            hideModal();
        }} onCancel={hideModal} />)
    }, [showModal, t, createProject, navigateTo, hideModal]);
    
    const handleDeleteProject = useCallback((id: string, title: string) => {
         showModal(
            t('workspace.delete.confirm', { title }),
            <>
                <p>{t('workspace.delete.confirm', { title })}</p>
                 <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                    <Button variant="danger" onClick={() => {
                        deleteProject(id, galleries, journalEntries);
                        setGalleries(prev => prev.filter(g => g.projectId !== id));
                        setJournalEntries(prev => prev.filter(j => j.projectId !== id));
                        showToast(t('toast.project.deleted'), 'success');
                        hideModal();
                    }}>{t('remove')}</Button>
                </div>
            </>
        );
    }, [showModal, t, deleteProject, galleries, journalEntries, showToast, hideModal, setGalleries, setJournalEntries]);
    
    const handleNewGalleryForProject = useCallback(() => {
        if (!currentProjectId) return;
        const newId = createNewGallery({ projectId: currentProjectId, title: t('gallery.newUntitled') });
        navigateTo({ galleryId: newId });
    }, [currentProjectId, createNewGallery, t, navigateTo]);
    
    const handleNewJournalEntryForProject = useCallback((): string => {
        if (!currentProjectId) return '';
        return createNewJournalEntry({ projectId: currentProjectId, title: t('journal.newUntitled') });
    }, [currentProjectId, createNewJournalEntry, t]);
    
    const handleNewJournalEntry = useCallback((): string => {
        return createNewJournalEntry({ title: t('journal.newUntitled') });
    }, [createNewJournalEntry, t]);

    const handleEnterWelcome = useCallback(() => {
        localStorage.setItem(WELCOME_PORTAL_SEEN_KEY, 'true');
        setShowWelcome(false);
    }, []);

    const commands: Command[] = useMemo(() => [
        { id: 'view_workspace', title: t('nav.workspace'), category: t('nav.category'), icon: <HomeIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'workspace', projectId: null, galleryId: null }) },
        { id: 'view_discover', title: t('nav.discover'), category: t('nav.category'), icon: <SearchIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'discover' }) },
        { id: 'view_studio', title: t('nav.studio'), category: t('nav.category'), icon: <PaintBrushIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'studio' }) },
        { id: 'view_journal', title: t('nav.journal'), category: t('nav.category'), icon: <JournalIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'journal', projectId: null, galleryId: null }) },
        { id: 'view_profile', title: t('nav.profile'), category: t('nav.category'), icon: <UserCircleIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'profile' }) },
        { id: 'view_settings', title: t('nav.settings'), category: t('nav.category'), icon: <Cog6ToothIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'setup' }) },
        { id: 'view_help', title: t('nav.help'), category: t('nav.category'), icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'help' }) },
        { id: 'toggle_theme', title: t('command.toggleTheme'), category: t('command.category.general'), icon: <CommandLineIcon className="w-5 h-5"/>, action: toggleTheme },
        ...projects.map(p => ({ id: `proj_${p.id}`, title: t('command.openProject', { title: p.title }), category: t('command.category.projects'), icon: <HomeIcon className="w-5 h-5"/>, action: () => navigateTo({ view: 'project', projectId: p.id, galleryId: null }) })),
        ...galleries.map(g => ({
            id: `gal_${g.id}`,
            title: t('command.openGallery', { title: g.title }),
            category: t('command.category.galleries'),
            icon: <GalleryIcon className="w-5 h-5"/>,
            action: () => navigateTo({ view: g.projectId ? 'project' : 'gallery', projectId: g.projectId || null, galleryId: g.id })
        })),
    ], [t, toggleTheme, projects, galleries, navigateTo]);


    const renderActiveView = () => {
        if (currentGalleryId && activeGallery) {
            return <GalleryView
                gallery={activeGallery}
                onClose={() => navigateTo({ galleryId: null })}
                onUpdate={updateActiveGallery}
                onRemoveArtwork={removeArtworkFromActiveGallery}
                onReorderArtworks={reorderArtworksInActiveGallery}
                onViewDetails={handleViewDetails}
                onInitiateAdd={initiateAddToGallery}
                onFindSimilar={handleFindSimilar}
                language={language}
            />
        }

        if (currentProjectId && activeProject) {
            return <ProjectView
                project={activeProject}
                onUpdateProject={updateProject}
                galleries={projectGalleries}
                journalEntries={projectJournalEntries}
                onNewGallery={handleNewGalleryForProject}
                onSelectGallery={(id) => navigateTo({ galleryId: id })}
                onDeleteGallery={handleDeleteGallery}
                onUpdateJournalEntry={updateJournalEntry}
                onDeleteJournalEntry={deleteJournalEntry}
                onNewJournalEntry={handleNewJournalEntryForProject}
                language={language}
            />
        }

        switch (currentView) {
            case 'workspace':
                return <Workspace 
                    projects={projects} 
                    onNewProject={handleNewProject}
                    onSelectProject={(id) => navigateTo({ view: 'project', projectId: id, galleryId: null })}
                    onDeleteProject={handleDeleteProject}
                    galleryCountByProject={(id) => galleries.filter(g => g.projectId === id).length}
                    journalCountByProject={(id) => journalEntries.filter(j => j.projectId === id).length}
                />;
            case 'discover':
                return <ArtLibrary 
                    onSearch={handleSearch}
                    onAnalyzeImage={handleAnalyzeImage}
                    onViewArtworkDetails={handleViewDetails}
                    onShowCamera={handleShowCamera}
                    artworks={artworks}
                    isLoading={activeAiTask === 'search' || activeAiTask === 'similar' || activeAiTask === 'analyze'}
                    searchTerm={searchTerm}
                    similarTo={similarTo}
                    featuredArtworks={featuredArtworks}
                />;
            case 'studio':
                return <Studio 
                    onInitiateAdd={initiateAddToGallery}
                />
            case 'journal':
                 return <Journal
                    entries={journalEntries.filter(j => !j.projectId)} // Only show non-project entries here
                    onNewEntry={handleNewJournalEntry}
                    galleries={galleries}
                    onUpdateEntry={updateJournalEntry}
                    onDeleteEntry={deleteJournalEntry}
                    language={language}
                />;
            case 'profile':
                return <ProfileView 
                    setActiveView={(v) => navigateTo({ view: v })}
                    stats={{
                        galleriesCurated: galleries.length,
                        artworksDiscovered: galleries.reduce((sum, g) => sum + g.artworks.filter(a => !a.isGenerated).length, 0),
                        aiArtworksCreated: galleries.reduce((sum, g) => sum + g.artworks.filter(a => a.isGenerated).length, 0),
                    }}
                />;
            case 'setup':
                return <Setup 
                    theme={theme} onToggleTheme={toggleTheme} 
                    language={language} onSetLanguage={setLanguage}
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
                isPublicView={true}
                galleryTitle={publicGalleryData.gallery.title}
                curatorProfile={publicGalleryData.profile}
            />
        );
    }

    if (showWelcome) {
        return <WelcomePortal onEnter={handleEnterWelcome} />;
    }
    
    const getPageTitle = () => {
        if (currentGalleryId && activeGallery) return activeGallery.title;
        if (currentProjectId && activeProject) return activeProject.title;
        return undefined; // Let Header component handle the fallback
    };
    
    const activeViewForNav: ActiveView = currentProjectId ? 'project' : (currentGalleryId ? 'gallery' : currentView);

    return (
        <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
            <SideNavBar activeView={activeViewForNav} setActiveView={(v) => navigateTo({ view: v, projectId: null, galleryId: null })} galleryItemCount={galleries.filter(g => !g.projectId).length} />
            <main className="flex-1 flex flex-col h-screen">
                <Header 
                    activeView={activeViewForNav}
                    isProjectView={!!currentProjectId}
                    isGalleryView={!!currentGalleryId}
                    pageTitle={getPageTitle()}
                    onNewGallery={handleNewGalleryForProject}
                    onNewJournalEntry={handleNewJournalEntry}
                    onNewProject={handleNewProject}
                    onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                    onNavigateBack={navigateBack}
                    onNavigateToSettings={() => navigateTo({ view: 'setup' })}
                    onNavigateToHelp={() => navigateTo({ view: 'help' })}
                />
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    {renderActiveView()}
                </div>
                <BottomNavBar activeView={activeViewForNav} setActiveView={(v) => navigateTo({ view: v, projectId: null, galleryId: null })} />
            </main>

            {isAddModalOpen && <AddToGalleryModal 
                galleries={galleries}
                onSelectGallery={handleSelectGalleryForAdd}
                onCreateAndAdd={handleCreateAndAdd}
                onClose={() => setAddModalOpen(false)}
                isOpen={isAddModalOpen}
                activeProjectId={currentProjectId}
            />}
            <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} commands={commands} />
            <div id="command-palette-root"></div>
        </div>
    );
};

export default App;