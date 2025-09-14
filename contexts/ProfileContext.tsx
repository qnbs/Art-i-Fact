
import React, { createContext, useContext } from 'react';
import { useProfile as useProfileHook } from '../hooks/useProfile.ts';
import type { Profile } from '../types.ts';

// FIX: Added isLoading to the context type to match the hook's return value.
type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Partial<Profile>) => void;
  resetProfile: () => void;
  isLoading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // FIX: Destructured and provided the isLoading state from the hook.
  const { profile, setProfile, resetProfile, isLoading } = useProfileHook();
  return (
    <ProfileContext.Provider value={{ profile, setProfile, resetProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};