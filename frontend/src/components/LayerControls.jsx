import React from 'react'
import {
  Layers, AlertTriangle, Eye, Activity, ShieldCheck,
  Zap, RefreshCw, Compass, Ruler, Scan, MapPin
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

  const layers = [
    {
      id: 'CADASTRE',
      label: 'Cadastral Ownership',
      desc: 'Owner boundaries & 3D parcels',
      icon: Layers,
      color: '#00D084',
      badge: null
    },
    {
      id: 'ENCROACHMENT',
      label: 'FAR & Setback Audit',
      desc: 'Clashes & setback violations',
      icon: AlertTriangle,
      color: '#EF4444',
      badge: violationsCount > 0 ? `${violationsCount} CLASH` : null
    },
    {
      id: 'UTILITIES',
      label: 'Subsurface Utilities',
      desc: 'Metro tunnels & utility lines',
      icon: Zap,
      color: '#3B82F6',
      badge: 'B1 / B2'
    },
    {
      id: 'TAX',
      label: 'Tax & Valuation Heatmap',
      desc: 'Circle rates & revenue status',
      icon: Activity,
      color: '#F59E0B',
      badge: null
    }
  ]

  return (
    <div
      className={`w-72 rounded-3xl border shadow-2xl p-4 space-y-4 backdrop-blur-2xl transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-[#C8E6C9] text-slate-800 shadow-[0_10px_35px_rgba(27,94,32,0.12)]'
          : 'bg-[#0B131E]/95 border-[#1E293B] text-white shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Layer Controls
          </span>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
          isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/15 text-[#00D084]'
        }`}>
          LIVE 3D
        </span>
      </div>

      {/* Layer Modes List */}
      <div className="space-y-1.5">
        {layers.map((l) => {
          const Icon = l.icon
          const isSelected = viewMode === l.id

          return (
            <button
              key={l.id}
              onClick={() => onSelectViewMode(l.id)}
              className={`w-full p-2.5 rounded-2xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                isSelected
                  ? isLight
                    ? 'bg-[#E8F5E9] border-[#1B5E20] shadow-sm text-[#1B5E20]'
                    : 'bg-[#00D084]/15 border-[#00D084] text-[#00D084] shadow-[0_0_15px_rgba(0,208,132,0.2)]'
                  : isLight
                  ? 'bg-[#F9FBF9] border-transparent hover:border-[#C8E6C9] text-slate-700'
                  : 'bg-[#080E17] border-transparent hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: isSelected ? `${l.color}25` : isLight ? '#ffffff' : '#0F172A',
                    borderColor: isSelected ? l.color : isLight ? '#C8E6C9' : '#1E293B',
                    color: l.color
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono">{l.label}</div>
                  <div className="text-[10px] text-slate-500">{l.desc}</div>
                </div>
              </div>

              {l.badge && (
                <span
                  className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${l.color}20`,
                    color: l.color,
                    border: `1px solid ${l.color}40`
                  }}
                >
                  {l.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Exploded View Slider */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>3D Exploded View</span>
          <span className={isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}>
            {explodedOffset > 0 ? `+${(explodedOffset * 5).toFixed(0)}m Z` : 'OFF'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2.5"
          step="0.1"
          value={explodedOffset}
          onChange={(e) => onExplodedChange && onExplodedChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D084]"
        />
      </div>

      {/* Quick Viewport Utilities */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1.5">
        <button
          onClick={onResetCamera}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F9FBF9] border-[#C8E6C9] hover:bg-[#E8F5E9] text-[#1B5E20]'
              : 'bg-[#080E17] border-[#1E293B] hover:border-[#00D084] text-slate-300 hover:text-white'
          }`}
          title="Reset Camera Overview"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono font-bold">Reset</span>
        </button>

        <button
          onClick={onToggleMeasure}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            measureMode
              ? 'bg-amber-500/20 border-amber-500 text-amber-500'
              : isLight
              ? 'bg-[#F9FBF9] border-[#C8E6C9] text-slate-700'
              : 'bg-[#080E17] border-[#1E293B] text-slate-300'
          }`}
          title="Toggle 3D Coordinates Grid"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono font-bold">Grid</span>
        </button>

        <button
          onClick={onToggleBounds}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            showBounds
              ? isLight
                ? 'bg-[#E8F5E9] border-[#1B5E20] text-[#1B5E20]'
                : 'bg-[#00D084]/20 border-[#00D084] text-[#00D084]'
              : isLight
              ? 'bg-[#F9FBF9] border-[#C8E6C9] text-slate-500'
              : 'bg-[#080E17] border-[#1E293B] text-slate-500'
          }`}
          title="Toggle Parcel Bounds"
        >
          <Scan className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono font-bold">Bounds</span>
        </button>

        <button
          onClick={onFocusCenter}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isLight
              ? 'bg-[#F9FBF9] border-[#C8E6C9] hover:bg-[#E8F5E9] text-[#1B5E20]'
              : 'bg-[#080E17] border-[#1E293B] hover:border-[#00D084] text-slate-300 hover:text-white'
          }`}
          title="Focus GPS Center"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono font-bold">Center</span>
        </button>
      </div>
    </div>
  )
}
