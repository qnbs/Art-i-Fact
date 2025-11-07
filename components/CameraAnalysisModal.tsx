import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { CameraIcon } from './IconComponents.tsx';

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
        <div className="flex flex-col">
             <div className="flex-grow flex flex-col justify-center items-center">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
                )}
            </div>
            <div className="pt-4 flex justify-center">
                <button onClick={handleCapture} disabled={!!error} className="bg-amber-600 text-white rounded-full p-4 hover:bg-amber-700 disabled:bg-gray-500">
                    <CameraIcon className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
};