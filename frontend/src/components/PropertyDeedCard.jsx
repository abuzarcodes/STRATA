import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Download,
  QrCode,
  ShieldCheck,
  Scissors,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

export default function PropertyDeedCard({
  unit,
  onClose,
  onOpenSplitModal,
  onInitiateMutation,
  theme = 'CYBER'
}) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!unit) return null

  const isLight = theme === 'LIGHT'

  const handleCopy = () => {
    navigator.clipboard.writeText(unit.ulpin_3d)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadDeed = () => {
    setDownloading(true)
    setTimeout(() => {
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
  const ulpinDisplay = unit.ulpin_3d || '3D-IN-MH-MUM-1092-B3-L12'
  const ownerDisplay = unit.owner || 'Aditya Swaminathan Kumar'
  const carpetArea = unit.carpet_area_sqm || unit.area_sqm || 124.5
  const volumeDisplay = unit.rera_volume_m3 || unit.volume_m3 || 435.75
  const elevationRange = unit.z_range || `+${(unit.level * 3 + 30).toFixed(2)}m to +${(unit.level * 3 + 33.5).toFixed(2)}m above datum`

  return (
    <div className={`w-[430px] border rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-xs font-sans pointer-events-auto max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-[#C8E6C9] text-[#1B5E20]'
        : 'bg-[#0B131E]/95 border-[#1E293B] text-white'
    }`}>
      {/* Header matching Figma Frame 11:266 */}
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
            isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'
          }`}>
            BHU-AADHAAR DIGITAL RECORD
          </span>
          <h2 className={`text-xl font-black tracking-wide mt-0.5 ${
            isLight ? 'text-[#1B5E20]' : 'text-white'
          }`}>
            3D Volumetric Deed
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#00D084]/20 border border-[#00D084]/50 text-[#00D084] font-mono font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED
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

      {/* QR Code and ULPIN Banner matching Figma */}
      <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
        isLight
          ? 'bg-[#F1F8E9] border-[#C8E6C9]'
          : 'bg-[#0F172A] border-[#1E293B]'
      }`}>
        <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex items-center justify-center border border-slate-300 shadow-md">
          <QrCode className="w-full h-full text-slate-900" />
        </div>
        <div className="flex-1 space-y-1">
          <div className={`text-[10px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>3D ULPIN IDENTIFIER</div>
          <div className={`font-mono font-bold text-xs break-all ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {ulpinDisplay}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 text-[11px] font-mono transition-colors pt-1 cursor-pointer ${
              isLight ? 'text-[#2E7D32] hover:text-[#1B5E20]' : 'text-slate-400 hover:text-[#00D084]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00D084]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY 3D-ULPIN'}</span>
          </button>
        </div>
      </div>

      {/* Volumetric Diagnostic Widget matching Figma */}
      <div className={`p-4 rounded-2xl border space-y-2 ${
        isLight
          ? 'bg-white border-[#C8E6C9]'
          : 'bg-[#080E17] border-[#1E293B]'
      }`}>
        <div className="flex items-center justify-between text-[11px]">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Parcel Model Diagnostic</span>
          <span className="text-[#00D084] font-mono font-bold">LOD 3.0 Solid</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className={`p-2 rounded-lg border ${
            isLight ? 'bg-[#F1F8E9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
          }`}>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Mesh Vertices:</span>{' '}
            <span className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>8,420</span>
          </div>
          <div className={`p-2 rounded-lg border ${
            isLight ? 'bg-[#F1F8E9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
          }`}>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Volumetric Slant:</span>{' '}
            <span className="text-[#00D084] font-bold">0.02° compliant</span>
          </div>
        </div>
      </div>

      {/* Property Details Table matching Figma Frame 11:266 */}
      <div className={`rounded-2xl border divide-y ${
        isLight
          ? 'border-[#C8E6C9] divide-[#C8E6C9]'
          : 'border-[#1E293B] divide-[#1E293B]'
      }`}>
        <div className="p-3 flex items-center justify-between">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Primary Owner</span>
          <span className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>{ownerDisplay}</span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Unit Classification</span>
          <span className={`font-mono font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            {unit.name || 'Commercial Office 1204'}
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Volumetric Space (RERA)</span>
          <span className={`font-mono font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {volumeDisplay} m³ ({carpetArea} m² carpet)
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Elevation Envelope</span>
          <span className={`font-mono text-[11px] ${isLight ? 'text-[#1B5E20]' : 'text-slate-300'}`}>
            {elevationRange}
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>LADM Rights Model</span>
          <span className={`font-mono font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            LA_BAUnit Freehold
          </span>
        </div>
      </div>

      {/* Action Buttons matching Figma */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleDownloadDeed}
          disabled={downloading}
          className={`w-full py-3 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[0_0_15px_rgba(27,94,32,0.25)]'
              : 'bg-[#00D084] hover:bg-[#00b875] text-[#080E17] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'GENERATING 3D DEED...' : 'DOWNLOAD 3D DEED FILE'}</span>
        </button>

        <button
          onClick={() => alert("Feature not yet implemented")}
          className={`w-full py-2.5 rounded-xl border text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLight
              ? 'bg-[#F1F8E9] hover:bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]'
              : 'bg-[#0F172A] hover:bg-[#1E293B] border-[#1E293B] text-slate-200'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>VERIFY ON BLOCKCHAIN RECORD</span>
        </button>
      </div>
    </div>
  )
}
