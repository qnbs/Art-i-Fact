

import React, { useState } from 'react';
import type { Project, Gallery, JournalEntry } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { GalleryManager } from './GalleryManager.tsx';
import { Journal } from './Journal.tsx';
import { Button } from './ui/Button.tsx';
import { PlusCircleIcon, GalleryIcon, JournalIcon, PencilIcon, CheckCircleIcon, HomeIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';

interface ProjectViewProps {
    project: Project;
    onClose: () => void;
    onUpdateProject: (id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
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
    const [activeTab, setActiveTab] = useState<ProjectTab>('galleries');
    const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [editedTitle, setEditedTitle] = useState(props.project.title);
    const [editedDescription, setEditedDescription] = useState(props.project.description);

    const handleSaveProject = () => {
        props.onUpdateProject(props.project.id, {
            title: editedTitle,
            description: editedDescription
        });
        setIsEditingProject(false);
    };
    
    const handleNewJournal = () => {
        const newId = props.onNewJournalEntry();
        setActiveJournalId(newId);
        setActiveTab('journal');
    }

    return (
        <div className="flex flex-col h-full">
            {/* Project Header */}
            {isEditingProject ? (
                 <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-3xl font-bold bg-gray-100 dark:bg-gray-800 focus:outline-none w-full p-1 rounded"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="text-gray-600 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-800 focus:outline-none w-full p-1 rounded resize-none"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveProject}><CheckCircleIcon className="w-4 h-4 mr-1" /> {t('save')}</Button>
                            <Button size="sm" variant="secondary" onClick={() => setIsEditingProject(false)}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <PageHeader 
                    onBack={props.onClose}
                    title={props.project.title} 
                    subtitle={props.project.description}
                    icon={<HomeIcon className="w-8 h-8" />}
                >
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingProject(true)} aria-label={t('workspace.editProject')}>
                        <PencilIcon className="w-5 h-5" />
                    </Button>
                </PageHeader>
            )}
           

            {/* Tabs & Actions */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 mb-4 flex-shrink-0">
                 <div className="flex">
                    <button 
                        onClick={() => setActiveTab('galleries')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'galleries' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <GalleryIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.galleries', { count: String(props.galleries.length)})}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('journal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'journal' ? 'border-amber-500 text-amber-700 dark:text-amber-500' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <JournalIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.journals', { count: String(props.journalEntries.length)})}</span>
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
                        onDeleteGallery={props.onDeleteGallery}
                        hideHeader={true}
                    />
                )}
                {activeTab === 'journal' && (
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
                )}
            </div>
        </div>
    );
};