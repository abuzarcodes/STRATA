import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Download,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Shield,
  Scissors,
  ArrowRightLeft,
  FileText,
  MapPin,
  Scale
} from 'lucide-react'

export default function PropertyDeedCard({
  unit,
  onClose,
  onOpenSplitModal,
  onInitiateMutation
}) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!unit) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(unit.ulpin_3d)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadDeed = () => {
    setDownloading(true)
    setTimeout(() => {
      // Trigger JSON / Deed download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(unit, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `3D_DEED_${unit.ulpin_3d}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setDownloading(false)
    }, 600)
  }

  const isViolation = unit.violation?.has_violation || unit.has_violation

  return (
    <div className="absolute right-6 top-20 bottom-6 z-20 w-96 glass-panel-accent rounded-3xl p-5 shadow-2xl border border-sky-500/30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${isViolation ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official 3D Cadastral Deed
              </div>
              <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                {unit.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3D-ULPIN Badge */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>3D-ULPIN (Bhu-Aadhaar 3D):</span>
            <button
              onClick={handleCopy}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[10px] font-bold"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono font-bold text-sm text-sky-300 tracking-wide break-all">
            {unit.ulpin_3d}
          </div>
        </div>

        {/* Violation Warning Banner */}
        {isViolation && (
          <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Cadastral Violation Detected!</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-200/90">
              {unit.violation?.description || 'Structural projection encroaches beyond authorized setback/boundary limits.'}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-red-400 font-bold">
              <span>Overhang: {unit.violation?.encroachment_area_m2 || 14.0} m²</span>
              <span>Volume: {unit.violation?.encroachment_volume_m3 || 39.2} m³</span>
            </div>
          </div>
        )}

        {/* Property Geometry & Metric Specs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
              <Scale className="w-3 h-3 text-emerald-400" /> RERA Carpet Area
            </div>
            <div className="text-base font-bold text-slate-100 font-mono mt-0.5">
              {unit.carpet_area_m2} <span className="text-xs text-slate-400 font-normal">m²</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
              <FileText className="w-3 h-3 text-sky-400" /> Enclosed Volume
            </div>
            <div className="text-base font-bold text-sky-300 font-mono mt-0.5">
              {unit.volume_m3} <span className="text-xs text-slate-400 font-normal">m³</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold">Level / Floor</div>
            <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
              {unit.level === 0 ? 'Ground' : unit.level < 0 ? `Basement (${unit.level})` : `Floor ${unit.level}`}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <div className="text-[10px] text-slate-400 font-semibold">Elevation Range (Z)</div>
            <div className="text-xs font-bold text-indigo-300 font-mono mt-0.5">
              {unit.z_min}m to {unit.z_max}m
            </div>
          </div>
        </div>

        {/* Legal Ownership & Encumbrance Details */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Registered Owner:</span>
            <span className="font-semibold text-slate-200">{unit.owner}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Classification:</span>
            <span className="font-mono text-[11px] text-sky-400 font-medium">
              {unit.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Title Status:</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clear & Verified
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Bank Lien / Mortgages:</span>
            <span className="text-slate-300 font-medium text-[11px]">Nil (Unencumbered)</span>
          </div>
        </div>

        {/* Cryptographic QR Verification Preview */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center shadow-inner">
            <QrCode className="w-10 h-10 text-slate-900" />
          </div>
          <div className="text-[10px] space-y-0.5 text-slate-400 font-mono">
            <div className="text-slate-300 font-bold">SHA-256 Spatial Hash:</div>
            <div className="text-sky-400 font-bold truncate max-w-[190px]">
              {unit.deed_token || 'e4b9d01f82c4a91b...'}
            </div>
            <div className="text-[9px] text-slate-500">ISO 19152 LADM Part 2 Compliant</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          onClick={handleDownloadDeed}
          disabled={downloading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Exporting...' : 'Download 3D Deed Certificate'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenSplitModal(unit)}
            className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Split</span>
          </button>

          <button
            onClick={() => onInitiateMutation(unit)}
            className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transfer Title</span>
          </button>
        </div>
      </div>
    </div>
  )
}
