import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, venue: string, rackCode: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newRack, setNewRack] = useState('FOH Rack 01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName.trim(), newVenue.trim() || 'Auditorio Central', newRack.trim() || 'FOH Rack 01');
    setNewName('');
    setNewVenue('');
    setShowModal(false);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
            Gestión de Proyectos y Racks
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Configura el evento, el rack asignado y sincroniza las tiradas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-['Space_Grotesk'] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-200"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;
          const totalMeters = proj.runs.reduce((acc, r) => acc + (parseInt(r.distance, 10) || 0), 0);

          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-2 border-indigo-600 shadow-md shadow-indigo-100/60'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}></span>
                    <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
                      {proj.name}
                    </h3>
                  </div>
                  {isActive && (
                    <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold uppercase">
                      Activo
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-600 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                    <span>{proj.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">dns</span>
                    <span className="font-mono font-medium">{proj.rackCode}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 font-mono text-xs">
                <span className="text-indigo-600 font-bold">
                  {proj.runs.length} {proj.runs.length === 1 ? 'tirada' : 'tiradas'}
                </span>
                <span className="text-slate-400">
                  {totalMeters}m de cableado
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
                Crear Nuevo Proyecto / Rack
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 rounded-lg p-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                  Nombre del Evento / Proyecto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mobile World Congress 2025"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-['Space_Grotesk'] outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                  Lugar / Venue
                </label>
                <input
                  type="text"
                  placeholder="Ej. Fira Gran Via - Hall 3"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-['Space_Grotesk'] outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase block mb-1">
                  Identificador de Rack
                </label>
                <input
                  type="text"
                  placeholder="Ej. FOH Rack 01 / Dimmer 02"
                  value={newRack}
                  onChange={(e) => setNewRack(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-['Space_Grotesk'] outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-['Space_Grotesk'] shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
