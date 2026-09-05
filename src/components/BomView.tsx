import React, { useState, useMemo } from 'react';
import { SignalRun, Project } from '../types';

interface BomViewProps {
  project: Project;
  onUpdateRunCheck: (runId: string, checked: boolean) => void;
}

interface CableGroup {
  count: number;
  totalMeters: number;
  items: string[];
}

export const BomView: React.FC<BomViewProps> = ({ project, onUpdateRunCheck }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Aggregate cables
  const cableSummary: Record<string, CableGroup> = useMemo(() => {
    const summary: Record<string, CableGroup> = {
      FIBRA: { count: 0, totalMeters: 0, items: [] },
      '12G-SDI': { count: 0, totalMeters: 0, items: [] },
      'HDMI 2.1': { count: 0, totalMeters: 0, items: [] },
      'DP 1.4': { count: 0, totalMeters: 0, items: [] },
    };

    project.runs.forEach((r) => {
      const meters = parseInt(r.distance.replace('m', ''), 10) || 0;
      if (!summary[r.cableType]) {
        summary[r.cableType] = { count: 0, totalMeters: 0, items: [] };
      }
      summary[r.cableType].count += 1;
      summary[r.cableType].totalMeters += meters;
      summary[r.cableType].items.push(`${r.distance} (${r.name || r.input})`);
    });

    return summary;
  }, [project.runs]);

  // Aggregate hardware
  const hardwareSummary = useMemo(() => {
    const mixers = new Map<string, number>();
    const destinations = new Map<string, number>();
    const converters = new Map<string, number>();

    project.runs.forEach((r) => {
      mixers.set(r.mixer, (mixers.get(r.mixer) || 0) + 1);
      destinations.set(r.destination, (destinations.get(r.destination) || 0) + 1);
      if (r.converter && !r.converter.includes('DIRECTO')) {
        converters.set(r.converter, (converters.get(r.converter) || 0) + 1);
      }
    });

    return { mixers, destinations, converters };
  }, [project.runs]);

  const totalMeters = useMemo(() => {
    return (Object.values(cableSummary) as CableGroup[]).reduce((acc, curr) => acc + curr.totalMeters, 0);
  }, [cableSummary]);

  const handleCopyBOM = () => {
    let text = `=== LISTA DE CARGA / BOM - ${project.name.toUpperCase()} ===\n`;
    text += `Fecha: ${project.date} | Rack: ${project.rackCode} | Lugar: ${project.venue}\n\n`;
    text += `--- CABLEADO TOTAL (${totalMeters} METROS) ---\n`;
    (Object.entries(cableSummary) as [string, CableGroup][]).forEach(([type, data]) => {
      text += `• ${type}: ${data.count} tiradas (${data.totalMeters}m totales) [${data.items.join(', ')}]\n`;
    });
    text += `\n--- PROCESAMIENTO CORE & MEZCLADORES ---\n`;
    hardwareSummary.mixers.forEach((cnt, name) => {
      text += `• [x${cnt}] ${name}\n`;
    });
    text += `\n--- PANTALLAS & DESTINOS ---\n`;
    hardwareSummary.destinations.forEach((cnt, name) => {
      text += `• [x${cnt}] ${name}\n`;
    });
    text += `\n--- CONVERSORES & TRANSCEPTORES ---\n`;
    hardwareSummary.converters.forEach((cnt, name) => {
      text += `• [x${cnt}] ${name}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handleDownloadCSV = () => {
    let csv = `Categoria,Elemento,Cantidad,Metros,Uso / Detalle\n`;
    (Object.entries(cableSummary) as [string, CableGroup][]).forEach(([type, data]) => {
      csv += `"Cableado","${type}",${data.count},${data.totalMeters},"${data.items.join('; ')}"\n`;
    });
    hardwareSummary.mixers.forEach((cnt, name) => {
      csv += `"Mezcladores","${name}",${cnt},0,"Procesador Core"\n`;
    });
    hardwareSummary.destinations.forEach((cnt, name) => {
      csv += `"Destinos / Pantallas","${name}",${cnt},0,"Salida"\n`;
    });
    hardwareSummary.converters.forEach((cnt, name) => {
      csv += `"Conversores","${name}",${cnt},0,"Extensor/Adaptador"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BOM_${project.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-slate-900">
              Lista de Carga y BOM de Material
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {project.name} • {project.runs.length} tiradas activas • <span className="font-mono font-semibold text-slate-700">{totalMeters} metros</span> totales de cableado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBOM}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copyFeedback ? 'check' : 'content_copy'}
            </span>
            <span>{copyFeedback ? '¡Copiado!' : 'Copiar BOM'}</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-200"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Cable Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(cableSummary) as [string, CableGroup][]).map(([type, data]) => (
          <div key={type} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-xs">
            <span className="font-mono text-xs text-indigo-700 font-bold uppercase">{type}</span>
            <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 mt-1">
              {data.totalMeters}
              <span className="text-xs font-mono text-slate-400 font-normal ml-1">m</span>
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {data.count} {data.count === 1 ? 'tirada' : 'tiradas'}
            </span>
          </div>
        ))}
      </div>

      {/* Hardware Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Mixers */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
            <span className="material-symbols-outlined text-[18px] text-indigo-600">dns</span>
            <span className="font-['Space_Grotesk'] text-xs font-bold text-slate-800 uppercase tracking-wide">
              Mezcladores / Procesadores
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {Array.from(hardwareSummary.mixers.entries()).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                <span className="font-['Space_Grotesk'] text-xs font-semibold text-slate-800">{name}</span>
                <span className="font-mono text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">
                  x{count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Converters / DAs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
            <span className="material-symbols-outlined text-[18px] text-sky-600">cable</span>
            <span className="font-['Space_Grotesk'] text-xs font-bold text-slate-800 uppercase tracking-wide">
              Conversores & Extensores
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {Array.from(hardwareSummary.converters.entries()).length === 0 ? (
              <span className="text-xs text-slate-400 italic p-2">Sin conversores activos</span>
            ) : (
              Array.from(hardwareSummary.converters.entries()).map(([name, count]) => (
                <div key={name} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                  <span className="font-['Space_Grotesk'] text-xs font-semibold text-slate-800 truncate mr-2">
                    {name}
                  </span>
                  <span className="font-mono text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold flex-shrink-0">
                    x{count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Displays & Destinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
            <span className="material-symbols-outlined text-[18px] text-blue-600">tv_gen</span>
            <span className="font-['Space_Grotesk'] text-xs font-bold text-slate-800 uppercase tracking-wide">
              Destinos / Pantallas
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {Array.from(hardwareSummary.destinations.entries()).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                <span className="font-['Space_Grotesk'] text-xs font-semibold text-slate-800 truncate mr-2">
                  {name}
                </span>
                <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold flex-shrink-0">
                  x{count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Truck Packing Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-indigo-600">local_shipping</span>
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-slate-800">
              Checklist de Carga en Camión / FOH
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            <span className="font-mono font-bold text-indigo-600">{project.runs.filter((r) => r.checkedInTruck).length}</span> de {project.runs.length} cargados
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {project.runs.map((run) => (
            <div
              key={run.id}
              onClick={() => onUpdateRunCheck(run.id, !run.checkedInTruck)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                run.checkedInTruck
                  ? 'bg-emerald-50/60 border-emerald-300 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!run.checkedInTruck}
                  onChange={() => {}}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer rounded"
                />
                <div>
                  <span className={`font-['Space_Grotesk'] text-xs font-bold ${run.checkedInTruck ? 'text-emerald-950 line-through' : 'text-slate-800'}`}>
                    {run.name || run.input}
                  </span>
                  <div className="font-mono text-[10px] text-slate-500">
                    {run.input} ➔ {run.mixer} ➔ {run.destination}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200">
                {run.distance} {run.cableType}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
