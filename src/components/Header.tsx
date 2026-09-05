import React from 'react';
import { Project } from '../types';

interface HeaderProps {
  currentProject: Project;
  onNewRun: () => void;
  onOpenExport: () => void;
  onSwitchProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onNewRun,
  onOpenExport,
  onSwitchProject,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
          onClick={onSwitchProject}
          title="Cambiar proyecto activo"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-200 flex-shrink-0">
            P
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] text-base font-bold text-slate-900 tracking-tight uppercase truncate">
                PATCHPRO AV
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 font-medium truncate group-hover:text-slate-800 transition-colors">
                {currentProject.name} • <span className="font-mono text-[11px] text-slate-600 font-semibold">{currentProject.rackCode}</span>
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-slate-600 transition-colors">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            aria-label="Nuevo Plano"
            onClick={onNewRun}
            className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200 flex items-center gap-1.5 font-medium text-xs transition-colors cursor-pointer"
            title="Limpiar y crear nueva tirada"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">add_to_photos</span>
            <span className="hidden sm:inline">Nueva Tirada</span>
          </button>
          <button
            onClick={onOpenExport}
            className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
