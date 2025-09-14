
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PROJECTS_LOCAL_STORAGE_KEY } from '../constants';
import type { Project, Gallery, JournalEntry } from '../types';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>(() => {
        try {
            const savedProjects = localStorage.getItem(PROJECTS_LOCAL_STORAGE_KEY);
            return savedProjects ? JSON.parse(savedProjects) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(PROJECTS_LOCAL_STORAGE_KEY, JSON.stringify(projects));
        } catch (error) {
            console.warn("Could not save projects:", error);
        }
    }, [projects]);

    const createProject = useCallback((title: string, description: string): string => {
        const newProject: Project = {
            id: uuidv4(),
            title,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setProjects(prev => [...prev, newProject]);
        return newProject.id;
    }, []);

    const updateProject = useCallback((id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject, updatedAt: new Date().toISOString() } : p));
    }, []);

    const deleteProject = useCallback((id: string, allGalleries: Gallery[], allJournalEntries: JournalEntry[]) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        // Note: The App component is responsible for filtering out associated galleries and journals from their respective states.
    }, []);

    const clearAllProjects = useCallback(() => {
        setProjects([]);
    }, []);

    return { projects, createProject, updateProject, deleteProject, setProjects, clearAllProjects };
};
