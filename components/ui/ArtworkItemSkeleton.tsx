import React from 'react';
import { Skeleton } from './Skeleton';

export const ArtworkItemSkeleton: React.FC = () => (
    <div className="w-full h-auto object-cover aspect-[3/4]">
        <Skeleton className="w-full h-full" />
    </div>
);
