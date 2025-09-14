
import React from 'react';
import { HomeIcon, GalleryIcon, JournalIcon, SearchIcon, PaintBrushIcon, UserCircleIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile' | 'glossary' | 'project';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
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
      className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 transition-colors duration-200 relative ${isActive ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      <div className="relative">
        {icon}
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      {isActive && <div className="absolute bottom-0 h-0.5 w-8 bg-amber-500 dark:bg-amber-400 rounded-full"></div>}
    </button>
  );
});


export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 flex z-40 md:hidden">
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
        label={t('workspace')}
        icon={<HomeIcon className="w-6 h-6" />}
        isActive={['workspace', 'gallery', 'project'].includes(activeView)}
        onClick={() => setActiveView('workspace')}
      />
      <NavButton
        label={t('journal.title')}
        icon={<JournalIcon className="w-6 h-6" />}
        isActive={activeView === 'journal'}
        onClick={() => setActiveView('journal')}
      />
       <NavButton
        label={t('profile')}
        icon={<UserCircleIcon className="w-6 h-6" />}
        isActive={['profile', 'setup', 'help', 'glossary'].includes(activeView)}
        onClick={() => setActiveView('profile')}
      />
    </nav>
  );
};
