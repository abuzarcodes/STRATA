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
  onApplySplit
}) {
  const [splitRatio, setSplitRatio] = useState(50)
  const [childAOwner, setChildAOwner] = useState(unit?.owner || 'Owner A')
  const [childBOwner, setChildBOwner] = useState('Anand Verma (Purchaser)')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [splitSuccess, setSplitSuccess] = useState(false)

  if (!unit) return null

  const parentVolume = unit.volume_m3
  const parentCarpetArea = unit.carpet_area_m2

  const childAVolume = roundVal((parentVolume * splitRatio) / 100)
  const childBVolume = roundVal(parentVolume - childAVolume)

  const childAArea = roundVal((parentCarpetArea * splitRatio) / 100)
  const childBArea = roundVal(parentCarpetArea - childAArea)

  const childA_ULPIN = `${unit.ulpin_3d}-S01`
  const childB_ULPIN = `${unit.ulpin_3d}-S02`

  function roundVal(v) {
    return Math.round(v * 10) / 10
  }

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
            name: `${unit.name} (Unit A)`,
            owner: childAOwner,
            carpet_area_m2: childAArea,
            volume_m3: childAVolume,
            level: unit.level,
            domain: unit.domain,
            type: unit.type,
            z_min: unit.z_min,
            z_max: unit.z_max,
            color: '#38bdf8'
          },
          childB: {
            unit_id: `${unit.unit_id}B`,
            ulpin_3d: childB_ULPIN,
            name: `${unit.name} (Unit B)`,
            owner: childBOwner,
            carpet_area_m2: childBArea,
            volume_m3: childBVolume,
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel-accent rounded-3xl p-6 shadow-2xl border border-amber-500/30 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Cadastral Edge Case Engine
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Volumetric 3D Parcel Subdivision (Split)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!splitSuccess ? (
          <div className="space-y-4 my-4">
            {/* Parent Unit Specs */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Parent 3D-ULPIN:</span>
                <div className="font-mono font-bold text-sky-300 text-sm">{unit.ulpin_3d}</div>
                <div className="text-slate-300 font-semibold mt-0.5">{unit.name} ({unit.owner})</div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Original Volume:</span>
                <div className="font-mono font-bold text-emerald-400 text-sm">{parentVolume} m³</div>
                <div className="text-slate-400 font-mono text-[11px]">{parentCarpetArea} m² Carpet Area</div>
              </div>
            </div>

            {/* Split Ratio Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label htmlFor="split-ratio-slider" className="text-slate-300 cursor-pointer">
                  Subdivision Ratio:
                </label>
                <span className="font-mono text-amber-400">{splitRatio}% / {100 - splitRatio}%</span>
              </div>
              <input
                id="split-ratio-slider"
                name="splitRatio"
                type="range"
                min="20"
                max="80"
                step="5"
                aria-label="3D Subdivision Volume Ratio"
                value={splitRatio}
                onChange={(e) => setSplitRatio(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Unit A: {childAVolume} m³</span>
                <span>Conservation Law: V(A) + V(B) = {parentVolume} m³</span>
                <span>Unit B: {childBVolume} m³</span>
              </div>
            </div>

            {/* Two Child Proposed ULPIN Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Child Unit A */}
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400 text-xs">Child Unit 1 (A)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    {splitRatio}%
                  </span>
                </div>
                <div className="font-mono font-bold text-slate-200 text-[11px] truncate">
                  {childA_ULPIN}
                </div>
                <div className="space-y-1">
                  <label htmlFor="child-a-owner-input" className="text-[10px] text-slate-400">Assigned Owner:</label>
                  <input
                    id="child-a-owner-input"
                    name="childAOwner"
                    type="text"
                    aria-label="Assigned Owner for Child Unit A"
                    value={childAOwner}
                    onChange={(e) => setChildAOwner(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Volume: <strong className="text-sky-300">{childAVolume} m³</strong> | Area: <strong>{childAArea} m²</strong>
                </div>
              </div>

              {/* Child Unit B */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 text-xs">Child Unit 2 (B)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {100 - splitRatio}%
                  </span>
                </div>
                <div className="font-mono font-bold text-slate-200 text-[11px] truncate">
                  {childB_ULPIN}
                </div>
                <div className="space-y-1">
                  <label htmlFor="child-b-owner-input" className="text-[10px] text-slate-400">Assigned Owner:</label>
                  <input
                    id="child-b-owner-input"
                    name="childBOwner"
                    type="text"
                    aria-label="Assigned Owner for Child Unit B"
                    value={childBOwner}
                    onChange={(e) => setChildBOwner(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Volume: <strong className="text-purple-300">{childBVolume} m³</strong> | Area: <strong>{childBArea} m²</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                3D Cadastral Subdivision Sanctioned & Minted!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Parent parcel <strong>{unit.ulpin_3d}</strong> has been archived. Two new child 3D-ULPINs have been cryptographically signed and registered in Bhu-Aadhaar 3D.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Return to 3D Map
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {!splitSuccess && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleExecuteSplit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Computing 3D Mesh Partition...' : 'Execute 3D Subdivision'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
