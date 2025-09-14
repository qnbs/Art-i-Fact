
import { useState, useEffect, useCallback } from 'react';
import { PROFILE_LOCAL_STORAGE_KEY } from '../constants';
import type { Profile } from '../types';

const defaultProfile: Profile = {
    username: 'Art Enthusiast',
    bio: 'Exploring the world of art, one masterpiece at a time.',
    avatar: 'avatar-1',
};

export const useProfile = (): { profile: Profile; setProfile: (profile: Partial<Profile>) => void; resetProfile: () => void; } => {
    const [profile, setProfileState] = useState<Profile>(() => {
        try {
            const savedProfile = localStorage.getItem(PROFILE_LOCAL_STORAGE_KEY);
            return savedProfile ? { ...defaultProfile, ...JSON.parse(savedProfile) } : defaultProfile;
        } catch {
            return defaultProfile;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROFILE_LOCAL_STORAGE_KEY, JSON.stringify(profile));
        } catch (error) {
            console.warn("Could not save profile:", error);
        }
    }, [profile]);

    const setProfile = useCallback((newProfile: Partial<Profile>) => {
        setProfileState(prev => ({ ...prev, ...newProfile }));
    }, []);

    const resetProfile = useCallback(() => {
        setProfileState(defaultProfile);
    }, []);

    return { profile, setProfile, resetProfile };
};
