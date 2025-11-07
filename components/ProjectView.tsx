import React, { useState, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { GalleryManager } from './GalleryManager.tsx';
import { Journal } from './Journal.tsx';
import { Button } from './ui/Button.tsx';
import { PlusCircleIcon, GalleryIcon, JournalIcon, PencilIcon, HomeIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { EmptyState } from './ui/EmptyState.tsx';

type ProjectTab = 'galleries' | 'journal';

export const ProjectView: React.FC = () => {
    const { t } = useTranslation();
    const {
        activeProject,
        handleSetView,
        handleEditProject,
        projectGalleries,
        projectJournals,
        language,
        handleNewGallery,
        updateJournalEntry,
        deleteJournalEntry,
        createJournalEntry,
        activeProjectId
    } = useAppContext();

    const [activeTab, setActiveTab] = useState<ProjectTab>('galleries');
    const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
    
    const handleNewJournal = useCallback(async () => {
        if (!activeProjectId) return;
        const newId = await createJournalEntry(activeProjectId);
        setActiveJournalId(newId);
        setActiveTab('journal');
    }, [createJournalEntry, activeProjectId]);

    const renderJournalContent = () => {
        if (projectJournals.length > 0) {
            return (
                <Journal 
                    entries={projectJournals}
                    language={language}
                    activeEntryId={activeJournalId}
                    onSelectEntry={setActiveJournalId}
                    onUpdateEntry={updateJournalEntry}
                    onDeleteEntry={deleteJournalEntry}
                    onNewEntry={() => createJournalEntry(activeProjectId)}
                />
            );
        }
        return (
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
        );
    }

    const renderGalleriesContent = () => {
        if (projectGalleries.length > 0) {
            return (
                 <GalleryManager 
                    galleries={projectGalleries}
                    onCreateNew={() => handleNewGallery()}
                    hideHeader={true}
                />
            );
        }
        return (
            <EmptyState
                icon={<GalleryIcon className="w-16 h-16" />}
                title={t('gallery.manager.empty.title')}
                message={t('gallery.manager.empty.prompt')}
            >
                <Button onClick={() => handleNewGallery()}>
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {t('gallery.manager.create')}
                </Button>
            </EmptyState>
        );
    }

    if (!activeProject) {
        // This should ideally not happen if logic is correct, but it's a good safeguard.
        return (
            <EmptyState 
                icon={<HomeIcon className="w-16 h-16" />}
                title={t('workspace.project.notFound.title')}
                message={t('workspace.project.notFound.message')}
            />
        );
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                onBack={() => handleSetView('workspace')}
                title={activeProject.title} 
                subtitle={activeProject.description}
                icon={<HomeIcon className="w-8 h-8" />}
            >
                <Button variant="ghost" size="sm" onClick={() => handleEditProject(activeProject)} aria-label={t('workspace.editProject')}>
                    <PencilIcon className="w-5 h-5" />
                </Button>
            </PageHeader>
           
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 mb-4 flex-shrink-0">
                 <div className="flex">
                    <button 
                        onClick={() => setActiveTab('galleries')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'galleries' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <GalleryIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.galleries_other', { count: String(projectGalleries.length)})}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('journal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'journal' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <JournalIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.journals_other', { count: String(projectJournals.length)})}</span>
                    </button>
                 </div>
                 {activeTab === 'galleries' && (
                     <Button size="sm" onClick={() => handleNewGallery()}>
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

            <div className="flex-grow overflow-y-auto">
                {activeTab === 'galleries' && renderGalleriesContent()}
                {activeTab === 'journal' && renderJournalContent()}
            </div>
        </div>
    );
};