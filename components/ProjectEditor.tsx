
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { Button } from './ui/Button.tsx';
import type { Project } from '../types.ts';

interface ProjectEditorProps {
  onSave: (details: { title: string; description: string }) => void;
  onCancel: () => void;
  project?: Project;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ onSave, onCancel, project }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="project-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('workspace.project.creator.title')}
        </label>
        <input
          id="project-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('workspace.project.creator.title.placeholder')}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('workspace.project.creator.description')}
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('workspace.project.creator.description.placeholder')}
          rows={4}
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div className="flex justify-end gap-2">
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
