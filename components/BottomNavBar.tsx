import React from 'react';
import type { ActiveView } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { HomeIcon, SearchIcon, PaintBrushIcon, JournalIcon, GlobeAltIcon, GalleryIcon } from './IconComponents.tsx';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  const { t } = useTranslation();

  const navItems: { view: ActiveView, label: string, icon: React.ReactNode }[] = [
    { view: 'workspace', label: t('view.workspace'), icon: <HomeIcon className="w-6 h-6" /> },
    { view: 'discover', label: t('view.discover'), icon: <SearchIcon className="w-6 h-6" /> },
    { view: 'gallerysuite', label: t('view.gallerysuite'), icon: <GalleryIcon className="w-6 h-6" /> },
    { view: 'studio', label: t('view.studio'), icon: <PaintBrushIcon className="w-6 h-6" /> },
    { view: 'journal', label: t('view.journal'), icon: <JournalIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-40">
      {navItems.map(item => (
        <NavItem
          key={item.view}
          label={item.label}
          icon={item.icon}
          isActive={activeView === item.view}
          onClick={() => setActiveView(item.view)}
        />
      ))}
    </nav>
  );
};