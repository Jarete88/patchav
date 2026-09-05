import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignalCanvas } from './components/SignalCanvas';
import { SignalFlowBuilder } from './components/SignalFlowBuilder';
import { RunsList } from './components/RunsList';
import { MatrixView } from './components/MatrixView';
import { BomView } from './components/BomView';
import { ProjectsView } from './components/ProjectsView';
import { BottomNav, NavTab } from './components/BottomNav';
import { TestPatternModal } from './components/TestPatternModal';
import { ExportModal } from './components/ExportModal';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { INITIAL_PROJECTS } from './data/mockData';
import { CableDistance, CableProtocol, Project, SignalRun } from './types';

const STORAGE_KEY = 'patchpro_av_projects_data_v1';

export default function App() {
  // Load initial projects from localStorage or default
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'tech-summit-2025');

  // Active project helper
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Active run id
  const [activeRunId, setActiveRunId] = useState<string>(currentProject?.runs[0]?.id || 'run-1');

  // Selected values for the 5-step builder (default matches screenshot)
  const [selectedInput, setSelectedInput] = useState<string>('RESO 1');
  const [selectedMixer, setSelectedMixer] = useState<string>('E2 2ª GEN');
  const [selectedDestination, setSelectedDestination] = useState<string>('VX1000');
  const [selectedConverter, setSelectedConverter] = useState<string>('EXTENSOR LIGHTWARE');
  const [selectedCable, setSelectedCable] = useState<CableProtocol>('FIBRA');
  const [selectedDistance, setSelectedDistance] = useState<CableDistance>('50m');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('tiradas');

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTestPatternOpen, setIsTestPatternOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectorNode, setInspectorNode] = useState<{
    type: 'input' | 'mixer' | 'converter' | 'destination';
    name: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  // Derive the active run object
  const activeRun: SignalRun = React.useMemo(() => {
    const found = currentProject?.runs.find((r) => r.id === activeRunId);
    if (found) return found;

    // Fallback: construct live representation from current builder state
    return {
      id: 'live-builder-preview',
      name: `${selectedInput} ➔ ${selectedDestination}`,
      input: selectedInput,
      mixer: selectedMixer,
      converter: selectedConverter,
      destination: selectedDestination,
      cableType: selectedCable,
      distance: selectedDistance,
      status: 'SYNC LOCKED',
      wire1Label: 'HDMI 5m',
      wire2Label: `${selectedDistance} ${selectedCable}`,
      wire3Label: 'HDMI 2m',
      resolution: '3840x2160@60Hz',
      colorScheme: 'cyan',
      checkedInTruck: true,
    };
  }, [currentProject, activeRunId, selectedInput, selectedMixer, selectedConverter, selectedDestination, selectedCable, selectedDistance]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Add new Tirada to current project
  const handleAddRun = () => {
    const newId = `run-${Date.now()}`;
    const newRun: SignalRun = {
      id: newId,
      name: `${selectedInput} ➔ ${selectedDestination}`,
      input: selectedInput,
      mixer: selectedMixer,
      converter: selectedConverter,
      destination: selectedDestination,
      cableType: selectedCable,
      distance: selectedDistance,
      status: 'SYNC LOCKED',
      wire1Label: selectedInput.includes('URSA') || selectedInput.includes('REA') ? 'SDI 5m' : 'HDMI 5m',
      wire2Label: `${selectedDistance} ${selectedCable}`,
      wire3Label: selectedDestination.includes('MONITOR') ? 'HDMI 2m' : 'HDMI 2m',
      resolution: '3840x2160@60Hz',
      colorScheme: selectedCable === 'FIBRA' ? 'cyan' : selectedCable === '12G-SDI' ? 'blue' : 'amber',
      checkedInTruck: true,
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === currentProject.id) {
          return {
            ...proj,
            runs: [newRun, ...proj.runs],
          };
        }
        return proj;
      })
    );

    setActiveRunId(newId);
    showToast(`✓ Tirada añadida al plano: ${selectedInput} ➔ ${selectedDestination}`);
  };

  const handleSelectRun = (runId: string) => {
    setActiveRunId(runId);
    const run = currentProject.runs.find((r) => r.id === runId);
    if (run) {
      setSelectedInput(run.input);
      setSelectedMixer(run.mixer);
      setSelectedConverter(run.converter);
      setSelectedDestination(run.destination);
      setSelectedCable(run.cableType);
      setSelectedDistance(run.distance);
    }
  };

  const handleDeleteRun = (runId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === currentProject.id) {
          const filtered = proj.runs.filter((r) => r.id !== runId);
          return { ...proj, runs: filtered };
        }
        return proj;
      })
    );
    if (activeRunId === runId) {
      const remaining = currentProject.runs.filter((r) => r.id !== runId);
      if (remaining.length > 0) {
        handleSelectRun(remaining[0].id);
      }
    }
    showToast('Tirada eliminada del plano');
  };

  const handleDuplicateRun = (run: SignalRun) => {
    const dupId = `run-${Date.now()}`;
    const duplicate: SignalRun = {
      ...run,
      id: dupId,
      name: `${run.name} (Copia)`,
    };
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === currentProject.id) {
          return { ...proj, runs: [duplicate, ...proj.runs] };
        }
        return proj;
      })
    );
    setActiveRunId(dupId);
    showToast('Tirada duplicada');
  };

  const handleToggleStatus = (runId: string) => {
    const statuses: Array<SignalRun['status']> = ['SYNC LOCKED', 'ON AIR', 'STANDBY', 'NO SYNC'];
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === currentProject.id) {
          return {
            ...proj,
            runs: proj.runs.map((r) => {
              if (r.id === runId) {
                const curIdx = statuses.indexOf(r.status);
                const nextStatus = statuses[(curIdx + 1) % statuses.length];
                return { ...r, status: nextStatus };
              }
              return r;
            }),
          };
        }
        return proj;
      })
    );
  };

  const handleUpdateRunCheck = (runId: string, checked: boolean) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === currentProject.id) {
          return {
            ...proj,
            runs: proj.runs.map((r) => (r.id === runId ? { ...r, checkedInTruck: checked } : r)),
          };
        }
        return proj;
      })
    );
  };

  const handleCreateProject = (name: string, venue: string, rackCode: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      venue,
      rackCode,
      date: new Date().toISOString().split('T')[0],
      runs: [],
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setActiveTab('tiradas');
    showToast(`Proyecto "${name}" creado con éxito`);
  };

  const handleNewRunClean = () => {
    setSelectedInput('PPT');
    setSelectedMixer('E2 2ª GEN');
    setSelectedConverter('DIRECTO (SIN CONV.)');
    setSelectedDestination('PROYECTOR 20K');
    setSelectedCable('FIBRA');
    setSelectedDistance('30m');
    setActiveTab('tiradas');
    showToast('Selector preparado para nueva tirada');
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Fixed Top Header */}
      <Header
        currentProject={currentProject}
        onNewRun={handleNewRunClean}
        onOpenExport={() => setIsExportOpen(true)}
        onSwitchProject={() => setActiveTab('proyectos')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pb-28 pt-16 max-w-7xl mx-auto">
        {activeTab === 'tiradas' && (
          <div className="flex flex-col w-full">
            {/* Top Interactive Blueprint Signal Canvas */}
            <SignalCanvas
              activeRun={activeRun}
              allRuns={currentProject.runs}
              onSelectRun={handleSelectRun}
              onInspectNode={(type, name) => setInspectorNode({ type, name })}
              onOpenTestPattern={() => setIsTestPatternOpen(true)}
            />

            {/* 5-Step Quick Signal Flow Builder */}
            <SignalFlowBuilder
              selectedInput={selectedInput}
              selectedMixer={selectedMixer}
              selectedDestination={selectedDestination}
              selectedConverter={selectedConverter}
              selectedCable={selectedCable}
              selectedDistance={selectedDistance}
              onSelectInput={setSelectedInput}
              onSelectMixer={setSelectedMixer}
              onSelectDestination={setSelectedDestination}
              onSelectConverter={setSelectedConverter}
              onSelectCable={setSelectedCable}
              onSelectDistance={setSelectedDistance}
              onAddRun={handleAddRun}
              runCount={currentProject.runs.length}
            />

            {/* List of Created Tiradas in Active Project */}
            {currentProject.runs.length > 0 && (
              <RunsList
                runs={currentProject.runs}
                activeRunId={activeRun.id}
                onSelectRun={handleSelectRun}
                onDeleteRun={handleDeleteRun}
                onDuplicateRun={handleDuplicateRun}
                onToggleStatus={handleToggleStatus}
                onOpenTestPattern={() => setIsTestPatternOpen(true)}
              />
            )}
          </div>
        )}

        {activeTab === 'matriz' && (
          <MatrixView onOpenTestPattern={() => setIsTestPatternOpen(true)} />
        )}

        {activeTab === 'carga-bom' && (
          <BomView project={currentProject} onUpdateRunCheck={handleUpdateRunCheck} />
        )}

        {activeTab === 'proyectos' && (
          <ProjectsView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setActiveTab('tiradas');
            }}
            onCreateProject={handleCreateProject}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        runsCount={currentProject.runs.length}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-[12px] font-medium shadow-lg shadow-slate-900/20 border border-slate-800 flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Node Inspector Modal */}
      {inspectorNode && (
        <NodeInspectorModal
          isOpen={!!inspectorNode}
          onClose={() => setInspectorNode(null)}
          nodeType={inspectorNode.type}
          nodeName={inspectorNode.name}
          onOpenTestPattern={() => {
            setInspectorNode(null);
            setIsTestPatternOpen(true);
          }}
        />
      )}

      {/* Test Pattern Simulator Modal */}
      <TestPatternModal
        isOpen={isTestPatternOpen}
        onClose={() => setIsTestPatternOpen(false)}
        signalLabel={`${selectedInput} ➔ ${selectedDestination}`}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={currentProject}
      />
    </div>
  );
}
