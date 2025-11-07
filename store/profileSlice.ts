import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { Profile } from '../types.ts';
import type { RootState } from './store.ts';

const defaultProfile: Profile = {
    username: 'Art Curator',
    bio: 'Discovering and sharing the world of art.',
    avatar: 'avatar-1'
};

interface ProfileState {
    profile: Profile;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProfileState = {
    profile: defaultProfile,
    status: 'idle',
    error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    const profile = await db.getProfile(defaultProfile);
    return profile;
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (newProfileData: Partial<Profile>, { getState }) => {
    const currentProfile = (getState() as RootState).profile.profile;
    const newProfile = { ...currentProfile, ...newProfileData };
    await db.saveProfile(newProfile);
    return newProfile;
});

export const resetProfile = createAsyncThunk('profile/resetProfile', async () => {
    await db.saveProfile(defaultProfile);
    return defaultProfile;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
                state.profile = action.payload;
            })
            .addCase(resetProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            });
    },
});

export default profileSlice.reducer;