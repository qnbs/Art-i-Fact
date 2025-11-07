import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { setActiveView as setStoreActiveView, setActiveProjectId as setStoreActiveProjectId, setActiveGalleryId as setStoreActiveGalleryId, setCommandPaletteOpen } from '../store/uiSlice.ts';
import { fetchProjects, addProject, updateProject, deleteProject, deleteAllProjects } from '../store/projectsSlice.ts';
import { fetchGalleries, createGallery, updateGallery, deleteGallery, deleteGalleriesByProjectId, addArtworkToGallery, removeArtworkFromGallery, reorderArtworksInGallery, importGallery, duplicateGallery, deleteAllGalleries } from '../store/galleriesSlice.ts';
import { fetchJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, deleteJournalsByProjectId, deleteAllJournals } from '../store/journalSlice.ts';
import { fetchSettings, updateSettings, resetSettings } from '../store/settingsSlice.ts';
import { fetchProfile, updateProfile, resetProfile } from '../store/profileSlice.ts';
import { fetchWelcomeStatus, setShowWelcome as setStoreShowWelcome, setInitialDiscoverSearch, setPreviewGallery } from '../store/appSlice.ts';
import type { ActiveView, Gallery, Artwork } from '../types.ts';

export const useAppController = () => {
    const dispatch = useAppDispatch();

    // Select state from Redux store
    const { settings, status: settingsStatus } = useAppSelector(state => state.settings);
    const { profile, status: profileStatus } = useAppSelector(state => state.profile);
    const { projects, status: projectsStatus } = useAppSelector(state => state.projects);
    const { galleries, status: galleriesStatus } = useAppSelector(state => state.galleries);
    const { entries, status: journalStatus } = useAppSelector(state => state.journal);
    const { activeView, activeProjectId, activeGalleryId, isCommandPaletteOpen, newlyCreatedProjectId, newlyCreatedGalleryId } = useAppSelector(state => state.ui);
    const { showWelcome, previewGallery, initialDiscoverSearch, status: appStatus } = useAppSelector(state => state.app);

    // Initial data fetch effect
    useEffect(() => {
        if (settingsStatus === 'idle') dispatch(fetchSettings());
        if (profileStatus === 'idle') dispatch(fetchProfile());
        if (projectsStatus === 'idle') dispatch(fetchProjects());
        if (galleriesStatus === 'idle') dispatch(fetchGalleries());
        if (journalStatus === 'idle') dispatch(fetchJournalEntries());
        if (appStatus === 'idle') dispatch(fetchWelcomeStatus());
    }, [dispatch, settingsStatus, profileStatus, projectsStatus, galleriesStatus, journalStatus, appStatus]);

    const isLoading = [settingsStatus, profileStatus, projectsStatus, galleriesStatus, journalStatus, appStatus].some(s => s !== 'succeeded');
    
    // Memoized data selectors
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const activeGallery = useMemo(() => galleries.find(g => g.id === activeGalleryId), [galleries, activeGalleryId]);
    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === activeProjectId), [galleries, activeProjectId]);
    const projectJournals = useMemo(() => entries.filter(j => j.projectId === activeProjectId), [entries, activeProjectId]);
    const galleryCountByProject = useCallback((projectId: string) => galleries.filter(g => g.projectId === projectId).length, [galleries]);
    const journalCountByProject = useCallback((projectId: string) => entries.filter(j => j.projectId === projectId).length, [entries]);

    // Action dispatchers (wrapped to preserve hook API)
    const handleSetView = useCallback((view: ActiveView) => dispatch(setStoreActiveView(view)), [dispatch]);
    const handleSelectProject = useCallback(async (id: string): Promise<void> => {
        await dispatch(setStoreActiveProjectId(id));
    }, [dispatch]);
    const handleSelectGallery = useCallback(async (id: string): Promise<void> => {
        await dispatch(setStoreActiveGalleryId(id));
    }, [dispatch]);
    const setIsCommandPaletteOpen = useCallback((isOpen: boolean) => dispatch(setCommandPaletteOpen(isOpen)), [dispatch]);
    const setShowWelcome = useCallback((show: boolean) => dispatch(setStoreShowWelcome(show)), [dispatch]);
    const setPreviewGallery = useCallback((gallery: Gallery | null) => dispatch(setPreviewGallery(gallery)), [dispatch]);
    const setInitialDiscoverSearch = useCallback((query: string) => dispatch(setInitialDiscoverSearch(query)), [dispatch]);

    // Data mutation thunk dispatchers
    const setAppSettings = useCallback((s: Partial<typeof settings>) => dispatch(updateSettings(s)), [dispatch]);
    const handleResetAppSettings = useCallback(() => dispatch(resetSettings()), [dispatch]);
    const setProfile = useCallback((p: Partial<typeof profile>) => dispatch(updateProfile(p)), [dispatch]);
    const handleResetProfile = useCallback(() => dispatch(resetProfile()), [dispatch]);

    const handleAddProject = useCallback(async (title: string, description: string): Promise<string> => {
        const result = await dispatch(addProject({ title, description }));
        if (addProject.fulfilled.match(result)) {
            return result.payload.id;
        }
        throw new Error('Failed to create project');
    }, [dispatch]);
    const handleUpdateProject = useCallback((id: string, details: any) => dispatch(updateProject({ id, updatedDetails: details })), [dispatch]);
    const handleDeleteProject = useCallback((id: string) => dispatch(deleteProject(id)), [dispatch]);
    const handleDeleteAllProjects = useCallback(() => dispatch(deleteAllProjects()), [dispatch]);

    const handleCreateGallery = useCallback(async (details: any): Promise<string> => {
        const result = await dispatch(createGallery(details));
        if (createGallery.fulfilled.match(result)) {
            return result.payload.id;
        }
        throw new Error('Failed to create gallery');
    }, [dispatch]);
    const handleUpdateGallery = useCallback((id: string, updater: any) => dispatch(updateGallery({ id, updater })), [dispatch]);
    const handleDeleteGallery = useCallback((id: string) => dispatch(deleteGallery(id)), [dispatch]);
    const handleDeleteGalleriesByProjectId = useCallback((id: string) => dispatch(deleteGalleriesByProjectId(id)), [dispatch]);
    const handleDeleteAllGalleries = useCallback(() => dispatch(deleteAllGalleries()), [dispatch]);
    const handleAddArtworkToGallery = useCallback((galleryId: string, artwork: Artwork) => dispatch(addArtworkToGallery({ galleryId, artwork })), [dispatch]);
    const handleRemoveArtworkFromGallery = useCallback((galleryId: string, artworkId: string) => dispatch(removeArtworkFromGallery({ galleryId, artworkId })), [dispatch]);
    const handleReorderArtworksInGallery = useCallback((galleryId: string, reorderedArtworks: Artwork[]) => dispatch(reorderArtworksInGallery({ galleryId, reorderedArtworks })), [dispatch]);
    const handleImportGallery = useCallback(async (gallery: Gallery): Promise<string> => {
        const result = await dispatch(importGallery(gallery));
        if (importGallery.fulfilled.match(result)) {
            return result.payload.id;
        }
        throw new Error('Failed to import gallery');
    }, [dispatch]);
    const handleDuplicateGallery = useCallback(async (id: string): Promise<string> => {
        const result = await dispatch(duplicateGallery(id));
        if (duplicateGallery.fulfilled.match(result)) {
            return result.payload.id;
        }
        throw new Error('Failed to duplicate gallery');
    }, [dispatch]);

    const handleCreateJournalEntry = useCallback(async (projectId: string | null): Promise<string> => {
        const result = await dispatch(createJournalEntry({ projectId, defaultTitle: settings.defaultJournalTitle }));
        if (createJournalEntry.fulfilled.match(result)) {
            return result.payload.id;
        }
        throw new Error('Failed to create journal entry');
    }, [dispatch, settings.defaultJournalTitle]);
    const handleUpdateJournalEntry = useCallback((id: string, details: any) => dispatch(updateJournalEntry({ id, updatedDetails: details })), [dispatch]);
    const handleDeleteJournalEntry = useCallback((id: string) => dispatch(deleteJournalEntry(id)), [dispatch]);
    const handleDeleteJournalsByProjectId = useCallback((id: string) => dispatch(deleteJournalsByProjectId(id)), [dispatch]);
    const handleDeleteAllJournals = useCallback(() => dispatch(deleteAllJournals()), [dispatch]);

    return {
        isLoading,
        showWelcome,
        previewGallery,
        activeView,
        activeProject,
        activeGallery,
        activeProjectId,
        activeGalleryId,
        profile,
        projects,
        galleries,
        entries,
        projectGalleries,
        projectJournals,
        initialDiscoverSearch,
        isCommandPaletteOpen,
        appSettings: settings,
        newlyCreatedProjectId,
        newlyCreatedGalleryId,
        
        setAppSettings,
        resetAppSettings: handleResetAppSettings,
        setProfile,
        resetProfile: handleResetProfile,
        
        handleSetView,
        handleSelectProject,
        handleSelectGallery,
        setPreviewGallery,
        setShowWelcome,
        setInitialDiscoverSearch,
        setIsCommandPaletteOpen,
        
        galleryCountByProject,
        journalCountByProject,
        
        createJournalEntry: handleCreateJournalEntry,
        updateJournalEntry: handleUpdateJournalEntry,
        deleteJournalEntry: handleDeleteJournalEntry,
        deleteJournalsByProjectId: handleDeleteJournalsByProjectId,
        deleteAllJournals: handleDeleteAllJournals,
        
        addArtworkToGallery: handleAddArtworkToGallery,
        removeArtworkFromGallery: handleRemoveArtworkFromGallery,
        reorderArtworksInGallery: handleReorderArtworksInGallery,
        createGallery: handleCreateGallery,
        updateGallery: handleUpdateGallery,
        deleteGallery: handleDeleteGallery,
        importGallery: handleImportGallery,
        duplicateGallery: handleDuplicateGallery,
        deleteGalleriesByProjectId: handleDeleteGalleriesByProjectId,
        deleteAllGalleries: handleDeleteAllGalleries,
        
        addProject: handleAddProject,
        updateProject: handleUpdateProject,
        deleteProject: handleDeleteProject,
        deleteAllProjects: handleDeleteAllProjects,
    };
};