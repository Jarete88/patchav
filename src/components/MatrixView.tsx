import React, { useState } from 'react';
import { INPUTS_LIST, DESTINATIONS_LIST } from '../data/mockData';

interface MatrixViewProps {
  onOpenTestPattern: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ onOpenTestPattern }) => {
  // Use a subset of primary inputs and outputs for ergonomic cross-point matrix
  const matrixInputs = INPUTS_LIST.slice(0, 8);
  const matrixOutputs = DESTINATIONS_LIST.slice(0, 6);

  // Active crosspoints map: `${input.id}_${output.id}` => boolean
  const [crossPoints, setCrossPoints] = useState<Record<string, boolean>>({
    'reso_1_vx1000': true,
    'ppt_proy_20k': true,
    'ursa_mon_28': true,
    'timer_pant_apoyo': true,
  });

  const [isLocked, setIsLocked] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ inName: string; outName: string; key: string } | null>({
    inName: 'RESO 1',
    outName: 'VX1000',
    key: 'reso_1_vx1000',
  });

  const toggleCrossPoint = (inId: string, outId: string, inName: string, outName: string) => {
    if (isLocked) return;
    const key = `${inId}_${outId}`;
    setCrossPoints((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSelectedCell({ inName, outName, key });
  };

  const clearMatrix = () => {
    if (isLocked) return;
    setCrossPoints({});
  };

  const presetAllToLED = () => {
    if (isLocked) return;
    setCrossPoints({
      'reso_1_vx1000': true,
      'reso_2_vx1000': true,
      'vmix_sd600': true,
      'ppt_vx4s': true,
    });
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-slate-800 uppercase tracking-tight">
              Matriz de Conmutación Cruzada (Crosspoint)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enrutamiento punto a punto I/O • Latencia ultrabaja &lt;1 frame
            </p>
          </div>
        </div>

        {/* Matrix Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isLocked
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Bloquear/desbloquear modificaciones en matriz"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isLocked ? 'lock' : 'lock_open'}
            </span>
            <span>{isLocked ? 'BLOQUEADO' : 'MASTER LOCK'}</span>
          </button>

          <button
            onClick={presetAllToLED}
            disabled={isLocked}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Preset LED
          </button>

          <button
            onClick={clearMatrix}
            disabled={isLocked}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:opacity-40 border border-rose-200 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Mute All
          </button>
        </div>
      </div>

      {/* Cross-point Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto select-none shadow-md">
        <div className="min-w-[620px]">
          {/* Column Headers (Inputs) */}
          <div className="grid grid-cols-[140px_repeat(8,1fr)] gap-1.5 mb-2 items-end">
            <div className="font-mono text-[10px] text-slate-400 font-bold p-1 uppercase tracking-wider">
              OUTPUTS \ INPUTS
            </div>
            {matrixInputs.map((input) => (
              <div
                key={input.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center flex flex-col items-center justify-center min-w-[52px]"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-400">{input.icon}</span>
                <span className="font-mono text-[9px] font-bold text-white truncate w-full mt-0.5">
                  {input.name}
                </span>
                <span className="font-mono text-[7.5px] text-slate-400 truncate">
                  {input.defaultProtocol.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Rows (Outputs) */}
          <div className="flex flex-col gap-1.5">
            {matrixOutputs.map((output) => (
              <div key={output.id} className="grid grid-cols-[140px_repeat(8,1fr)] gap-1.5 items-center">
                {/* Output Row Label */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="font-['Space_Grotesk'] text-[11px] font-bold text-white truncate">
                      {output.name}
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-indigo-400">tv_gen</span>
                  </div>
                  <span className="font-mono text-[8.5px] text-slate-400 truncate">{output.subtext}</span>
                </div>

                {/* Crosspoint buttons */}
                {matrixInputs.map((input) => {
                  const key = `${input.id}_${output.id}`;
                  const isConnected = !!crossPoints[key];
                  const isSelected = selectedCell?.key === key;

                  return (
                    <button
                      key={key}
                      onClick={() => toggleCrossPoint(input.id, output.id, input.name, output.name)}
                      className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                        isConnected
                          ? 'bg-indigo-950/80 border-2 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                          : 'bg-slate-900 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                      } ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}
                      title={`${input.name} ➔ ${output.name}`}
                    >
                      {isConnected ? (
                        <div className="flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm animate-pulse"></span>
                          <span className="font-mono text-[7.5px] text-indigo-200 font-bold mt-0.5">ON</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[12px] font-mono leading-none">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inspector / Status Card */}
      {selectedCell && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 rounded-full bg-indigo-600"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedCell.inName}
                </span>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="font-mono text-xs text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedCell.outName}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    crossPoints[selectedCell.key]
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {crossPoints[selectedCell.key] ? 'ACTIVO (ON AIR)' : 'DESCONECTADO'}
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-500 mt-1">
                EDID: 3840x2160 @ 59.94Hz • Color Space: RGB 4:4:4 10-bit • HDCP 2.2 Compliant
              </p>
            </div>
          </div>

          <button
            onClick={onOpenTestPattern}
            className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors self-end sm:self-auto"
          >
            <span className="material-symbols-outlined text-[17px]">tv</span>
            <span>Test Pattern</span>
          </button>
        </div>
      )}
    </div>
  );
};
