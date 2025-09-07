import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import { PROJECTS_LOCAL_STORAGE_KEY } from '../constants';

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
            title,
            description,
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => [newProject, ...prev]);
        return newId;
    }, []);

    const updateProject = useCallback((id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        setProjects(prev => prev.map(project =>
            project.id === id
                ? { ...project, ...updatedProject, updatedAt: new Date().toISOString() }
                : project
        ));
    }, []);

    const deleteProject = useCallback((id: string) => {
        setProjects(prev => prev.filter(project => project.id !== id));
        // Note: This does not delete associated galleries/journals. They become "unassigned".
        // A more complex implementation could handle cascading deletes.
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
