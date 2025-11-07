import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { SearchIcon, CloseIcon } from './IconComponents.tsx';

export interface Command {
    id: string;
    name: string;
    action: () => void;
    icon?: React.ReactNode;
    section?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = useMemo(() => {
        if (!searchTerm) return commands;
        return commands.filter(command =>
            command.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, commands]);
    
    useEffect(() => {
        setActiveIndex(0);
    }, [filteredCommands]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setActiveIndex(0);
            inputRef.current?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev + 1) % filteredCommands.length);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = filteredCommands[activeIndex];
                    if (command) {
                        command.action();
                    }
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose, filteredCommands, activeIndex]);
    
    useEffect(() => {
        const activeItem = document.getElementById(`command-item-${activeIndex}`);
        activeItem?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    if (!isOpen) return null;
    
    const paletteRoot = document.getElementById('command-palette-root');
    if (!paletteRoot) return null;

    const groupedCommands = filteredCommands.reduce((acc, command) => {
        const section = command.section || t('commandPalette.sections.general');
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(command);
        return acc;
    }, {} as Record<string, Command[]>);

    const CommandList = () => (
        <>
        {(Object.entries(groupedCommands) as [string, Command[]][]).map(([section, cmds]) => (
            <div key={section} className="mb-2">
                <h3 className="text-xs font-semibold uppercase text-gray-400 px-3 py-1">{section}</h3>
                <ul>
                    {cmds.map((command) => {
                        const index = filteredCommands.findIndex(c => c.id === command.id);
                        return (
                        <li
                            key={command.id}
                            id={`command-item-${index}`}
                            onClick={command.action}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-gray-800 dark:text-gray-200 ${
                                activeIndex === index ? 'bg-amber-100 dark:bg-amber-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span className="text-gray-500">{command.icon}</span>
                            <span>{command.name}</span>
                        </li>
                    )})}
                </ul>
            </div>
        ))}
        </>
    );

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start md:pt-[4.5rem] animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            {/* Desktop Modal */}
            <div
                className="hidden md:flex bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex-col animate-command-palette-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative p-2 border-b border-gray-200 dark:border-gray-800">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('commandPalette.placeholder')}
                        className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                        <CommandList />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {t('commandPalette.noResults', { query: searchTerm })}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-700 flex flex-col max-h-[70vh] animate-slide-in-from-bottom"
                 onClick={e => e.stopPropagation()}
            >
                 <div className="text-center py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto" />
                </div>
                 <div className="p-2 overflow-y-auto">
                    <CommandList />
                 </div>
            </div>

        </div>,
        paletteRoot
    );
};

export default CommandPalette;
