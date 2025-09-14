

import React from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { Project } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
// FIX: Added .tsx extension to fix module resolution error.
import { HomeIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { PageHeader } from './ui/PageHeader.tsx';

interface WorkspaceProps {
    projects: Project[];
    onNewProject: () => void;
    onSelectProject: (id: string) => void;
    // FIX: Changed signature to match the implementation in App.tsx.
    onDeleteProject: (id: string) => void;
    galleryCountByProject: (projectId: string) => number;
    journalCountByProject: (projectId: string) => number;
    newlyCreatedId: string | null;
}

const ProjectCard: React.FC<{ 
    project: Project; 
    isNew: boolean;
    onSelect: () => void; 
    onDelete: () => void;
    galleryCount: number;
    journalCount: number;
}> = React.memo(({ project, isNew, onSelect, onDelete, galleryCount, journalCount }) => {
    const { t } = useTranslation();
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div 
            className={`group relative bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${isNew ? 'animate-newItem' : ''}`} 
            onClick={onSelect}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
            tabIndex={0}
        >
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 truncate mb-2">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-3 h-[60px]">{project.description}</p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>{t('workspace.project.galleries', { count: String(galleryCount)})}</span>
                <span>{t('workspace.project.journals', { count: String(journalCount)})}</span>
            </div>
            {/* FIX: Completed the truncated button element. */}
             <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-focus-within:opacity-100">
                <button onClick={handleDeleteClick} aria-label={t('workspace.delete.projectLabel', { title: project.title })} className="p-2 bg-red-600/80 text-white rounded-full hover:bg-red-700/80 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});
ProjectCard.displayName = 'ProjectCard';

// FIX: Added the missing Workspace component and exported it.
export const Workspace: React.FC<WorkspaceProps> = ({
    projects,
    onNewProject,
    onSelectProject,
    onDeleteProject,
    galleryCountByProject,
    journalCountByProject,
    newlyCreatedId,
}) => {
    const { t } = useTranslation();

    if (projects.length === 0) {
        return (
            <div className="h-full">
                <EmptyState
                    icon={<HomeIcon className="w-16 h-16" />}
                    title={t('workspace.empty.title')}
                    message={t('workspace.empty.prompt')}
                >
                    <Button onClick={onNewProject}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        {t('workspace.empty.button')}
                    </Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <PageHeader title={t('workspace.title')} icon={<HomeIcon className="w-8 h-8" />} >
                <Button onClick={onNewProject}>
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {t('workspace.newProject')}
                </Button>
            </PageHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...projects]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isNew={project.id === newlyCreatedId}
                            onSelect={() => onSelectProject(project.id)}
                            onDelete={() => onDeleteProject(project.id)}
                            galleryCount={galleryCountByProject(project.id)}
                            journalCount={journalCountByProject(project.id)}
                        />
                    ))}
            </div>
        </div>
    );
};