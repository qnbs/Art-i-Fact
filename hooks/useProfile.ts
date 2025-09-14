import { useState, useEffect, useCallback } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { Profile } from '../types.ts';
import { db } from '../services/dbService.ts';

const defaultProfile: Profile = {
    username: 'Art Curator',
    bio: 'Discovering and sharing the world of art.',
    avatar: 'avatar-1'
};

export const useProfile = () => {
    const [profile, setProfileState] = useState<Profile>(defaultProfile);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const storedProfile = await db.getProfile(defaultProfile);
            setProfileState(storedProfile);
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    const setProfile = useCallback(async (newProfileData: Partial<Profile>) => {
        const newProfile = { ...profile, ...newProfileData };
        setProfileState(newProfile);
        await db.saveProfile(newProfile);
    }, [profile]);

    const resetProfile = useCallback(async () => {
        setProfileState(defaultProfile);
        await db.saveProfile(defaultProfile);
    }, []);

    return { profile, isLoading, setProfile, resetProfile };
};