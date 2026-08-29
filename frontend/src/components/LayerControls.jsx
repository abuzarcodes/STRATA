import React from 'react'
import {
  Layers,
  AlertTriangle,
  Flame,
  ArrowDownCircle,
  Compass,
  MapPin,
  Ruler,
  Scan,
  Maximize2,
  Sliders
} from 'lucide-react'

export default function LayerControls({
  viewMode = 'CADASTRE',
  onSelectViewMode,
  violationsCount = 0,
  onResetCamera,
  onToggleBounds,
  onToggleMeasure,
  onFocusCenter,
  showBounds = true,
  measureMode = false,
  explodedOffset = 0,
  onExplodedChange,
  theme = 'CYBER'
}) {
  const isLight = theme === 'LIGHT'

  const modes = [
    {
      id: 'CADASTRE',
      label: 'Cadastral Ownership',
      icon: Layers,
      color: isLight ? '#1B5E20' : '#00D084',
    },
    {
      id: 'ENCROACHMENT',
      label: 'FAR/Encroachment',
      icon: AlertTriangle,
      color: '#F43F5E',
      badge: violationsCount > 0 ? `${violationsCount}` : null
    },
    {
      id: 'SUBSURFACE',
      label: 'Subsurface Utilities',
      icon: ArrowDownCircle,
      color: '#10B981',
    },
    {
      id: 'TAXATION',
      label: 'Tax Valuation',
      icon: Flame,
      color: '#F59E0B',
    },
  ]

  return (
    <div className="flex flex-col items-end gap-3 pointer-events-auto transition-colors duration-300">
      {/* 4 Core View Mode Switchers */}
      <div className={`w-56 border rounded-2xl p-2 shadow-2xl backdrop-blur-xl space-y-1.5 ${
        isLight
          ? 'bg-white/95 border-[#C8E6C9]'
          : 'bg-[#0B131E]/95 border-[#1E293B]'
      }`}>
        <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
          <span>Cadastre View Layers</span>
        </div>

        {modes.map((mode) => {
          const isActive = viewMode === mode.id
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => onSelectViewMode && onSelectViewMode(mode.id)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                isActive
                  ? isLight
                    ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#1B5E20] shadow-[0_0_12px_rgba(27,94,32,0.15)]'
                    : 'bg-[#00D084]/15 text-[#00D084] border-[#00D084] shadow-[0_0_15px_rgba(0,208,132,0.2)]'
                  : isLight
                    ? 'bg-[#F1F8E9] text-slate-700 border-transparent hover:border-[#C8E6C9] hover:bg-white'
                    : 'bg-[#0F172A]/70 text-slate-300 border-transparent hover:border-[#1E293B] hover:bg-[#131F37]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? (isLight ? '#1B5E20' : '#00D084') : (isLight ? '#66BB6A' : '#94A3B8') }}
                />
                <span>{mode.label}</span>
              </div>
              {mode.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse">
                  {mode.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* Exploded 3D Vertical Slider */}
        {onExplodedChange && (
          <div className={`p-2.5 rounded-xl border mt-2 space-y-1.5 ${isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'}`}>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#00D084]" />
                <span>Explode 3D:</span>
              </span>
              <span className="font-bold text-[#00D084]">{explodedOffset.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.1"
              value={explodedOffset}
              onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#00D084]"
            />
          </div>
        )}
      </div>

      {/* Floating Action Utility Icons */}
      <div className={`flex flex-col gap-1.5 p-1.5 rounded-xl border shadow-xl backdrop-blur-xl ${
        isLight
          ? 'bg-white/95 border-[#C8E6C9]'
          : 'bg-[#0B131E]/95 border-[#1E293B]'
      }`}>
        <button
          onClick={onResetCamera}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Reset Camera View (Overview)"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMeasure}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            measureMode
              ? 'bg-amber-500 text-[#080E17] shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              : isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Toggle 3D Coordinate Grid Guide"
        >
          <Ruler className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleBounds}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            showBounds
              ? isLight
                ? 'bg-[#E8F5E9] text-[#1B5E20]'
                : 'bg-[#00D084]/20 text-[#00D084]'
              : isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Toggle Cadastral Parcel Bounds"
        >
          <Scan className="w-4 h-4" />
        </button>

        <button
          onClick={onFocusCenter}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Focus GPS Anchor Datum"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
