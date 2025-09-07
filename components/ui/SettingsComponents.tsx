import React from 'react';

export const Section: React.FC<{ title: string; children: React.ReactNode, icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
        <div className="bg-white dark:bg-gray-900/70 rounded-lg divide-y divide-gray-200 dark:divide-gray-700/50">
            {children}
        </div>
    </div>
);

export const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="p-4 flex justify-between items-center">
        <div>
            <span className="text-gray-800 dark:text-gray-200">{label}</span>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        </div>
        <div>{children}</div>
    </div>
);

export const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 ${enabled ? 'bg-amber-600' : 'bg-gray-400 dark:bg-gray-600'}`}
        role="switch"
        aria-checked={enabled}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);
