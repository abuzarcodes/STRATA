import React, { useState } from 'react'
import {
  X, Copy, Check, Download, QrCode, ShieldCheck,
  Scissors, ArrowRightLeft, CheckCircle2, ExternalLink,
  Box, Sparkles, Layers, AlertCircle, Lock
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function PropertyDeedCard({
  unit,
  onClose,
  onOpenSplitModal,
  onInitiateMutation,
  activeRole = 'CITIZEN',
  onRestrictedAction,
  theme = 'CYBER'
}) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!unit) return null

  const isLight = theme === 'LIGHT'

  const handleCopy = () => {
    if (unit?.ulpin_3d) {
      navigator.clipboard.writeText(unit.ulpin_3d)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadDeed = () => {
    setDownloading(true)
    setTimeout(() => {
      const deedPayload = {
        standard: "ISO 19152:2024 LADM Part 2",
        system: "STRATA Bhu-Aadhaar 3D Cadastral Digital Twin",
        certificate_no: `STRATA-${unit.unit_id}-${Date.now().toString().slice(-6)}`,
        issuing_authority: "Ministry of Rural Development & Land Resources (DILRMP)",
        unit_details: {
          unit_id: unit.unit_id,
          ulpin_3d: unit.ulpin_3d,
          name: unit.name,
          registered_owner: unit.owner,
          floor_level: unit.level,
          domain_flag: unit.domain || "A",
          carpet_area_m2: unit.carpet_area_m2 || 81.0,
          volume_m3: unit.volume_m3 || 226.8,
          watertight_certification: unit.is_watertight ?? true,
          euler_characteristic: "χ = V - E + F = 2",
          centroid_wgs84: {
            latitude: 28.5823,
            longitude: 77.0602,
            elevation_datum_msl: `+${(unit.level * 3.5 + 30).toFixed(1)}m`
          }
        },
        rights_restrictions_responsibilities: [
          { type: "RIGHT", description: "Exclusive Freehold Volumetric Ownership of Defined Polyhedral Space" },
          { type: "RESTRICTION", description: "Cantilever Alteration Beyond Approved Setback Prohibited" },
          { type: "RESPONSIBILITY", description: "Annual Volumetric Property Tax & Common Area Maintenance" }
        ],
        cryptographic_hash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deedPayload, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `STRATA_3D_DEED_${unit.ulpin_3d}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setDownloading(false)
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } })
    }, 600)
  }

  const handleSplitClick = () => {
    if (activeRole === 'SURVEYOR' || activeRole === 'GOVT') {
      if (onOpenSplitModal) onOpenSplitModal(unit)
    } else {
      if (onRestrictedAction) {
        onRestrictedAction('3D Parcel Subdivision', 'Licensed Surveyor or Revenue Administrator role required to execute legal 3D parcel splits.')
      }
    }
  }

  const handleMutationClick = () => {
    if (activeRole === 'OWNER' || activeRole === 'GOVT') {
      if (onInitiateMutation) onInitiateMutation(unit)
    } else {
      if (onRestrictedAction) {
        onRestrictedAction('Title Mutation Transfer', 'Property Owner or Revenue Administrator authentication required to initiate ownership transfer.')
      }
    }
  }

  const isViolation = unit.violation?.has_violation || unit.has_violation
  const ulpinDisplay = unit.ulpin_3d || 'IND280145987621-A+01-4DAC'
  const ownerDisplay = unit.owner || 'Deepak Joshi'
  const carpetArea = unit.carpet_area_m2 || unit.area_m2 || 81.0
  const volumeDisplay = unit.volume_m3 || 226.8
  const elevationRange = unit.z_range || `+${(unit.level * 3.5 + 30).toFixed(1)}m to +${(unit.level * 3.5 + 33.5).toFixed(1)}m MSL`

  return (
    <div
      className={`w-[410px] rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-xs font-sans pointer-events-auto max-h-[88vh] overflow-y-auto transition-all duration-300 border ${
        isLight
          ? 'bg-white/95 border-[#C8E6C9] text-slate-800'
          : 'bg-[#060B12]/95 border-[#1E293B] text-white'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${
              isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'
            }`}
          >
            NATIONAL BHU-AADHAAR RECORD
          </span>
          <h2 className={`text-xl font-black tracking-tight mt-0.5 ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            3D Volumetric Title Deed
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] flex items-center gap-1 border ${
              isViolation
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/50'
            }`}
          >
            {isViolation ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {isViolation ? 'AUDIT FLAGGED' : 'VERIFIED SOLID'}
          </span>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#F1F8E9] border-[#C8E6C9] text-slate-600 hover:text-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QR Code & 3D-ULPIN Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center gap-4 ${
          isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
        }`}
      >
        <div className="w-18 h-18 bg-white rounded-xl p-1.5 flex items-center justify-center border border-slate-300 shadow-md shrink-0">
          <QrCode className="w-full h-full text-slate-900" />
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="text-[10px] font-mono text-slate-500 uppercase">3D-ULPIN Identifier</div>
          <div className={`font-mono font-bold text-xs truncate ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {ulpinDisplay}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-[11px] font-mono font-bold transition-colors pt-1 cursor-pointer ${
              isLight ? 'text-[#2E7D32] hover:text-[#1B5E20]' : 'text-slate-400 hover:text-[#00D084]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00D084]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED 3D-ULPIN' : 'COPY 3D-ULPIN'}</span>
          </button>
        </div>
      </div>

      {/* Volumetric Diagnostics Box */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 ${
          isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
        }`}
      >
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-slate-500">Spatial Topology Certification</span>
          <span className="text-[#00D084] font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            LoD 3.0 Watertight
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div
            className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
            }`}
          >
            <span className="text-slate-500">Euler Characteristic:</span><br />
            <span className="text-[#00D084] font-bold">χ = V - E + F = 2</span>
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
            }`}
          >
            <span className="text-slate-500">Volumetric Space:</span><br />
            <span className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>{volumeDisplay} m³</span>
          </div>
        </div>
      </div>

      {/* Property Details Table */}
      <div
        className={`rounded-2xl border divide-y text-xs font-sans ${
          isLight ? 'border-[#C8E6C9] divide-[#C8E6C9]' : 'border-[#1E293B] divide-[#1E293B]'
        }`}
      >
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Registered Owner</span>
          <span className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>{ownerDisplay}</span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Unit Type</span>
          <span className={`font-mono font-semibold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            {unit.name || 'Apartment Unit'}
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Carpet Area</span>
          <span className={`font-mono font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {carpetArea} m² ({volumeDisplay} m³)
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Elevation Datum</span>
          <span className="font-mono text-[11px] text-slate-400">{elevationRange}</span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Cadastre Rights Standard</span>
          <span className="font-mono font-bold text-[#00D084]">ISO 19152 LA_BAUnit</span>
        </div>
      </div>

      {/* Action Workflow Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleDownloadDeed}
          disabled={downloading}
          className={`w-full py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[#1B5E20]/20'
              : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12] shadow-[0_0_20px_rgba(0,208,132,0.35)]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'GENERATING CERTIFIED DEED...' : 'DOWNLOAD 3D DEED CERTIFICATE'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSplitClick}
            className={`py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRole === 'SURVEYOR' || activeRole === 'GOVT'
                ? isLight
                  ? 'bg-white border-[#C8E6C9] text-amber-700 hover:bg-amber-50'
                  : 'bg-[#0B131E] border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                : 'opacity-70 border-slate-300 dark:border-slate-800 text-slate-400 hover:opacity-100'
            }`}
          >
            {activeRole !== 'SURVEYOR' && activeRole !== 'GOVT' && <Lock className="w-3 h-3 text-slate-400" />}
            <Scissors className="w-3.5 h-3.5" />
            <span>SUBDIVIDE (SPLIT)</span>
          </button>

          <button
            onClick={handleMutationClick}
            className={`py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRole === 'OWNER' || activeRole === 'GOVT'
                ? isLight
                  ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#E8F5E9]'
                  : 'bg-[#0B131E] border-[#00D084]/40 text-[#00D084] hover:bg-[#00D084]/10'
                : 'opacity-70 border-slate-300 dark:border-slate-800 text-slate-400 hover:opacity-100'
            }`}
          >
            {activeRole !== 'OWNER' && activeRole !== 'GOVT' && <Lock className="w-3 h-3 text-slate-400" />}
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>MUTATE TITLE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
