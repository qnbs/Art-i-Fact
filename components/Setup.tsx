import React from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { AppSettings } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { Section, SettingRow, Toggle } from './ui/SettingsComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
// FIX: Added .tsx extension to fix module resolution error.
import { Cog6ToothIcon, UserCircleIcon, SparklesIcon, PaintBrushIcon, PresentationChartBarIcon, ArrowPathIcon } from './IconComponents.tsx';
import { db } from '../services/dbService.ts';

export const Setup: React.FC = () => {
    const { t, language, setLanguage } = useTranslation();
    const { settings: appSettings, updateSettings, resetSettings } = useAppContext();
    const { showToast } = useToast();

    const handleReset = () => {
        resetSettings();
        showToast(t('toast.settings.reset'), 'success');
    };
    
    // FIX: Made function async and awaited the data export to resolve promise before creating Blob.
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
                    // Force a reload to apply all settings and data
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                    showToast(t('toast.settings.importError'), 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    const handleUpdate = (key: keyof AppSettings, value: any) => {
        updateSettings({ [key]: value });
        showToast(t('toast.settings.updated'), 'success');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title={t('settings.title')} icon={<Cog6ToothIcon className="w-8 h-8" />} />
            
            {/* General Settings */}
            <Section title={t('settings.general.title')} icon={<Cog6ToothIcon className="w-5 h-5" />}>
                 <SettingRow label={t('settings.general.language.label')}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.general.theme.label')}>
                    <select
                        value={appSettings.theme}
                        onChange={(e) => handleUpdate('theme', e.target.value as 'light' | 'dark')}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    >
                        <option value="dark">{t('settings.general.theme.dark')}</option>
                        <option value="light">{t('settings.general.theme.light')}</option>
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.general.confirmDelete.label')} description={t('settings.general.confirmDelete.desc')}>
                    <Toggle enabled={appSettings.showDeletionConfirmation} onToggle={() => handleUpdate('showDeletionConfirmation', !appSettings.showDeletionConfirmation)} />
                </SettingRow>
            </Section>

            {/* AI Settings */}
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
                    </select>
                </SettingRow>
                <SettingRow label={t('settings.ai.results.label')} description={t('settings.ai.results.desc')}>
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={appSettings.aiResultsCount}
                        onChange={(e) => handleUpdate('aiResultsCount', parseInt(e.target.value, 10))}
                        className="w-20 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2"
                    />
                </SettingRow>
            </Section>

            {/* Studio Settings */}
            <Section title={t('settings.studio.title')} icon={<PaintBrushIcon className="w-5 h-5" />}>
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
                <SettingRow label={t('settings.studio.clearPrompt.label')} description={t('settings.studio.clearPrompt.desc')}>
                    <Toggle enabled={appSettings.clearPromptOnGenerate} onToggle={() => handleUpdate('clearPromptOnGenerate', !appSettings.clearPromptOnGenerate)} />
                </SettingRow>
            </Section>

             {/* Danger Zone */}
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
                    <Button variant="danger" size="sm" onClick={handleReset}>{t('settings.data.reset.button')}</Button>
                </SettingRow>
            </Section>
        </div>
    );
};