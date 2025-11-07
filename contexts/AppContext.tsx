import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAppController } from '../hooks/useAppController.ts';
import { useTranslation } from './TranslationContext.tsx';
import { useModal } from './ModalContext.tsx';
import { useToast } from './ToastContext.tsx';
import { useAI } from './AIStatusContext.tsx';

import type { Project, Artwork, Gallery, Profile } from '../types.ts';
import type { Command } from '../components/CommandPalette.tsx';

import { ProjectEditor } from '../components/ProjectEditor.tsx';
import { GalleryCreator } from '../components/GalleryCreator.tsx';
import { AddToGalleryModal } from '../components/AddToGalleryModal.tsx';
import { ArtworkDetails } from '../components/ArtworkDetails.tsx';
import { ChatModal } from '../components/ChatModal.tsx';
import { ProfileEditor } from '../components/ProfileEditor.tsx';
import * as gemini from '../services/geminiService.ts';
import { GlobeAltIcon } from '../components/IconComponents.tsx';
import { Button } from '../components/ui/Button.tsx';

type AppControllerReturnType = ReturnType<typeof useAppController>;

interface AppContextType extends AppControllerReturnType {
    handleNewProject: () => void;
    handleEditProject: (project: Project) => void;
    handleDeleteProject: (project: Project) => void;
    handleNewGallery: (inProjectId?: string | null) => void;
    handleNewGallerySuite: () => void;
    handleDeleteGalleryWithConfirmation: (id: string) => void;
    handleDuplicateGallery: (id: string) => void;
    handleSetFeaturedGallery: (id: string) => void;
    handleGenerateTrailer: (gallery: Gallery) => void;
    handleViewArtworkDetails: (artwork: Artwork) => void;
    handleInitiateAdd: (artwork: Artwork) => void;
    handleFindSimilarArt: (artwork: Artwork) => void;
    handleStartChat: (artwork: Artwork) => void;
    handleEditProfile: () => void;
    handleResetAllData: () => void;
    commands: Command[];
    language: 'de' | 'en';
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const controller = useAppController();
    const { t, language, setLanguage } = useTranslation();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();
    const { handleAiTask } = useAI();

    const {
        galleries,
        activeProjectId,
        activeGalleryId,
        appSettings,
        profile,
        addProject,
        updateProject,
        deleteProject: deleteProjectData,
        createGallery,
        updateGallery,
        deleteGallery,
        duplicateGallery,
        addArtworkToGallery,
        removeArtworkFromGallery,
        setProfile,
        setAppSettings, // Used for toggleTheme
        deleteGalleriesByProjectId,
        deleteJournalsByProjectId,
        deleteAllProjects,
        deleteAllGalleries,
        deleteAllJournals,
        resetAppSettings,
        resetProfile,
        setInitialDiscoverSearch,
        handleSetView,
        handleSelectProject,
        handleSelectGallery,
        setIsCommandPaletteOpen
    } = controller;

    const toggleTheme = useCallback(() => {
        const newTheme = appSettings.theme === 'dark' ? 'light' : 'dark';
        setAppSettings({ theme: newTheme });
    }, [appSettings.theme, setAppSettings]);

    const handleNewProject = useCallback(() => {
        showModal(t('workspace.newProject'), <ProjectEditor
            onSave={async (details) => {
                const newId = await addProject(details.title, details.description);
                handleSelectProject(newId);
                hideModal();
                showToast(t('toast.project.created'), 'success');
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, addProject, handleSelectProject, hideModal, showToast]);

    const handleEditProject = useCallback((project: Project) => {
        showModal(t('workspace.editProject', { title: project.title }), <ProjectEditor
            project={project}
            onSave={(details) => {
                updateProject(project.id, details);
                hideModal();
                showToast(t('toast.project.updated'), 'success');
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, updateProject, hideModal, showToast]);

    const handleDeleteProject = useCallback((project: Project) => {
        if (appSettings.showDeletionConfirmation && !window.confirm(t('confirm.delete.project', { title: project.title }))) return;
        deleteGalleriesByProjectId(project.id);
        deleteJournalsByProjectId(project.id);
        deleteProjectData(project.id);
        showToast(t('toast.project.deleted'), 'success');
    }, [appSettings.showDeletionConfirmation, t, deleteGalleriesByProjectId, deleteJournalsByProjectId, deleteProjectData, showToast]);

    const handleNewGallery = useCallback((inProjectId: string | null = activeProjectId) => {
        showModal(t('gallery.new'), <GalleryCreator
            onSave={async (details) => {
                const newId = await createGallery({ ...details, projectId: inProjectId });
                handleSelectGallery(newId);
                hideModal();
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, createGallery, handleSelectGallery, hideModal, activeProjectId]);
    
    const handleNewGallerySuite = useCallback(() => handleNewGallery(null), [handleNewGallery]);

    const handleDeleteGalleryWithConfirmation = useCallback((id: string) => {
        const gallery = galleries.find(g => g.id === id);
        if (!gallery) return;
        if (appSettings.showDeletionConfirmation && !window.confirm(t('confirm.delete.gallery', { title: gallery.title }))) return;
        deleteGallery(id);
        showToast(t('toast.gallery.deleted'), 'success');
    }, [appSettings.showDeletionConfirmation, t, galleries, deleteGallery, showToast]);

    const handleDuplicateGallery = useCallback(async (id: string) => {
        const newId = await duplicateGallery(id);
        if (newId) {
            showToast(t('toast.gallery.duplicated'), 'success');
            handleSelectGallery(newId);
        }
    }, [duplicateGallery, showToast, handleSelectGallery]);
    
    const handleSetFeaturedGallery = useCallback((id: string) => {
        setProfile({ featuredGalleryId: id });
        showToast(t('toast.profile.featured'), 'success');
    }, [setProfile, showToast]);

    const handleGenerateTrailer = useCallback(async (gallery: Gallery) => {
        const startGeneration = async () => {
            handleAiTask<string>('video', () => gemini.generateTrailerVideo(gallery), {
                onEnd: (result) => {
                    if (result) { // result is a blob URL string
                        showModal('Gallery Trailer Ready!', 
                            <div className="flex flex-col items-center">
                                <video src={result} controls autoPlay className="w-full rounded-lg mb-4" />
                                <a href={result} download={`${gallery.title.replace(/ /g, '_')}_trailer.mp4`}>
                                    <Button>Download Video</Button>
                                </a>
                            </div>
                        );
                    }
                }
            });
        };

        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        
        if (!hasKey) {
            showModal(t('veo.modal.title'), 
                <div>
                    <p className="mb-4">{t('veo.modal.description')}</p>
                    <p className="text-sm text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: t('veo.modal.billingInfo') }}/>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                        <Button onClick={async () => {
                            hideModal();
                            await (window as any).aistudio?.openSelectKey();
                            // Assume key is selected and proceed
                            // Add a small delay to allow the environment variable to potentially update
                            setTimeout(startGeneration, 500); 
                        }}>
                            {t('veo.modal.selectKeyButton')}
                        </Button>
                    </div>
                </div>
            );
        } else {
            startGeneration();
        }
    }, [handleAiTask, showModal, hideModal, t]);

    const handleFindSimilarArt = useCallback(async (artwork: Artwork) => {
        try {
            const query = await gemini.generateSimilarArtSearchQuery(artwork, language as 'de' | 'en');
            setInitialDiscoverSearch(query);
            handleSetView('discover');
        } catch (e) {
            showToast(t('toast.error.gemini'), 'error');
        }
    }, [language, setInitialDiscoverSearch, handleSetView, showToast, t]);

    const handleStartChat = useCallback((artwork: Artwork) => {
        showModal(t('artwork.details.chat'), <ChatModal artwork={artwork} language={language as 'de' | 'en'} />);
    }, [showModal, t, language]);

    const handleInitiateAdd = useCallback((artwork: Artwork) => {
        const handleCreateAndAdd = async (details: { title: string; description: string; }) => {
            const newId = await createGallery({ ...details, projectId: activeProjectId });
            addArtworkToGallery(newId, artwork);
            showToast(t('toast.artwork.addedAndCreated'), 'success');
            hideModal();
            handleSelectGallery(newId);
        };

        const handleAddExisting = (galleryId: string) => {
            addArtworkToGallery(galleryId, artwork);
            showToast(t('toast.artwork.added'), 'success');
            hideModal();
        };

        showModal(t('modal.details.addToGallery'), <AddToGalleryModal
            artwork={artwork}
            galleries={galleries}
            onAddExisting={handleAddExisting}
            onCreateAndAdd={handleCreateAndAdd}
            activeProjectId={activeProjectId}
        />);
    }, [createGallery, activeProjectId, addArtworkToGallery, showToast, hideModal, handleSelectGallery, showModal, t, galleries]);

    const handleViewArtworkDetails = useCallback((artwork: Artwork) => {
        const gallery = galleries.find(g => g.id === activeGalleryId);

        const handleAddComment = (artworkId: string, comment: string) => {
            if(gallery) {
                const updatedArtworks = gallery.artworks.map(a => a.id === artworkId ? {...a, comment } : a);
                updateGallery(gallery.id, g => ({...g, artworks: updatedArtworks }));
            }
        };

        showModal(artwork.title, <ArtworkDetails
            artwork={artwork}
            activeGallery={gallery}
            language={language as 'de'|'en'}
            onClose={hideModal}
            onFindSimilar={handleFindSimilarArt}
            onInitiateAddToGallery={handleInitiateAdd}
            onRemoveFromGallery={(artworkId: string) => removeArtworkFromGallery(gallery!.id, artworkId)}
            onAddComment={handleAddComment}
            onThematicSearch={() => {}} // Placeholder
            onStartChat={handleStartChat}
        />);
    }, [galleries, activeGalleryId, language, showModal, hideModal, handleFindSimilarArt, handleInitiateAdd, removeArtworkFromGallery, updateGallery, handleStartChat]);
    
    const handleEditProfile = useCallback(() => {
        showModal(t('profile.edit.button'), <ProfileEditor
            profile={profile}
            onSave={(details: Partial<Profile>) => {
                setProfile(details);
                hideModal();
                showToast(t('toast.profile.updated'), 'success');
            }}
            onCancel={hideModal}
        />);
    }, [showModal, t, profile, setProfile, hideModal, showToast]);

    const handleResetAllData = useCallback(() => {
        if(window.confirm(t('confirm.delete.allData'))) {
            deleteAllProjects();
            deleteAllGalleries();
            deleteAllJournals();
            resetAppSettings();
            resetProfile();
            showToast(t('toast.settings.reset'), 'success');
            setTimeout(() => window.location.reload(), 1000);
        }
    }, [t, deleteAllProjects, deleteAllGalleries, deleteAllJournals, resetAppSettings, resetProfile, showToast]);

    const commands = useMemo((): Command[] => {
        const navCommands = (['workspace', 'discover', 'gallerysuite', 'studio', 'journal', 'profile', 'setup', 'help'] as const).map(view => ({
            id: `nav-${view}`,
            name: t(`view.${view}`),
            action: () => { handleSetView(view); setIsCommandPaletteOpen(false); },
            section: t('commandPalette.sections.navigation'),
        }));

        const actionCommands: Command[] = [
            { id: 'act-new-project', name: t('workspace.newProject'), action: () => { handleNewProject(); setIsCommandPaletteOpen(false); }, section: t('commandPalette.sections.actions')},
            { id: 'act-new-gallery', name: t('gallery.new'), action: () => { handleNewGallery(); setIsCommandPaletteOpen(false); }, section: t('commandPalette.sections.actions')},
        ];

        const languageCommands: Command[] = [
            { id: 'lang-en', name: t('commandPalette.actions.setLangEn'), action: () => { setLanguage('en'); setIsCommandPaletteOpen(false); }, section: t('commandPalette.sections.language'), icon: <GlobeAltIcon className="w-5 h-5" /> },
            { id: 'lang-de', name: t('commandPalette.actions.setLangDe'), action: () => { setLanguage('de'); setIsCommandPaletteOpen(false); }, section: t('commandPalette.sections.language'), icon: <GlobeAltIcon className="w-5 h-5" /> },
        ]

        return [...navCommands, ...actionCommands, ...languageCommands];
    }, [t, handleSetView, setIsCommandPaletteOpen, handleNewProject, handleNewGallery, setLanguage]);

    const value: AppContextType = {
        ...controller,
        handleNewProject,
        handleEditProject,
        handleDeleteProject,
        handleNewGallery,
        handleNewGallerySuite,
        handleDeleteGalleryWithConfirmation,
        handleDuplicateGallery,
        handleSetFeaturedGallery,
        handleGenerateTrailer,
        handleViewArtworkDetails,
        handleInitiateAdd,
        handleFindSimilarArt,
        handleStartChat,
        handleEditProfile,
        handleResetAllData,
        commands,
        language,
        toggleTheme,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};