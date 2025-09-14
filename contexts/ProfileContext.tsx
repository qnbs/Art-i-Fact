
import React, { createContext, useContext } from 'react';
import { useProfile as useProfileHook } from '../hooks/useProfile';
import type { Profile } from '../types';

type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Partial<Profile>) => void;
  resetProfile: () => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, setProfile, resetProfile } = useProfileHook();
  return (
    <ProfileContext.Provider value={{ profile, setProfile, resetProfile }}>
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
