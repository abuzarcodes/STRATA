import React from 'react'
import {
  Layers,
  Sliders,
  Eye,
  AlertTriangle,
  Compass,
  Box,
  MapPin,
  Flame,
  ArrowDownCircle,
  Video,
  Sun,
  Moon,
  ChevronsUp
} from 'lucide-react'

const FLOORS = [
  { id: 'ALL', label: 'All Levels', desc: 'Full Volumetric Model' },
  { id: 5, label: 'Terrace (R)', desc: '+15.2m to +17.5m (Solar/Utility)' },
  { id: 4, label: 'Floor 4', desc: '+12.2m to +15.0m (Penthouse)' },
  { id: 3, label: 'Floor 3', desc: '+9.2m to +12.0m (Flats 301-304)' },
  { id: 2, label: 'Floor 2 (⚠️)', desc: '+6.2m to +9.0m (Balcony Violation)' },
  { id: 1, label: 'Floor 1', desc: '+3.2m to +6.0m (Flats 101-104)' },
  { id: 0, label: 'Ground', desc: '+0.2m to +3.0m (Lobby & Amenities)' },
  { id: -1, label: 'Basement (⚠️)', desc: '-3.5m to -0.2m (Parking & Substation)' }
]

export default function LayerControls({
  activeFloor,
  onSelectFloor,
  viewMode,
  onSelectViewMode,
  cameraPreset,
  onSelectCameraPreset,
  violationsCount,
  explodedOffset,
  onExplodedOffsetChange,
  theme,
  onToggleTheme
}) {
  return (
    <div className="absolute left-6 bottom-6 z-20 flex flex-col gap-3 max-w-xs animate-in fade-in slide-in-from-left duration-300">
      {/* 1. Floor Slicer / Isolation Panel */}
      <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Vertical Floor Slicer</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-sky-400 border border-slate-700">
            {activeFloor === 'ALL' ? '3D Full' : `Level ${activeFloor}`}
          </span>
        </div>

        {/* Floor Buttons Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {FLOORS.map((fl) => {
            const isSelected = activeFloor === fl.id
            const isViolationFloor = fl.id === 2 || fl.id === -1

            return (
              <button
                key={fl.id}
                onClick={() => onSelectFloor(fl.id)}
                className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-all flex flex-col justify-center border ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20'
                    : isViolationFloor
                    ? 'bg-slate-900/90 text-slate-200 border-red-900/30 hover:border-red-500/50 hover:bg-red-950/20'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{fl.label}</span>
                  {isViolationFloor && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  )}
                </div>
                <span className={`text-[10px] truncate ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                  {fl.desc.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>

        {/* 3D Exploded View Slider */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <ChevronsUp className="w-3.5 h-3.5" />
              <span>Exploded 3D Stack:</span>
            </span>
            <span className="font-mono text-indigo-300">
              {explodedOffset > 0 ? `+${(explodedOffset * 3).toFixed(1)}m` : 'Compact'}
            </span>
          </div>
          <input
            id="exploded-view-slider"
            name="explodedViewSlider"
            type="range"
            min="0"
            max="2.5"
            step="0.1"
            aria-label="Exploded 3D Floor Stack Slider"
            value={explodedOffset}
            onChange={(e) => onExplodedOffsetChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>
      </div>

      {/* 2. Visual Layer & Rendering Modes */}
      <div className="glass-panel rounded-2xl p-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-1">
        <button
          onClick={() => onSelectViewMode('CADASTRE')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
            viewMode === 'CADASTRE'
              ? 'bg-slate-800 text-sky-400 border border-sky-500/30 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
          title="Cadastral Ownership Color Mapping"
        >
          <Box className="w-4 h-4" />
          <span className="text-[10px]">Cadastre</span>
        </button>

        <button
          onClick={() => onSelectViewMode('XRAY')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
            viewMode === 'XRAY'
              ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
          title="Transparent Structural Wireframe"
        >
          <Eye className="w-4 h-4" />
          <span className="text-[10px]">X-Ray</span>
        </button>

        <button
          onClick={() => onSelectViewMode('ENCROACHMENT')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all relative ${
            viewMode === 'ENCROACHMENT'
              ? 'bg-red-950 text-red-300 border border-red-500/50 shadow-inner encroachment-glow'
              : 'text-slate-400 hover:text-red-400 hover:bg-red-950/20'
          }`}
          title="Highlight Encroachments & Violations in Pulsing Red"
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-[10px] text-red-400 font-bold">Audit Alert</span>
          {violationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {violationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle (Cyber / Daylight) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all ml-1 border border-slate-800"
          title={`Switch to ${theme === 'CYBER' ? 'Daylight Architectural' : 'Cyber Dark'} Mode`}
        >
          {theme === 'CYBER' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>
      </div>

      {/* 3. Camera Quick-Snap Angle Bar */}
      <div className="glass-panel rounded-2xl px-3 py-2 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Video className="w-3 h-3 text-sky-400" /> Cam:
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectCameraPreset('OVERVIEW')}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
              cameraPreset === 'OVERVIEW'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'hover:text-slate-200'
            }`}
          >
            3D Orbit
          </button>
          <button
            onClick={() => onSelectCameraPreset('TOPDOWN')}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
              cameraPreset === 'TOPDOWN'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'hover:text-slate-200'
            }`}
          >
            2D Map
          </button>
          <button
            onClick={() => onSelectCameraPreset('UNDERGROUND')}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
              cameraPreset === 'UNDERGROUND'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'hover:text-slate-200'
            }`}
          >
            Basement
          </button>
          <button
            onClick={() => {
              onSelectCameraPreset('ENCROACHMENT')
              onSelectViewMode('ENCROACHMENT')
            }}
            className={`px-2 py-1 rounded-md text-[11px] font-bold text-red-400 transition-all ${
              cameraPreset === 'ENCROACHMENT'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'hover:text-red-300'
            }`}
          >
            Violation
          </button>
        </div>
      </div>
    </div>
  )
}
