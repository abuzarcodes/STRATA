import React, { useState } from 'react'
import {
  Layers, AlertTriangle, Eye, Activity, ShieldCheck,
  Zap, RefreshCw, Compass, Ruler, Scan, MapPin, ChevronRight, ChevronLeft
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
  const [isCollapsed, setIsCollapsed] = useState(false)
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
      id: 'LIDAR',
      label: 'LiDAR Cloud (LAS/LAZ)',
      desc: '157.1M point cloud survey layer',
      icon: Scan,
      color: '#38bdf8',
      badge: 'points.laz'
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

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className={`pointer-events-auto px-4 py-2.5 rounded-2xl border shadow-2xl flex items-center gap-2.5 font-mono text-xs font-bold transition-all duration-300 cursor-pointer ${
          isLight
            ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-slate-50 shadow-md'
            : 'bg-[#071216] border-[var(--color-border-default)] text-white hover:border-[var(--color-accent-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
        }`}
        title="Open Layer Controls"
      >
        <ChevronLeft className="w-4 h-4 text-slate-400" />
        <Layers className="w-4 h-4 text-[var(--color-accent-primary)]" />
        <span>Layers & GIS Modes</span>
      </button>
    )
  }

  return (
    <div
      className="theme-surface relative w-72 rounded-3xl border shadow-2xl p-4 space-y-4 backdrop-blur-2xl transition-all duration-300 pointer-events-auto"
    >
      {/* Header & Collapse Toggle */}
      <div className="theme-divider flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 theme-accent" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Layer Controls
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
            isLight
              ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-slate-600 hover:text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-400 hover:text-white'
          }`}
          title="Hide Layer Controls"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
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
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${l.color}15`,
                    borderColor: `${l.color}40`,
                    color: l.color
                  }}
                >
                  {l.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Camera & Measurement Controls */}
      <div className="pt-2 border-t border-[var(--color-border-default)] space-y-2">
        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          Spatial Tools
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onResetCamera}
            className="p-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-2)] text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-[var(--color-surface-muted)] cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
            <span>Reset View</span>
          </button>

          <button
            onClick={onToggleMeasure}
            className={`p-2 rounded-xl border text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              measureMode
                ? 'bg-[var(--color-accent-primary)] text-slate-950 border-[var(--color-accent-primary)]'
                : 'border-[var(--color-border-default)] bg-[var(--color-surface-2)] text-slate-300 hover:bg-[var(--color-surface-muted)]'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Measure Grid</span>
          </button>
        </div>
      </div>
    </div>
  )
}
