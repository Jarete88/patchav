import React, { useState, useEffect, useRef } from 'react';

interface TestPatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalLabel?: string;
}

export const TestPatternModal: React.FC<TestPatternModalProps> = ({
  isOpen,
  onClose,
  signalLabel = 'RESO 1 ➔ VX1000',
}) => {
  const [pattern, setPattern] = useState<'smpte' | 'grid' | 'ramp' | 'solid'>('smpte');
  const [resolution, setResolution] = useState('3840x2160 @ 59.94Hz (4K UHD)');
  const [toneActive, setToneActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleTone = () => {
    if (toneActive) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {
          // ignore
        }
      }
      setToneActive(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1 kHz reference tone
        gain.gain.setValueAtTime(0.05, ctx.currentTime); // Safe low volume
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setToneActive(true);
      } catch (err) {
        console.warn('Audio Context tone not available', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
              Generador de Patrón de Prueba (TPG) • {signalLabel}
            </span>
          </div>
          <button
            onClick={() => {
              if (toneActive) toggleTone();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {pattern === 'smpte' && (
            <div className="w-full h-full flex flex-col">
              {/* Main 7 color bars */}
              <div className="flex-1 flex">
                <div className="flex-1 bg-[#c0c0c0]"></div>
                <div className="flex-1 bg-[#c0c000]"></div>
                <div className="flex-1 bg-[#00c0c0]"></div>
                <div className="flex-1 bg-[#00c000]"></div>
                <div className="flex-1 bg-[#c000c0]"></div>
                <div className="flex-1 bg-[#c00000]"></div>
                <div className="flex-1 bg-[#0000c0]"></div>
              </div>
              {/* Bottom sync stripes */}
              <div className="h-[25%] flex">
                <div className="flex-1 bg-[#0000c0]"></div>
                <div className="flex-1 bg-[#131313]"></div>
                <div className="flex-1 bg-[#c000c0]"></div>
                <div className="flex-1 bg-[#131313]"></div>
                <div className="flex-1 bg-[#00c0c0]"></div>
                <div className="flex-1 bg-[#131313]"></div>
                <div className="flex-1 bg-[#c0c0c0]"></div>
              </div>
            </div>
          )}

          {pattern === 'grid' && (
            <div className="w-full h-full bg-[#121212] relative flex items-center justify-center">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="test-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#test-grid)" />
                <circle cx="50%" cy="50%" r="120" fill="none" stroke="#a5b4fc" strokeWidth="2" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {pattern === 'ramp' && (
            <div className="w-full h-full bg-gradient-to-r from-black via-gray-500 to-white flex items-center justify-center"></div>
          )}

          {pattern === 'solid' && (
            <div className="w-full h-full bg-[#ff1744] flex items-center justify-center">
              <span className="font-mono text-[14px] text-white font-bold bg-black/60 px-3 py-1 rounded">
                RED SOLID 100%
              </span>
            </div>
          )}

          {/* OSD Telemetry Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 font-mono text-xs text-indigo-200 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {resolution}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-amber-300">10-bit YUV 4:2:2</span>
            <span className="text-white/40">|</span>
            <span className="text-sky-300">REC.709</span>
          </div>
        </div>

        {/* Pattern Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase mr-1">Patrón:</span>
              <button
                onClick={() => setPattern('smpte')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  pattern === 'smpte'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                SMPTE Bars
              </button>
              <button
                onClick={() => setPattern('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  pattern === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Raster Grid
              </button>
              <button
                onClick={() => setPattern('ramp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  pattern === 'ramp'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Color Ramp
              </button>
              <button
                onClick={() => setPattern('solid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  pattern === 'solid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Pure Red
              </button>
            </div>

            {/* Audio Tone 1kHz */}
            <button
              onClick={toggleTone}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                toneActive
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {toneActive ? 'volume_up' : 'volume_off'}
              </span>
              <span>1kHz Audio Tone {toneActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 text-xs text-slate-500">
            <span>Generador de señal estándar para comprobación de cables y EDID en tiempo real</span>
            <button
              onClick={() => {
                if (toneActive) toggleTone();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
