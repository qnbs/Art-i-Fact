import { useState, useEffect, useCallback } from 'react';
import type { Project, Gallery, JournalEntry } from '../types';
import { PROJECTS_LOCAL_STORAGE_KEY, GALLERY_LOCAL_STORAGE_KEY, JOURNAL_LOCAL_STORAGE_KEY } from '../constants';
import { sanitizeInput } from '../services/geminiService';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>(() => {
        try {
            const savedProjects = localStorage.getItem(PROJECTS_LOCAL_STORAGE_KEY);
            return savedProjects ? JSON.parse(savedProjects) : [];
        } catch (error) {
            console.error("Could not parse saved projects:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROJECTS_LOCAL_STORAGE_KEY, JSON.stringify(projects));
        } catch (error) {
            console.warn("Could not save projects to local storage:", error);
        }
    }, [projects]);

    const createProject = useCallback((title: string, description: string): string => {
        const newId = `project_${Date.now()}`;
        const now = new Date().toISOString();
        const newProject: Project = {
            id: newId,
            title: sanitizeInput(title),
            description: sanitizeInput(description),
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => [newProject, ...prev]);
        return newId;
    }, []);

    const updateProject = useCallback((id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        setProjects(prev => prev.map(project => {
            if (project.id !== id) return project;
            
            const newValues = { ...updatedProject };
            if (newValues.title) newValues.title = sanitizeInput(newValues.title);
            if (newValues.description) newValues.description = sanitizeInput(newValues.description);

            return { ...project, ...newValues, updatedAt: new Date().toISOString() };
        }));
    }, []);

    const deleteProject = useCallback((id: string, allGalleries: Gallery[], allJournalEntries: JournalEntry[]) => {
        setProjects(prev => prev.filter(project => project.id !== id));
        
        // This is a bit of a pattern break, but necessary for cascading deletes
        // without introducing a full-blown state management library.
        try {
            const updatedGalleries = allGalleries.filter(g => g.projectId !== id);
            localStorage.setItem(GALLERY_LOCAL_STORAGE_KEY, JSON.stringify(updatedGalleries));

            const updatedJournal = allJournalEntries.filter(j => j.projectId !== id);
            localStorage.setItem(JOURNAL_LOCAL_STORAGE_KEY, JSON.stringify(updatedJournal));
        } catch (error) {
            console.error("Failed to perform cascading delete.", error);
        }

    }, []);
    
    const clearAllProjects = useCallback(() => {
        setProjects([]);
    }, []);

    return {
        projects,
        setProjects,
        createProject,
        updateProject,
        deleteProject,
        clearAllProjects,
    };
};