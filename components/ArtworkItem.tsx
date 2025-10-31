import React from 'react';
import type { Artwork } from '../types.ts';
import { InfoIcon, PlusCircleIcon } from './IconComponents.tsx';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { ArtworkItemUI } from './ui/ArtworkItemUI.tsx';

interface ArtworkItemProps {
  artwork: Artwork;
  onViewDetails: (artwork: Artwork) => void;
  onInitiateAdd: (artwork: Artwork) => void;
}

export const ArtworkItem: React.FC<ArtworkItemProps> = ({ artwork, onViewDetails, onInitiateAdd }) => {
  const { t } = useTranslation();
  
  const handleDetailsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onViewDetails(artwork);
  }

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onInitiateAdd(artwork);
  }

  const overlay = (
    <>
      <button 
        onClick={handleAddClick}
        className="add-button absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full p-2.5 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all hover:bg-green-600/70 focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label={t('modal.details.addToGallery')}
      >
        <PlusCircleIcon className="w-5 h-5" />
      </button>

      <button 
        onClick={handleDetailsClick}
        className="details-button absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2.5 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all hover:bg-amber-600/70 focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label={t('artwork.detailsLabel', { title: artwork.title })}
      >
        <InfoIcon className="w-5 h-5" />
      </button>
    </>
  );

  return (
    <ArtworkItemUI 
      artwork={artwork} 
      overlayContent={overlay}
      onClick={() => onViewDetails(artwork)}
      role="button"
    />
  );
};