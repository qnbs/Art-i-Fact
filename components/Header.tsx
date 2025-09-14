import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PlusCircleIcon, CommandLineIcon, ArrowLeftIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from './IconComponents';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

interface HeaderProps {
  activeView: ActiveView;
  isProjectView: boolean;
  isGalleryView: boolean;
  pageTitle?: string;
  onNewGallery: () => void;
  onNewJournalEntry: () => void;
  onNewProject: () => void;
  onOpenCommandPalette: () => void;
  onNavigateBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    activeView, 
    isProjectView,
    isGalleryView,
    pageTitle,
    onNewGallery, 
    onNewJournalEntry,
    onNewProject,
    onOpenCommandPalette,
    onNavigateBack,
    onNavigateToSettings,
    onNavigateToHelp,
}) => {
  const { t } = useTranslation();

  const showBackButton = isProjectView || isGalleryView;
  
  const viewTitles: Record<string, string> = {
    discover: t('artLibrary.title'),
    studio: t('studio.title'),
    workspace: t('workspace.title'),
    journal: t('journal.title'),
    profile: t('profile'),
    setup: t('settings.title'),
    help: t('help.title'),
  };

  const title = pageTitle || viewTitles[activeView] || 'Art-i-Fact';


  return (
    <header className="md:hidden sticky top-0 z-30 grid grid-cols-3 items-center h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-2 justify-start">
         <button onClick={onOpenCommandPalette} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title="Open Command Palette">
          <CommandLineIcon className="w-6 h-6" />
        </button>
        {showBackButton && (
          <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={t('navigateBack')}>
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2 justify-end">
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
        {activeView === 'journal' && !isProjectView && (
            <button onClick={onNewJournalEntry} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('journal.new')}>
                <PlusCircleIcon className="w-7 h-7" />
            </button>
        )}
        <button onClick={onNavigateToSettings} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('settings.title')}>
            <Cog6ToothIcon className="w-6 h-6" />
        </button>
         <button onClick={onNavigateToHelp} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" title={t('help.title')}>
            <QuestionMarkCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};