import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ActiveView, Artwork, Gallery, Project, JournalEntry } from './types.ts';
import { useTranslation } from './contexts/TranslationContext.tsx';
import { useAppSettings } from './contexts/AppSettingsContext.tsx';
import { useProfile } from './contexts/ProfileContext.tsx';
import { useModal } from './contexts/ModalContext.tsx';
import { useToast } from './contexts/ToastContext.tsx';
import { useProjects } from './hooks/useProjects.ts';
import { useGallery } from './hooks/useGallery.ts';
import { useJournal } from './hooks/useJournal.ts';
import { db } from './services/dbService.ts';
import * as gemini from './services/geminiService.ts';
import { WELCOME_PORTAL_SEEN_KEY } from './constants.ts';

import { SideNavBar } from './components/SideNavBar.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { Header } from './components/Header.tsx';
// FIX: Correctly export and import Workspace component.
import { Workspace } from './components/Workspace.tsx';
import { ProjectView } from './components/ProjectView.tsx';
import { ArtLibrary } from './components/ArtLibrary.tsx';
import { GalleryView } from './components/GalleryView.tsx';
import { Studio } from './components/Studio.tsx';
import { Journal } from './components/Journal.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { Setup } from './components/Setup.tsx';
import { Help } from './components/Help.tsx';
import { ArtworkDetails } from './components/ArtworkDetails.tsx';
import { AddToGalleryModal } from './components/AddToGalleryModal.tsx';
import { ChatModal } from './components/ChatModal.tsx';
import { WelcomePortal } from './components/WelcomePortal.tsx';
import { PageLoader } from './components/ui/PageLoader.tsx';
import { CommunityView } from './components/CommunityView.tsx';
import { ExhibitionMode } from './components/ExhibitionMode.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import { Cog6ToothIcon, GlobeAltIcon, HomeIcon, JournalIcon, PaintBrushIcon, QuestionMarkCircleIcon, SearchIcon, UserCircleIcon } from './components/IconComponents.tsx';

const App: React.FC = () => {
    const { t, language } = useTranslation();
    const { appSettings, isLoading: settingsLoading } = useAppSettings();
    // FIX: Destructure isLoading from useProfile hook, which is now correctly provided by the context.
    const { profile, isLoading: profileLoading } = useProfile();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();

    // State
    const [activeView, setActiveView] = useState<ActiveView>('workspace');
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
    const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [previewGallery, setPreviewGallery] = useState<Gallery | null>(null);
    const [initialDiscoverSearch, setInitialDiscoverSearch] = useState<string>('');
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);


    // Hooks
    const { projects, addProject, updateProject, deleteProject, isLoading: projectsLoading } = useProjects();
    const { galleries, createGallery, updateGallery, deleteGallery, addArtworkToGallery, removeArtworkFromGallery, reorderArtworksInGallery, importGallery, isLoading: galleriesLoading } = useGallery();
    const { entries, createJournalEntry, updateJournalEntry, deleteJournalEntry, deleteJournalsByProjectId, isLoading: journalLoading } = useJournal(appSettings.defaultJournalTitle);
    
    const isLoading = settingsLoading || profileLoading || projectsLoading || galleriesLoading || journalLoading;

    // Effects
    useEffect(() => {
        const checkWelcomeSeen = async () => {
            const seen = await db.getWelcomeSeen();
            if (!seen) {
                setShowWelcome(true);
            }
        };
        checkWelcomeSeen();
    }, []);

    useEffect(() => {
      document.documentElement.className = appSettings.theme;
    }, [appSettings.theme]);

    // Memoized data
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const activeGallery = useMemo(() => galleries.find(g => g.id === activeGalleryId), [galleries, activeGalleryId]);

    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === activeProjectId), [galleries, activeProjectId]);
    const projectJournals = useMemo(() => entries.filter(j => j.projectId === activeProjectId), [entries, activeProjectId]);

    const galleryCountByProject = useCallback((projectId: string) => galleries.filter(g => g.projectId === projectId).length, [galleries]);
    const journalCountByProject = useCallback((projectId: string) => entries.filter(j => j.projectId === projectId).length, [entries]);
    
    // Handlers
    const handleSetView = useCallback((view: ActiveView) => {
        if (view !== 'project' && view !== 'gallery') {
            setActiveProjectId(null);
            setActiveGalleryId(null);
        }
        setActiveView(view);
    }, []);

    const handleSelectProject = (id: string) => {
        setActiveProjectId(id);
        setActiveView('project');
    };

    const handleSelectGallery = (id: string) => {
        setActiveGalleryId(id);
        setActiveView('gallery');
    };

    const handleFindSimilar = async (artwork: Artwork) => {
        hideModal();
        showToast('AI is crafting a search for similar art...', 'info');
        try {
            const query = await gemini.generateSimilarArtSearchQuery(artwork, language as 'de' | 'en');
            setInitialDiscoverSearch(query);
            setActiveView('discover');
            // Clear the initial search so it doesn't re-trigger
            setTimeout(() => setInitialDiscoverSearch(''), 0);
        } catch (e) {
            console.error(e);
            showToast(t('toast.error.gemini'), 'error');
        }
    };

    const handleViewArtworkDetails = (artwork: Artwork) => {
        showModal(artwork.title, <ArtworkDetails 
            artwork={artwork}
            activeGallery={activeGallery}
            language={language}
            onClose={hideModal}
            onFindSimilar={handleFindSimilar}
            onInitiateAddToGallery={handleInitiateAdd}
            // FIX: Pass a function that calls removeArtworkFromGallery with the required galleryId.
            onRemoveFromGallery={(artworkId) => activeGalleryId && removeArtworkFromGallery(activeGalleryId, artworkId)}
            onAddComment={(artworkId, comment) => updateGallery(activeGalleryId!, g => ({ ...g, artworks: g.artworks.map(a => a.id === artworkId ? {...a, comment} : a) }))}
            onThematicSearch={() => {}}
            onStartChat={handleStartChat}
        />);
    };

    const handleStartChat = (artwork: Artwork) => {
        showModal(t('chat.title', { title: artwork.title }), <ChatModal artwork={artwork} language={language} />);
    };
    
    const handleInitiateAdd = (artwork: Artwork) => {
        const handleAddToGallery = (galleryId: string) => {
            addArtworkToGallery(galleryId, artwork);
            showToast(t('toast.artwork.added', { gallery: galleries.find(g => g.id === galleryId)?.title || '' }), 'success');
            hideModal();
        }
        const handleCreateAndAdd = () => {
             const newId = createGallery({
                title: t('gallery.new'),
                description: '',
                projectId: activeProjectId,
             });
             addArtworkToGallery(newId, artwork);
             showToast(t('toast.artwork.added', { gallery: t('gallery.new') }), 'success');
             hideModal();
        }
        showModal(t('modal.addToGallery.title'), <AddToGalleryModal 
            galleries={galleries}
            onSelectGallery={handleAddToGallery}
            onCreateAndAdd={handleCreateAndAdd}
            activeProjectId={activeProjectId}
        />);
    };

    const handleNewProject = () => {
        const id = addProject('New Project', 'A collection of galleries and research.');
        setNewlyCreatedProjectId(id);
        setTimeout(() => setNewlyCreatedProjectId(null), 1500);
    };

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        deleteJournalsByProjectId(id);
        galleries.filter(g => g.projectId === id).forEach(g => deleteGallery(g.id));
    };

    const handleNewGallery = () => {
        const newId = createGallery({ title: 'New Gallery', description: '', projectId: activeProjectId });
        handleSelectGallery(newId);
    };
    
    const handleImportGallery = useCallback((gallery: Gallery) => {
        importGallery(gallery);
        showToast(t('toast.gallery.imported', { title: gallery.title }), 'success');
    }, [importGallery, showToast, t]);
    
    const commands = useMemo(() => [
        { id: 'nav-workspace', name: t('view.workspace'), action: () => { handleSetView('workspace'); setIsCommandPaletteOpen(false); }, icon: <HomeIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-discover', name: t('view.discover'), action: () => { handleSetView('discover'); setIsCommandPaletteOpen(false); }, icon: <SearchIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-studio', name: t('view.studio'), action: () => { handleSetView('studio'); setIsCommandPaletteOpen(false); }, icon: <PaintBrushIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-journal', name: t('view.journal'), action: () => { handleSetView('journal'); setIsCommandPaletteOpen(false); }, icon: <JournalIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-community', name: t('view.community'), action: () => { handleSetView('community'); setIsCommandPaletteOpen(false); }, icon: <GlobeAltIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-profile', name: t('view.profile'), action: () => { handleSetView('profile'); setIsCommandPaletteOpen(false); }, icon: <UserCircleIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-settings', name: t('view.setup'), action: () => { handleSetView('setup'); setIsCommandPaletteOpen(false); }, icon: <Cog6ToothIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-help', name: t('view.help'), action: () => { handleSetView('help'); setIsCommandPaletteOpen(false); }, icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, section: 'Account' }
    ], [t, handleSetView]);

    if (isLoading) {
        return <PageLoader message="Loading your creative space..." />;
    }
    
    if (showWelcome) {
        return <WelcomePortal onDone={() => { db.setWelcomeSeen(true); setShowWelcome(false); }} />;
    }
    
    if (previewGallery) {
        return <ExhibitionMode 
            artworks={previewGallery.artworks} 
            onClose={() => setPreviewGallery(null)}
            isPublicView={true}
            galleryTitle={previewGallery.title}
            curatorProfile={previewGallery.curatorProfile}
        />;
    }

    const renderContent = () => {
        switch (activeView) {
            case 'workspace':
                return <Workspace 
                    projects={projects}
                    onNewProject={handleNewProject}
                    onSelectProject={handleSelectProject}
                    onDeleteProject={handleDeleteProject}
                    galleryCountByProject={galleryCountByProject}
                    journalCountByProject={journalCountByProject}
                    newlyCreatedId={newlyCreatedProjectId}
                />;
            case 'project':
                return activeProject ? <ProjectView
                    project={activeProject}
                    onClose={() => handleSetView('workspace')}
                    onUpdateProject={updateProject}
                    galleries={projectGalleries}
                    journalEntries={projectJournals}
                    language={language}
                    onNewGallery={handleNewGallery}
                    onSelectGallery={handleSelectGallery}
                    onDeleteGallery={deleteGallery}
                    onUpdateJournalEntry={updateJournalEntry}
                    onDeleteJournalEntry={deleteJournalEntry}
                    onNewJournalEntry={() => createJournalEntry(activeProjectId)}
                /> : null;
            case 'discover':
                return <ArtLibrary 
                    onViewDetails={handleViewArtworkDetails} 
                    onInitiateAdd={handleInitiateAdd} 
                    initialSearchQuery={initialDiscoverSearch}
                />;
            case 'gallery':
                return activeGallery ? <GalleryView 
                    gallery={activeGallery} 
                    language={language}
                    onClose={() => activeGallery.projectId ? handleSelectProject(activeGallery.projectId) : handleSetView('workspace')}
                    onUpdate={(updater) => updateGallery(activeGallery.id, updater)}
                    onRemoveArtwork={(artworkId) => removeArtworkFromGallery(activeGallery.id, artworkId)}
                    onReorderArtworks={(reordered) => reorderArtworksInGallery(activeGallery.id, reordered)}
                    onViewDetails={handleViewArtworkDetails}
                    onInitiateAdd={handleInitiateAdd}
                    onFindSimilar={() => {}}
                /> : null;
            case 'studio':
                return <Studio onInitiateAdd={handleInitiateAdd} />;
            case 'journal':
                 return <Journal 
                    entries={entries.filter(e => !e.projectId)}
                    galleries={galleries}
                    language={language}
                    onUpdateEntry={updateJournalEntry}
                    onDeleteEntry={deleteJournalEntry}
                    onNewEntry={createJournalEntry}
                 />
            case 'profile':
                 const galleriesCurated = galleries.length;
                 const artworksDiscovered = galleries.reduce((sum, g) => sum + g.artworks.filter(a => !a.isGenerated).length, 0);
                 const aiArtworksCreated = galleries.reduce((sum, g) => sum + g.artworks.filter(a => a.isGenerated).length, 0);
                return <ProfileView setActiveView={handleSetView} stats={{ galleriesCurated, artworksDiscovered, aiArtworksCreated }}/>;
            case 'setup':
                return <Setup />;
            case 'help':
                return <Help />;
            case 'community':
                return <CommunityView 
                    onPreviewGallery={setPreviewGallery}
                    onImportGallery={handleImportGallery}
                />;
            default:
                return <Workspace 
                    projects={projects}
                    onNewProject={handleNewProject}
                    onSelectProject={handleSelectProject}
                    onDeleteProject={handleDeleteProject}
                    galleryCountByProject={galleryCountByProject}
                    journalCountByProject={journalCountByProject}
                    newlyCreatedId={newlyCreatedProjectId}
                />;
        }
    };
    
    return (
         <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            <SideNavBar activeView={activeView} setActiveView={handleSetView} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header 
                    activeView={activeView}
                    setActiveView={handleSetView}
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                    activeProjectTitle={activeProject?.title}
                    activeGalleryTitle={activeGallery?.title}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderContent()}
                </main>
                <BottomNavBar activeView={activeView} setActiveView={handleSetView} />
            </div>
            <CommandPalette 
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                commands={commands}
            />
        </div>
    );
};

export default App;