
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { Button } from './ui/Button.tsx';
import type { Profile } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';

interface ProfileEditorProps {
  onSave: (details: Partial<Profile>) => void;
  onCancel: () => void;
  profile: Profile;
}

const avatarOptions = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6'];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave, onCancel, profile }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('avatar-1');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio);
      setAvatar(profile.avatar);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSave({ username, bio, avatar });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('profile.edit.username')}
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('profile.edit.bio')}
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.edit.avatar')}
        </label>
        <div className="grid grid-cols-6 gap-2">
            {avatarOptions.map(opt => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => setAvatar(opt)}
                    className={`rounded-full transition-all duration-200 ${avatar === opt ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : 'opacity-70 hover:opacity-100'}`}
                >
                    <Avatar seed={opt} className="w-12 h-12" />
                </button>
            ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">
          {t('save')}
        </Button>
      </div>
    </form>
  );
};
