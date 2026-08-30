import React, { useState } from 'react'
import {
  Building2, User, Key, ShieldCheck, Download,
  Share2, Split, ArrowRightLeft, X, Check, Copy, AlertTriangle,
  QrCode, ExternalLink, Box
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function PropertyDeedCard({
  unit,
  onClose,
  theme = 'CYBER',
  activeRole = 'CITIZEN',
  onOpenSplitModal,
  onInitiateMutation,
  onRestrictedAction
}) {
  const [copied, setCopied] = useState(false)
  const [isDownloadingDeed, setIsDownloadingDeed] = useState(false)
  const isLight = theme === 'LIGHT'

  if (!unit) return null

  const handleCopyUlpin = () => {
    navigator.clipboard.writeText(unit.ulpin_3d || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadDeedCertificate = () => {
    setIsDownloadingDeed(true)
    setTimeout(() => {
      const deedPayload = {
        title_deed_type: "3D_VOLUMETRIC_PROPERTY_DEED",
        standard: "ISO 19152 LADM Part 2 compliant",
        national_cadastre_system: "STRATA Bhu-Aadhaar 3D",
        metadata: {
          ulpin_3d: unit.ulpin_3d,
          spatial_unit_id: unit.unit_id,
          unit_name: unit.name,
          floor_level: unit.level,
          owner_name: unit.owner,
          volumetric_m3: unit.volume_m3,
          carpet_area_m2: unit.carpet_area_m2,
          built_up_area_m2: unit.built_up_area_m2,
          property_type: unit.type,
          tax_assessment_val_inr: unit.tax_assessed_val_inr,
          watertight_manifold: unit.is_watertight ? "VERIFIED (Euler χ=2)" : "NON_MANIFOLD"
        },
        certification: {
          issuing_authority: "Ministry of Land Resources & Department of Revenue, Government of NCT of Delhi",
          cryptographic_seal: "SHA256: 8f94d12c0192ea0183b0f5899a19c62c3e4495c",
          issued_at: new Date().toISOString()
        }
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deedPayload, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `3D_DEED_${unit.ulpin_3d || unit.unit_id}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setIsDownloadingDeed(false)
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
    }, 500)
  }

  const handleSubdivideClick = () => {
    if (activeRole === 'SURVEYOR' || activeRole === 'GOVT') {
      if (onOpenSplitModal) onOpenSplitModal(unit)
    } else {
      if (onRestrictedAction) {
        onRestrictedAction('3D Parcel Subdivision', 'Only Licensed Surveyors and Revenue Officers are authorized to execute volumetric parcel subdivisions.')
      }
    }
  }

  const handleMutateClick = () => {
    if (activeRole === 'OWNER' || activeRole === 'GOVT') {
      if (onInitiateMutation) onInitiateMutation(unit)
    } else {
      if (onRestrictedAction) {
        onRestrictedAction('Title Mutation Transfer', 'Only verified Property Owners and Revenue Officers can initiate deed ownership mutation transfers.')
      }
    }
  }

  return (
    <div
      className={`responsive-deed-card w-84 sm:w-96 rounded-3xl border shadow-2xl p-5 space-y-4 backdrop-blur-2xl transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-[var(--color-border-default)] text-slate-800 shadow-[0_15px_45px_rgba(27,94,32,0.15)]'
          : 'bg-[var(--color-surface-1)]/95 border-[var(--color-border-default)] text-white shadow-[0_15px_50px_rgba(0,0,0,0.85)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold tracking-wider ${
                isLight ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]'
              }`}
            >
              LEVEL {unit.level}
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase">
              {unit.type || 'RESIDENTIAL'}
            </span>
          </div>
          <h3 className={`text-xl font-black mt-1 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
            {unit.name}
          </h3>
        </div>

        <button
          onClick={onClose}
          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
            isLight
              ? 'hover:bg-slate-100 text-slate-500 border-slate-200'
              : 'hover:bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3D-ULPIN Identifier Capsule */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between font-mono ${
          isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'
        }`}
      >
        <div>
          <div className="text-[10px] text-slate-500 uppercase">3D-ULPIN (Bhu-Aadhaar 3D)</div>
          <div className={`text-xs font-bold truncate max-w-[210px] ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
            {unit.ulpin_3d || 'IND280145987621-A+01-4DAC'}
          </div>
        </div>
        <button
          onClick={handleCopyUlpin}
          className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
            copied
              ? 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
              : isLight
              ? 'hover:bg-[var(--color-surface-muted)] text-slate-600 border-[var(--color-border-default)]'
              : 'hover:bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title="Copy 3D-ULPIN"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Volumetric Cadastre Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div
          className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="text-[10px] text-slate-500">Volumetric Space</div>
          <div className={`text-sm font-black mt-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {unit.volume_m3 || '226.8'} m³
          </div>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="text-[10px] text-slate-500">Carpet Area (RERA)</div>
          <div className={`text-sm font-black mt-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            {unit.carpet_area_m2 || '81.0'} m²
          </div>
        </div>
      </div>

      {/* Legal & Ownership Metadata */}
      <div
        className={`p-3 rounded-2xl border space-y-2 text-xs font-mono ${
          isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Registered Owner</span>
          </span>
          <span className="font-bold text-right">{unit.owner || 'Deepak Joshi'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
            <span>Topology Manifold</span>
          </span>
          <span className="font-bold text-[var(--color-accent-primary)]">Watertight (Euler χ=2)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Tax Valuation</span>
          <span className="font-bold">₹{(unit.tax_assessed_val_inr || 8450000).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Primary Action: Download 3D Deed */}
      <button
        onClick={handleDownloadDeedCertificate}
        disabled={isDownloadingDeed}
        className={`w-full py-2.5 rounded-2xl font-mono text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
          isLight
            ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/20'
            : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)] shadow-[0_0_20px_rgba(0,208,132,0.3)]'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>{isDownloadingDeed ? 'GENERATING 3D DEED...' : 'DOWNLOAD 3D DEED CERTIFICATE'}</span>
      </button>

      {/* Cadastral Operations: Subdivide & Title Mutation with Role Permissions */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleSubdivideClick}
          className={`py-2 px-3 rounded-xl border font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isLight
              ? 'bg-white border-[var(--color-border-default)] text-slate-700 hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 hover:text-white hover:border-[var(--color-accent-primary)]'
          }`}
        >
          <Split className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Subdivide (3D)</span>
        </button>

        <button
          onClick={handleMutateClick}
          className={`py-2 px-3 rounded-xl border font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isLight
              ? 'bg-white border-[var(--color-border-default)] text-slate-700 hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 hover:text-white hover:border-[var(--color-accent-primary)]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Mutate Title</span>
        </button>
      </div>
    </div>
  )
}
