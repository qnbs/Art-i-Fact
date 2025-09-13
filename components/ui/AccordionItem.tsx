import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '../IconComponents';

export const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-md"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                {isOpen ? <ArrowUpIcon className="w-5 h-5 flex-shrink-0" /> : <ArrowDownIcon className="w-5 h-5 flex-shrink-0" />}
            </button>
            {isOpen && (
                <div className="pb-3 px-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};