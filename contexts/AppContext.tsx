import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useAppController } from '../hooks/useAppController.ts';
import type { ActiveView, Gallery, Project, Artwork, Profile, AppSettings, JournalEntry, ShareableGalleryData } from '../types.ts';
import { useModal } from './ModalContext.tsx';
import { useToast } from './ToastContext.tsx';
import { useTranslation } from './TranslationContext.tsx';

import type { Command } from '../components/CommandPalette.tsx';
import { ProjectEditor } from '../components/ProjectEditor.tsx';
import { GalleryCreator } from '../components/GalleryCreator.tsx';
import { ArtworkDetails } from '../components/ArtworkDetails.tsx';
import { AddToGalleryModal } from '../components/AddToGalleryModal.tsx';
import { ProfileEditor } from '../components/ProfileEditor.tsx';
import { ChatModal } from '../components/ChatModal.tsx';
import { HomeIcon, SearchIcon, PaintBrushIcon, JournalIcon, UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, GalleryIcon, PlusCircleIcon } from '../components/IconComponents.tsx';
// FIX: Import gemini service.
import * as gemini from '../services/geminiService.ts';

type AppControllerReturnType = ReturnType<typeof useAppController>;

// FIX: Add missing properties to the context type.
export type AppContextType = AppControllerReturnType & {
    language: 'de' | 'en';
    settings: AppSettings;
    handleNewProject: () => void;
    handleEditProject: (project: Project) => void;
    handleDeleteProject: (project: Project) => void;
    handleNewGallery: () => void;
    handleNewGallerySuite: () => void;
    handleDeleteGalleryWithConfirmation: (id: string) => void;
    handleDuplicateGallery: (id: string) => void;
    handleViewArtworkDetails: (artwork: Artwork) => void;
    handleInitiateAdd: (artwork: Artwork) => void;
    handleEditProfile: () => void;
    onStartChat: (artwork: Artwork) => void;
    handleThematicSearch: (themes: string[]) => void;
    commands: Command[];
    newlyCreatedProjectId: string | null;
    newlyCreatedGalleryId: string | null;
    toggleTheme: () => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetSettings: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const controller = useAppController();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();
    const { t, language } = useTranslation();
    // FIX: Correctly destructure `resetAppSettings` from the controller and rename `appSettings` to `settings`.
    const { appSettings: settings, setAppSettings, resetAppSettings } = controller;

    const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<string | null>(null);
    const [newlyCreatedGalleryId, setNewlyCreatedGalleryId] = useState<string | null>(null);

    useEffect(() => {
        if (newlyCreatedProjectId) {
            const timer = setTimeout(() => setNewlyCreatedProjectId(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [newlyCreatedProjectId]);

    useEffect(() => {
        if (newlyCreatedGalleryId) {
            const timer = setTimeout(() => setNewlyCreatedGalleryId(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [newlyCreatedGalleryId]);
    
    // FIX: Implement theme toggling logic.
    const toggleTheme = useCallback(() => {
        setAppSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
    }, [setAppSettings, settings.theme]);

    const handleNewProject = useCallback(() => {
        showModal(t('workspace.newProject'), <ProjectEditor
            onSave={async (details) => {
                const newId = controller.addProject(details.title, details.description);
                setNewlyCreatedProjectId(newId);
                controller.handleSelectProject(newId);
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, controller.addProject, controller.handleSelectProject, hideModal]);

    const handleEditProject = useCallback((project: Project) => {
        showModal(t('workspace.editProject'), <ProjectEditor
            project={project}
            onSave={(details) => {
                controller.updateProject(project.id, details);
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, controller.updateProject, hideModal]);

    const handleDeleteProject = useCallback((project: Project) => {
        const confirmAndDelete = () => {
            controller.deleteProject(project.id);
            controller.deleteGalleriesByProjectId(project.id);
            controller.deleteJournalsByProjectId(project.id);
            showToast(t('toast.project.deleted', { title: project.title }), 'success');
        };

        if (settings.showDeletionConfirmation) {
            if (window.confirm(t('delete.project.confirm', { title: project.title }))) {
                confirmAndDelete();
            }
        } else {
             confirmAndDelete();
        }
    }, [settings.showDeletionConfirmation, t, controller.deleteProject, controller.deleteGalleriesByProjectId, controller.deleteJournalsByProjectId, showToast]);
    
    const createNewGallery = useCallback((projectId: string | null) => {
        showModal(t('gallery.new'), <GalleryCreator 
            onSave={(details) => {
                const newId = controller.createGallery({ ...details, projectId });
                setNewlyCreatedGalleryId(newId);
                controller.handleSelectGallery(newId);
                hideModal();
            }}
            onCancel={hideModal}
        />)
    }, [showModal, t, controller.createGallery, controller.handleSelectGallery, hideModal]);
    
    const handleNewGallery = useCallback(() => createNewGallery(controller.activeProjectId), [createNewGallery, controller.activeProjectId]);
    const handleNewGallerySuite = useCallback(() => createNewGallery(null), [createNewGallery]);


    const handleDeleteGalleryWithConfirmation = useCallback((id: string) => {
        const gallery = controller.galleries.find(g => g.id === id);
        if (!gallery) return;

        const confirmAndDelete = () => {
            controller.deleteGallery(id);
            showToast(t('toast.gallery.deleted', { title: gallery.title }), 'success');
        };

        if (settings.showDeletionConfirmation) {
            if (window.confirm(t('delete.gallery.confirm', { title: gallery.title }))) {
                confirmAndDelete();
            }
        } else {
            confirmAndDelete();
        }
    }, [settings.showDeletionConfirmation, t, controller.galleries, controller.deleteGallery, showToast]);

    const handleDuplicateGallery = useCallback((id: string) => {
        const newId = controller.duplicateGallery(id);
        if (newId) {
            // NOTE: The new gallery might not be in the `galleries` state immediately.
            // This relies on the duplicate function returning a title, or we make an assumption.
            // A better approach would be to have duplicateGallery thunk return the full object.
            // For now, let's just find it, but it might be one render behind.
            const newGallery = controller.galleries.find(g => g.id === newId);
            showToast(t('toast.gallery.duplicated', { title: newGallery?.title || '' }), 'success');
        }
    }, [controller.duplicateGallery, controller.galleries, showToast, t]);

    const handleThematicSearch = useCallback((themes: string[]) => {
        if (themes.length > 0) {
            controller.setInitialDiscoverSearch(themes.join(', '));
            controller.handleSetView('discover');
        }
    }, [controller.setInitialDiscoverSearch, controller.handleSetView]);
    
     const onStartChat = useCallback((artwork: Artwork) => {
        showModal(t('chat.title', { title: artwork.title }), <ChatModal artwork={artwork} language={language} />);
    }, [showModal, t, language]);


    const handleInitiateAdd = useCallback((artwork: Artwork) => {
         const handleCreateAndAdd = (details: { title: string, description: string }) => {
            const newId = controller.createGallery({ ...details, projectId: controller.activeProjectId });
            controller.addArtworkToGallery(newId, artwork);
            showToast(t('toast.artwork.added', { gallery: details.title }), 'success');
            hideModal();
        }

        const handleAddExisting = (galleryId: string) => {
            controller.addArtworkToGallery(galleryId, artwork);
            const gallery = controller.galleries.find(g => g.id === galleryId);
            showToast(t('toast.artwork.added', { gallery: gallery?.title || '' }), 'success');
            hideModal();
        };

        showModal(t('modal.addToGallery.title'), <AddToGalleryModal 
            artwork={artwork}
            galleries={controller.galleries}
            onAddExisting={handleAddExisting}
            onCreateAndAdd={handleCreateAndAdd}
            activeProjectId={controller.activeProjectId}
        />);
    }, [
        controller.galleries, 
        controller.activeProjectId, 
        controller.createGallery, 
        controller.addArtworkToGallery, 
        showModal, 
        hideModal, 
        showToast, 
        t
    ]);

    const handleViewArtworkDetails = useCallback((artwork: Artwork) => {
        const activeGallery = controller.galleries.find(g => g.id === controller.activeGalleryId);

        const handleAddComment = (artworkId: string, comment: string) => {
            if (activeGallery) {
                const updatedArtworks = activeGallery.artworks.map(a => a.id === artworkId ? {...a, comment } : a);
                controller.updateGallery(activeGallery.id, g => ({ ...g, artworks: updatedArtworks }));
            }
        };

        showModal(artwork.title, <ArtworkDetails
            artwork={artwork}
            activeGallery={activeGallery}
            language={language}
            onClose={hideModal}
            onFindSimilar={(art) => {
                gemini.generateSimilarArtSearchQuery(art, language).then(query => {
                    controller.setInitialDiscoverSearch(query);
                    controller.handleSetView('discover');
                    hideModal();
                });
            }}
            onInitiateAddToGallery={(art) => { hideModal(); handleInitiateAdd(art); }}
            onRemoveFromGallery={(artworkId) => activeGallery && controller.removeArtworkFromGallery(activeGallery.id, artworkId)}
            onAddComment={handleAddComment}
            onThematicSearch={(themes) => {
                handleThematicSearch(themes);
                hideModal();
            }}
            onStartChat={onStartChat}
        />)
    }, [
        controller.galleries, 
        controller.activeGalleryId, 
        controller.updateGallery, 
        controller.setInitialDiscoverSearch,
        controller.handleSetView,
        controller.removeArtworkFromGallery,
        hideModal, 
        language, 
        handleThematicSearch, 
        onStartChat, 
        handleInitiateAdd,
        showModal
    ]);
    

    const handleEditProfile = useCallback(() => {
        showModal(t('profile.edit.title'), <ProfileEditor 
            profile={controller.profile}
            onSave={(details) => {
                controller.setProfile(details);
                hideModal();
            }}
            onCancel={hideModal}
        />)
    }, [showModal, t, controller.profile, controller.setProfile, hideModal]);
    
    const commands: Command[] = useMemo(() => [
        { id: 'nav-workspace', name: t('view.workspace'), action: () => { controller.handleSetView('workspace'); controller.setIsCommandPaletteOpen(false) }, icon: <HomeIcon className="w-5 h-5"/> },
        { id: 'nav-discover', name: t('view.discover'), action: () => { controller.handleSetView('discover'); controller.setIsCommandPaletteOpen(false) }, icon: <SearchIcon className="w-5 h-5"/> },
        { id: 'nav-gallerysuite', name: t('view.gallerysuite'), action: () => { controller.handleSetView('gallerysuite'); controller.setIsCommandPaletteOpen(false) }, icon: <GalleryIcon className="w-5 h-5"/> },
        { id: 'nav-studio', name: t('view.studio'), action: () => { controller.handleSetView('studio'); controller.setIsCommandPaletteOpen(false) }, icon: <PaintBrushIcon className="w-5 h-5"/> },
        { id: 'nav-journal', name: t('view.journal'), action: () => { controller.handleSetView('journal'); controller.setIsCommandPaletteOpen(false) }, icon: <JournalIcon className="w-5 h-5"/> },
        { id: 'nav-profile', name: t('view.profile'), action: () => { controller.handleSetView('profile'); controller.setIsCommandPaletteOpen(false) }, icon: <UserCircleIcon className="w-5 h-5"/>, section: 'User' },
        { id: 'nav-settings', name: t('view.setup'), action: () => { controller.handleSetView('setup'); controller.setIsCommandPaletteOpen(false) }, icon: <Cog6ToothIcon className="w-5 h-5"/>, section: 'User' },
        { id: 'nav-help', name: t('view.help'), action: () => { controller.handleSetView('help'); controller.setIsCommandPaletteOpen(false) }, icon: <QuestionMarkCircleIcon className="w-5 h-5"/>, section: 'User' },
        { id: 'action-new-project', name: t('workspace.newProject'), action: () => { handleNewProject(); controller.setIsCommandPaletteOpen(false); }, icon: <PlusCircleIcon className="w-5 h-5"/>, section: 'Actions' },
        { id: 'action-new-gallery', name: t('gallery.new'), action: () => { handleNewGallery(); controller.setIsCommandPaletteOpen(false); }, icon: <PlusCircleIcon className="w-5 h-5"/>, section: 'Actions' },
    ], [t, controller.handleSetView, controller.setIsCommandPaletteOpen, handleNewProject, handleNewGallery]);

    const value: AppContextType = {
        ...controller,
        language,
        settings,
        handleNewProject,
        handleEditProject,
        handleDeleteProject,
        handleNewGallery,
        handleNewGallerySuite,
        handleDeleteGalleryWithConfirmation,
        handleDuplicateGallery,
        handleViewArtworkDetails,
        handleInitiateAdd,
        handleEditProfile,
        onStartChat,
        handleThematicSearch,
        commands,
        newlyCreatedProjectId,
        newlyCreatedGalleryId,
        toggleTheme,
        updateSettings: setAppSettings,
        resetSettings: resetAppSettings,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};