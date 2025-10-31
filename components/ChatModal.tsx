import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { SparklesIcon, UserCircleIcon } from './IconComponents.tsx';
import * as gemini from '../services/geminiService.ts';
import type { Artwork } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { SpinnerIcon } from './IconComponents.tsx';

interface ChatModalProps {
    artwork: Artwork;
    language: 'de' | 'en';
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ artwork, language }) => {
    const { t } = useTranslation();
    const { settings } = useAppContext();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            setIsLoading(true);
            const chatSession = gemini.startArtChat(artwork, settings, language);
            setChat(chatSession);
            
            const initialResponse = await chatSession.sendMessage({ message: "Give me a brief, fascinating insight about this piece to start our conversation." });
            setMessages([{ sender: 'ai', text: initialResponse.text }]);
            setIsLoading(false);
        };
        initChat();
    }, [artwork, settings, language]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userInput });
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[60vh]">
            <div className="flex-grow overflow-y-auto p-1 pr-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600"><SparklesIcon className="w-5 h-5" /></div>}
                        <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'ai' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-amber-600 text-white'}`}>
                           <MarkdownRenderer markdown={msg.text} />
                        </div>
                         {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500"><UserCircleIcon className="w-6 h-6" /></div>}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600"><SparklesIcon className="w-5 h-5" /></div>
                        <div className="max-w-sm p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                           <SpinnerIcon className="w-5 h-5" />
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex-shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-12 text-lg"
                        disabled={isLoading}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 disabled:text-gray-400" disabled={isLoading || !userInput.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};
