
import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PlusCircleIcon, CommandLineIcon, ArrowLeftIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from './IconComponents';
import { Tooltip } from './ui/Tooltip';

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
    gallery: t('gallery'),
    journal: t('journal.title'),
    profile: t('profile'),
    setup: t('settings.title'),
    help: t('help.title'),
  };

  const title = pageTitle || viewTitles[activeView] || 'Art-i-Fact';


  return (
    <header className="md:hidden sticky top-0 z-30 grid grid-cols-3 items-center h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
      <div className="flex items-center gap-2 justify-start">
        <Tooltip text={t('commandPalette.placeholder')}>
          <button onClick={onOpenCommandPalette} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
            <CommandLineIcon className="w-6 h-6" />
          </button>
        </Tooltip>
        {showBackButton && (
          <Tooltip text={t('navigateBack')}>
            <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2 justify-end">
        {activeView === 'workspace' && !isProjectView && (
            <Tooltip text={t('workspace.newProject')}>
              <button onClick={onNewProject} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
                  <PlusCircleIcon className="w-7 h-7" />
              </button>
            </Tooltip>
        )}
        {isProjectView && (
             <Tooltip text={t('gallery.manager.create')}>
              <button onClick={onNewGallery} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
                  <PlusCircleIcon className="w-7 h-7" />
              </button>
            </Tooltip>
        )}
        {activeView === 'gallery' && !isProjectView && !isGalleryView && (
            <Tooltip text={t('gallery.manager.create')}>
              <button onClick={onNewGallery} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
                  <PlusCircleIcon className="w-7 h-7" />
              </button>
            </Tooltip>
        )}
        {activeView === 'journal' && !isProjectView && (
            <Tooltip text={t('journal.new')}>
              <button onClick={onNewJournalEntry} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
                  <PlusCircleIcon className="w-7 h-7" />
              </button>
            </Tooltip>
        )}
        <Tooltip text={t('settings.title')}>
          <button onClick={onNavigateToSettings} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
              <Cog6ToothIcon className="w-6 h-6" />
          </button>
        </Tooltip>
         <Tooltip text={t('help.title')}>
          <button onClick={onNavigateToHelp} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400">
              <QuestionMarkCircleIcon className="w-6 h-6" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};
