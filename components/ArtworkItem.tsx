
import React from 'react';
import type { Artwork } from '../types';
import { InfoIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface ArtworkItemProps {
  artwork: Artwork;
  onViewDetails: (artwork: Artwork) => void;
}

const ArtworkItemComponent: React.FC<ArtworkItemProps> = ({ artwork, onViewDetails }) => {
  const { t } = useTranslation();
  
  const handleCardClick = () => {
    onViewDetails(artwork);
  };

  const handleDetailsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents handleCardClick from firing
    onViewDetails(artwork);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-900 transition-transform duration-300 hover:scale-105 hover:shadow-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-950"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') handleCardClick(); }}
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

      <button 
        onClick={handleDetailsClick}
        className="details-button absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2.5 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all hover:bg-amber-600/70 focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label={t('artwork.detailsLabel', { title: artwork.title })}
      >
        <InfoIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ArtworkItem = React.memo(ArtworkItemComponent);