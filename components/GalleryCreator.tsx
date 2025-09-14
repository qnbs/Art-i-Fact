
import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { Button } from './ui/Button.tsx';
// FIX: Added .ts extension to fix module resolution error.
import type { Gallery } from '../types.ts';

interface GalleryCreatorProps {
  onSave: (details: { title: string; description: string }) => void;
  onCancel: () => void;
  gallery?: Gallery | null;
  isCompact?: boolean;
}

export const GalleryCreator: React.FC<GalleryCreatorProps> = ({ onSave, onCancel, gallery, isCompact = false }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (gallery) {
      setTitle(gallery.title);
      setDescription(gallery.description);
    }
  }, [gallery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isCompact ? 'p-1' : ''}`}>
      <div>
        <label htmlFor="gallery-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('gallery.creator.title')}
        </label>
        <input
          id="gallery-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('gallery.creator.title.placeholder')}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="gallery-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('gallery.creator.description')}
        </label>
        <textarea
          id="gallery-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('gallery.creator.description.placeholder')}
          rows={isCompact ? 3 : 4}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {isCompact ? t('back') : t('cancel')}
        </Button>
        <Button type="submit">
          {gallery ? t('save') : t('create')}
        </Button>
      </div>
    </form>
  );
};
