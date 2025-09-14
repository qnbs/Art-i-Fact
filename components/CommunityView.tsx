import React, { useState, useEffect, memo } from 'react';
import type { Gallery } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { getCommunityGalleries } from '../services/communityService.ts';
import { PageHeader } from './ui/PageHeader.tsx';
import { GlobeAltIcon, ArrowDownTrayIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { Avatar } from './ui/Avatar.tsx';
import { LoadingOverlay } from './ui/LoadingOverlay.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { Skeleton } from './ui/Skeleton.tsx';


interface CommunityViewProps {
    onPreviewGallery: (gallery: Gallery) => void;
    onImportGallery: (gallery: Gallery) => void;
}

const CommunityGalleryCard: React.FC<{
    gallery: Gallery;
    onPreview: () => void;
    onImport: () => void;
}> = memo(({ gallery, onPreview, onImport }) => {
    const { t } = useTranslation();
    const { curatorProfile } = gallery;

    return (
        <div className="group bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 border border-gray-200 dark:border-gray-800 flex flex-col">
            <button onClick={onPreview} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-t-lg">
                <ImageWithFallback 
                    src={gallery.thumbnailUrl} 
                    alt={gallery.title} 
                    fallbackText={gallery.title}
                    className="w-full h-40 object-cover"
                />
            </button>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg truncate">{gallery.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-grow mt-1">{gallery.description}</p>
                
                {curatorProfile && (
                    <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                        <Avatar seed={curatorProfile.avatar} className="w-8 h-8 rounded-full" />
                        <div className="ml-2">
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('community.curatedBy', { name: '' })}</p>
                            <p className="text-sm font-semibold">{curatorProfile.username}</p>
                        </div>
                    </div>
                )}
            </div>
             <div className="p-2 border-t border-gray-100 dark:border-gray-800/50 flex gap-2">
                <Button variant="secondary" size="sm" className="w-full" onClick={onPreview}>
                    {t('community.preview')}
                </Button>
                <Button size="sm" className="w-full" onClick={onImport}>
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2"/>
                    {t('community.import')}
                </Button>
            </div>
        </div>
    );
});
CommunityGalleryCard.displayName = 'CommunityGalleryCard';

const CommunityGalleryCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 flex flex-col">
        <Skeleton className="w-full h-40" />
        <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="p-2 border-t border-gray-100 dark:border-gray-800/50 flex gap-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-1/2" />
        </div>
    </div>
);


export const CommunityView: React.FC<CommunityViewProps> = ({ onPreviewGallery, onImportGallery }) => {
    const { t } = useTranslation();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGalleries = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getCommunityGalleries();
                setGalleries(data);
            } catch (err) {
                setError(t('community.empty.prompt'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchGalleries();
    }, [t]);

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title={t('community.title')}
                subtitle={t('community.subtitle')}
                icon={<GlobeAltIcon className="w-8 h-8" />}
            />

            {isLoading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <CommunityGalleryCardSkeleton key={i} />)}
                 </div>
            ) : error ? (
                <EmptyState
                    icon={<GlobeAltIcon className="w-16 h-16" />}
                    title={t('community.empty.title')}
                    message={error}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galleries.map(gallery => (
                        <CommunityGalleryCard
                            key={gallery.id}
                            gallery={gallery}
                            onPreview={() => onPreviewGallery(gallery)}
                            onImport={() => onImportGallery(gallery)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};