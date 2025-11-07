import React, { useMemo } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Avatar } from './ui/Avatar.tsx';
import { Cog6ToothIcon, QuestionMarkCircleIcon, ChevronRightIcon, UserCircleIcon, PencilIcon, TrophyIcon, ClockIcon, ChartPieIcon, SwatchIcon, GalleryIcon, SparklesIcon, BookOpenIcon, SearchIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { Tooltip } from './ui/Tooltip.tsx';

const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-white dark:bg-gray-900/70 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 flex flex-col ${className}`}>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
        </h3>
        <div className="flex-grow">{children}</div>
    </div>
);

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = item.value / total;
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        
        const startX = 50 + 40 * Math.cos(Math.PI * (startAngle - 90) / 180);
        const startY = 50 + 40 * Math.sin(Math.PI * (startAngle - 90) / 180);
        const endX = 50 + 40 * Math.cos(Math.PI * (endAngle - 90) / 180);
        const endY = 50 + 40 * Math.sin(Math.PI * (endAngle - 90) / 180);

        return <path key={item.name} d={`M ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`} stroke={item.color} strokeWidth="15" fill="none" />;
    });

    return <svg viewBox="0 0 100 100" className="w-full h-full">{segments}</svg>;
};

const StatItem: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg text-center shadow-sm">
        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
);


export const ProfileView: React.FC = () => {
    const { t } = useTranslation();
    const { 
        handleSetView, 
        handleEditProfile, 
        galleries, 
        profile, 
        entries,
        appSettings,
        handleSelectGallery,
    } = useAppContext();

    const featuredGallery = useMemo(() => 
        profile.featuredGalleryId ? galleries.find(g => g.id === profile.featuredGalleryId) : null
    , [profile.featuredGalleryId, galleries]);

    const stats = useMemo(() => ({
        galleriesCurated: galleries.length,
        artworksDiscovered: galleries.reduce((sum, g) => sum + g.artworks.filter(a => !a.isGenerated).length, 0),
        aiArtworksCreated: galleries.reduce((sum, g) => sum + g.artworks.filter(a => a.isGenerated).length, 0),
        journalEntries: entries.length,
    }), [galleries, entries]);

    const allArtworks = useMemo(() => galleries.flatMap(g => g.artworks), [galleries]);

    const movementData = useMemo(() => {
        const movementCounts: Record<string, number> = {};
        const commonMovements = ['Impressionism', 'Cubism', 'Surrealism', 'Baroque', 'Renaissance', 'Pop Art', 'Abstract Expressionism', 'Rococo', 'Minimalism'];
        
        allArtworks.forEach(art => {
            art.tags?.forEach(tag => {
                const matchedMovement = commonMovements.find(m => tag.toLowerCase().includes(m.toLowerCase()));
                if (matchedMovement) {
                    movementCounts[matchedMovement] = (movementCounts[matchedMovement] || 0) + 1;
                }
            });
        });
        
        const sorted = Object.entries(movementCounts).sort((a, b) => b[1] - a[1]);
        const top5 = sorted.slice(0, 5);
        const otherCount = sorted.slice(5).reduce((sum, item) => sum + item[1], 0);
        
        const chartData = top5.map(([name, value]) => ({ name, value }));
        if(otherCount > 0) chartData.push({ name: t('profile.movements.other'), value: otherCount });
        
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];
        return chartData.map((item, i) => ({ ...item, color: colors[i % colors.length] }));
    }, [allArtworks, t]);

    const colorPalette = useMemo(() => {
        const allColors = allArtworks.flatMap(art => art.colorPalette || []);
        const colorCounts = allColors.reduce((acc, color) => {
            acc[color] = (acc[color] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(colorCounts).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 6).map(([color]) => color);
    }, [allArtworks]);

    const activityFeed = useMemo(() => {
        const galleryEvents = galleries.map(g => ({ date: new Date(g.createdAt), type: 'galleryCreated', title: g.title, id: g.id }));
        const journalEvents = entries.map(e => ({ date: new Date(e.createdAt), type: 'journalCreated', title: e.title, id: e.id }));
        // Could also add update events if needed
        return [...galleryEvents, ...journalEvents].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
    }, [galleries, entries]);
    
    const achievements = useMemo(() => [
        { id: 'first', name: t('profile.achievements.firstGallery.name'), desc: t('profile.achievements.firstGallery.desc'), icon: <GalleryIcon className="w-6 h-6"/>, isUnlocked: stats.galleriesCurated >= 1 },
        { id: 'prolific', name: t('profile.achievements.prolificCurator.name'), desc: t('profile.achievements.prolificCurator.desc'), icon: <GalleryIcon className="w-6 h-6"/>, isUnlocked: stats.galleriesCurated >= 5 },
        { id: 'pioneer', name: t('profile.achievements.aiPioneer.name'), desc: t('profile.achievements.aiPioneer.desc'), icon: <SparklesIcon className="w-6 h-6"/>, isUnlocked: stats.aiArtworksCreated >= 1 },
        { id: 'historian', name: t('profile.achievements.artHistorian.name'), desc: t('profile.achievements.artHistorian.desc'), icon: <BookOpenIcon className="w-6 h-6"/>, isUnlocked: stats.journalEntries >= 3 },
        { id: 'discoverer', name: t('profile.achievements.discoverer.name'), desc: t('profile.achievements.discoverer.desc'), icon: <SearchIcon className="w-6 h-6"/>, isUnlocked: stats.artworksDiscovered >= 10 },
    ].filter(a => a.isUnlocked), [stats, t]);

    const journalCountLabel = stats.journalEntries === 1
        ? t('workspace.project.journals_one')
        : t('workspace.project.journals_other', { count: String(stats.journalEntries) });

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
            <PageHeader title={t('profile.title')} icon={<UserCircleIcon className="w-8 h-8" />}>
                 <Button variant="secondary" onClick={handleEditProfile}>
                    <PencilIcon className="w-5 h-5 mr-2" />
                    {t('profile.edit.button')}
                </Button>
            </PageHeader>
            <div className="flex flex-col md:flex-row items-center text-center md:text-left p-6 mb-6 bg-white/50 dark:bg-black/20 rounded-xl gap-6">
                <Avatar seed={profile.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-full flex-shrink-0 shadow-lg" />
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold">{profile.username}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">{profile.bio}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                 <StatItem value={stats.galleriesCurated} label={t('profile.stats.galleries')} />
                 <StatItem value={stats.artworksDiscovered} label={t('profile.stats.discovered')} />
                 <StatItem value={stats.aiArtworksCreated} label={t('profile.stats.created')} />
                 <StatItem value={stats.journalEntries} label={journalCountLabel} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     {featuredGallery && (
                        <DashboardCard title={t('profile.featuredGallery')} icon={<TrophyIcon className="w-5 h-5" />}>
                           <button onClick={() => handleSelectGallery(featuredGallery.id)} className="block w-full text-left p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <ImageWithFallback src={featuredGallery.thumbnailUrl} alt={featuredGallery.title} fallbackText={featuredGallery.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-lg">{featuredGallery.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{featuredGallery.description}</p>
                                    </div>
                                </div>
                           </button>
                        </DashboardCard>
                     )}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DashboardCard title={t('profile.movements.title')} icon={<ChartPieIcon className="w-5 h-5"/>}>
                            {movementData.length > 0 ? (
                                <div className="flex items-center gap-4 h-full">
                                    <div className="w-24 h-24 flex-shrink-0"><DonutChart data={movementData} /></div>
                                    <ul className="text-sm space-y-1">
                                        {movementData.map(item => (
                                            <li key={item.name} className="flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}/>
                                                {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : <p className="text-xs text-gray-500 text-center p-4">{t('profile.movements.empty')}</p>}
                        </DashboardCard>
                         <DashboardCard title={t('profile.palette.title')} icon={<SwatchIcon className="w-5 h-5" />}>
                            {colorPalette.length > 0 ? (
                                <div className="flex flex-wrap gap-2 items-center justify-center h-full">
                                    {colorPalette.map(color => (
                                        <Tooltip key={color} text={color}>
                                            <div className="w-10 h-10 rounded-full border-2 border-white/50 dark:border-black/50 shadow-md" style={{backgroundColor: color}} />
                                        </Tooltip>
                                    ))}
                                </div>
                            ) : <p className="text-xs text-gray-500 text-center p-4">{t('profile.palette.empty')}</p>}
                        </DashboardCard>
                     </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {appSettings.showProfileActivity && (
                        <DashboardCard title={t('profile.activity.title')} icon={<ClockIcon className="w-5 h-5" />}>
                            {activityFeed.length > 0 ? (
                                <ul className="space-y-3">
                                    {activityFeed.map(item => (
                                        <li key={`${item.type}-${item.id}`} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type.includes('gallery') ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-200">
                                                    {t(`profile.activity.${item.type}`)} <span className="font-semibold">"{item.title}"</span>
                                                </p>
                                                <p className="text-xs text-gray-400">{item.date.toLocaleDateString()}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-gray-500 text-center p-4">{t('profile.activity.empty')}</p>}
                        </DashboardCard>
                    )}
                    {appSettings.showProfileAchievements && (
                        <DashboardCard title={t('profile.achievements.title')} icon={<TrophyIcon className="w-5 h-5" />}>
                            <div className="flex flex-wrap gap-3">
                                {achievements.map(ach => (
                                     <Tooltip key={ach.id} text={ach.desc}>
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-amber-600 dark:text-amber-400">
                                            {ach.icon}
                                        </div>
                                    </Tooltip>
                                ))}
                            </div>
                        </DashboardCard>
                    )}
                </div>
            </div>
        </div>
    );
};
