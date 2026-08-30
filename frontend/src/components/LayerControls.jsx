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
      color: 'var(--color-accent-primary)',
      badge: null
    },
    {
      id: 'ENCROACHMENT',
      label: 'FAR & Setback Audit',
      desc: 'Clashes & setback violations',
      icon: AlertTriangle,
      color: 'var(--color-status-danger)',
      badge: violationsCount > 0 ? `${violationsCount} CLASH` : null
    },
    {
      id: 'UTILITIES',
      label: 'Subsurface Utilities',
      desc: 'Metro tunnels & utility lines',
      icon: Zap,
      color: 'var(--color-status-info)',
      badge: 'B1 / B2'
    },
    {
      id: 'TAX',
      label: 'Tax & Valuation Heatmap',
      desc: 'Circle rates & revenue status',
      icon: Activity,
      color: 'var(--color-status-warning)',
      badge: null
    }
  ]

  return (
    <div
      className="theme-surface w-72 rounded-3xl border shadow-2xl p-4 space-y-4 backdrop-blur-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="theme-divider flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 theme-accent" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Layer Controls
          </span>
        </div>
        <span className="theme-accent-surface text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
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
              className={`w-full p-2.5 rounded-2xl text-left transition-all border flex items-center justify-between cursor-pointer ${isSelected ? 'theme-accent-surface shadow-[0_0_15px_rgba(0,208,132,0.16)]' : 'theme-surface-secondary theme-text-secondary theme-hover-surface'}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: isSelected ? 'color-mix(in srgb, var(--color-accent-primary) 14%, transparent)' : 'var(--color-surface-1)',
                    borderColor: isSelected ? 'var(--color-accent-primary)' : 'var(--color-border-default)',
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
                    backgroundColor: `color-mix(in srgb, ${l.color} 14%, transparent)`,
                    color: l.color,
                    border: `1px solid color-mix(in srgb, ${l.color} 32%, transparent)`
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
      <div className="theme-divider pt-2 border-t">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1.5">
          <span className="theme-text-secondary">3D Exploded View</span>
          <span className="theme-accent">
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
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-primary)]"
        />
      </div>

      {/* Quick Viewport Utilities */}
      <div className="theme-divider pt-2 border-t grid grid-cols-4 gap-1.5">
        <button
          onClick={onResetCamera}
          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            isLight
              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] hover:border-[var(--color-accent-primary)] text-slate-300 hover:text-white'
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
              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-700'
              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-300'
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
                ? 'bg-[var(--color-surface-muted)] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                : 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
              : isLight
              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-500'
              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-500'
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
              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] hover:border-[var(--color-accent-primary)] text-slate-300 hover:text-white'
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
