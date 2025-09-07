import React from 'react';
import { Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { PlusCircleIcon } from './IconComponents';
import { Modal } from './Modal';

interface AddToGalleryModalProps {
  galleries: Gallery[];
  onSelectGallery: (galleryId: string) => void;
  onCreateAndAdd: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AddToGalleryModal: React.FC<AddToGalleryModalProps> = ({ galleries, onSelectGallery, onCreateAndAdd, onClose, isOpen }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modal.addToGallery.title')}>
        <div>
            <button
                onClick={onCreateAndAdd}
                className="w-full flex items-center justify-center p-3 mb-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                {t('modal.addToGallery.create')}
            </button>
            
            {galleries.length > 0 && (
                <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">{t('modal.addToGallery.select')}</p>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                        {galleries.map(gallery => (
                            <button
                                key={gallery.id}
                                onClick={() => onSelectGallery(gallery.id)}
                                className="w-full text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                            >
                                <img src={gallery.thumbnailUrl} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0 bg-gray-300" />
                                <span className="font-semibold truncate">{gallery.title || t('gallery.new')}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    </Modal>
  );
};
