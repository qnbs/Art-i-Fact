import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from '../contexts/TranslationContext';
import { SearchIcon, CommandLineIcon } from './IconComponents';

export interface Command {
    id: string;
    title: string;
    category: string;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredCommands = useMemo(() => {
        if (!searchTerm) return commands;
        const lowercasedTerm = searchTerm.toLowerCase();
        return commands.filter(command =>
            command.title.toLowerCase().includes(lowercasedTerm) ||
            command.category.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm, commands]);

    useEffect(() => {
        setActiveIndex(0);
    }, [searchTerm]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
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
                if (filteredCommands[activeIndex]) {
                    filteredCommands[activeIndex].action();
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, activeIndex, filteredCommands]);
    
    useEffect(() => {
        resultsRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const groupedCommands = useMemo(() => {
        return filteredCommands.reduce((acc, command) => {
            (acc[command.category] = acc[command.category] || []).push(command);
            return acc;
        }, {} as Record<string, Command[]>);
    }, [filteredCommands]);

    if (!isOpen) return null;
    
    let currentIndex = -1;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center pt-20" onClick={onClose}>
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700/50 flex items-center gap-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('commandPalette.placeholder')}
                        className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
                    />
                </div>
                <ul ref={resultsRef} className="flex-grow overflow-y-auto p-2">
                    {Object.entries(groupedCommands).length > 0 ? (
                        Object.entries(groupedCommands).map(([category, commandsInCategory]) => (
                            <li key={category}>
                                <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{category}</div>
                                <ul>
                                    {commandsInCategory.map(command => {
                                        currentIndex++;
                                        const isSelected = currentIndex === activeIndex;
                                        return (
                                        <li
                                            key={command.id}
                                            data-index={currentIndex}
                                            onClick={() => { command.action(); onClose(); }}
                                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${isSelected ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                                        >
                                            <CommandLineIcon className="w-5 h-5 flex-shrink-0" />
                                            <span>{command.title}</span>
                                        </li>
                                        )
                                    })}
                                </ul>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-gray-500">{t('commandPalette.noResults')}</li>
                    )}
                </ul>
            </div>
        </div>,
        document.getElementById('command-palette-root')!
    );
};