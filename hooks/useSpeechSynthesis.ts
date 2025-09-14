
import { useState, useCallback, useEffect } from 'react';
import type { AppSettings } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

export const useSpeechSynthesis = (onEnd: () => void, settings: Pick<AppSettings, 'audioGuideVoiceURI' | 'audioGuideSpeed'>) => {
    const { language } = useTranslation();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        setIsPaused(false);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
        utterance.rate = settings.audioGuideSpeed;
        
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.voiceURI === settings.audioGuideVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd();
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            // Don't call onEnd here to prevent skipping on error
        };
        speechSynthesis.speak(utterance);
    }, [onEnd, language, settings]);

    const cancel = useCallback(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    const togglePause = useCallback(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        } else if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false);
        }
    }, []);

    useEffect(() => {
        return () => cancel();
    }, [cancel]);

    return { speak, cancel, togglePause, isSpeaking, isPaused };
};
