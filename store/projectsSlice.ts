import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { Project } from '../types.ts';

interface ProjectsState {
    projects: Project[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProjectsState = {
    projects: [],
    status: 'idle',
    error: null,
};

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    return await db.getProjects();
});

export const addProject = createAsyncThunk('projects/addProject', async (details: { title: string; description: string }) => {
    const newProject: Project = {
        id: `proj_${Date.now()}`,
        ...details,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const currentProjects = await db.getProjects();
    const updatedProjects = [newProject, ...currentProjects];
    await db.saveProjects(updatedProjects);
    return newProject;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, updatedDetails }: { id: string; updatedDetails: Partial<Omit<Project, 'id' | 'createdAt'>> }) => {
    const currentProjects = await db.getProjects();
    const updatedProjects = currentProjects.map(p => 
        p.id === id ? { ...p, ...updatedDetails, updatedAt: new Date().toISOString() } : p
    );
    await db.saveProjects(updatedProjects);
    return { id, updatedDetails };
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: string) => {
    const currentProjects = await db.getProjects();
    const updatedProjects = currentProjects.filter(p => p.id !== id);
    await db.saveProjects(updatedProjects);
    return id;
});

export const deleteAllProjects = createAsyncThunk('projects/deleteAllProjects', async () => {
    await db.saveProjects([]);
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects = action.payload;
            })
            .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
                state.projects.unshift(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = { ...state.projects[index], ...action.payload.updatedDetails, updatedAt: new Date().toISOString() };
                }
            })
            .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
                state.projects = state.projects.filter(p => p.id !== action.payload);
            })
            .addCase(deleteAllProjects.fulfilled, (state) => {
                state.projects = [];
            });
    },
});

export default projectsSlice.reducer;