import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '../types';
import { PROFILE_LOCAL_STORAGE_KEY } from '../constants';

const initialProfile: Profile = { 
    username: 'Art Enthusiast', 
    bio: 'Discovering the world, one masterpiece at a time.', 
    avatar: 'avatar-1' 
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_LOCAL_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        return { ...initialProfile, ...parsed };
      }
      return initialProfile;
    } catch (error) {
      console.error("Could not parse saved profile:", error);
      return initialProfile;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.warn("Could not save profile to local storage:", error);
    }
  }, [profile]);

  const updateProfile = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
  }, []);

  return {
    profile,
    updateProfile,
    setProfile,
  };
};