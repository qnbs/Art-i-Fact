

import React, { useState, useCallback } from 'react';
import type { Project, Gallery, JournalEntry } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { GalleryManager } from './GalleryManager.tsx';
import { Journal } from './Journal.tsx';
import { Button } from './ui/Button.tsx';
import { PlusCircleIcon, GalleryIcon, JournalIcon, PencilIcon, HomeIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { useAppSettings } from '../../contexts/AppSettingsContext.tsx';
import { useModal } from '../../contexts/ModalContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { EmptyState } from './ui/EmptyState.tsx';

interface ProjectViewProps {
    project: Project;
    onClose: () => void;
    onUpdateProject: (id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
    onEditProject: (project: Project) => void;
    galleries: Gallery[];
    journalEntries: JournalEntry[];
    language: 'de' | 'en';
    onNewGallery: () => void;
    onSelectGallery: (id: string) => void;
    onDeleteGallery: (id: string) => void;
    onUpdateJournalEntry: (id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
    onDeleteJournalEntry: (id: string) => void;
    onNewJournalEntry: () => string;
}

type ProjectTab = 'galleries' | 'journal';

export const ProjectView: React.FC<ProjectViewProps> = (props) => {
    const { t } = useTranslation();
    const { appSettings } = useAppSettings();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<ProjectTab>('galleries');
    const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
    
    const handleNewJournal = useCallback(() => {
        const newId = props.onNewJournalEntry();
        setActiveJournalId(newId);
        setActiveTab('journal');
    }, [props.onNewJournalEntry]);

    const confirmAndDeleteGallery = useCallback((galleryId: string) => {
        const gallery = props.galleries.find(g => g.id === galleryId);
        if (!gallery) return;
        props.onDeleteGallery(galleryId);
        showToast(t('toast.gallery.deleted', { title: gallery.title }), 'success');
        hideModal();
    }, [props.galleries, props.onDeleteGallery, showToast, t, hideModal]);
    
    const handleDeleteGallery = useCallback((galleryId: string) => {
        const gallery = props.galleries.find(g => g.id === galleryId);
        if (!gallery) return;

        if (appSettings.showDeletionConfirmation) {
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
    }, [props.galleries, appSettings.showDeletionConfirmation, showModal, t, confirmAndDeleteGallery, hideModal]);

    return (
        <div className="flex flex-col h-full">
            {/* Project Header */}
            <PageHeader 
                onBack={props.onClose}
                title={props.project.title} 
                subtitle={props.project.description}
                icon={<HomeIcon className="w-8 h-8" />}
            >
                <Button variant="ghost" size="sm" onClick={() => props.onEditProject(props.project)} aria-label={t('workspace.editProject')}>
                    <PencilIcon className="w-5 h-5" />
                </Button>
            </PageHeader>
           
            {/* Tabs & Actions */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 mb-4 flex-shrink-0">
                 <div className="flex">
                    <button 
                        onClick={() => setActiveTab('galleries')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'galleries' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <GalleryIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.galleries_other', { count: String(props.galleries.length)})}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('journal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'journal' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <JournalIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.journals_other', { count: String(props.journalEntries.length)})}</span>
                    </button>
                 </div>
                 {activeTab === 'galleries' && (
                     <Button size="sm" onClick={props.onNewGallery}>
                        <PlusCircleIcon className="w-4 h-4 mr-1" />
                        {t('gallery.new')}
                    </Button>
                 )}
                 {activeTab === 'journal' && (
                     <Button size="sm" onClick={handleNewJournal}>
                        <PlusCircleIcon className="w-4 h-4 mr-1" />
                        {t('journal.new')}
                    </Button>
                 )}
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'galleries' && (
                    <GalleryManager 
                        galleries={props.galleries}
                        onCreateNew={props.onNewGallery}
                        onSelectGallery={props.onSelectGallery}
                        onDeleteGallery={handleDeleteGallery}
                        hideHeader={true}
                    />
                )}
                {activeTab === 'journal' && (
                    props.journalEntries.length > 0 ? (
                        <Journal 
                            entries={props.journalEntries}
                            galleries={[]} // Galleries not needed for project-specific journal view
                            language={props.language}
                            activeEntryId={activeJournalId}
                            onSelectEntry={setActiveJournalId}
                            onUpdateEntry={props.onUpdateJournalEntry}
                            onDeleteEntry={props.onDeleteJournalEntry}
                            onNewEntry={props.onNewJournalEntry}
                        />
                    ) : (
                        <EmptyState 
                            icon={<JournalIcon className="w-16 h-16" />}
                            title={t('journal.empty.title')}
                            message={t('journal.empty.prompt')}
                        >
                            <Button onClick={handleNewJournal}>
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                {t('journal.new')}
                            </Button>
                        </EmptyState>
                    )
                )}
            </div>
        </div>
    );
};
