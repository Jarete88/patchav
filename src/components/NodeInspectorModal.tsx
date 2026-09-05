import React from 'react';

interface NodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: 'input' | 'mixer' | 'converter' | 'destination';
  nodeName: string;
  onOpenTestPattern: () => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  isOpen,
  onClose,
  nodeType,
  nodeName,
  onOpenTestPattern,
}) => {
  if (!isOpen) return null;

  const typeTitles = {
    input: 'Fuente de Señal (Input)',
    mixer: 'Procesador Central (Mixer Core)',
    converter: 'Transceptor / Conversor',
    destination: 'Destino / Pantalla (Output)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="font-['Space_Grotesk'] text-[11px] text-indigo-600 uppercase tracking-wider font-bold">
              {typeTitles[nodeType]}
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              {nodeName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[10px] font-semibold block">ESTADO DE ENLACE</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYNC LOCKED
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[10px] font-semibold block">RESOLUCIÓN / FRAMERATE</span>
            <span className="text-slate-900 font-bold mt-0.5 block">
              3840x2160 @ 59.94p
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[10px] font-semibold block">ESPACIO DE COLOR</span>
            <span className="text-amber-800 font-bold mt-0.5 block">
              RGB 4:4:4 10-bit
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[10px] font-semibold block">PROTECCIÓN HDCP</span>
            <span className="text-sky-800 font-bold mt-0.5 block">
              HDCP 2.2 Compliant
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1.5 text-xs font-mono text-slate-600">
          <div className="flex justify-between">
            <span>Latencia interna de procesamiento:</span>
            <span className="text-indigo-600 font-bold">12.4 ms (0.75 frames)</span>
          </div>
          <div className="flex justify-between">
            <span>Pérdida de paquetes / Jitter:</span>
            <span className="text-indigo-600 font-bold">0.00%</span>
          </div>
          <div className="flex justify-between">
            <span>Reloj Genlock Maestro:</span>
            <span className="text-slate-900 font-bold">Tri-Level Sync Locked</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onOpenTestPattern();
            }}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            <span>Inyectar Patrón de Prueba</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
