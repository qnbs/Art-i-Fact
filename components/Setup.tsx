import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, UserCircleIcon, CheckCircleIcon, PresentationChartBarIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, SparklesIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { Profile, AppSettings } from '../types';
import { Section, SettingRow, Toggle } from './ui/SettingsComponents';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

interface SetupProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onClearCache: () => void;
    profile: Profile;
    onUpdateProfile: (profile: Profile) => void;
    onShowToast: (message: string) => void;
    appSettings: AppSettings;
    onUpdateAppSettings: (settings: Partial<AppSettings>) => void;
    onExportAllData: () => void;
    onTriggerImport: () => void;
}

const predefinedAvatars = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6'];

export const Setup: React.FC<SetupProps> = ({ 
    theme, onToggleTheme, onClearCache, profile, onUpdateProfile, onShowToast, 
    appSettings, onUpdateAppSettings, onExportAllData, onTriggerImport
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [localProfile, setLocalProfile] = useState<Profile>(profile);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const getVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        const langPrefix = language === 'de' ? 'de' : 'en';
        const filteredVoices = availableVoices.filter(v => v.lang.startsWith(langPrefix));
        setVoices(filteredVoices.length > 0 ? filteredVoices : availableVoices);
    };
    getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
    }
  }, [language]);


  useEffect(() => {
      setLocalProfile(profile);
  }, [profile]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
      setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
      onUpdateProfile(localProfile);
      onShowToast(t('toast.profile.saved'));
  };

  return (
    <div className="flex flex-col h-full">
        <Section title={t('settings.section.profile')} icon={<UserCircleIcon className="w-5 h-5"/>}>
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar seed={localProfile.avatar} className="w-20 h-20 rounded-full flex-shrink-0" />
                    <div className="flex-grow">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.username')}</label>
                        <input
                          id="username"
                          type="text"
                          value={localProfile.username}
                          onChange={(e) => handleProfileChange('username', e.target.value)}
                          placeholder={t('settings.profile.username.placeholder')}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.avatar')}</label>
                    <div className="flex flex-wrap gap-2">
                        {predefinedAvatars.map(avatarId => (
                            <button 
                                key={avatarId}
                                onClick={() => handleProfileChange('avatar', avatarId)}
                                className={`rounded-full p-1 transition-all ${localProfile.avatar === avatarId ? 'ring-2 ring-amber-500' : ''}`}
                            >
                                <Avatar seed={avatarId} className="w-12 h-12" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                     <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.bio')}</label>
                     <textarea
                       id="bio"
                       value={localProfile.bio}
                       onChange={(e) => handleProfileChange('bio', e.target.value)}
                       placeholder={t('settings.profile.bio.placeholder')}
                       rows={3}
                       className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                     />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleSaveProfile}>
                        <CheckCircleIcon className="w-5 h-5 mr-2"/>
                        {t('settings.profile.save')}
                    </Button>
                </div>
            </div>
        </Section>

        <Section title={t('settings.section.ai')} icon={<SparklesIcon className="w-5 h-5" />}>
            <SettingRow label={t('settings.ai.creativity')} description={t('settings.ai.creativity.desc')}>
                 <select 
                    value={appSettings.aiCreativity} 
                    onChange={(e) => onUpdateAppSettings({ aiCreativity: e.target.value as AppSettings['aiCreativity'] })} 
                    className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2 max-w-xs"
                >
                    <option value="focused">{t('settings.ai.creativity.focused')}</option>
                    <option value="balanced">{t('settings.ai.creativity.balanced')}</option>
                    <option value="creative">{t('settings.ai.creativity.creative')}</option>
                </select>
            </SettingRow>
            <SettingRow label={t('settings.ai.resultsCount')} description={t('settings.ai.resultsCount.desc')}>
                <div className="flex items-center gap-2">
                    <input 
                        type="range"
                        min="10" max="50" step="5"
                        value={appSettings.aiResultsCount}
                        onChange={(e) => onUpdateAppSettings({ aiResultsCount: Number(e.target.value) })}
                        className="w-24"
                    />
                    <span className="text-sm w-12 text-right">{appSettings.aiResultsCount}</span>
                </div>
            </SettingRow>
        </Section>

        <Section title={t('settings.section.exhibition')} icon={<PresentationChartBarIcon className="w-5 h-5" />}>
            <SettingRow label={t('settings.exhibit.slideshowSpeed')} description={t('settings.exhibit.slideshowSpeed.desc')}>
                <div className="flex items-center gap-2">
                    <input 
                        type="range"
                        min="5" max="15" step="1"
                        value={appSettings.slideshowSpeed}
                        onChange={(e) => onUpdateAppSettings({ slideshowSpeed: Number(e.target.value) })}
                        className="w-24"
                    />
                    <span className="text-sm w-12 text-right">{appSettings.slideshowSpeed}s</span>
                </div>
            </SettingRow>
            <SettingRow label={t('settings.exhibit.autoplay')} description={t('settings.exhibit.autoplay.desc')}>
                 <Toggle enabled={appSettings.exhibitAutoplay} onToggle={() => onUpdateAppSettings({ exhibitAutoplay: !appSettings.exhibitAutoplay })} />
            </SettingRow>
            <SettingRow label={t('settings.exhibit.audioGuideVoice')} description={t('settings.exhibit.audioGuideVoice.desc')}>
                <select 
                    value={appSettings.audioGuideVoiceURI || ''} 
                    onChange={(e) => onUpdateAppSettings({ audioGuideVoiceURI: e.target.value })} 
                    className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2 max-w-xs"
                    disabled={voices.length === 0}
                >
                    {voices.map(voice => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>
                    ))}
                </select>
            </SettingRow>
             <SettingRow label={t('settings.exhibit.audioGuideSpeed')} description={t('settings.exhibit.audioGuideSpeed.desc')}>
                <div className="flex items-center gap-2">
                    <input 
                        type="range"
                        min="0.5" max="2" step="0.1"
                        value={appSettings.audioGuideSpeed}
                        onChange={(e) => onUpdateAppSettings({ audioGuideSpeed: Number(e.target.value) })}
                        className="w-24"
                    />
                    <span className="text-sm w-12 text-right">x{appSettings.audioGuideSpeed.toFixed(1)}</span>
                </div>
            </SettingRow>
        </Section>
        
        <Section title={t('settings.section.appearance')}>
            <SettingRow label={t('settings.darkMode')}>
                <Toggle enabled={theme === 'dark'} onToggle={onToggleTheme} />
            </SettingRow>
        </Section>
        
        <Section title={t('settings.section.general')}>
             <SettingRow label={t('settings.language')}>
                <select value={language} onChange={(e) => setLanguage(e.target.value as 'de' | 'en')} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2">
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                </select>
            </SettingRow>
        </Section>

         <Section title={t('settings.section.data')}>
            <SettingRow label={t('settings.data.export')} description={t('settings.data.export.desc')}>
                <Button variant="secondary" size="sm" onClick={onExportAllData}>
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    {t('export')}
                </Button>
            </SettingRow>
             <SettingRow label={t('settings.data.import')} description={t('settings.data.import.desc')}>
                 <Button variant="secondary" size="sm" onClick={onTriggerImport}>
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    {t('import')}
                </Button>
            </SettingRow>
            <SettingRow label={t('settings.galleryCache')} description={t('settings.galleryCache.desc')}>
                 <Button variant="danger" size="sm" onClick={onClearCache}>
                    {t('settings.clearCache')}
                </Button>
            </SettingRow>
        </Section>

        <Section title={t('settings.section.about')}>
            <div className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                <p className="mb-2"><strong>Art-i-Fact</strong> {t('settings.about.version')}</p>
                <p>{t('settings.about.description')}</p>
                <div className="mt-4">
                    <a href="#" className="text-amber-600 dark:text-amber-500 hover:underline mr-4">{t('settings.about.privacy')}</a>
                    <a href="#" className="text-amber-600 dark:text-amber-500 hover:underline mr-4">{t('settings.about.terms')}</a>
                    <a href="https://github.com/qnbs/Art-i-Fact" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-500 hover:underline">{t('settings.about.sourceCode')}</a>
                </div>
            </div>
        </Section>
        
    </div>
  );
};