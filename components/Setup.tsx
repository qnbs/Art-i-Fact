import React, { useState, useEffect } from 'react';
import type { AppSettings, ActiveView } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { Section, SettingRow, Toggle } from './ui/SettingsComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
import { Cog6ToothIcon, UserCircleIcon, SparklesIcon, PaintBrushIcon, PresentationChartBarIcon, ArrowPathIcon, BookOpenIcon, SpeakerWaveIcon, IdentificationIcon, GlobeAltIcon } from './IconComponents.tsx';
import { db } from '../services/dbService.ts';

// UI component for sliders, defined locally to adhere to file constraints.
const Slider: React.FC<{
  id?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ id, min, max, step, value, onChange, unit }) => {
  const displayValue = unit === '%' ? value.toFixed(0) : (step < 1 ? value.toFixed(2) : value.toFixed(1));
  return (
    <div className="flex items-center gap-3 w-64">
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
      />
      <span className="text-sm font-mono w-16 text-right text-gray-700 dark:text-gray-300">
        {displayValue}{unit}
      </span>
    </div>
  );
};


export const Setup: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();
    const { appSettings, setAppSettings, handleResetAllData } = useAppContext();
    const { showToast } = useToast();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);
    
    const handleExport = async () => {
        const data = await db.exportAllData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `art-i-fact-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(t('toast.settings.exported'), 'success');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonString = e.target?.result as string;
                    db.importAllData(jsonString);
                    showToast(t('toast.settings.imported'), 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                    showToast(t('toast.settings.importError'), 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleUpdate = (key: keyof AppSettings, value: any) => {
        setAppSettings({ [key]: value });
    };

    const activeViews: ActiveView[] = ['workspace', 'discover', 'gallerysuite', 'studio', 'journal'];

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={t('settings.title')} icon={<Cog6ToothIcon className="w-8 h-8" />} />
            
            <Section title={t('settings.general.title')} icon={<UserCircleIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.general.theme.label')}>
                    <select
                        value={appSettings.theme}
                        onChange={(e) => handleUpdate('theme', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="light">{t('settings.general.theme.light')}</option>
                        <option value="dark">{t('settings.general.theme.dark')}</option>
                        <option value="system">{t('settings.general.theme.system')}</option>
                    </select>
                </SettingRow>
                 <SettingRow label={t('settings.general.language.label')} description={t('settings.general.language.desc')}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'de' | 'en')}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="en">{t('settings.general.language.en')}</option>
                        <option value="de">{t('settings.general.language.de')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.general.defaultView.label')} description={t('settings.general.defaultView.desc')}>
                    <select
                        value={appSettings.defaultViewOnStartup}
                        onChange={(e) => handleUpdate('defaultViewOnStartup', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        {activeViews.map(v => <option key={v} value={v}>{t(`view.${v}`)}</option>)}
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.general.compactMode.label')} description={t('settings.general.compactMode.desc')}>
                    <Toggle enabled={appSettings.compactMode} onToggle={() => handleUpdate('compactMode', !appSettings.compactMode)} />
                </SettingRow>
                <SettingRow label={t('settings.general.reduceMotion.label')} description={t('settings.general.reduceMotion.desc')}>
                    <Toggle enabled={appSettings.reduceMotion} onToggle={() => handleUpdate('reduceMotion', !appSettings.reduceMotion)} />
                </SettingRow>
                <SettingRow label={t('settings.general.confirmDelete.label')} description={t('settings.general.confirmDelete.desc')}>
                    <Toggle enabled={appSettings.showDeletionConfirmation} onToggle={() => handleUpdate('showDeletionConfirmation', !appSettings.showDeletionConfirmation)} />
                </SettingRow>
            </Section>

            <Section title={t('settings.ai.title')} icon={<SparklesIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.ai.creativity.label')} description={t('settings.ai.creativity.desc')}>
                     <select
                        value={appSettings.aiCreativity}
                        onChange={(e) => handleUpdate('aiCreativity', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="focused">{t('settings.ai.creativity.focused')}</option>
                        <option value="balanced">{t('settings.ai.creativity.balanced')}</option>
                        <option value="creative">{t('settings.ai.creativity.creative')}</option>
                        <option value="custom">{t('settings.ai.creativity.custom')}</option>
                    </select>
                </SettingRow>

                {appSettings.aiCreativity === 'custom' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-3">
                         <SettingRow label={t('settings.ai.temperature.label')}>
                           <Slider min={0} max={1} step={0.05} value={appSettings.aiTemperature} onChange={v => handleUpdate('aiTemperature', v)} />
                        </SettingRow>
                         <SettingRow label={t('settings.ai.topP.label')}>
                            <Slider min={0} max={1} step={0.05} value={appSettings.aiTopP} onChange={v => handleUpdate('aiTopP', v)} />
                        </SettingRow>
                         <SettingRow label={t('settings.ai.topK.label')}>
                           <Slider min={1} max={100} step={1} value={appSettings.aiTopK} onChange={v => handleUpdate('aiTopK', v)} unit=" " />
                        </SettingRow>
                    </div>
                )}
                 <SettingRow label={t('settings.ai.language.label')} description={t('settings.ai.language.desc')}>
                    <select
                        value={appSettings.aiContentLanguage}
                        onChange={(e) => handleUpdate('aiContentLanguage', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="ui">{t('settings.ai.language.ui')}</option>
                        <option value="en">{t('settings.ai.language.en')}</option>
                        <option value="de">{t('settings.ai.language.de')}</option>
                    </select>
                </SettingRow>
                 <SettingRow label={t('settings.ai.thinkingBudget.label')} description={t('settings.ai.thinkingBudget.desc')}>
                    <Slider min={0} max={100} step={5} value={appSettings.aiThinkingBudget} onChange={v => handleUpdate('aiThinkingBudget', v)} unit="%" />
                </SettingRow>
                <SettingRow label={t('settings.ai.stream.label')} description={t('settings.ai.stream.desc')}>
                    <Toggle enabled={appSettings.streamJournalResponses} onToggle={() => handleUpdate('streamJournalResponses', !appSettings.streamJournalResponses)} />
                </SettingRow>
            </Section>

            <Section title={t('settings.studio.title')} icon={<PaintBrushIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.studio.aspectRatio.label')} description={t('settings.studio.aspectRatio.desc')}>
                    <select
                        value={appSettings.studioDefaultAspectRatio}
                        onChange={(e) => handleUpdate('studioDefaultAspectRatio', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="1:1">{t('settings.studio.aspectRatio.1:1')}</option>
                        <option value="3:4">{t('settings.studio.aspectRatio.3:4')}</option>
                        <option value="4:3">{t('settings.studio.aspectRatio.4:3')}</option>
                        <option value="9:16">{t('settings.studio.aspectRatio.9:16')}</option>
                        <option value="16:9">{t('settings.studio.aspectRatio.16:9')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.studio.enhancement.label')} description={t('settings.studio.enhancement.desc')}>
                     <select
                        value={appSettings.promptEnhancementStyle}
                        onChange={(e) => handleUpdate('promptEnhancementStyle', e.target.value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="subtle">{t('settings.studio.enhancement.subtle')}</option>
                        <option value="descriptive">{t('settings.studio.enhancement.descriptive')}</option>
                        <option value="artistic">{t('settings.studio.enhancement.artistic')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.studio.autoEnhance.label')} description={t('settings.studio.autoEnhance.desc')}>
                    <Toggle enabled={appSettings.autoEnhancePrompts} onToggle={() => handleUpdate('autoEnhancePrompts', !appSettings.autoEnhancePrompts)} />
                </SettingRow>
                <SettingRow label={t('settings.studio.clearPrompt.label')} description={t('settings.studio.clearPrompt.desc')}>
                    <Toggle enabled={appSettings.clearPromptOnGenerate} onToggle={() => handleUpdate('clearPromptOnGenerate', !appSettings.clearPromptOnGenerate)} />
                </SettingRow>
                 <SettingRow label={t('settings.studio.negPrompt.label')} description={t('settings.studio.negPrompt.desc')}>
                    <input type="text" value={appSettings.defaultNegativePrompt} onChange={e => handleUpdate('defaultNegativePrompt', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm" />
                </SettingRow>
                 <SettingRow label={t('settings.studio.remixPrompt.label')} description={t('settings.studio.remixPrompt.desc')}>
                    <input type="text" value={appSettings.defaultRemixPrompt} onChange={e => handleUpdate('defaultRemixPrompt', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm" />
                </SettingRow>
            </Section>
            
            <Section title={t('settings.exhibit.title')} icon={<PresentationChartBarIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.exhibit.speed.label')} description={t('settings.exhibit.speed.desc')}>
                    <Slider min={3} max={30} step={1} value={appSettings.slideshowSpeed} onChange={v => handleUpdate('slideshowSpeed', v)} unit="s" />
                </SettingRow>
                <SettingRow label={t('settings.exhibit.transition.label')}>
                    <select value={appSettings.slideshowTransition} onChange={e => handleUpdate('slideshowTransition', e.target.value)} className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2">
                        <option value="fade">{t('settings.exhibit.transition.fade')}</option>
                        <option value="slide">{t('settings.exhibit.transition.slide')}</option>
                        <option value="kenburns">{t('settings.exhibit.transition.kenburns')}</option>
                    </select>
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.background.label')} description={t('settings.exhibit.background.desc')}>
                    <select value={appSettings.exhibitBackground} onChange={e => handleUpdate('exhibitBackground', e.target.value)} className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2">
                        <option value="blur">{t('settings.exhibit.background.blur')}</option>
                        <option value="color">{t('settings.exhibit.background.color')}</option>
                        <option value="none">{t('settings.exhibit.background.none')}</option>
                    </select>
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.showInfo.label')} description={t('settings.exhibit.showInfo.desc')}>
                    <Toggle enabled={appSettings.showArtworkInfoInSlideshow} onToggle={() => handleUpdate('showArtworkInfoInSlideshow', !appSettings.showArtworkInfoInSlideshow)} />
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.showControls.label')} description={t('settings.exhibit.showControls.desc')}>
                    <Toggle enabled={appSettings.showControlsOnHover} onToggle={() => handleUpdate('showControlsOnHover', !appSettings.showControlsOnHover)} />
                </SettingRow>
                <SettingRow label={t('settings.exhibit.autoplay.label')} description={t('settings.exhibit.autoplay.desc')}>
                    <Toggle enabled={appSettings.exhibitAutoplay} onToggle={() => handleUpdate('exhibitAutoplay', !appSettings.exhibitAutoplay)} />
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.loop.label')} description={t('settings.exhibit.loop.desc')}>
                    <Toggle enabled={appSettings.exhibitLoopSlideshow} onToggle={() => handleUpdate('exhibitLoopSlideshow', !appSettings.exhibitLoopSlideshow)} />
                </SettingRow>
                 <SettingRow label={t('settings.exhibit.parallax.label')} description={t('settings.exhibit.parallax.desc')}>
                    <Toggle enabled={appSettings.exhibitEnableParallax} onToggle={() => handleUpdate('exhibitEnableParallax', !appSettings.exhibitEnableParallax)} />
                </SettingRow>
            </Section>
            
             <Section title={t('settings.audio.title')} icon={<SpeakerWaveIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.audio.voice.label')} description={t('settings.audio.voice.desc')}>
                    <select value={appSettings.audioGuideVoiceURI} onChange={e => handleUpdate('audioGuideVoiceURI', e.target.value)} className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 max-w-[250px]">
                        <option value="default">Default</option>
                        {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.audio.speed.label')}>
                     <Slider min={0.5} max={2} step={0.1} value={appSettings.audioGuideSpeed} onChange={v => handleUpdate('audioGuideSpeed', v)} unit="x" />
                </SettingRow>
                <SettingRow label={t('settings.audio.pitch.label')}>
                     <Slider min={0.5} max={2} step={0.1} value={appSettings.audioGuidePitch} onChange={v => handleUpdate('audioGuidePitch', v)} unit="x" />
                </SettingRow>
                 <SettingRow label={t('settings.audio.volume.label')}>
                     <Slider min={0} max={1} step={0.1} value={appSettings.audioGuideVolume} onChange={v => handleUpdate('audioGuideVolume', v)} />
                </SettingRow>
            </Section>

            <Section title={t('settings.journal.title')} icon={<BookOpenIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.journal.fontSize.label')}>
                     <select value={appSettings.journalEditorFontSize} onChange={e => handleUpdate('journalEditorFontSize', e.target.value)} className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2">
                        <option value="sm">{t('settings.journal.fontSize.sm')}</option>
                        <option value="base">{t('settings.journal.fontSize.base')}</option>
                        <option value="lg">{t('settings.journal.fontSize.lg')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.journal.autoSave.label')} description={t('settings.journal.autoSave.desc')}>
                    <Toggle enabled={appSettings.autoSaveJournal} onToggle={() => handleUpdate('autoSaveJournal', !appSettings.autoSaveJournal)} />
                </SettingRow>
                 <SettingRow label={t('settings.journal.defaultTitle.label')} description={t('settings.journal.defaultTitle.desc')}>
                    <input type="text" value={appSettings.defaultJournalTitle} onChange={e => handleUpdate('defaultJournalTitle', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm" />
                </SettingRow>
            </Section>
            
            <Section title={t('settings.profile.title')} icon={<IdentificationIcon className="w-5 h-5" />}>
                <SettingRow label={t('settings.profile.showActivity.label')} description={t('settings.profile.showActivity.desc')}>
                    <Toggle enabled={appSettings.showProfileActivity} onToggle={() => handleUpdate('showProfileActivity', !appSettings.showProfileActivity)} />
                </SettingRow>
                <SettingRow label={t('settings.profile.showAchievements.label')} description={t('settings.profile.showAchievements.desc')}>
                    <Toggle enabled={appSettings.showProfileAchievements} onToggle={() => handleUpdate('showProfileAchievements', !appSettings.showProfileAchievements)} />
                </SettingRow>
            </Section>

            <Section title={t('settings.data.title')} icon={<ArrowPathIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.data.export.label')} description={t('settings.data.export.desc')}>
                    <Button variant="secondary" size="sm" onClick={handleExport}>{t('settings.data.export.button')}</Button>
                </SettingRow>
                 <SettingRow label={t('settings.data.import.label')} description={t('settings.data.import.desc')}>
                    <Button variant="secondary" size="sm" as="label" className="cursor-pointer">
                        {t('settings.data.import.button')}
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </Button>
                </SettingRow>
                <SettingRow label={t('settings.data.reset.label')} description={t('settings.data.reset.desc')}>
                    <Button variant="danger" size="sm" onClick={handleResetAllData}>{t('settings.data.reset.button')}</Button>
                </SettingRow>
            </Section>
        </div>
    );
};