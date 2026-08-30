import React, { useState } from 'react'
import {
  Scissors,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  FileCheck
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ParcelSplitModal({
  unit,
  onClose,
  onApplySplit,
  theme = 'CYBER'
}) {
  const [splitRatio, setSplitRatio] = useState(50)
  const [childAOwner, setChildAOwner] = useState(unit?.owner || 'Owner A')
  const [childBOwner, setChildBOwner] = useState('Anand Verma (Purchaser)')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [splitSuccess, setSplitSuccess] = useState(false)

  const isLight = theme === 'LIGHT'

  if (!unit) return null

  const parentVolume = unit.volume_m3 || 226.8
  const parentCarpetArea = unit.carpet_area_m2 || 81.0

  function roundVal(v) {
    return Math.round(v * 10) / 10
  }

  const childAVolume = roundVal((parentVolume * splitRatio) / 100)
  const childBVolume = roundVal(parentVolume - childAVolume)

  const childAArea = roundVal((parentCarpetArea * splitRatio) / 100)
  const childBArea = roundVal(parentCarpetArea - childAArea)

  const childA_ULPIN = `${unit.ulpin_3d}-S01`
  const childB_ULPIN = `${unit.ulpin_3d}-S02`

  const handleExecuteSplit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSplitSuccess(true)
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })

      // Notify parent app
      if (onApplySplit) {
        onApplySplit({
          parentUnitId: unit.unit_id,
          childA: {
            unit_id: `${unit.unit_id}A`,
            ulpin_3d: childA_ULPIN,
            name: `${unit.name} (Sub-Unit 1)`,
            owner: childAOwner,
            volume_m3: childAVolume,
            carpet_area_m2: childAArea,
            is_watertight: true,
            level: unit.level,
            domain: unit.domain,
            type: unit.type,
            z_min: unit.z_min,
            z_max: unit.z_max,
            color: '#3b82f6'
          },
          childB: {
            unit_id: `${unit.unit_id}B`,
            ulpin_3d: childB_ULPIN,
            name: `${unit.name} (Sub-Unit 2)`,
            owner: childBOwner,
            volume_m3: childBVolume,
            carpet_area_m2: childBArea,
            is_watertight: true,
            level: unit.level,
            domain: unit.domain,
            type: unit.type,
            z_min: unit.z_min,
            z_max: unit.z_max,
            color: '#a855f7'
          }
        })
      }
    }, 1000)
  }

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200 ${
      isLight ? 'bg-[var(--color-surface-muted)]/80' : 'bg-slate-950/80'
    }`}>
      <div className={`w-full max-w-2xl rounded-3xl p-6 shadow-2xl border flex flex-col justify-between transition-all ${
        isLight
          ? 'bg-white border-[var(--color-border-default)] text-slate-800'
          : 'bg-[var(--color-surface-1)] border-amber-500/30 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-[var(--color-border-default)]' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Cadastral Spatial Engine
              </div>
              <h2 className={`text-xl font-extrabold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Volumetric 3D Parcel Subdivision (Split)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!splitSuccess ? (
          <div className="space-y-4 my-4">
            {/* Parent Unit Specs */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div>
                <span className="text-slate-400 font-mono text-[11px]">Parent 3D-ULPIN:</span>
                <div className={`font-mono font-bold text-sm ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>{unit.ulpin_3d}</div>
                <div className="font-semibold text-slate-500">{unit.name} ({parentVolume} m³ / {parentCarpetArea} m²)</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/40">
                SUBDIVISION PENDING
              </span>
            </div>

            {/* Split Slider */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                  Subdivision Volume Ratio (X-Axis Geometric Plane):
                </span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {splitRatio}% / {100 - splitRatio}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={splitRatio}
                onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Sub-Unit A: {childAVolume} m³ ({childAArea} m²)</span>
                <span>Sub-Unit B: {childBVolume} m³ ({childBArea} m²)</span>
              </div>
            </div>

            {/* Sub-Unit Details Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Child A */}
              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-sky-50/50 border-sky-200' : 'bg-sky-950/20 border-sky-500/30'
              }`}>
                <span className="font-mono text-[10px] font-bold text-sky-400 uppercase">Child Parcel A (Retained)</span>
                <div className="font-mono font-bold text-xs text-sky-300 truncate">{childA_ULPIN}</div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500">Assign Owner:</label>
                  <input
                    type="text"
                    value={childAOwner}
                    onChange={(e) => setChildAOwner(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                      isLight ? 'bg-white border-sky-300 text-slate-800' : 'bg-slate-900 border-sky-500/40 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Child B */}
              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-950/20 border-purple-500/30'
              }`}>
                <span className="font-mono text-[10px] font-bold text-purple-400 uppercase">Child Parcel B (New Title)</span>
                <div className="font-mono font-bold text-xs text-purple-300 truncate">{childB_ULPIN}</div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500">Assign Owner:</label>
                  <input
                    type="text"
                    value={childBOwner}
                    onChange={(e) => setChildBOwner(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${
                      isLight ? 'bg-white border-purple-300 text-slate-800' : 'bg-slate-900 border-purple-500/40 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                onClick={handleExecuteSplit}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-[var(--color-bg-app)] shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scissors className="w-4 h-4" />
                <span>{isSubmitting ? 'MINTING CHILD 3D-ULPINS...' : 'CONFIRM 3D PARCEL SUBDIVISION'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="my-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)]/20 border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              3D Parcel Subdivided Successfully
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Parent unit <strong>{unit.name}</strong> has been subdivided into two valid, watertight 3D parcels with distinct cryptographic 3D-ULPIN tokens.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}
              >
                INSPECT NEW PARCELS IN 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
