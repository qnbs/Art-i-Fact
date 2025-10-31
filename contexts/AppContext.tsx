import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import type { ActiveView, Artwork, Gallery, Project, ShareableGalleryData, JournalEntry, AppSettings } from '../types.ts';

import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchProjects, addProject, updateProject, deleteProject } from '../store/projectsSlice.ts';
import { fetchGalleries, createGallery, updateGallery as updateGalleryAction, deleteGallery, importGallery, duplicateGallery, addArtworkToGallery, removeArtworkFromGallery, reorderArtworksInGallery, deleteGalleriesByProjectId } from '../store/galleriesSlice.ts';
import { fetchJournalEntries, createJournalEntry as createJournalEntryAction, updateJournalEntry as updateJournalEntryAction, deleteJournalEntry as deleteJournalEntryAction, deleteJournalsByProjectId } from '../store/journalSlice.ts';
import { fetchSettings, updateSettings as updateSettingsAction, resetSettings as resetSettingsAction } from '../store/settingsSlice.ts';
import { fetchProfile, updateProfile } from '../store/profileSlice.ts';
import { fetchWelcomeStatus, setPreviewGallery, setShowWelcome, setInitialDiscoverSearch } from '../store/appSlice.ts';
import { setActiveView as setStoreActiveView, setActiveProjectId, setActiveGalleryId, setCommandPaletteOpen } from '../store/uiSlice.ts';

import { useTranslation } from './TranslationContext.tsx';
import { useModal } from './ModalContext.tsx';
import { useToast } from './ToastContext.tsx';
import * as gemini from '../services/geminiService.ts';

// Component Imports for Modals
import { ProjectEditor } from '../components/ProjectEditor.tsx';
import { ProfileEditor } from '../components/ProfileEditor.tsx';
import { Button } from '../components/ui/Button.tsx';
import { ChatModal } from '../components/ChatModal.tsx';
import { ArtworkDetails } from '../components/ArtworkDetails.tsx';
import { AddToGalleryModal } from '../components/AddToGalleryModal.tsx';
import { Cog6ToothIcon, GlobeAltIcon, HomeIcon, JournalIcon, PaintBrushIcon, QuestionMarkCircleIcon, SearchIcon, UserCircleIcon, GalleryIcon } from '../components/IconComponents.tsx';

interface AppContextType {
    isLoading: boolean;
    showWelcome: boolean;
    previewGallery: Gallery | null;
    activeView: ActiveView;
    activeProject?: Project;
    activeGallery?: Gallery;
    activeProjectId: string | null;
    profile: any;
    projects: Project[];
    galleries: Gallery[];
    entries: any[];
    projectGalleries: Gallery[];
    projectJournals: any[];
    initialDiscoverSearch: string;
    isCommandPaletteOpen: boolean;
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    resetSettings: () => void;
    toggleTheme: () => void;
    handleSetView: (view: ActiveView) => void;
    handleSelectProject: (id: string) => void;
    handleSelectGallery: (id: string) => void;
    setPreviewGallery: (gallery: Gallery | null) => void;
    setShowWelcome: (show: boolean) => void;
    setIsCommandPaletteOpen: (isOpen: boolean) => void;
    galleryCountByProject: (projectId: string) => number;
    journalCountByProject: (projectId: string) => number;
    handleNewProject: () => void;
    handleDeleteProject: (project: Project) => void;
    handleEditProject: (project: Project) => void;
    handleNewGallery: () => void;
    handleNewGallerySuite: () => void;
    handleDeleteGalleryWithConfirmation: (galleryId: string) => void;
    handleDuplicateGallery: (id: string) => void;
    handleImportGallery: (gallery: Gallery) => void;
    handleEditProfile: () => void;
    handleViewArtworkDetails: (artwork: Artwork) => void;
    handleInitiateAdd: (artwork: Artwork) => void;
    newlyCreatedProjectId: string | null;
    newlyCreatedGalleryId: string | null;
    commands: any[];
    language: 'de' | 'en';
    createJournalEntry: (projectId: string | null) => Promise<string>;
    updateJournalEntry: (id: string, updatedDetails: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
    deleteJournalEntry: (id: string) => void;
    updateGallery: (id: string, updater: (g: Gallery) => Gallery) => void;
    removeArtworkFromGallery: (galleryId: string, artworkId: string) => void;
    reorderArtworksInGallery: (galleryId: string, reorderedArtworks: Artwork[]) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { t, language } = useTranslation();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();

    // Fetch initial data on app load
    useEffect(() => {
        dispatch(fetchSettings());
        dispatch(fetchProfile());
        dispatch(fetchProjects());
        dispatch(fetchGalleries());
        dispatch(fetchJournalEntries());
        dispatch(fetchWelcomeStatus());
    }, [dispatch]);

    // Select state from Redux store
    const { settings, status: settingsStatus } = useAppSelector(state => state.settings);
    const { profile, status: profileStatus } = useAppSelector(state => state.profile);
    const { projects, status: projectsStatus } = useAppSelector(state => state.projects);
    const { galleries, status: galleriesStatus } = useAppSelector(state => state.galleries);
    const { entries, status: journalStatus } = useAppSelector(state => state.journal);
    const { activeView, activeProjectId, activeGalleryId, isCommandPaletteOpen } = useAppSelector(state => state.ui);
    const { showWelcome, previewGallery, initialDiscoverSearch, status: appStatus } = useAppSelector(state => state.app);

    const isLoading = [settingsStatus, profileStatus, projectsStatus, galleriesStatus, journalStatus, appStatus].some(s => s === 'idle' || s === 'loading');

    const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<string | null>(null);
    const [newlyCreatedGalleryId, setNewlyCreatedGalleryId] = useState<string | null>(null);

    // Memoized selectors for derived data
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const activeGallery = useMemo(() => galleries.find(g => g.id === activeGalleryId), [galleries, activeGalleryId]);
    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === activeProjectId), [galleries, activeProjectId]);
    const projectJournals = useMemo(() => entries.filter(j => j.projectId === activeProjectId), [entries, activeProjectId]);
    const galleryCountByProject = useCallback((projectId: string) => galleries.filter(g => g.projectId === projectId).length, [galleries]);
    const journalCountByProject = useCallback((projectId: string) => entries.filter(j => j.projectId === projectId).length, [entries]);

    // UI State Handlers (dispatching to uiSlice)
    const handleSetView = useCallback((view: ActiveView) => dispatch(setStoreActiveView(view)), [dispatch]);
    const handleSelectProject = useCallback((id: string) => dispatch(setActiveProjectId(id)), [dispatch]);
    const handleSelectGallery = useCallback((id: string) => dispatch(setActiveGalleryId(id)), [dispatch]);
    const handleSetIsCommandPaletteOpen = useCallback((isOpen: boolean) => dispatch(setCommandPaletteOpen(isOpen)), [dispatch]);
    const handleSetShowWelcome = useCallback((show: boolean) => dispatch(setShowWelcome(show)), [dispatch]);
    const handleSetPreviewGallery = useCallback((gallery: Gallery | null) => dispatch(setPreviewGallery(gallery)), [dispatch]);
    
    // Settings Handlers
    const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
        dispatch(updateSettingsAction(newSettings));
    }, [dispatch]);

    const handleResetSettings = useCallback(() => {
        dispatch(resetSettingsAction());
    }, [dispatch]);

    const handleToggleTheme = useCallback(() => {
        const newTheme = settings.theme === 'light' ? 'dark' : 'light';
        dispatch(updateSettingsAction({ theme: newTheme }));
    }, [dispatch, settings.theme]);

    // Complex Handlers
    const handleFindSimilar = useCallback(async (artwork: Artwork) => {
        hideModal();
        showToast(t('toast.ai.thinking'), 'info');
        try {
            const query = await gemini.generateSimilarArtSearchQuery(artwork, language as 'de' | 'en');
            dispatch(setInitialDiscoverSearch(query));
            handleSetView('discover');
            setTimeout(() => dispatch(setInitialDiscoverSearch('')), 0); 
        } catch (e) {
            console.error(e);
            showToast(t('toast.error.gemini'), 'error');
        }
    }, [hideModal, showToast, t, language, dispatch, handleSetView]);
    
    const handleStartChat = useCallback((artwork: Artwork) => {
        showModal(t('chat.title', { title: artwork.title }), <ChatModal artwork={artwork} language={language as 'de' | 'en'} />);
    }, [showModal, t, language]);

    const handleInitiateAdd = useCallback((artwork: Artwork) => {
        const handleAddExisting = (galleryId: string) => {
            dispatch(addArtworkToGallery({ galleryId, artwork }));
            showToast(t('toast.artwork.added', { gallery: galleries.find(g => g.id === galleryId)?.title || '' }), 'success');
            hideModal();
        }
        
        const handleCreateAndAdd = (details: { title: string; description: string; }) => {
             dispatch(createGallery({ ...details, projectId: activeProjectId })).then(action => {
                const newGallery = action.payload as Gallery;
                dispatch(addArtworkToGallery({ galleryId: newGallery.id, artwork }));
             });
             showToast(t('toast.artwork.added', { gallery: details.title }), 'success');
             hideModal();
        }

        showModal(t('modal.addToGallery.title'), <AddToGalleryModal 
            artwork={artwork}
            galleries={galleries}
            onAddExisting={handleAddExisting}
            onCreateAndAdd={handleCreateAndAdd}
            activeProjectId={activeProjectId}
        />);
    }, [dispatch, showToast, t, galleries, hideModal, activeProjectId, showModal]);

    const handleViewArtworkDetails = useCallback((artwork: Artwork) => {
        showModal(artwork.title, <ArtworkDetails 
            artwork={artwork}
            activeGallery={activeGallery}
            language={language as 'de' | 'en'}
            onClose={hideModal}
            onFindSimilar={handleFindSimilar}
            onInitiateAddToGallery={handleInitiateAdd}
            onRemoveFromGallery={(artworkId: string) => activeGalleryId && dispatch(removeArtworkFromGallery({ galleryId: activeGalleryId, artworkId }))}
            onAddComment={(artworkId: string, comment: string) => dispatch(updateGalleryAction({ id: activeGalleryId!, updater: g => ({ ...g, artworks: g.artworks.map(a => a.id === artworkId ? {...a, comment} : a) })))}
            onThematicSearch={(themes: string[]) => {
                dispatch(setInitialDiscoverSearch(themes.join(' ')));
                handleSetView('discover');
                hideModal();
            }}
            onStartChat={handleStartChat}
        />);
    }, [activeGallery, language, hideModal, handleFindSimilar, handleInitiateAdd, activeGalleryId, handleStartChat, showModal, dispatch, handleSetView]);

    const handleNewProject = useCallback(async () => {
        const action = await dispatch(addProject({ title: t('workspace.newProject.defaultTitle'), description: t('workspace.newProject.defaultDesc') }));
        const newProject = action.payload as Project;
        setNewlyCreatedProjectId(newProject.id);
        setTimeout(() => setNewlyCreatedProjectId(null), 1500);
    }, [dispatch, t]);
    
    const confirmAndDeleteProject = useCallback((project: Project) => {
        dispatch(deleteProject(project.id));
        dispatch(deleteJournalsByProjectId(project.id));
        dispatch(deleteGalleriesByProjectId(project.id));
        showToast(t('toast.project.deleted', { title: project.title }), 'success');
        hideModal();
    }, [dispatch, showToast, t, hideModal]);

    const handleDeleteProject = useCallback((project: Project) => {
        if (settings.showDeletionConfirmation) {
            showModal(t('delete.project.title'), (
                <div>
                    <p>{t('delete.project.confirm', { title: project.title })}</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={() => confirmAndDeleteProject(project)}>{t('remove')}</Button>
                    </div>
                </div>
            ));
        } else {
            confirmAndDeleteProject(project);
        }
    }, [settings.showDeletionConfirmation, showModal, t, confirmAndDeleteProject, hideModal]);
    
    const handleNewGallery = useCallback(async () => {
        const action = await dispatch(createGallery({ title: t('gallery.new'), description: '', projectId: activeProjectId }));
        const newGallery = action.payload as Gallery;
        handleSelectGallery(newGallery.id);
    }, [dispatch, t, activeProjectId, handleSelectGallery]);

    const handleNewGallerySuite = useCallback(async () => {
        const action = await dispatch(createGallery({ title: t('gallery.new'), description: '', projectId: null }));
        const newGallery = action.payload as Gallery;
        setNewlyCreatedGalleryId(newGallery.id);
        handleSelectGallery(newGallery.id);
        setTimeout(() => setNewlyCreatedGalleryId(null), 1500);
    }, [dispatch, handleSelectGallery, t]);

    const confirmAndDeleteGallery = useCallback((galleryId: string) => {
        const gallery = galleries.find(g => g.id === galleryId);
        if (!gallery) return;
        dispatch(deleteGallery(galleryId));
        showToast(t('toast.gallery.deleted', { title: gallery.title }), 'success');
        hideModal();
    }, [galleries, dispatch, showToast, t, hideModal]);
    
    const handleDeleteGalleryWithConfirmation = useCallback((galleryId: string) => {
        const gallery = galleries.find(g => g.id === galleryId);
        if (!gallery) return;
        if (settings.showDeletionConfirmation) {
            showModal(t('delete.gallery.title'), (
                <div>
                    <p>{t('delete.gallery.confirm', { title: gallery.title })}</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={() => confirmAndDeleteGallery(galleryId)}>{t('remove')}</Button>
                    </div>
                </div>
            ));
        } else {
            confirmAndDeleteGallery(galleryId);
        }
    }, [galleries, settings.showDeletionConfirmation, showModal, t, confirmAndDeleteGallery, hideModal]);

    const handleDuplicateGallery = useCallback(async (id: string) => {
        const galleryToDuplicate = galleries.find(g => g.id === id);
        if (!galleryToDuplicate) return;
        const action = await dispatch(duplicateGallery(id));
        if (action.meta.requestStatus === 'fulfilled') {
            showToast(t('toast.gallery.duplicated', { title: galleryToDuplicate.title }), 'success');
        }
    }, [galleries, dispatch, showToast, t]);
    
    const handleImportGallery = useCallback(async (gallery: Gallery) => {
        const action = await dispatch(importGallery(gallery));
        const newGallery = (action.payload as any)?.payload as Gallery;
        if (newGallery) {
            showToast(t('toast.gallery.imported', { title: gallery.title }), 'success');
            handleSelectGallery(newGallery.id);
        }
    }, [dispatch, showToast, t, handleSelectGallery]);

    const handleEditProject = useCallback((project: Project) => {
        showModal(t('workspace.editProject'), <ProjectEditor 
            project={project}
            onSave={(details) => {
                dispatch(updateProject({ id: project.id, updatedDetails: details }));
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, dispatch, hideModal]);

    const handleEditProfile = useCallback(() => {
        showModal(t('profile.edit.title'), <ProfileEditor 
            profile={profile}
            onSave={(newProfileData) => {
                dispatch(updateProfile(newProfileData));
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, profile, dispatch, hideModal]);

    const handleCreateJournalEntry = useCallback(async (projectId: string | null): Promise<string> => {
        const action = await dispatch(createJournalEntryAction({ projectId, defaultTitle: settings.defaultJournalTitle }));
        const newEntry = action.payload as JournalEntry;
        return newEntry.id;
    }, [dispatch, settings.defaultJournalTitle]);

    const handleUpdateJournalEntry = useCallback((id: string, updatedDetails: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        dispatch(updateJournalEntryAction({ id, updatedDetails }));
    }, [dispatch]);
    
    const handleDeleteJournalEntry = useCallback((id: string) => {
        dispatch(deleteJournalEntryAction(id));
    }, [dispatch]);

    const handleUpdateGallery = useCallback((id: string, updater: (g: Gallery) => Gallery) => {
        dispatch(updateGalleryAction({ id, updater }));
    }, [dispatch]);

    const handleRemoveArtworkFromGallery = useCallback((galleryId: string, artworkId: string) => {
        dispatch(removeArtworkFromGallery({ galleryId, artworkId }));
    }, [dispatch]);
    
    const handleReorderArtworksInGallery = useCallback((galleryId: string, reorderedArtworks: Artwork[]) => {
        dispatch(reorderArtworksInGallery({ galleryId, reorderedArtworks }));
    }, [dispatch]);
    
    const commands = useMemo(() => [
        { id: 'nav-workspace', name: t('view.workspace'), action: () => { handleSetView('workspace'); handleSetIsCommandPaletteOpen(false); }, icon: <HomeIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-discover', name: t('view.discover'), action: () => { handleSetView('discover'); handleSetIsCommandPaletteOpen(false); }, icon: <SearchIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-gallerysuite', name: t('view.gallerysuite'), action: () => { handleSetView('gallerysuite'); handleSetIsCommandPaletteOpen(false); }, icon: <GalleryIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-studio', name: t('view.studio'), action: () => { handleSetView('studio'); handleSetIsCommandPaletteOpen(false); }, icon: <PaintBrushIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-journal', name: t('view.journal'), action: () => { handleSetView('journal'); handleSetIsCommandPaletteOpen(false); }, icon: <JournalIcon className="w-5 h-5"/>, section: 'Navigation' },
        { id: 'nav-profile', name: t('view.profile'), action: () => { handleSetView('profile'); handleSetIsCommandPaletteOpen(false); }, icon: <UserCircleIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-settings', name: t('view.setup'), action: () => { handleSetView('setup'); handleSetIsCommandPaletteOpen(false); }, icon: <Cog6ToothIcon className="w-5 h-5"/>, section: 'Account' },
        { id: 'nav-help', name: t('view.help'), action: () => { handleSetView('help'); handleSetIsCommandPaletteOpen(false); }, icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, section: 'Account' }
    ], [t, handleSetView, handleSetIsCommandPaletteOpen]);

    const value: AppContextType = {
        isLoading,
        showWelcome,
        previewGallery,
        activeView,
        activeProject,
        activeGallery,
        activeProjectId,
        profile,
        projects,
        galleries,
        entries,
        projectGalleries,
        projectJournals,
        initialDiscoverSearch,
        isCommandPaletteOpen,
        settings,
        updateSettings: handleUpdateSettings,
        resetSettings: handleResetSettings,
        toggleTheme: handleToggleTheme,
        handleSetView,
        handleSelectProject,
        handleSelectGallery,
        setPreviewGallery: handleSetPreviewGallery,
        setShowWelcome: handleSetShowWelcome,
        setIsCommandPaletteOpen: handleSetIsCommandPaletteOpen,
        galleryCountByProject,
        journalCountByProject,
        handleNewProject,
        handleDeleteProject,
        handleEditProject,
        handleNewGallery,
        handleNewGallerySuite,
        handleDeleteGalleryWithConfirmation,
        handleDuplicateGallery,
        handleImportGallery,
        handleEditProfile,
        handleViewArtworkDetails,
        handleInitiateAdd,
        newlyCreatedProjectId,
        newlyCreatedGalleryId,
        commands,
        language: language as 'de' | 'en',
        createJournalEntry: handleCreateJournalEntry,
        updateJournalEntry: handleUpdateJournalEntry,
        deleteJournalEntry: handleDeleteJournalEntry,
        updateGallery: handleUpdateGallery,
        removeArtworkFromGallery: handleRemoveArtworkFromGallery,
        reorderArtworksInGallery: handleReorderArtworksInGallery,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};