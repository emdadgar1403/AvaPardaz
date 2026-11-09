/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { HomeView } from './views/HomeView';
import { GenerateView } from './views/GenerateView';
import { ProjectsView } from './views/ProjectsView';
import { ModelsView } from './views/ModelsView';
import { SettingsView } from './views/SettingsView';
import { AudioProject, EngineType, ModelInfo, UserSettings } from './types';
import { DEFAULT_SETTINGS, INITIAL_MODELS, INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isCodeExplorerOpen, setIsCodeExplorerOpen] = useState(false);
  const [activeProjectToEdit, setActiveProjectToEdit] = useState<AudioProject | null>(null);

  // Persistent projects in LocalStorage
  const [projects, setProjects] = useState<AudioProject[]>(() => {
    try {
      const saved = localStorage.getItem('avapardaz_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS;
  });

  // Persistent models in LocalStorage
  const [models, setModels] = useState<ModelInfo[]>(() => {
    try {
      const saved = localStorage.getItem('avapardaz_models');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MODELS;
  });

  // Persistent settings in LocalStorage
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('avapardaz_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('avapardaz_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('avapardaz_models', JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem('avapardaz_settings', JSON.stringify(settings));
  }, [settings]);

  // Project operations
  const handleSaveProject = (savedProject: AudioProject) => {
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === savedProject.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = savedProject;
        return copy;
      }
      return [savedProject, ...prev];
    });
  };

  const handleOpenProjectToEdit = (project: AudioProject) => {
    setActiveProjectToEdit(project);
    setActiveTab('generate');
  };

  const handleRenameProject = (id: string, newTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle, updatedAt: Date.now() } : p))
    );
  };

  /**
   * Clone project with 100% independent audio file separation
   */
  const handleCloneProject = (sourceId: string) => {
    const source = projects.find((p) => p.id === sourceId);
    if (!source) return;

    const newId = `proj_clone_${Date.now()}`;
    const cloned: AudioProject = {
      ...source,
      id: newId,
      title: `${source.title} (کپی)`,
      // Independent audio path simulation
      audioFilePath: source.audioFilePath ? `/storage/emulated/0/AvaPardaz/Audios/audio_${newId}.wav` : null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setProjects((prev) => [cloned, ...prev]);
  };

  const handleDeleteProject = (project: AudioProject) => {
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    if (activeProjectToEdit?.id === project.id) {
      setActiveProjectToEdit(null);
    }
  };

  const handleImportProject = (importedProject: AudioProject) => {
    setProjects((prev) => [importedProject, ...prev]);
    setActiveTab('projects');
  };

  const handleSelectDefaultEngine = (engine: EngineType) => {
    setSettings((prev) => ({ ...prev, defaultEngine: engine }));
  };

  const handleAddNewCustomModel = (model: ModelInfo) => {
    setModels((prev) => [model, ...prev]);
  };

  const handleRestoreBackup = (restoredProjects: AudioProject[], restoredSettings: UserSettings) => {
    setProjects(restoredProjects);
    setSettings(restoredSettings);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Header */}
      <Header onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)} />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'home' && (
          <HomeView
            projects={projects}
            onNavigateToGenerate={() => {
              setActiveProjectToEdit(null);
              setActiveTab('generate');
            }}
            onNavigateToProjects={() => setActiveTab('projects')}
            onNavigateToModels={() => setActiveTab('models')}
            onOpenProject={handleOpenProjectToEdit}
          />
        )}

        {activeTab === 'generate' && (
          <GenerateView
            onSaveProject={handleSaveProject}
            activeProjectToEdit={activeProjectToEdit}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenProject={handleOpenProjectToEdit}
            onRenameProject={handleRenameProject}
            onCloneProject={handleCloneProject}
            onDeleteProject={handleDeleteProject}
            onImportProject={handleImportProject}
            onNavigateToGenerate={() => {
              setActiveProjectToEdit(null);
              setActiveTab('generate');
            }}
          />
        )}

        {activeTab === 'models' && (
          <ModelsView
            models={models}
            defaultEngine={settings.defaultEngine}
            onSelectDefaultEngine={handleSelectDefaultEngine}
            onAddNewCustomModel={handleAddNewCustomModel}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            projects={projects}
            onUpdateSettings={setSettings}
            onRestoreBackup={handleRestoreBackup}
            onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
          />
        )}
      </main>

      {/* Responsive Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab !== 'generate') {
            setActiveProjectToEdit(null);
          }
          setActiveTab(tab);
        }}
        projectsCount={projects.length}
      />

      {/* Android Code Explorer & Download Modal */}
      <CodeExplorerModal
        isOpen={isCodeExplorerOpen}
        onClose={() => setIsCodeExplorerOpen(false)}
      />

    </div>
  );
}
