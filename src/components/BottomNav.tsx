import React from 'react';

export type NavTab = 'proyectos' | 'matriz' | 'tiradas' | 'carga-bom';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  runsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  runsCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom,0px)] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-3">
        {/* Proyectos */}
        <button
          onClick={() => onSelectTab('proyectos')}
          className={`flex flex-col items-center justify-center min-w-[70px] h-12 rounded-xl transition-all px-2 cursor-pointer ${
            activeTab === 'proyectos'
              ? 'text-indigo-600 bg-indigo-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="font-['Space_Grotesk'] text-[11px] mt-0.5 tracking-tight font-medium">Proyectos</span>
        </button>

        {/* Matriz */}
        <button
          onClick={() => onSelectTab('matriz')}
          className={`flex flex-col items-center justify-center min-w-[70px] h-12 rounded-xl transition-all px-2 cursor-pointer relative ${
            activeTab === 'matriz'
              ? 'text-indigo-600 bg-indigo-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">hub</span>
          <span className="font-['Space_Grotesk'] text-[11px] mt-0.5 tracking-tight font-medium">Matriz</span>
        </button>

        {/* Tiradas (Active) */}
        <button
          onClick={() => onSelectTab('tiradas')}
          className={`flex flex-col items-center justify-center min-w-[70px] h-12 rounded-xl transition-all px-2 cursor-pointer relative ${
            activeTab === 'tiradas'
              ? 'text-indigo-600 bg-indigo-50 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {runsCount > 0 && (
            <span className="absolute top-1.5 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white font-mono font-bold text-[9px] flex items-center justify-center shadow-xs">
              {runsCount}
            </span>
          )}
          <span className="material-symbols-outlined text-[20px]">cable</span>
          <span className="font-['Space_Grotesk'] text-[11px] mt-0.5 tracking-tight font-medium">Tiradas</span>
        </button>

        {/* Carga / BOM */}
        <button
          onClick={() => onSelectTab('carga-bom')}
          className={`flex flex-col items-center justify-center min-w-[70px] h-12 rounded-xl transition-all px-2 cursor-pointer ${
            activeTab === 'carga-bom'
              ? 'text-indigo-600 bg-indigo-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          <span className="font-['Space_Grotesk'] text-[11px] mt-0.5 tracking-tight font-medium">Carga / BOM</span>
        </button>
      </div>
    </nav>
  );
};
