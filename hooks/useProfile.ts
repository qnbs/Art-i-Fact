

import { useState, useEffect, useCallback } from 'react';
import type { Profile } from '../types';
import { PROFILE_LOCAL_STORAGE_KEY } from '../constants';
import { sanitizeInput } from '../services/geminiService';

const initialProfile: Profile = { 
    username: 'Art Enthusiast', 
    bio: 'Discovering the world, one masterpiece at a time.', 
    avatar: 'avatar-1' 
};

const sanitizeProfile = (p: Profile): Profile => ({
    ...p,
    username: sanitizeInput(p.username),
    bio: sanitizeInput(p.bio),
});

export const useProfile = () => {
  const [profile, setProfileState] = useState<Profile>(() => {
    let p = initialProfile;
    try {
      const savedProfile = localStorage.getItem(PROFILE_LOCAL_STORAGE_KEY);
      if (savedProfile) {
        p = { ...initialProfile, ...JSON.parse(savedProfile) };
      }
    } catch (error) {
      console.error("Could not parse saved profile:", error);
    }
    return sanitizeProfile(p);
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
        console.warn("Could not save profile to local storage:", error);
    }
  }, [profile]);

  const setProfile = useCallback((newProfile: Profile) => {
    setProfileState(sanitizeProfile(newProfile));
  }, []);

  const updateProfile = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
  }, [setProfile]);

  return {
    profile,
    updateProfile,
    setProfile,
  };
};
