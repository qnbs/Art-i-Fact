import { useState, useEffect, useCallback } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { Project } from '../types.ts';
import { db } from '../services/dbService.ts';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            const storedProjects = await db.getProjects();
            setProjects(storedProjects);
            setIsLoading(false);
        };
        loadProjects();
    }, []);

    const updateAndSave = useCallback(async (newProjects: Project[] | ((prev: Project[]) => Project[])) => {
        const updatedProjects = typeof newProjects === 'function' ? newProjects(projects) : newProjects;
        setProjects(updatedProjects);
        await db.saveProjects(updatedProjects);
    }, [projects]);

    const addProject = useCallback((title: string, description: string): string => {
        const newProject: Project = {
            id: `proj_${Date.now()}`,
            title,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        updateAndSave(prev => [newProject, ...prev]);
        return newProject.id;
    }, [updateAndSave]);

    const updateProject = useCallback((id: string, updatedDetails: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        updateAndSave(prev => 
            prev.map(p => 
                p.id === id ? { ...p, ...updatedDetails, updatedAt: new Date().toISOString() } : p
            )
        );
    }, [updateAndSave]);

    const deleteProject = useCallback((id: string) => {
        updateAndSave(prev => prev.filter(p => p.id !== id));
    }, [updateAndSave]);
    
    const deleteAllProjects = useCallback(() => {
        updateAndSave([]);
    }, [updateAndSave]);

    return {
        projects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
    };
};