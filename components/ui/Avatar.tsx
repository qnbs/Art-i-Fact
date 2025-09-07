import React from 'react';

export const Avatar: React.FC<{ seed: string, className?: string }> = ({ seed, className }) => {
    let design: React.ReactNode;
    const avatarId = parseInt(seed.replace('avatar-', ''), 10);

    switch (avatarId) {
        case 1: // Abstract Sunrise
            design = (
                <>
                    <rect width="100" height="100" fill="#fde68a" />
                    <circle cx="50" cy="85" r="40" fill="#f59e0b" />
                    <rect y="60" width="100" height="40" fill="#fbbf24" />
                    <path d="M 0 60 Q 50 45, 100 60" fill="none" stroke="#d97706" strokeWidth="3" />
                </>
            );
            break;
        case 2: // Geometric Mosaic
            design = (
                <>
                    <rect width="100" height="100" fill="#a5f3fc" />
                    <path d="M 0 0 L 50 0 L 0 50 Z" fill="#67e8f9" />
                    <path d="M 50 0 L 100 0 L 100 50 Z" fill="#22d3ee" />
                    <path d="M 0 50 L 50 100 L 0 100 Z" fill="#06b6d4" />
                    <path d="M 50 100 L 100 50 L 100 100 Z" fill="#0891b2" />
                    <path d="M 0 50 L 50 0 L 100 50 L 50 100 Z" fill="#cffafe" opacity="0.5" />
                </>
            );
            break;
        case 3: // Stylized Mountains
            design = (
                <>
                    <rect width="100" height="100" fill="#d4d4d8" />
                    <path d="M -10 70 L 40 40 L 70 60 L 110 30 V 100 H -10 Z" fill="#71717a" />
                    <path d="M -10 80 L 60 50 L 80 60 L 120 40 V 100 H -10 Z" fill="#a1a1aa" opacity="0.7" />
                    <circle cx="75" cy="30" r="10" fill="#facc15" />
                </>
            );
            break;
        case 4: // Simple Wave
            design = (
                <>
                    <rect width="100" height="100" fill="#a7f3d0" />
                    <path d="M 0 40 C 25 20, 40 60, 50 40 S 75 60, 100 40 V 100 H 0 Z" fill="#34d399" />
                    <path d="M 0 50 C 25 30, 40 70, 50 50 S 75 70, 100 50 V 100 H 0 Z" fill="#059669" opacity="0.8" />
                </>
            );
            break;
        case 5: // Minimalist Profile
             design = (
                <>
                    <rect width="100" height="100" fill="#1f2937" />
                    <path d="M 100 20 C 60 20, 60 30, 60 50 C 60 80, 70 100, 30 100 L 100 100 Z" fill="#e11d48" />
                </>
            );
            break;
        case 6: // Concentric Patterns
        default:
             design = (
                <>
                    <rect width="100" height="100" fill="#c4b5fd" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#a78bfa" strokeWidth="5" />
                    <circle cx="50" cy="50" r="30" fill="#8b5cf6" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="#ede9fe" strokeWidth="3" strokeDasharray="5 3" />
                </>
            );
            break;
    }

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <clipPath id={`clip-${seed}`}>
                <circle cx="50" cy="50" r="50" />
            </clipPath>
            <g clipPath={`url(#clip-${seed})`}>
                {design}
            </g>
        </svg>
    );
};
