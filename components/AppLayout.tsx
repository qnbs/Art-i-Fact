import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import { db } from '../services/dbService.ts';
import { useModal } from '../contexts/ModalContext.tsx';
import { Modal } from './Modal.tsx';

import { SideNavBar } from './SideNavBar.tsx';
import { BottomNavBar } from './BottomNavBar.tsx';
import { Header } from './Header.tsx';
import { WelcomePortal } from './WelcomePortal.tsx';
import { PageLoader } from './ui/PageLoader.tsx';
import { ExhibitionMode } from './ExhibitionMode.tsx';
import CommandPalette from './CommandPalette.tsx';
import { LoadingOverlay } from './ui/LoadingOverlay.tsx';
import { MainContent } from './MainContent.tsx';

export const AppLayout: React.FC = () => {
    const {
        isLoading,
        showWelcome,
        setShowWelcome,
        previewGallery,
        setPreviewGallery,
        activeView,
        handleSetView,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        commands,
        activeProject,
        activeGallery,
        settings,
    } = useAppContext();
    const { t } = useTranslation();
    const { activeAiTask, loadingMessage, aiError } = useAI();
    const { isOpen: isModalOpen, modalContent, hideModal } = useModal();

    useEffect(() => {
      document.documentElement.className = settings.theme;
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', settings.theme === 'dark' ? '#030712' : '#d97706');
      }
    }, [settings.theme]);

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

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans" data-compact={settings.compactMode}>
            <SideNavBar activeView={activeView} setActiveView={handleSetView} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header 
                    activeView={activeView}
                    setActiveView={handleSetView}
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                    activeProjectTitle={activeProject?.title}
                    activeGalleryTitle={activeGallery?.title}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    <MainContent />
                </main>
                <BottomNavBar activeView={activeView} setActiveView={handleSetView} />
            </div>
            <CommandPalette 
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                commands={commands}
            />
            <Modal isOpen={isModalOpen} onClose={hideModal} title={modalContent.title}>
                {modalContent.content}
            </Modal>
            <LoadingOverlay isActive={!!activeAiTask || !!aiError} message={loadingMessage} error={aiError} />
        </div>
    );
};
