
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Artwork, AudioGuide, Profile } from '../types';
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, DocumentTextIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { getWikimediaImageUrl } from '../services/wikimediaService';

interface ExhibitionModeProps {
  artworks: Artwork[];
  startIndex?: number;
  onClose: () => void;
  audioGuide?: AudioGuide;
  isPublicView?: boolean;
  galleryTitle?: string;
  curatorProfile?: Profile;
}

export const ExhibitionMode: React.FC<ExhibitionModeProps> = ({ 
    artworks, startIndex = 0, onClose, audioGuide,
    isPublicView = false, galleryTitle, curatorProfile 
}) => {
  const { t } = useTranslation();
  const { appSettings } = useAppSettings();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isSlideshowPlaying, setSlideshowPlaying] = useState(appSettings.exhibitAutoplay && !audioGuide);
  const [isAudioGuideActive, setAudioGuideActive] = useState(appSettings.exhibitAutoplay && !!audioGuide);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');
  const exhibitionRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  const currentArtwork = artworks[currentIndex];

  const resetInactivityTimer = useCallback(() => {
    setAreControlsVisible(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetInactivityTimer();
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, [resetInactivityTimer]);

  const goToNext = useCallback(() => {
    if (appSettings.slideshowTransition === 'slide') {
        setSlideDirection('out');
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % artworks.length);
            setSlideDirection('in');
        }, 500);
    } else {
        setCurrentIndex(prevIndex => (prevIndex + 1) % artworks.length);
    }
  }, [artworks.length, appSettings.slideshowTransition]);

  const goToPrevious = useCallback(() => {
    // Note: Slide transition for previous is not implemented to keep it simple
    setCurrentIndex(prevIndex => (prevIndex - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  const { speak, cancel, togglePause, isSpeaking, isPaused } = useSpeechSynthesis(isAudioGuideActive ? goToNext : () => {}, appSettings);

  const stopAllModes = () => {
      setSlideshowPlaying(false);
      setAudioGuideActive(false);
      cancel();
  }

  const handlePreviousClick = () => {
    stopAllModes();
    goToPrevious();
  };

  const handleNextClick = () => {
    stopAllModes();
    goToNext();
  };

  const handlePlayPauseClick = () => {
    if (audioGuide) {
        if (isAudioGuideActive) {
            togglePause();
        } else {
            setAudioGuideActive(true);
            setSlideshowPlaying(false);
        }
    } else {
        setSlideshowPlaying(prev => !prev);
    }
  };
  
    const toggleFullscreen = useCallback(() => {
        const elem = exhibitionRef.current;
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

  // Slideshow timer effect
  useEffect(() => {
    let timer: number;
    if (isSlideshowPlaying && !isAudioGuideActive) {
      timer = window.setTimeout(goToNext, appSettings.slideshowSpeed * 1000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isSlideshowPlaying, isAudioGuideActive, goToNext, appSettings.slideshowSpeed]);

  // Audio guide speech effect
  useEffect(() => {
    if (!audioGuide || !isAudioGuideActive || isPaused) {
        return;
    }
    const currentArtworkId = artworks[currentIndex].id;
    const segment = audioGuide.segments.find(s => s.artworkId === currentArtworkId);
    
    // Speak intro only on first artwork when audio guide is initially active
    if (currentIndex === 0 && !isSpeaking) {
        speak(audioGuide.introduction);
    } else if (segment) {
        speak(segment.script);
    } else {
        // No segment, advance after timeout
        const timer = window.setTimeout(goToNext, appSettings.slideshowSpeed * 1000);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, isAudioGuideActive, isPaused, audioGuide, artworks, speak, goToNext, isSpeaking, appSettings.slideshowSpeed]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNextClick();
      else if (event.key === 'ArrowLeft') handlePreviousClick();
      else if (event.key === 'Escape') onClose();
      else if (event.key === ' ') {
        event.preventDefault();
        handlePlayPauseClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextClick, handlePreviousClick, onClose, handlePlayPauseClick]);

  if (!currentArtwork) return null;
  
  const isPlaying = audioGuide ? (isAudioGuideActive && isSpeaking) : isSlideshowPlaying;
  const currentScript = audioGuide ? (currentIndex === 0 ? audioGuide.introduction : audioGuide.segments.find(s => s.artworkId === currentArtwork.id)?.script) : null;
  
  const animationClass = appSettings.slideshowTransition === 'slide' 
    ? (slideDirection === 'in' ? 'animate-slide-in' : 'animate-slide-out') 
    : 'animate-fade-in';

  return (
    <div ref={exhibitionRef} className="fixed inset-0 bg-gray-950/95 backdrop-blur-xl z-50 flex flex-col p-4 md:p-8 text-white animate-fade-in" onMouseMove={resetInactivityTimer}>
      <div className={`flex-shrink-0 flex justify-between items-center mb-4 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-2">
            {artworks.map((_, index) => (
              <button 
                key={index}
                onClick={() => { stopAllModes(); setCurrentIndex(index); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-amber-500 w-8' : 'bg-gray-600 w-4 hover:bg-gray-400'}`}
                aria-label={t('exhibition.goToArtwork', { number: String(index + 1) })}
              />
            ))}
        </div>
        <div className="flex items-center gap-4">
            {audioGuide && (
                 <button onClick={() => setShowTranscript(s => !s)} className="text-gray-400 hover:text-white transition-colors" title={t('exhibition.transcript')}>
                    <DocumentTextIcon className="w-6 h-6" />
                </button>
            )}
             <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition-colors" title={isFullscreen ? t('exhibition.exitFullscreen') : t('exhibition.toggleFullscreen')}>
                {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="w-6 h-6" />}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label={t('close')}>
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 overflow-hidden">
        <div className="relative w-full md:w-1/2 h-2/3 md:h-full flex items-center justify-center">
            <ImageWithFallback 
              key={currentArtwork.id}
              src={getWikimediaImageUrl(currentArtwork.imageUrl, 1280)} 
              alt={currentArtwork.title} 
              fallbackText={currentArtwork.title}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${animationClass}`}
            />
             {appSettings.showArtworkInfoInSlideshow && (
                <div className={`absolute bottom-4 left-4 right-4 bg-black/50 p-2 rounded-lg text-center transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="font-bold text-white truncate">{currentArtwork.title}</h3>
                    <p className="text-sm text-gray-300 truncate">{currentArtwork.artist}</p>
                </div>
            )}
        </div>
        <div className="w-full md:w-1/3 h-1/3 md:h-full overflow-y-auto p-4 relative">
          <h2 className="text-3xl font-bold text-amber-400">{currentArtwork.title}</h2>
          <p className="text-xl text-gray-300 mt-1">{currentArtwork.artist}, {currentArtwork.year}</p>
          
          {currentArtwork.description && !showTranscript && (
            <p className="mt-6 text-gray-300 text-sm leading-relaxed">{currentArtwork.description}</p>
          )}

          {showTranscript && currentScript && (
               <div className="mt-6 p-4 bg-black/30 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{currentScript}</p>
               </div>
          )}

          {currentArtwork.comment && (
            <div className="mt-6 p-3 bg-white/10 rounded-lg">
              <h4 className="font-semibold text-amber-500">{t('modal.details.notes')}</h4>
              <p className="text-gray-200 italic text-sm mt-1">"{currentArtwork.comment}"</p>
            </div>
          )}
        </div>
      </div>
      
      <div className={`flex-shrink-0 flex justify-center items-center gap-8 mt-4 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={handlePreviousClick} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous Artwork">
              <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={handlePlayPauseClick} className="text-white bg-amber-600 hover:bg-amber-700 transition-colors rounded-full p-4" aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}>
              {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
          </button>
          <button onClick={handleNextClick} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label="Next Artwork">
              <ArrowRightIcon className="w-6 h-6" />
          </button>
           {audioGuide && (
             <button onClick={() => setAudioGuideActive(s => !s)} className="absolute right-8 bottom-8 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20" title={isAudioGuideActive ? t('exhibition.audioPlaying') : t('exhibition.audioMuted')}>
                 {isAudioGuideActive ? <SpeakerWaveIcon className="w-6 h-6" /> : <SpeakerXMarkIcon className="w-6 h-6" />}
             </button>
           )}
      </div>

      {isPublicView && curatorProfile && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-300 bg-black/40 backdrop-blur-sm p-2 rounded-lg">
            <p className="font-bold">{galleryTitle}</p>
            <p className="text-gray-400">{t('exhibition.curatedBy', { username: curatorProfile.username })}</p>
        </div>
      )}
    </div>
  );
};
