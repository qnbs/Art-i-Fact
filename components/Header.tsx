import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { CommandLineIcon, UserCircleIcon, EllipsisVerticalIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from './IconComponents.tsx';
import { useTranslation } from '../contexts/TranslationContext.tsx';
// FIX: Added .ts extension to fix module resolution error.
import type { ActiveView } from '../types.ts';
import { useProfile } from '../contexts/ProfileContext.tsx';
import { Avatar } from './ui/Avatar.tsx';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenCommandPalette: () => void;
  activeProjectTitle?: string;
  activeGalleryTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onOpenCommandPalette, activeProjectTitle, activeGalleryTitle }) => {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const getTitle = () => {
    if (activeView === 'project' && activeProjectTitle) return activeProjectTitle;
    if (activeView === 'gallery' && activeGalleryTitle) return activeGalleryTitle;
    return t(`view.${activeView}`);
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between w-full">
        <button
          onClick={onOpenCommandPalette}
          className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open command palette"
        >
          <CommandLineIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate px-2">{getTitle()}</h1>
        <details className="relative">
            <summary className="list-none cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <EllipsisVerticalIcon className="w-6 h-6"/>
            </summary>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveView('profile')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UserCircleIcon className="w-5 h-5" /> {t('view.profile')}
                </button>
                <button onClick={() => setActiveView('setup')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Cog6ToothIcon className="w-5 h-5" /> {t('view.setup')}
                </button>
                 <button onClick={() => setActiveView('help')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <QuestionMarkCircleIcon className="w-5 h-5" /> {t('view.help')}
                </button>
            </div>
        </details>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{getTitle()}</h1>
        <button onClick={() => setActiveView('profile')} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <Avatar seed={profile.avatar} className="w-8 h-8"/>
            <span className="text-sm font-semibold mr-2">{profile.username}</span>
        </button>
      </div>
    </header>
  );
};