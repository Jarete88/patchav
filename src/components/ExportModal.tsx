import React, { useState } from 'react';
import { Project } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    let text = `🎬 PATCHPRO AV - PLANO DE SEÑAL ACTIVO\n`;
    text += `Evento: ${project.name} (${project.rackCode})\n`;
    text += `Fecha: ${project.date} | Lugar: ${project.venue}\n\n`;
    project.runs.forEach((r, idx) => {
      text += `${idx + 1}. [${r.status}] ${r.input} ➔ ${r.mixer} ➔ ${r.converter} ➔ ${r.destination} (${r.distance} ${r.cableType})\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedType('summary');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `patchpro_${project.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-indigo-600">ios_share</span>
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
              Exportar Plano de Señal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Exporta el esquema técnico de conexionado y las especificaciones de <strong className="text-slate-800 font-semibold">{project.name}</strong> para el equipo de FOH, operadores de pantalla y técnicos de escenario.
        </p>

        <div className="flex flex-col gap-3">
          {/* Quick Copy for WhatsApp / Slack */}
          <button
            onClick={handleCopySummary}
            className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[22px] text-amber-500">chat</span>
              <div>
                <div className="font-['Space_Grotesk'] text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Copiar Resumen para Chat / WhatsApp
                </div>
                <div className="text-[11px] text-slate-500">
                  Texto formateado con todas las tiradas y metrajes
                </div>
              </div>
            </div>
            <span className="text-xs text-indigo-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              {copiedType === 'summary' ? '¡Copiado!' : 'Copiar'}
            </span>
          </button>

          {/* JSON Project File */}
          <button
            onClick={handleDownloadJSON}
            className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[22px] text-indigo-600">data_object</span>
              <div>
                <div className="font-['Space_Grotesk'] text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Descargar Proyecto (.JSON)
                </div>
                <div className="text-[11px] text-slate-500">
                  Archivo de parcheo compatible con PatchPro AV
                </div>
              </div>
            </div>
            <span className="text-xs text-indigo-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              Descargar
            </span>
          </button>

          {/* Print / PDF View */}
          <button
            onClick={handlePrint}
            className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[22px] text-sky-600">print</span>
              <div>
                <div className="font-['Space_Grotesk'] text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Imprimir / Guardar en PDF
                </div>
                <div className="text-[11px] text-slate-500">
                  Hoja técnica para carpetas de producción de rack
                </div>
              </div>
            </div>
            <span className="text-xs text-indigo-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              Imprimir
            </span>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
