import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Artwork, AudioGuide, Profile } from '../types.ts';
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, DocumentTextIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from './IconComponents.tsx';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.ts';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';

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
  const { appSettings } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isSlideshowPlaying, setSlideshowPlaying] = useState(appSettings.exhibitAutoplay && !audioGuide);
  const [isAudioGuideActive, setAudioGuideActive] = useState(appSettings.exhibitAutoplay && !!audioGuide);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');
  const [transformStyle, setTransformStyle] = useState({});
  const exhibitionRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);

  const currentArtwork = artworks[currentIndex];

  const resetInactivityTimer = useCallback(() => {
    if (!appSettings.showControlsOnHover) return;
    setAreControlsVisible(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
    }, 3000);
  }, [appSettings.showControlsOnHover]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!exhibitionRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (clientY - innerHeight / 2) / (innerHeight / 2);
        const maxRotate = 5; // Max rotation in degrees
        setTransformStyle({
            transform: `perspective(1000px) rotateY(${x * maxRotate}deg) rotateX(${-y * maxRotate}deg) scale3d(1.05, 1.05, 1.05)`,
        });
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return; // gamma is left-to-right, beta is front-to-back
      const gamma = e.gamma; // -90 to 90
      const beta = e.beta; // -180 to 180
      const maxRotate = 8;
      const clampedGamma = Math.max(-90, Math.min(90, gamma));
      const clampedBeta = Math.max(-90, Math.min(90, beta));
      
      setTransformStyle({
        transform: `perspective(1000px) rotateY(${clampedGamma / 90 * maxRotate}deg) rotateX(${clampedBeta / 90 * maxRotate}deg) scale3d(1.05, 1.05, 1.05)`
      });
    };

    if (appSettings.exhibitEnableParallax) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
    resetInactivityTimer();
    window.addEventListener('keydown', resetInactivityTimer);

    return () => {
        if (appSettings.exhibitEnableParallax) {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('deviceorientation', handleDeviceOrientation);
        }
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, [resetInactivityTimer, appSettings.exhibitEnableParallax]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === artworks.length - 1;
    if (isLastSlide && !appSettings.exhibitLoopSlideshow) {
        setSlideshowPlaying(false);
        return;
    }

    if (appSettings.slideshowTransition === 'slide') {
        setSlideDirection('out');
        setTimeout(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % artworks.length);
            setSlideDirection('in');
        }, 500);
    } else {
        setCurrentIndex(prevIndex => (prevIndex + 1) % artworks.length);
    }
  }, [artworks.length, appSettings.slideshowTransition, appSettings.exhibitLoopSlideshow, currentIndex]);

  const goToPrevious = useCallback(() => {
    // Note: Slide transition for previous is not implemented to keep it simple
    setCurrentIndex(prevIndex => (prevIndex - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  const { speak, cancel, togglePause, isSpeaking, isPaused } = useSpeechSynthesis(goToNext, appSettings);

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
            setHasIntroPlayed(false); // Reset intro state
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
    
    let textToSpeak = '';

    if (currentIndex === 0 && !hasIntroPlayed) {
        textToSpeak = audioGuide.introduction;
        if (segment?.script) {
            textToSpeak += ` \n\n ${segment.script}`;
        }
        setHasIntroPlayed(true);
    } else if (segment) {
        textToSpeak = segment.script;
    }
    
    if (textToSpeak) {
        speak(textToSpeak.trim());
    } else {
        // No segment, advance after timeout
        const timer = window.setTimeout(goToNext, appSettings.slideshowSpeed * 1000);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, isAudioGuideActive, isPaused, hasIntroPlayed, audioGuide, artworks, speak, goToNext, appSettings.slideshowSpeed]);


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
    
  const controlsVisibleClass = areControlsVisible || !appSettings.showControlsOnHover ? 'opacity-100' : 'opacity-0';

  return (
    <div ref={exhibitionRef} className="fixed inset-0 bg-gray-950/95 backdrop-blur-xl z-50 flex flex-col p-4 md:p-8 text-white animate-fade-in overflow-hidden" onMouseMove={resetInactivityTimer}>
      <div 
        className="absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{ 
            backgroundImage: `url(${currentArtwork.imageUrl})`, 
            filter: 'blur(20px) brightness(0.4)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.1)'
        }} 
      />
      <div className={`flex-shrink-0 flex justify-between items-center mb-4 transition-opacity duration-300 ${controlsVisibleClass}`}>
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
            <div style={transformStyle} className="transition-transform duration-100 ease-out">
                <ImageWithFallback 
                  key={currentArtwork.id}
                  src={currentArtwork.imageUrl} 
                  alt={currentArtwork.title} 
                  fallbackText={currentArtwork.title}
                  className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${animationClass}`}
                  style={{ willChange: 'transform' }}
                />
            </div>
             {appSettings.showArtworkInfoInSlideshow && (
                <div className={`absolute bottom-4 left-4 right-4 bg-black/50 p-2 rounded-lg text-center transition-opacity duration-300 ${controlsVisibleClass}`}>
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
      
      <div className={`flex-shrink-0 flex justify-center items-center gap-8 mt-4 transition-opacity duration-300 ${controlsVisibleClass}`}>
          <button onClick={handlePreviousClick} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label={t('exhibition.aria.previous')}>
              <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <button onClick={handlePlayPauseClick} className="text-white bg-amber-600 hover:bg-amber-700 transition-colors rounded-full p-4" aria-label={isPlaying ? t('exhibition.aria.pause') : t('exhibition.aria.play')}>
              {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
          </button>
          <button onClick={handleNextClick} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20" aria-label={t('exhibition.aria.next')}>
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