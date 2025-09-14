
import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useProfile } from '../contexts/ProfileContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useModal } from '../contexts/ModalContext';
import { Section, SettingRow, Toggle } from './ui/SettingsComponents';
import { PageHeader } from './ui/PageHeader';
import { Cog6ToothIcon, UserCircleIcon, SparklesIcon, PaintBrushIcon, PresentationChartBarIcon, TrashIcon } from './IconComponents';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

const AppResetModal: React.FC<{ onConfirm: () => void, onClose: () => void }> = ({ onConfirm, onClose }) => {
    const { t } = useTranslation();
    const [confirmationText, setConfirmationText] = useState('');
    const [finalConfirm, setFinalConfirm] = useState(false);
    const APP_NAME = "Art-i-Fact";
    const isConfirmed = confirmationText === APP_NAME;

    const handleInitialConfirm = () => {
        if (isConfirmed) {
            setFinalConfirm(true);
        }
    }

    if (finalConfirm) {
        return (
            <div>
                <h3 className="font-bold text-lg text-red-600 mb-2">{t('settings.danger.reset.final.title')}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{t('settings.danger.reset.final.desc')}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                    <Button variant="danger" onClick={onConfirm}>{t('confirm')}</Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t('settings.danger.reset.confirm.desc', { appName: APP_NAME })}</p>
            <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 mb-4"
            />
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                <Button variant="danger" onClick={handleInitialConfirm} disabled={!isConfirmed}>{t('confirm')}</Button>
            </div>
        </div>
    );
};

interface SetupProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    language: 'de' | 'en';
    onSetLanguage: (lang: 'de' | 'en') => void;
    onImportClick: () => void;
    onExport: () => void;
    onResetApp: () => void;
}

export const Setup: React.FC<SetupProps> = ({ theme, onToggleTheme, language, onSetLanguage, onImportClick, onExport, onResetApp }) => {
    const { t } = useTranslation();
    const { profile, setProfile } = useProfile();
    const { appSettings, setAppSettings } = useAppSettings();
    const { showModal, hideModal } = useModal();
    
    const handleProfileChange = (field: keyof typeof profile, value: string) => {
        setProfile({ [field]: value });
    };

    const handleSettingsChange = (field: keyof typeof appSettings, value: any) => {
        setAppSettings({ [field]: value });
    };
    
    const openResetModal = () => {
        showModal(
            t('settings.danger.reset.confirm.title'),
            <AppResetModal onConfirm={onResetApp} onClose={hideModal} />
        );
    };

    const availableAvatars = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6'];

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={t('settings.title')} icon={<Cog6ToothIcon className="w-8 h-8" />} />

            <Section title={t('settings.profile.title')} icon={<UserCircleIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.profile.username')}>
                    <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
                        className="w-48 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-right"
                    />
                </SettingRow>
                <SettingRow label={t('settings.profile.bio')}>
                    <textarea
                        value={profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        className="w-48 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-right"
                        rows={2}
                    />
                </SettingRow>
                <SettingRow label={t('settings.profile.avatar')}>
                    <div className="flex gap-2">
                        {availableAvatars.map(avatarId => (
                            <button key={avatarId} onClick={() => handleProfileChange('avatar', avatarId)} className={`rounded-full p-1 ${profile.avatar === avatarId ? 'ring-2 ring-amber-500' : ''}`}>
                                <Avatar seed={avatarId} className="w-10 h-10" />
                            </button>
                        ))}
                    </div>
                </SettingRow>
            </Section>

            <Section title={t('settings.general.title')} icon={<Cog6ToothIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.general.language')}>
                    <div className="flex gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-md">
                        <Button size="sm" variant={language === 'de' ? 'primary' : 'ghost'} onClick={() => onSetLanguage('de')}>DE</Button>
                        <Button size="sm" variant={language === 'en' ? 'primary' : 'ghost'} onClick={() => onSetLanguage('en')}>EN</Button>
                    </div>
                </SettingRow>
                <SettingRow label={t('settings.general.theme')}>
                     <div className="flex gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-md">
                        <Button size="sm" variant={theme === 'light' ? 'primary' : 'ghost'} onClick={() => theme === 'dark' && onToggleTheme()}>Light</Button>
                        <Button size="sm" variant={theme === 'dark' ? 'primary' : 'ghost'} onClick={() => theme === 'light' && onToggleTheme()}>Dark</Button>
                    </div>
                </SettingRow>
                <SettingRow label={t('settings.general.compactMode')} description={t('settings.general.compactMode.desc')}>
                    <Toggle enabled={appSettings.compactMode} onToggle={() => handleSettingsChange('compactMode', !appSettings.compactMode)} />
                </SettingRow>
            </Section>

            <Section title={t('settings.ai.title')} icon={<SparklesIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.ai.language')} description={t('settings.ai.language.desc')}>
                    <select
                        value={appSettings.aiContentLanguage}
                        onChange={(e) => handleSettingsChange('aiContentLanguage', e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="ui">{t('settings.ai.language.ui')}</option>
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.ai.creativity')} description={t('settings.ai.creativity.desc')}>
                    <select
                        value={appSettings.aiCreativity}
                        onChange={(e) => handleSettingsChange('aiCreativity', e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="focused">{t('settings.ai.creativity.focused')}</option>
                        <option value="balanced">{t('settings.ai.creativity.balanced')}</option>
                        <option value="creative">{t('settings.ai.creativity.creative')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.ai.resultsCount')} description={t('settings.ai.resultsCount.desc')}>
                    <input
                        type="number"
                        min="5"
                        max="50"
                        step="5"
                        value={appSettings.aiResultsCount}
                        onChange={(e) => handleSettingsChange('aiResultsCount', parseInt(e.target.value, 10))}
                        className="w-20 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-right"
                    />
                </SettingRow>
            </Section>
            
            <Section title={t('settings.studio.title')} icon={<PaintBrushIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.studio.enhancementStyle')} description={t('settings.studio.enhancementStyle.desc')}>
                    <select
                        value={appSettings.promptEnhancementStyle}
                        onChange={(e) => handleSettingsChange('promptEnhancementStyle', e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="descriptive">{t('settings.studio.enhancementStyle.descriptive')}</option>
                        <option value="subtle">{t('settings.studio.enhancementStyle.subtle')}</option>
                        <option value="artistic">{t('settings.studio.enhancementStyle.artistic')}</option>
                    </select>
                </SettingRow>
            </Section>

            <Section title={t('settings.exhibit.title')} icon={<PresentationChartBarIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.exhibit.autoplay')} description={t('settings.exhibit.autoplay.desc')}>
                    <Toggle enabled={appSettings.exhibitAutoplay} onToggle={() => handleSettingsChange('exhibitAutoplay', !appSettings.exhibitAutoplay)} />
                 </SettingRow>
                 <SettingRow label={t('settings.exhibit.speed')} description={t('settings.exhibit.speed.desc')}>
                     <input
                        type="range"
                        min="3"
                        max="15"
                        step="1"
                        value={appSettings.slideshowSpeed}
                        onChange={(e) => handleSettingsChange('slideshowSpeed', parseInt(e.target.value, 10))}
                        className="w-32"
                    />
                    <span className="ml-4 text-sm font-mono">{appSettings.slideshowSpeed}s</span>
                 </SettingRow>
                  <SettingRow label={t('settings.exhibit.transition')} description={t('settings.exhibit.transition.desc')}>
                    <select
                        value={appSettings.slideshowTransition}
                        onChange={(e) => handleSettingsChange('slideshowTransition', e.target.value)}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="fade">{t('settings.exhibit.transition.fade')}</option>
                        <option value="slide">{t('settings.exhibit.transition.slide')}</option>
                    </select>
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.showInfo')} description={t('settings.exhibit.showInfo.desc')}>
                    <Toggle enabled={appSettings.showArtworkInfoInSlideshow} onToggle={() => handleSettingsChange('showArtworkInfoInSlideshow', !appSettings.showArtworkInfoInSlideshow)} />
                 </SettingRow>
            </Section>
            
             <Section title={t('settings.data.title')} icon={<Cog6ToothIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.data.import.label')} description={t('settings.data.import.desc')}>
                    <Button variant="secondary" onClick={onImportClick}>{t('settings.data.import.button')}</Button>
                </SettingRow>
                 <SettingRow label={t('settings.data.export.label')} description={t('settings.data.export.desc')}>
                    <Button variant="secondary" onClick={onExport}>{t('settings.data.export.button')}</Button>
                </SettingRow>
            </Section>

            <div className="mb-8 p-4 border-2 border-red-500/50 dark:border-red-400/50 rounded-lg bg-red-50 dark:bg-red-900/20">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2 flex items-center"><TrashIcon className="w-5 h-5 mr-2" />{t('settings.danger.title')}</h3>
                <SettingRow label={t('settings.danger.reset.label')} description={t('settings.danger.reset.desc')}>
                    <Button variant="danger" onClick={openResetModal}>{t('settings.danger.reset.button')}</Button>
                </SettingRow>
            </div>
        </div>
    );
};
