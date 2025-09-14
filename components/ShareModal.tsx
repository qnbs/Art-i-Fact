

import React from 'react';
import type { Gallery, Profile, ShareableGalleryData } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { Button } from './ui/Button.tsx';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from './IconComponents.tsx';

interface ShareModalProps {
    gallery: Gallery;
    profile: Profile;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ gallery, profile, onClose }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();

    const handleCopyLink = () => {
        const shareableData: ShareableGalleryData = {
            gallery,
            profile,
        };
        const jsonString = JSON.stringify(shareableData);
        const encodedData = btoa(jsonString);
        const url = `${window.location.origin}${window.location.pathname}#view=${encodedData}`;
        
        navigator.clipboard.writeText(url)
            .then(() => showToast(t('toast.share.linkCopied'), 'success'))
            .catch(err => console.error('Failed to copy link: ', err));
        onClose();
    };

    const handleExport = () => {
        const jsonString = JSON.stringify(gallery, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeTitle = gallery.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${safeTitle || 'gallery'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        onClose();
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center"><ArrowUpTrayIcon className="w-5 h-5 mr-2 text-amber-500"/>{t('share.modal.link.title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">{t('share.modal.link.description')}</p>
                <Button onClick={handleCopyLink} className="w-full">{t('share.modal.link.copy')}</Button>
            </div>
             <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold text-lg flex items-center"><ArrowDownTrayIcon className="w-5 h-5 mr-2 text-amber-500"/>{t('share.modal.export.title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 my-2">{t('share.modal.export.description')}</p>
                <Button variant="secondary" onClick={handleExport} className="w-full">{t('share.modal.export.button')}</Button>
            </div>
        </div>
    );
};