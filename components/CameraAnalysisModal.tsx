import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { CloseIcon, CameraIcon } from './IconComponents';

export const CameraAnalysisModal: React.FC<{ onCapture: (file: File) => void; onClose: () => void; }> = ({ onCapture, onClose }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setError(t('camera.error.access'));
            }
        };
        startCamera();
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [t]);

    const handleCapture = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            if (blob) {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                onCapture(file);
                onClose();
            }
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl transform flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold">{t('camera.modal.title')}</h2>
                    <button onClick={onClose} aria-label={t('close')}><CloseIcon /></button>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center items-center">
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700/50 flex justify-center">
                    <button onClick={handleCapture} disabled={!!error} className="bg-amber-600 text-white rounded-full p-4 hover:bg-amber-700 disabled:bg-gray-500">
                        <CameraIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
};