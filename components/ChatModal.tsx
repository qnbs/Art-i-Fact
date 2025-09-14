
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { useTranslation } from '../contexts/TranslationContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { startArtChat } from '../services/geminiService';
import type { Artwork } from '../types';
import { SparklesIcon } from './IconComponents';

interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export const ChatModal: React.FC<{ artwork: Artwork; language: 'de' | 'en'; }> = ({ artwork, language }) => {
    const { t } = useTranslation();
    const { appSettings } = useAppSettings();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatInstance = startArtChat(artwork, appSettings, language);
        setChat(chatInstance);
        const getInitialMessage = async () => {
            setIsLoading(true);
            try {
                // Let the AI start the conversation based on its system prompt
                const responseStream = await chatInstance.sendMessageStream({ message: "Tell me about this artwork." });
                let fullText = '';
                for await (const chunk of responseStream) {
                    if (chunk.text) {
                        fullText += chunk.text;
                        setMessages([{ sender: 'ai', text: fullText }]);
                    }
                }
            } catch (e) {
                setMessages([{ sender: 'ai', text: t('chat.error.start') }]);
            } finally {
                setIsLoading(false);
            }
        };
        getInitialMessage();
    }, [artwork, t, appSettings, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const newUserMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });
            let fullText = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    fullText += chunk.text;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = fullText;
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = t('chat.error.response');
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
         <div className="flex flex-col h-[60vh] max-h-[500px]">
            <div className="flex-grow p-4 overflow-y-auto space-y-4 -mx-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div>
                        <div className="max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-bounce mr-1"></span>
                            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-bounce mr-1" style={{ animationDelay: '0.1s' }}></span>
                            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="pt-4 flex-shrink-0 -mx-6 px-6">
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    disabled={isLoading}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
            </form>
        </div>
    );
};
