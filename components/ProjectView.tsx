

import React, { useState } from 'react';
import { Project, Gallery, JournalEntry } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { GalleryManager } from './GalleryManager';
import { Journal } from './Journal';
import { Button } from './ui/Button';
import { PlusCircleIcon, GalleryIcon, JournalIcon, PencilIcon, CheckCircleIcon } from './IconComponents';
import { sanitizeInput } from '../services/geminiService';
import { Tooltip } from './ui/Tooltip';

// All the props from App.tsx
interface ProjectViewProps {
    project: Project;
    onUpdateProject: (id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
    galleries: Gallery[];
    journalEntries: JournalEntry[];
    onNewGallery: () => void;
    onSelectGallery: (id: string) => void;
    onDeleteGallery: (id: string, title: string) => void;
    onUpdateJournalEntry: (id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
    onDeleteJournalEntry: (id: string) => void;
    onNewJournalEntry: () => string;
    onJournalResearch: (topic: string) => Promise<string>;
    activeAiTask: string | null;
    handleAiTask: <T>(taskName: string, taskFn: () => Promise<T>, options?: { onStart?: () => void; onEnd?: (result: T | undefined) => void; }) => Promise<T | undefined>;
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

    return (
        <div className="flex flex-col h-full">
            {/* Project Header */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                {isEditingProject ? (
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
                ) : (
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{props.project.title}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{props.project.description}</p>
                        </div>
                        <Tooltip text={t('workspace.editProject')}>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingProject(true)}>
                                <PencilIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>

            {/* Tabs & Actions */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/50 mb-4 flex-shrink-0">
                 <div className="flex">
                    <button 
                        onClick={() => setActiveTab('galleries')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'galleries' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <GalleryIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.galleries', { count: String(props.galleries.length)})}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('journal')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${activeTab === 'journal' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <JournalIcon className="w-5 h-5"/>
                        <span className="font-semibold">{t('workspace.project.journals', { count: String(props.journalEntries.length)})}</span>
                    </button>
                 </div>
                 {activeTab === 'galleries' && (
                     <Button size="sm" onClick={props.onNewGallery}>
                         <PlusCircleIcon className="w-5 h-5 mr-2" />
                         {t('gallery.manager.create')}
                     </Button>
                 )}
                 {activeTab === 'journal' && (
                      <Button size="sm" onClick={() => {
                          const newId = props.onNewJournalEntry();
                          setActiveJournalId(newId);
                      }}>
                         <PlusCircleIcon className="w-5 h-5 mr-2" />
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
                        isProjectView={true}
                    />
                )}
                {activeTab === 'journal' && (
                    <Journal
                        entries={props.journalEntries}
                        galleries={props.galleries}
                        activeEntryId={activeJournalId}
                        onSelectEntry={setActiveJournalId}
                        onUpdateEntry={props.onUpdateJournalEntry}
                        onDeleteEntry={(id) => { props.onDeleteJournalEntry(id); setActiveJournalId(null); }}
                        onJournalResearch={props.onJournalResearch}
                        activeAiTask={props.activeAiTask}
                        handleAiTask={props.handleAiTask}
                    />
                )}
            </div>
        </div>
    );
};