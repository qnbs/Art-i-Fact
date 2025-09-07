import React from 'react';
import { Profile } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { Avatar } from './ui/Avatar';
import { Cog6ToothIcon, QuestionMarkCircleIcon, ChevronRightIcon } from './IconComponents';

interface ProfileViewProps {
    profile: Profile;
    setActiveView: (view: 'setup' | 'help') => void;
    stats: {
        galleriesCurated: number;
        artworksDiscovered: number;
        aiArtworksCreated: number;
    };
}

const StatItem: React.FC<{ value: number; label: string; }> = ({ value, label }) => (
    <div className="text-center p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
);

const ProfileLink: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 bg-white dark:bg-gray-900/70 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors">
        <div className="mr-4 text-amber-500 dark:text-amber-400">{icon}</div>
        <span className="font-semibold text-lg flex-grow text-left">{label}</span>
        <ChevronRightIcon className="w-6 h-6 text-gray-400" />
    </button>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, setActiveView, stats }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full p-4 md:p-6">
            <div className="flex flex-col items-center text-center p-8 mb-8">
                <Avatar seed={profile.avatar} className="w-24 h-24 rounded-full mb-4" />
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto w-full">
                <StatItem value={stats.galleriesCurated} label={t('profile.stats.galleries')} />
                <StatItem value={stats.artworksDiscovered} label={t('profile.stats.discovered')} />
                <StatItem value={stats.aiArtworksCreated} label={t('profile.stats.created')} />
            </div>

            <div className="space-y-4 max-w-md mx-auto w-full">
                <ProfileLink icon={<Cog6ToothIcon className="w-7 h-7" />} label={t('settings.title')} onClick={() => setActiveView('setup')} />
                <ProfileLink icon={<QuestionMarkCircleIcon className="w-7 h-7" />} label={t('help.title')} onClick={() => setActiveView('help')} />
            </div>
        </div>
    );
};
