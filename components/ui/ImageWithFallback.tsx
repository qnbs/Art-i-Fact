import React, { useState, useEffect } from 'react';
import { GalleryIcon } from '../IconComponents.tsx';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackText: string;
}

const generateSvgFallback = (text: string, isUnavailable: boolean = false) => {
    let content: string;
    if (isUnavailable) {
        content = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" stroke-width="8" stroke="#cbd5e1" fill="none" />
                   <text x="50" y="90" font-family="sans-serif" font-size="9" fill="#9ca3af" text-anchor="middle">Not Found</text>`;
    } else {
        const initials = text
            .split(' ')
            .map(word => word ? word[0] : '')
            .slice(0, 2)
            .join('')
            .toUpperCase();
        content = `<text x="50" y="55" font-family="sans-serif" font-size="40" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${initials}</text>`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" />${content}</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, fallbackText, ...props }) => {
    const [hasError, setHasError] = useState(false);

    // When the src changes, reset the error state
    useEffect(() => {
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
        }
    };
    
    // Explicitly handle the case where the src is null or undefined from the start
    const isUnavailable = !src;
    const finalSrc = isUnavailable ? generateSvgFallback(fallbackText, true) : (hasError ? generateSvgFallback(fallbackText, false) : src);

    return (
        <img
            src={finalSrc}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
};