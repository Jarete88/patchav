import React from 'react';
import { SignalRun } from '../types';

interface RunsListProps {
  runs: SignalRun[];
  activeRunId: string;
  onSelectRun: (id: string) => void;
  onDeleteRun: (id: string) => void;
  onDuplicateRun: (run: SignalRun) => void;
  onToggleStatus: (id: string) => void;
  onOpenTestPattern: () => void;
}

export const RunsList: React.FC<RunsListProps> = ({
  runs,
  activeRunId,
  onSelectRun,
  onDeleteRun,
  onDuplicateRun,
  onToggleStatus,
  onOpenTestPattern,
}) => {
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-3 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-indigo-600">format_list_bulleted</span>
          <h4 className="font-['Space_Grotesk'] text-sm font-bold text-slate-800">
            Tiradas Registradas ({runs.length})
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Selecciona una tirada para inspeccionarla en el plano
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {runs.map((run, idx) => {
          const isActive = run.id === activeRunId;
          return (
            <div
              key={run.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-indigo-50/50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                  onClick={() => onSelectRun(run.id)}
                >
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    #{idx + 1}
                  </span>
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-slate-900 truncate">
                    {run.name || `Tirada ${idx + 1}`}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full uppercase font-bold tracking-tight">
                      En pantalla
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onToggleStatus(run.id)}
                    className="text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1.5 font-medium bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    title="Alternar estado de sincronización"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {run.status}
                  </button>
                  <button
                    onClick={() => onDuplicateRun(run)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Duplicar tirada"
                  >
                    <span className="material-symbols-outlined text-[17px]">content_copy</span>
                  </button>
                  <button
                    onClick={() => onDeleteRun(run.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Eliminar tirada"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Path badges */}
              <div
                className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto no-scrollbar pt-1 cursor-pointer"
                onClick={() => onSelectRun(run.id)}
              >
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate">
                  {run.input}
                </span>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 truncate">
                  {run.mixer}
                </span>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 truncate">
                  {run.converter}
                </span>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate">
                  {run.destination}
                </span>
                <span className="ml-auto text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 font-bold flex-shrink-0 text-[11px]">
                  {run.distance} {run.cableType}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
