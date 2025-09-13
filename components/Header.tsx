import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PlusCircleIcon, CommandLineIcon, ArrowLeftIcon } from './IconComponents';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

interface HeaderProps {
  activeView: ActiveView;
  isProjectView: boolean;
  isGalleryView: boolean;
  onNewGallery: () => void;
  onNewJournalEntry: () => void;
  onNewProject: () => void;
  onOpenCommandPalette: () => void;
  onNavigateBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    activeView, 
    isProjectView,
    isGalleryView,
    onNewGallery, 
    onNewJournalEntry,
    onNewProject,
    onOpenCommandPalette,
    onNavigateBack
}) => {
  const { t } = useTranslation();

  const getTitle = () => {
    if (isProjectView) return t('project');
    if (isGalleryView) return t('gallery');
    
    switch (activeView) {
      case 'workspace':
        return t('workspace.title');
      case 'discover':
        return t('artLibrary.title');
      case 'studio':
        return t('studio.title');
      case 'journal':
        return t('journal.title');
      case 'profile':
      case 'setup':
      case 'help':
      case 'glossary':
        return t('profile');
      default:
        return 'Art-i-Fact';
    }
  };

  const showBackButton = isProjectView || isGalleryView;

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center">
        {showBackButton && (
          <button onClick={onNavigateBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        {activeView === 'workspace' && !isProjectView && (
            <button onClick={onNewProject} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('workspace.newProject')}>
                <PlusCircleIcon className="w-7 h-7" />
            </button>
        )}
        {isProjectView && (
             <button onClick={onNewGallery} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('gallery.manager.create')}>
                <PlusCircleIcon className="w-7 h-7" />
            </button>
        )}
        {activeView === 'journal' && (
            <button onClick={onNewJournalEntry} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('journal.new')}>
                <PlusCircleIcon className="w-7 h-7" />
            </button>
        )}
        <button onClick={onOpenCommandPalette} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title="Open Command Palette">
          <CommandLineIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};