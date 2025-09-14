import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ActiveView, Artwork, Gallery, Project, JournalEntry, Profile, ShareableGalleryData } from './types.ts';
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
import { GalleryManager } from './components/GalleryManager.tsx';
import { Cog6ToothIcon, GlobeAltIcon, HomeIcon, JournalIcon, PaintBrushIcon, QuestionMarkCircleIcon, SearchIcon, UserCircleIcon, GalleryIcon } from './components/IconComponents.tsx';
import { ProjectEditor } from './components/ProjectEditor.tsx';
import { ProfileEditor } from './components/ProfileEditor.tsx';
import { Button } from './components/ui/Button.tsx';

const App: React.FC = () => {
    const { t, language } = useTranslation();
    const { appSettings, isLoading: settingsLoading } = useAppSettings();
    const { profile, setProfile, isLoading: profileLoading } = useProfile();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();

    // State
    const [activeView, setActiveView] = useState<ActiveView>('workspace');
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
    const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<string | null>(null);
    const [newlyCreatedGalleryId, setNewlyCreatedGalleryId] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [previewGallery, setPreviewGallery] = useState<Gallery | null>(null);
    const [initialDiscoverSearch, setInitialDiscoverSearch] = useState<string>('');
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);


    // Hooks
    const { projects, addProject, updateProject, deleteProject, isLoading: projectsLoading } = useProjects();
    const { galleries, createGallery, updateGallery, deleteGallery, addArtworkToGallery, removeArtworkFromGallery, reorderArtworksInGallery, importGallery, isLoading: galleriesLoading, duplicateGallery } = useGallery();
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
    
    // Effect to handle shared gallery URLs
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#view=')) {
                try {
                    const encodedData = hash.substring(6);
                    const decodedJson = atob(encodedData);
                    const data: ShareableGalleryData = JSON.parse(decodedJson);
                    
                    if (data.gallery && data.profile) {
                        setPreviewGallery({ ...data.gallery, curatorProfile: data.profile });
                        // Clean the URL
                        window.history.replaceState(null, "", window.location.pathname + window.location.search);
                    }
                } catch (error) {
                    console.error("Failed to parse shared gallery data:", error);
                    showToast(t('toast.error.generic'), 'error');
                }
            }
        };
        
        handleHashChange(); // Check on initial load
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [showToast, t]);

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

    const handleSelectProject = useCallback((id: string) => {
        setActiveProjectId(id);
        setActiveView('project');
    }, []);

    const handleSelectGallery = useCallback((id: string) => {
        setActiveGalleryId(id);
        setActiveView('gallery');
    }, []);

    const handleFindSimilar = useCallback(async (artwork: Artwork) => {
        hideModal();
        showToast(t('toast.ai.thinking'), 'info');
        try {
            const query = await gemini.generateSimilarArtSearchQuery(artwork, language as 'de' | 'en');
            setInitialDiscoverSearch(query);
            setActiveView('discover');
            setTimeout(() => setInitialDiscoverSearch(''), 0);
        } catch (e) {
            console.error(e);
            showToast(t('toast.error.gemini'), 'error');
        }
    }, [hideModal, showToast, t, language]);
    
    const handleStartChat = useCallback((artwork: Artwork) => {
        showModal(t('chat.title', { title: artwork.title }), <ChatModal artwork={artwork} language={language} />);
    }, [showModal, t, language]);

    const handleInitiateAdd = useCallback((artwork: Artwork) => {
        hideModal();
        
        setTimeout(() => {
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
        }, 200);
    }, [addArtworkToGallery, showToast, t, galleries, hideModal, createGallery, activeProjectId, showModal]);

    const handleViewArtworkDetails = useCallback((artwork: Artwork) => {
        showModal(artwork.title, <ArtworkDetails 
            artwork={artwork}
            activeGallery={activeGallery}
            language={language}
            onClose={hideModal}
            onFindSimilar={handleFindSimilar}
            onInitiateAddToGallery={handleInitiateAdd}
            onRemoveFromGallery={(artworkId) => activeGalleryId && removeArtworkFromGallery(activeGalleryId, artworkId)}
            onAddComment={(artworkId, comment) => updateGallery(activeGalleryId!, g => ({ ...g, artworks: g.artworks.map(a => a.id === artworkId ? {...a, comment} : a) }))}
            onThematicSearch={() => {}}
            onStartChat={handleStartChat}
        />);
    }, [activeGallery, language, hideModal, handleFindSimilar, handleInitiateAdd, activeGalleryId, removeArtworkFromGallery, updateGallery, handleStartChat, showModal]);

    const handleNewProject = useCallback(() => {
        const id = addProject(t('workspace.newProject.defaultTitle'), t('workspace.newProject.defaultDesc'));
        setNewlyCreatedProjectId(id);
        setTimeout(() => setNewlyCreatedProjectId(null), 1500);
    }, [addProject, t]);

    const confirmAndDeleteProject = useCallback((project: Project) => {
        deleteProject(project.id);
        deleteJournalsByProjectId(project.id);
        galleries.filter(g => g.projectId === project.id).forEach(g => deleteGallery(g.id));
        showToast(t('toast.project.deleted', { title: project.title }), 'success');
    }, [deleteProject, deleteJournalsByProjectId, galleries, deleteGallery, showToast, t]);

    const handleDeleteProject = useCallback((project: Project) => {
        if (appSettings.showDeletionConfirmation) {
            showModal(t('delete.project.title'), (
                <div>
                    <p>{t('delete.project.confirm', { title: project.title })}</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={() => { confirmAndDeleteProject(project); hideModal(); }}>{t('remove')}</Button>
                    </div>
                </div>
            ));
        } else {
            confirmAndDeleteProject(project);
        }
    }, [appSettings.showDeletionConfirmation, showModal, hideModal, t, confirmAndDeleteProject]);

    const handleNewGallery = useCallback(() => {
        const newId = createGallery({ title: t('gallery.new'), description: '', projectId: activeProjectId });
        handleSelectGallery(newId);
    }, [createGallery, activeProjectId, handleSelectGallery, t]);

    const handleNewGallerySuite = useCallback(() => {
        const newId = createGallery({ title: t('gallery.new'), description: '', projectId: null });
        setNewlyCreatedGalleryId(newId);
        setTimeout(() => setNewlyCreatedGalleryId(null), 1500);
        handleSelectGallery(newId);
    }, [createGallery, handleSelectGallery, t]);
    
    const handleDuplicateGallery = useCallback((id: string) => {
        const galleryToDuplicate = galleries.find(g => g.id === id);
        if (!galleryToDuplicate) return;
        
        const newId = duplicateGallery(id);
        if(newId) {
            showToast(t('toast.gallery.duplicated', { title: galleryToDuplicate.title }), 'success');
        }
    }, [galleries, duplicateGallery, showToast, t]);
    
    const handleImportGallery = useCallback((gallery: Gallery) => {
        importGallery(gallery);
        showToast(t('toast.gallery.imported', { title: gallery.title }), 'success');
    }, [importGallery, showToast, t]);

    const handleEditProject = useCallback((project: Project) => {
        showModal(t('workspace.editProject'), <ProjectEditor 
            project={project}
            onSave={(details) => {
                updateProject(project.id, details);
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, updateProject, hideModal]);

    const handleEditProfile = useCallback(() => {
        showModal(t('profile.edit.title'), <ProfileEditor 
            profile={profile}
            onSave={(newProfileData) => {
                setProfile(newProfileData);
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, profile, setProfile, hideModal]);
    
    const commands = useMemo(() => [
        { id: 'nav-workspace', name: t('view.workspace'), action: () => { handleSetView('workspace'); setIsCommandPaletteOpen(false); }, icon: <HomeIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-discover', name: t('view.discover'), action: () => { handleSetView('discover'); setIsCommandPaletteOpen(false); }, icon: <SearchIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-gallerysuite', name: t('view.gallerysuite'), action: () => { handleSetView('gallerysuite'); setIsCommandPaletteOpen(false); }, icon: <GalleryIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-studio', name: t('view.studio'), action: () => { handleSetView('studio'); setIsCommandPaletteOpen(false); }, icon: <PaintBrushIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-journal', name: t('view.journal'), action: () => { handleSetView('journal'); setIsCommandPaletteOpen(false); }, icon: <JournalIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-community', name: t('view.community'), action: () => { handleSetView('community'); setIsCommandPaletteOpen(false); }, icon: <GlobeAltIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-profile', name: t('view.profile'), action: () => { handleSetView('profile'); setIsCommandPaletteOpen(false); }, icon: <UserCircleIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-settings', name: t('view.setup'), action: () => { handleSetView('setup'); setIsCommandPaletteOpen(false); }, icon: <Cog6ToothIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-help', name: t('view.help'), action: () => { handleSetView('help'); setIsCommandPaletteOpen(false); }, icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, section: 'Account' }
    ], [t, handleSetView]);

    if (isLoading) {
        return <PageLoader message={t('loader.generic')} />;
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
                    onEditProject={handleEditProject}
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
                    onEditProject={handleEditProject}
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
                    onClose={() => activeGallery.projectId ? handleSelectProject(activeGallery.projectId) : handleSetView('gallerysuite')}
                    onUpdate={(updater) => updateGallery(activeGallery.id, updater)}
                    onRemoveArtwork={(artworkId) => removeArtworkFromGallery(activeGallery.id, artworkId)}
                    onReorderArtworks={(reordered) => reorderArtworksInGallery(activeGallery.id, reordered)}
                    onViewDetails={handleViewArtworkDetails}
                    onInitiateAdd={handleInitiateAdd}
                /> : null;
            case 'gallerysuite':
                return <GalleryManager 
                    galleries={galleries}
                    projects={projects}
                    onSelectGallery={handleSelectGallery}
                    onCreateNew={handleNewGallerySuite}
                    onDeleteGallery={deleteGallery}
                    onDuplicateGallery={handleDuplicateGallery}
                    newlyCreatedId={newlyCreatedGalleryId}
                />;
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
                return <ProfileView setActiveView={handleSetView} onEditProfile={handleEditProfile} stats={{ galleriesCurated, artworksDiscovered, aiArtworksCreated }}/>;
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
                    onEditProject={handleEditProject}
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