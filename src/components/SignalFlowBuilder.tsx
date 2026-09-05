import React from 'react';
import {
  INPUTS_LIST,
  MIXERS_LIST,
  DESTINATIONS_LIST,
  CONVERTERS_LIST,
  CABLES_LIST,
  DISTANCES_LIST,
} from '../data/mockData';
import { CableDistance, CableProtocol, SignalRun } from '../types';

interface SignalFlowBuilderProps {
  selectedInput: string;
  selectedMixer: string;
  selectedDestination: string;
  selectedConverter: string;
  selectedCable: CableProtocol;
  selectedDistance: CableDistance;
  onSelectInput: (val: string) => void;
  onSelectMixer: (val: string) => void;
  onSelectDestination: (val: string) => void;
  onSelectConverter: (val: string) => void;
  onSelectCable: (val: CableProtocol) => void;
  onSelectDistance: (val: CableDistance) => void;
  onAddRun: () => void;
  runCount: number;
}

export const SignalFlowBuilder: React.FC<SignalFlowBuilderProps> = ({
  selectedInput,
  selectedMixer,
  selectedDestination,
  selectedConverter,
  selectedCable,
  selectedDistance,
  onSelectInput,
  onSelectMixer,
  onSelectDestination,
  onSelectConverter,
  onSelectCable,
  onSelectDistance,
  onAddRun,
  runCount,
}) => {
  // Cable protocol humanized label
  const cableMetaLabel = React.useMemo(() => {
    let name = selectedCable;
    if (selectedCable === 'FIBRA') name = 'Fibra Óptica';
    if (selectedCable === '12G-SDI') name = 'Coaxial 12G-SDI';
    const meters = selectedDistance.replace('m', ' Metros');
    return `${name} • ${meters}`;
  }, [selectedCable, selectedDistance]);

  return (
    <div className="p-5 sm:p-6 flex flex-col gap-5 bg-white rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto w-full my-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-200">
            5
          </div>
          <h3 className="font-['Space_Grotesk'] text-base font-bold text-slate-800 tracking-tight">
            Creador Rápido de Planos AV
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
          Flujo Punto a Punto
        </span>
      </div>

      {/* PASO 1: INPUTS (ORIGEN) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            PASO 1: INPUTS (ORIGEN)
          </span>
          <span className="text-xs text-slate-400 font-medium">{INPUTS_LIST.length} fuentes</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none no-scrollbar">
          {INPUTS_LIST.map((item) => {
            const isSelected = selectedInput === item.name;
            return (
              <button
                key={item.id}
                onClick={() => onSelectInput(item.name)}
                className={`px-3.5 py-2 rounded-lg font-['Space_Grotesk'] text-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-2 border-amber-500 text-amber-900 font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 2: MEZCLADORES */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-indigo-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            PASO 2: MEZCLADORES
          </span>
          <span className="text-xs text-slate-400 font-medium">Procesador Core</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MIXERS_LIST.map((mixer) => {
            const isSelected = selectedMixer === mixer.name;
            return (
              <button
                key={mixer.id}
                onClick={() => onSelectMixer(mixer.name)}
                className={`py-2 px-2.5 rounded-lg font-['Space_Grotesk'] text-xs text-center active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 font-bold shadow-sm shadow-indigo-100'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium'
                }`}
              >
                {mixer.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 3: DESTINOS (OUTPUT) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-blue-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            PASO 3: DESTINOS (OUTPUT)
          </span>
          <span className="text-xs text-slate-400 font-medium">Salida / Pantallas</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none no-scrollbar">
          {DESTINATIONS_LIST.map((dest) => {
            const isSelected = selectedDestination === dest.name;
            return (
              <button
                key={dest.id}
                onClick={() => onSelectDestination(dest.name)}
                className={`px-3.5 py-2 rounded-lg font-['Space_Grotesk'] text-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium'
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 4: CONVERSORES / ADAPTADORES */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-sky-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            PASO 4: CONVERSORES / ADAPTADORES
          </span>
          <span className="text-xs text-slate-400 font-medium">Conversión & DA</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CONVERTERS_LIST.map((conv) => {
            const isSelected = selectedConverter === conv.name;
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConverter(conv.name)}
                className={`py-2 px-3 rounded-lg font-['Space_Grotesk'] text-xs text-left truncate active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 border-2 border-sky-600 text-sky-950 font-bold shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium'
                }`}
                title={conv.desc}
              >
                {conv.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 5: CABLE Y METRAJE */}
      <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-indigo-700 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            PASO 5: CABLE Y METRAJE
          </span>
          <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-xs">
            {cableMetaLabel}
          </span>
        </div>

        {/* Cable Types */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CABLES_LIST.map((cable) => {
            const isSelected = selectedCable === cable;
            return (
              <button
                key={cable}
                onClick={() => onSelectCable(cable)}
                className={`py-2 px-3 rounded-lg font-mono text-xs font-bold text-center border active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 font-semibold'
                }`}
              >
                {cable}
              </button>
            );
          })}
        </div>

        {/* Distances */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pt-1 no-scrollbar">
          {DISTANCES_LIST.map((dist) => {
            const isSelected = selectedDistance === dist;
            return (
              <button
                key={dist}
                onClick={() => onSelectDistance(dist)}
                className={`flex-1 min-w-[42px] py-1.5 px-2 rounded-lg font-mono text-xs text-center active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold'
                }`}
              >
                {dist}
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRA RESUMEN Y ACCION */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 gap-2">
          <div className="flex items-center gap-2 min-w-0 text-xs font-mono overflow-x-auto no-scrollbar">
            <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold truncate">
              {selectedInput}
            </span>
            <span className="text-slate-400 font-bold">➔</span>
            <span className="text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-bold truncate">
              {selectedMixer}
            </span>
            <span className="text-slate-400 font-bold">➔</span>
            <span className="text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 font-bold truncate">
              {selectedConverter}
            </span>
            <span className="text-slate-400 font-bold">➔</span>
            <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold truncate">
              {selectedDestination}
            </span>
          </div>
          <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-bold flex-shrink-0 uppercase">
            {selectedDistance} {selectedCable}
          </span>
        </div>

        <button
          onClick={onAddRun}
          className="w-full py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 active:scale-95 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Añadir Tirada al Plano de Señal</span>
        </button>
      </div>
    </div>
  );
};
