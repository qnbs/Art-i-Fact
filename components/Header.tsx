import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { Gallery, Project } from '../types';
import { 
    Cog6ToothIcon, QuestionMarkCircleIcon, SparklesIcon, PlusCircleIcon, HomeIcon,
    GalleryIcon, JournalIcon, ArrowLeftIcon, PresentationChartBarIcon, ShareIcon,
    Bars3Icon, CheckCircleIcon, PencilIcon, UserCircleIcon
} from './IconComponents';
import { Button } from './ui/Button';

type ActiveView = 'workspace' | 'discover' | 'studio' | 'gallery' | 'journal' | 'setup' | 'help' | 'profile';

interface HeaderProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    
    // Contextual props
    activeGallery: Gallery | null;
    onNewProject?: () => void;
    onCreateNewGallery?: () => void;
    onNewJournalEntry?: () => void;
    onGoBack?: () => void;
    isGalleryEditing?: boolean;
    onToggleGalleryEditing?: () => void;
    onExhibit?: () => void;
    onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    activeView, setActiveView, activeGallery, onNewProject, onCreateNewGallery, onNewJournalEntry,
    onGoBack, isGalleryEditing, onToggleGalleryEditing, onExhibit, onShare
}) => {
  const { t } = useTranslation();

  const renderTitleAndActions = () => {
      switch (activeView) {
          case 'workspace':
              return (
                  <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                          <HomeIcon className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                          <h1 className="text-xl font-bold">{t('workspace.title')}</h1>
                      </div>
                      {onNewProject && <Button variant="secondary" onClick={onNewProject}>
                          <PlusCircleIcon className="w-5 h-5 mr-2" /> {t('workspace.newProject')}
                      </Button>}
                  </div>
              );
          case 'gallery':
              if (activeGallery) {
                  return (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                            {onGoBack && <Button variant="secondary" size="sm" onClick={onGoBack} title={t('gallery.backToManager')}><ArrowLeftIcon className="w-5 h-5" /></Button>}
                            <h1 className="text-xl font-bold truncate">{activeGallery.title || t('gallery.new')}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                          {onToggleGalleryEditing && <Button variant={isGalleryEditing ? 'primary' : 'secondary'} size="sm" onClick={onToggleGalleryEditing}>{isGalleryEditing ? <><CheckCircleIcon className="w-5 h-5 mr-1"/>{t('done')}</> : <><PencilIcon className="w-4 h-4 mr-1" />{t('edit')}</>}</Button>}
                          {onExhibit && activeGallery.artworks.length > 0 && <Button variant="secondary" onClick={onExhibit} disabled={isGalleryEditing}><PresentationChartBarIcon className="w-5 h-5 mr-2" />{t('gallery.exhibit')}</Button>}
                          {onShare && <Button onClick={onShare} disabled={isGalleryEditing}><ShareIcon className="w-5 h-5 mr-2" />{t('share')}</Button>}
                        </div>
                      </div>
                  )
              }
              return (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <GalleryIcon className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                        <h1 className="text-xl font-bold">{t('gallery.manager.title')}</h1>
                    </div>
                    {onCreateNewGallery && <Button variant="secondary" onClick={onCreateNewGallery}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> {t('gallery.manager.create')}
                    </Button>}
                  </div>
              );
          case 'journal':
              return (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                       {onGoBack && <Button variant="secondary" size="sm" onClick={onGoBack} title={t('back')}><ArrowLeftIcon className="w-5 h-5" /></Button>}
                        <JournalIcon className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                        <h1 className="text-xl font-bold">{t('journal.title')}</h1>
                    </div>
                    {onNewJournalEntry && <Button variant="secondary" onClick={onNewJournalEntry}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> {t('journal.new')}
                    </Button>}
                  </div>
              );
          case 'profile':
              return <h1 className="text-xl font-bold flex items-center gap-2"><UserCircleIcon className="w-7 h-7" /> {t('profile')}</h1>;
          case 'setup':
              return <h1 className="text-xl font-bold flex items-center gap-2"><Cog6ToothIcon className="w-7 h-7" /> {t('settings.title')}</h1>;
          case 'help':
              return <h1 className="text-xl font-bold flex items-center gap-2"><QuestionMarkCircleIcon className="w-7 h-7" /> {t('help.title')}</h1>;
          default:
              return (
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center gap-2 md:gap-3">
                        <SparklesIcon className="w-7 h-7 md:w-8 md:h-8 text-amber-500 dark:text-amber-400" />
                        <h1 className="text-2xl md:text-3xl font-bold tracking-wider">Art-i-Fact</h1>
                    </div>
                </div>
              );
      }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg p-3 sm:p-4 sticky top-0 z-40 border-b border-gray-200 dark:border-white/10 w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">{renderTitleAndActions()}</div>
      </div>
    </header>
  );
};