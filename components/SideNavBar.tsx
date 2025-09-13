import React from 'react';
import { HomeIcon, GalleryIcon, Cog6ToothIcon, SparklesIcon, QuestionMarkCircleIcon, JournalIcon, SearchIcon, PaintBrushIcon, UserCircleIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

interface SideNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  galleryItemCount: number;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}> = React.memo(({ label, icon, isActive, onClick, badgeCount }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 relative ${isActive ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative">
        {icon}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1 -left-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </div>
      <span className="ml-4">{label}</span>
      {isActive && <div className="absolute right-0 h-6 w-1 bg-amber-500 dark:bg-amber-400 rounded-l-full"></div>}
    </button>
  );
});


export const SideNavBar: React.FC<SideNavBarProps> = ({ activeView, setActiveView, galleryItemCount }) => {
  const { t } = useTranslation();
  return (
    <nav className="hidden md:flex flex-col w-72 h-screen bg-white/50 dark:bg-black/20 p-4 border-r border-gray-200 dark:border-white/10 flex-shrink-0">
      <div className="flex items-center justify-center p-4 mb-8">
        <SparklesIcon className="w-9 h-9 text-amber-500 dark:text-amber-400 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-wider">
          Art-i-Fact
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <NavButton
          label={t('workspace')}
          icon={<HomeIcon className="w-6 h-6" />}
          isActive={activeView === 'workspace' || activeView === 'project'}
          onClick={() => setActiveView('workspace')}
        />
        <NavButton
          label={t('discover')}
          icon={<SearchIcon className="w-6 h-6" />}
          isActive={activeView === 'discover'}
          onClick={() => setActiveView('discover')}
        />
        <NavButton
          label={t('studio.title')}
          icon={<PaintBrushIcon className="w-6 h-6" />}
          isActive={activeView === 'studio'}
          onClick={() => setActiveView('studio')}
        />
        <NavButton
          label={t('gallery')}
          icon={<GalleryIcon className="w-6 h-6" />}
          isActive={activeView === 'gallery'}
          onClick={() => setActiveView('gallery')}
          badgeCount={galleryItemCount}
        />
        <NavButton
          label={t('journal.title')}
          icon={<JournalIcon className="w-6 h-6" />}
          isActive={activeView === 'journal'}
          onClick={() => setActiveView('journal')}
        />
      </div>
      <div className="mt-auto flex flex-col gap-2">
         <NavButton
          label={t('profile')}
          icon={<UserCircleIcon className="w-6 h-6" />}
          isActive={activeView === 'profile'}
          onClick={() => setActiveView('profile')}
        />
         <NavButton
          label={t('settings.title')}
          icon={<Cog6ToothIcon className="w-6 h-6" />}
          isActive={activeView === 'setup'}
          onClick={() => setActiveView('setup')}
        />
        <NavButton
          label={t('help.title')}
          icon={<QuestionMarkCircleIcon className="w-6 h-6" />}
          isActive={activeView === 'help' || activeView === 'glossary'}
          onClick={() => setActiveView('help')}
        />
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 p-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <p>Art-i-Fact {t('settings.about.version')}</p>
            <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </nav>
  );
};