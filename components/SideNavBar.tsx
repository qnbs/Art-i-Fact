import React from 'react';
import type { ActiveView } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { HomeIcon, SearchIcon, PaintBrushIcon, JournalIcon, SparklesIcon, GlobeAltIcon, GalleryIcon, SunIcon, MoonIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface SideNavBarProps {
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
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <div className="w-6 h-6 mr-4">{icon}</div>
        <span className="font-semibold">{label}</span>
      </button>
    </li>
  );
};

export const SideNavBar: React.FC<SideNavBarProps> = ({ activeView, setActiveView }) => {
  const { t } = useTranslation();
  // FIX: Destructure appSettings as settings and use toggleTheme from context.
  const { appSettings: settings, toggleTheme } = useAppContext();

  const navItems: { view: ActiveView, label: string, icon: React.ReactNode }[] = [
    { view: 'workspace', label: t('view.workspace'), icon: <HomeIcon /> },
    { view: 'discover', label: t('view.discover'), icon: <SearchIcon /> },
    { view: 'gallerysuite', label: t('view.gallerysuite'), icon: <GalleryIcon /> },
    { view: 'studio', label: t('view.studio'), icon: <PaintBrushIcon /> },
    { view: 'journal', label: t('view.journal'), icon: <JournalIcon /> },
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex-shrink-0">
      <div className="flex items-center mb-8">
        <SparklesIcon className="w-8 h-8 text-amber-500 mr-2" />
        <h1 className="text-xl font-bold">Art-i-Fact</h1>
      </div>
      <ul className="space-y-2">
        {navItems.map(item => (
          <NavItem
            key={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </ul>
      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
          aria-label={settings.theme === 'dark' ? t('settings.general.theme.toggleLight') : t('settings.general.theme.toggleDark')}
        >
          {settings.theme === 'dark' ? <SunIcon className="w-6 h-6 mr-4" /> : <MoonIcon className="w-6 h-6 mr-4" />}
          <span className="font-semibold">{settings.theme === 'dark' ? t('settings.general.theme.lightMode') : t('settings.general.theme.darkMode')}</span>
        </button>
      </div>
    </nav>
  );
};