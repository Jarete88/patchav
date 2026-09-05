import React from 'react';
import { SignalRun } from '../types';

interface SignalCanvasProps {
  activeRun: SignalRun;
  allRuns: SignalRun[];
  onSelectRun: (runId: string) => void;
  onInspectNode: (nodeType: 'input' | 'mixer' | 'converter' | 'destination', name: string) => void;
  onOpenTestPattern: () => void;
}

export const SignalCanvas: React.FC<SignalCanvasProps> = ({
  activeRun,
  allRuns,
  onSelectRun,
  onInspectNode,
  onOpenTestPattern,
}) => {
  return (
    <div className="w-full flex flex-col bg-white border-b border-slate-200 shadow-sm">
      {/* Canvas Sub-Header */}
      <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
          <span className="font-['Space_Grotesk'] text-sm font-bold text-slate-800 uppercase tracking-wide truncate">
            Plano de Señal Activo
          </span>
          {allRuns.length > 1 && (
            <select
              value={activeRun.id}
              onChange={(e) => onSelectRun(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {allRuns.map((r, idx) => (
                <option key={r.id} value={r.id} className="bg-white text-slate-900">
                  #{idx + 1}: {r.name || `${r.input} ➔ ${r.destination}`}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTestPattern}
            className="flex items-center gap-1.5 font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer font-medium"
            title="Abrir generador de patrón de prueba SMPTE"
          >
            <span className="material-symbols-outlined text-[15px]">palette</span>
            <span className="hidden sm:inline">Test Pattern</span>
          </button>
          <span className="font-mono text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-medium">
            4 Nodos Enlazados
          </span>
        </div>
      </div>

      {/* Blueprint Interactive Canvas */}
      <div className="relative w-full h-[225px] overflow-x-auto overflow-y-hidden bg-slate-950 border-b border-slate-800 select-none no-scrollbar">
        {/* SVG Blueprint Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 min-w-[560px]">
          <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="20" id="bp-grid" patternUnits="userSpaceOnUse" width="20">
                <circle cx="2" cy="2" fill="#818cf8" r="0.8"></circle>
              </pattern>
              <pattern height="80" id="bp-major" patternUnits="userSpaceOnUse" width="80">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#475569" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect fill="url(#bp-grid)" height="100%" width="100%"></rect>
            <rect fill="url(#bp-major)" height="100%" width="100%"></rect>
          </svg>
        </div>

        {/* Dynamic Glowing Connecting Wires & Tags */}
        <div className="relative min-w-[540px] max-w-4xl mx-auto h-full flex items-center px-6">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter height="140%" id="glow-amber" width="140%" x="-20%" y="-20%">
                <feDropShadow dx="0" dy="0" floodColor="#f59e0b" floodOpacity="0.9" stdDeviation="3.5"></feDropShadow>
              </filter>
              <filter height="140%" id="glow-indigo" width="140%" x="-20%" y="-20%">
                <feDropShadow dx="0" dy="0" floodColor="#818cf8" floodOpacity="0.95" stdDeviation="4"></feDropShadow>
              </filter>
              <filter height="140%" id="glow-sky" width="140%" x="-20%" y="-20%">
                <feDropShadow dx="0" dy="0" floodColor="#38bdf8" floodOpacity="0.9" stdDeviation="3.5"></feDropShadow>
              </filter>
            </defs>

            {/* Wire 1: Input -> Mixer */}
            <path
              className="opacity-95"
              d="M 112 112 L 160 112"
              fill="none"
              filter="url(#glow-amber)"
              stroke="#f59e0b"
              strokeDasharray="4,2"
              strokeWidth="2.5"
            ></path>
            {/* Animated signal pulse dot on Wire 1 */}
            <circle cx="136" cy="112" r="3" fill="#fbbf24">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* Wire 2: Mixer -> Extensor */}
            <path
              className="opacity-95"
              d="M 264 112 L 306 112"
              fill="none"
              filter="url(#glow-indigo)"
              stroke="#6366f1"
              strokeWidth="3.2"
            ></path>
            {/* Laser animated pulse dot on Wire 2 */}
            <circle cx="285" cy="112" r="3.5" fill="#a5b4fc">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* Wire 3: Extensor -> Destino */}
            <path
              className="opacity-95"
              d="M 408 112 L 448 112"
              fill="none"
              filter="url(#glow-sky)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            ></path>
            {/* Animated signal pulse dot on Wire 3 */}
            <circle cx="428" cy="112" r="3" fill="#38bdf8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Wire Length Tag 1 */}
          <div className="absolute left-[136px] top-[74px] z-20 -translate-x-1/2">
            <div className="px-2 py-0.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-amber-500/50 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="font-mono text-[8.5px] text-amber-200 font-bold tracking-tight">
                {activeRun.wire1Label || 'HDMI 5m'}
              </span>
            </div>
          </div>

          {/* Wire Length Tag 2 (Main distance) */}
          <div className="absolute left-[285px] top-[74px] z-20 -translate-x-1/2">
            <div className="px-2.5 py-0.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-indigo-500/70 shadow-[0_0_12px_rgba(99,102,241,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="font-mono text-[9px] text-indigo-200 font-bold tracking-tight uppercase">
                {activeRun.distance} {activeRun.cableType}
              </span>
            </div>
          </div>

          {/* Wire Length Tag 3 */}
          <div className="absolute left-[428px] top-[74px] z-20 -translate-x-1/2">
            <div className="px-2 py-0.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-sky-500/50 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span className="font-mono text-[8.5px] text-sky-200 font-bold tracking-tight">
                {activeRun.wire3Label || 'HDMI 2m'}
              </span>
            </div>
          </div>

          {/* The 4 Hardware Interactive Node Modules */}
          <div className="flex items-center justify-between w-full relative z-20 gap-3">
            {/* NODO 1: INPUT */}
            <div
              onClick={() => onInspectNode('input', activeRun.input)}
              className="w-[102px] bg-slate-900/90 hover:bg-slate-800 border border-amber-500/60 rounded-xl p-2.5 shadow-lg flex-shrink-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              title="Click para ver telemetría del Input"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[8px] text-amber-400 uppercase tracking-wider font-bold">INPUT</span>
                <span className="material-symbols-outlined text-[14px] text-amber-400">laptop_mac</span>
              </div>
              <div className="font-['Space_Grotesk'] text-[11px] font-bold text-white truncate">
                {activeRun.input}
              </div>
              <div className="font-mono text-[9px] text-amber-200/80 truncate">HDMI 2.1</div>
            </div>

            {/* NODO 2: MEZCLADOR */}
            <div
              onClick={() => onInspectNode('mixer', activeRun.mixer)}
              className="w-[108px] bg-slate-900/90 hover:bg-slate-800 border border-indigo-500 rounded-xl p-2.5 shadow-[0_0_16px_rgba(99,102,241,0.35)] flex-shrink-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              title="Click para ver telemetría del Mezclador"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[8px] text-indigo-400 uppercase tracking-wider font-bold">MEZCLADOR</span>
                <span className="material-symbols-outlined text-[14px] text-indigo-400">dns</span>
              </div>
              <div className="font-['Space_Grotesk'] text-[11px] font-bold text-white truncate">
                {activeRun.mixer}
              </div>
              <div className="font-mono text-[9px] text-indigo-300 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SYNC LOCKED
              </div>
            </div>

            {/* NODO 3: CONVERSOR */}
            <div
              onClick={() => onInspectNode('converter', activeRun.converter)}
              className="w-[104px] bg-slate-900/90 hover:bg-slate-800 border border-sky-500/60 rounded-xl p-2.5 shadow-lg flex-shrink-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              title="Click para ver telemetría del Conversor"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[8px] text-sky-400 uppercase tracking-wider font-bold">CONVERSOR</span>
                <span className="material-symbols-outlined text-[14px] text-sky-400">cable</span>
              </div>
              <div className="font-['Space_Grotesk'] text-[10px] font-bold text-white truncate">
                {activeRun.converter.replace('DISTRIBUIDOR', 'DISTRIB.').replace('EXTENSOR', '')}
              </div>
              <div className="font-mono text-[8px] text-sky-300/80 truncate">OPTICAL LINK</div>
            </div>

            {/* NODO 4: DESTINO */}
            <div
              onClick={() => onInspectNode('destination', activeRun.destination)}
              className="w-[102px] bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/60 rounded-xl p-2.5 shadow-lg flex-shrink-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              title="Click para ver telemetría del Destino"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-wider font-bold">DESTINO</span>
                <span className="material-symbols-outlined text-[14px] text-emerald-400">tv_gen</span>
              </div>
              <div className="font-['Space_Grotesk'] text-[11px] font-bold text-white truncate">
                {activeRun.destination}
              </div>
              <div className="font-mono text-[8.5px] text-slate-300 truncate">LED Main Wall</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
