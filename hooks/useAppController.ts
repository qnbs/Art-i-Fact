import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store.ts';
import { setActiveView as setStoreActiveView, setActiveProjectId as setStoreActiveProjectId, setActiveGalleryId as setStoreActiveGalleryId, setCommandPaletteOpen } from '../store/uiSlice.ts';

import type { ActiveView, Gallery } from '../types.ts';
import { useAppSettings } from '../contexts/AppSettingsContext.tsx';
import { useProfile } from '../contexts/ProfileContext.tsx';
import { useProjects } from './useProjects.ts';
import { useGallery } from './useGallery.ts';
import { useJournal } from './useJournal.ts';
import { db } from '../services/dbService.ts';

export const useAppController = () => {
    // Hooks
    const { appSettings, isLoading: settingsLoading } = useAppSettings();
    const { profile, isLoading: profileLoading } = useProfile();
    
    // RTK State Management for UI
    const dispatch = useDispatch<AppDispatch>();
    const { activeView, activeProjectId, activeGalleryId, isCommandPaletteOpen } = useSelector((state: RootState) => state.ui);

    // Local state for non-global UI elements
    const [showWelcome, setShowWelcome] = useState(false);
    const [previewGallery, setPreviewGallery] = useState<Gallery | null>(null);
    const [initialDiscoverSearch, setInitialDiscoverSearch] = useState<string>('');

    // Data Hooks
    // FIX: Consolidate all data hooks and their functions into this controller.
    const { projects, addProject, updateProject, deleteProject, isLoading: projectsLoading } = useProjects();
    const { galleries, createGallery, updateGallery, deleteGallery, addArtworkToGallery, removeArtworkFromGallery, reorderArtworksInGallery, importGallery, duplicateGallery, isLoading: galleriesLoading } = useGallery();
    const { entries, createJournalEntry, updateJournalEntry, deleteJournalEntry, deleteJournalsByProjectId, isLoading: journalLoading } = useJournal(appSettings.defaultJournalTitle);
    
    const isLoading = settingsLoading || profileLoading || projectsLoading || galleriesLoading || journalLoading;

    // Effects
    useEffect(() => {
        const checkWelcomeSeen = async () => {
            const seen = await db.getWelcomeSeen();
            if (!seen && !isLoading) { // Only show welcome if not loading
                setShowWelcome(true);
            }
        };
        checkWelcomeSeen();
    }, [isLoading]);
    
    useEffect(() => {
      document.documentElement.className = appSettings.theme;
    }, [appSettings.theme]);

    // Memoized data selectors
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const activeGallery = useMemo(() => galleries.find(g => g.id === activeGalleryId), [galleries, activeGalleryId]);
    const projectGalleries = useMemo(() => galleries.filter(g => g.projectId === activeProjectId), [galleries, activeProjectId]);
    const projectJournals = useMemo(() => entries.filter(j => j.projectId === activeProjectId), [entries, activeProjectId]);
    const galleryCountByProject = useCallback((projectId: string) => galleries.filter(g => g.projectId === projectId).length, [galleries]);
    const journalCountByProject = useCallback((projectId: string) => entries.filter(j => j.projectId === projectId).length, [entries]);
    
    // Handlers that dispatch actions to the Redux store
    const handleSetView = useCallback((view: ActiveView) => {
        dispatch(setStoreActiveView(view));
    }, [dispatch]);

    const handleSelectProject = useCallback((id: string) => {
        dispatch(setStoreActiveProjectId(id));
    }, [dispatch]);

    const handleSelectGallery = useCallback((id: string) => {
        dispatch(setStoreActiveGalleryId(id));
    }, [dispatch]);

    const setIsCommandPaletteOpen = useCallback((isOpen: boolean) => {
        dispatch(setCommandPaletteOpen(isOpen));
    }, [dispatch]);

    return {
        // State & Data
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
        
        // Simple Handlers & Setters
        handleSetView,
        handleSelectProject,
        handleSelectGallery,
        setPreviewGallery,
        setShowWelcome,
        setInitialDiscoverSearch,
        setIsCommandPaletteOpen,
        
        // Count Functions
        galleryCountByProject,
        journalCountByProject,
        
        // Journal handlers
        createJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        deleteJournalsByProjectId,
        
        // Gallery handlers
        addArtworkToGallery,
        removeArtworkFromGallery,
        reorderArtworksInGallery,
        createGallery,
        updateGallery,
        deleteGallery,
        importGallery,
        duplicateGallery,
        
        // Project handlers
        addProject,
        updateProject,
        deleteProject,
    };
};