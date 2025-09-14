import React from 'react';
import type { Project } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { HomeIcon, PlusCircleIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { PageHeader } from './ui/PageHeader.tsx';

interface WorkspaceProps {
    projects: Project[];
    onNewProject: () => void;
    onSelectProject: (id: string) => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (project: Project) => void;
    galleryCountByProject: (projectId: string) => number;
    journalCountByProject: (projectId: string) => number;
    newlyCreatedId: string | null;
}

const ProjectCard: React.FC<{ 
    project: Project; 
    isNew: boolean;
    onSelect: () => void; 
    onEdit: () => void;
    onDelete: () => void;
    galleryCount: number;
    journalCount: number;
}> = React.memo(({ project, isNew, onSelect, onEdit, onDelete, galleryCount, journalCount }) => {
    const { t } = useTranslation();
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    const getGalleryCountText = () => {
        if (galleryCount === 1) return t('workspace.project.galleries_one');
        return t('workspace.project.galleries_other', { count: String(galleryCount) });
    };

    const getJournalCountText = () => {
        if (journalCount === 1) return t('workspace.project.journals_one');
        return t('workspace.project.journals_other', { count: String(journalCount) });
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
                <span>{getGalleryCountText()}</span>
                <span>{getJournalCountText()}</span>
            </div>
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" onClick={stopPropagation}>
                 <details className="relative">
                    <summary className="list-none cursor-pointer p-2 bg-black/40 text-white rounded-full hover:bg-black/60">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </summary>
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <button onClick={onEdit} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <PencilIcon className="w-4 h-4" /> {t('workspace.editProject')}
                        </button>
                        <button onClick={onDelete} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                            <TrashIcon className="w-4 h-4" /> {t('remove')}
                        </button>
                    </div>
                </details>
            </div>
        </div>
    );
});
ProjectCard.displayName = 'ProjectCard';

export const Workspace: React.FC<WorkspaceProps> = ({
    projects,
    onNewProject,
    onSelectProject,
    onEditProject,
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
                            onEdit={() => onEditProject(project)}
                            onDelete={() => onDeleteProject(project)}
                            galleryCount={galleryCountByProject(project.id)}
                            journalCount={journalCountByProject(project.id)}
                        />
                    ))}
            </div>
        </div>
    );
};
