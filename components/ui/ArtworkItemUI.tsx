import React from 'react';
import type { Artwork } from '../../types.ts';
import { ImageWithFallback } from './ImageWithFallback.tsx';

interface ArtworkItemUIProps extends React.HTMLAttributes<HTMLDivElement> {
    artwork: Artwork;
    overlayContent?: React.ReactNode;
}

export const ArtworkItemUI = React.forwardRef<HTMLDivElement, ArtworkItemUIProps>(
    ({ artwork, overlayContent, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`group relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-950 ${className}`}
                tabIndex={0}
                aria-label={`${artwork.title} by ${artwork.artist}`}
                onKeyDown={(e) => { if(e.key === 'Enter') props.onClick?.(e as any); }}
                {...props}
            >
                <ImageWithFallback 
                    src={artwork.thumbnailUrl || artwork.imageUrl} 
                    alt={artwork.title} 
                    fallbackText={artwork.title}
                    className="w-full h-auto object-cover aspect-[3/4] transition-opacity duration-300 group-hover:brightness-75"
                    loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
                    <h3 className="font-bold text-base text-white truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-300 truncate">{artwork.artist}</p>
                </div>
                
                {/* Container for dynamic overlay content */}
                {overlayContent}
            </div>
        );
    }
);

ArtworkItemUI.displayName = 'ArtworkItemUI';