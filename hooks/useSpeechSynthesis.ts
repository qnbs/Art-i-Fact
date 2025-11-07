import { useState, useCallback, useEffect } from 'react';
import type { AppSettings } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';

export const useSpeechSynthesis = (onEnd: () => void, settings: Pick<AppSettings, 'audioGuideVoiceURI' | 'audioGuideSpeed' | 'audioGuidePitch' | 'audioGuideVolume'>) => {
    const { language } = useTranslation();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };
        // Initial load + event listener for async population
        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        setIsPaused(false);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
        utterance.rate = settings.audioGuideSpeed;
        utterance.pitch = settings.audioGuidePitch;
        utterance.volume = settings.audioGuideVolume;
        
        if (voices.length > 0) {
            const selectedVoice = voices.find(v => v.voiceURI === settings.audioGuideVoiceURI);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                // Fallback to find a voice matching the current language if no specific voice is set/found
                const fallbackVoice = voices.find(v => v.lang.startsWith(language)); // e.g., 'en-US', 'en-GB'
                if(fallbackVoice) {
                    utterance.voice = fallbackVoice;
                }
            }
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd();
        };
        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e);
            setIsSpeaking(false);
        };
        speechSynthesis.speak(utterance);
    }, [onEnd, language, settings, voices]);

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