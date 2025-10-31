



import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Workspace } from './Workspace.tsx';
import { ProjectView } from './ProjectView.tsx';
import { ArtLibrary } from './ArtLibrary.tsx';
import { GalleryView } from './GalleryView.tsx';
import { Studio } from './Studio.tsx';
import { Journal } from './Journal.tsx';
import { ProfileView } from './ProfileView.tsx';
import { Setup } from './Setup.tsx';
import { Help } from './Help.tsx';
import { GalleryManager } from './GalleryManager.tsx';

export const MainContent: React.FC = () => {
    const { 
        activeView,
        galleries, 
        handleNewGallerySuite,
        // FIX: Destructure necessary props for the Journal component from the app context.
        entries,
        language,
        createJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
    } = useAppContext();

    // FIX: Add local state to manage the active journal entry in the main journal view.
    const [activeJournalId, setActiveJournalId] = useState<string | null>(null);

    switch (activeView) {
        case 'workspace':
            return <Workspace />;
        case 'project':
            return <ProjectView />;
        case 'discover':
            return <ArtLibrary />;
        case 'gallery':
            return <GalleryView />;
        case 'gallerysuite':
            return <GalleryManager 
                galleries={galleries.filter(g => !g.projectId)} 
                onCreateNew={handleNewGallerySuite} 
            />;
        case 'studio':
            return <Studio />;
        case 'journal':
            // FIX: Pass all required props to the Journal component.
            return <Journal 
                entries={entries.filter(e => !e.projectId)}
                language={language}
                activeEntryId={activeJournalId}
                onSelectEntry={setActiveJournalId}
                onUpdateEntry={updateJournalEntry}
                onDeleteEntry={deleteJournalEntry}
                // FIX: Pass an async function to match the expected promise return type.
                onNewEntry={async () => await createJournalEntry(null)}
            />;
        case 'profile':
            return <ProfileView />;
        case 'setup':
            return <Setup />;
        case 'help':
            return <Help />;
        default:
            return <Workspace />;
    }
};