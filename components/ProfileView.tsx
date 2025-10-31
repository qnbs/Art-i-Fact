import React from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Avatar } from './ui/Avatar.tsx';
import { Cog6ToothIcon, QuestionMarkCircleIcon, ChevronRightIcon, UserCircleIcon, PencilIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';

const StatItem: React.FC<{ value: number; label: string; }> = React.memo(({ value, label }) => (
    <div className="text-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
        <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
));
StatItem.displayName = 'StatItem';

const ProfileLink: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = React.memo(({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-white dark:bg-gray-900/70 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors shadow-sm hover:shadow-md">
        <div className="mr-4 text-amber-500 dark:text-amber-400">{icon}</div>
        <span className="font-semibold text-lg flex-grow text-left">{label}</span>
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
    </button>
));
ProfileLink.displayName = 'ProfileLink';

export const ProfileView: React.FC = () => {
    const { t } = useTranslation();
    const { handleSetView, handleEditProfile, galleries, profile } = useAppContext();

    const stats = {
        galleriesCurated: galleries.length,
        artworksDiscovered: galleries.reduce((sum, g) => sum + g.artworks.filter(a => !a.isGenerated).length, 0),
        aiArtworksCreated: galleries.reduce((sum, g) => sum + g.artworks.filter(a => a.isGenerated).length, 0),
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
            <PageHeader title={t('profile.title')} icon={<UserCircleIcon className="w-8 h-8" />}>
                 <Button variant="secondary" onClick={handleEditProfile}>
                    <PencilIcon className="w-5 h-5 mr-2" />
                    {t('profile.edit.button')}
                </Button>
            </PageHeader>
            <div className="flex flex-col md:flex-row items-center text-center md:text-left p-8 mb-8 bg-white/50 dark:bg-black/20 rounded-xl">
                <Avatar seed={profile.avatar} className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-8 flex-shrink-0" />
                <div>
                    <h2 className="text-3xl font-bold">{profile.username}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">{profile.bio}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatItem value={stats.galleriesCurated} label={t('profile.stats.galleries')} />
                <StatItem value={stats.artworksDiscovered} label={t('profile.stats.discovered')} />
                <StatItem value={stats.aiArtworksCreated} label={t('profile.stats.created')} />
            </div>

            <div className="space-y-4">
                <ProfileLink icon={<Cog6ToothIcon className="w-7 h-7" />} label={t('settings.title')} onClick={() => handleSetView('setup')} />
                <ProfileLink icon={<QuestionMarkCircleIcon className="w-7 h-7" />} label={t('help.title')} onClick={() => handleSetView('help')} />
            </div>
        </div>
    );
};