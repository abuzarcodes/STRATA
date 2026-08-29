import React from 'react'
import {
  Layers,
  AlertTriangle,
  Flame,
  ArrowDownCircle,
  Compass,
  MapPin,
  Ruler,
  Maximize2,
  Scan
} from 'lucide-react'

export default function LayerControls({
  viewMode,
  onSelectViewMode,
  violationsCount = 0,
  onResetCamera,
  onToggleExploded,
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
      {/* 4 Core View Mode Switchers matching Figma Frame 11:171 */}
      <div className={`w-56 border rounded-2xl p-2 shadow-2xl backdrop-blur-xl space-y-1.5 ${
        isLight
          ? 'bg-white/95 border-[#C8E6C9]'
          : 'bg-[#0B131E]/95 border-[#1E293B]'
      }`}>
        {modes.map((mode) => {
          const isActive = viewMode === mode.id
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              onClick={() => onSelectViewMode(mode.id)}
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
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px] font-mono font-bold">
                  {mode.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Floating Action Icons matching Figma Frame 11:171 */}
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
          title="Reset Camera View"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button onClick={() => alert("Feature not yet implemented")}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Measure 3D Distances"
        >
          <Ruler className="w-4 h-4" />
        </button>
        <button onClick={() => alert("Feature not yet implemented")}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Toggle Parcel Bounds"
        >
          <Scan className="w-4 h-4" />
        </button>
        <button onClick={() => alert("Feature not yet implemented")}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] text-slate-600 hover:text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-400 hover:text-[#00D084]'
          }`}
          title="Focus GPS Center"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
