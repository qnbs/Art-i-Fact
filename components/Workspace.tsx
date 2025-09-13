

import React from 'react';
import { Project } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { HomeIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './IconComponents';
import { Button } from './ui/Button';

interface WorkspaceProps {
    projects: Project[];
    onNewProject: () => void;
    onSelectProject: (id: string) => void;
    onDeleteProject: (id: string, title: string) => void;
    galleryCountByProject: (projectId: string) => number;
    journalCountByProject: (projectId: string) => number;
}

const ProjectCard: React.FC<{ 
    project: Project; 
    onSelect: () => void; 
    onDelete: () => void;
    galleryCount: number;
    journalCount: number;
}> = React.memo(({ project, onSelect, onDelete, galleryCount, journalCount }) => {
    const { t } = useTranslation();
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 flex flex-col" onClick={onSelect}>
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 truncate mb-2">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-3 h-[60px]">{project.description}</p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>{t('workspace.project.galleries', { count: String(galleryCount)})}</span>
                <span>{t('workspace.project.journals', { count: String(journalCount)})}</span>
            </div>
             <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={handleDeleteClick} title={t('remove')} className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

export const Workspace: React.FC<WorkspaceProps> = ({ projects, onNewProject, onSelectProject, onDeleteProject, galleryCountByProject, journalCountByProject }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full">
            {projects.length === 0 ? (
                <div className="flex-grow flex justify-center items-center text-center">
                    <div className="text-center text-gray-500 max-w-md p-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                        <HomeIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('workspace.empty.title')}</h3>
                        <p className="mb-6">{t('workspace.empty.prompt')}</p>
                        <Button onClick={onNewProject}>
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            {t('workspace.empty.button')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onSelect={() => onSelectProject(project.id)} 
                            onDelete={() => onDeleteProject(project.id, project.title)}
                            galleryCount={galleryCountByProject(project.id)}
                            journalCount={journalCountByProject(project.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};