import React from 'react'
import { X, Shield, Layers, Globe, Box, CheckCircle2, ArrowRight, ExternalLink, Cpu, Database } from 'lucide-react'

export default function AboutModal({ isOpen, onClose, onLaunchPlatform, theme = 'CYBER' }) {
  if (!isOpen) return null

  const isLight = theme === 'LIGHT'

  return (
    <div className="responsive-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`responsive-modal-panel relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col transition-all duration-300 ${
          isLight
            ? 'bg-white border-[var(--color-border-default)] text-slate-800'
            : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-black text-base ${
                isLight
                  ? 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)]/60 text-[var(--color-accent-primary)]'
              }`}
            >
              S
            </div>
            <div>
              <h2 className={`text-base font-extrabold tracking-wide ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                About STRATA Bhu-Aadhaar 3D
              </h2>
              <p className={`text-[11px] font-mono ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'}`}>
                Smart India Hackathon • Problem Statement PS-011
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'hover:bg-slate-100 text-slate-500 border-slate-200'
                : 'hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Mission Hero Banner */}
          <div
            className={`p-5 rounded-xl border ${
              isLight
                ? 'bg-gradient-to-r from-[var(--color-surface-muted)] to-[var(--color-surface-3)] border-[var(--color-border-default)]'
                : 'bg-gradient-to-r from-[var(--color-surface-2)] to-[var(--color-surface-1)] border-[var(--color-border-default)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
              }`}>
                National Digital Cadastre
              </span>
              <span className="text-xs text-slate-500">• Ministry of Land Resources</span>
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              Revolutionizing Land Records from Flat 2D to 3D Volumetric Digital Twins
            </h3>
            <p className={`mt-2 text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              STRATA provides an end-to-end framework to establish unique 3D Bhu-Aadhaar (3D-ULPIN) identifiers for high-rise buildings, underground assets, and complex multi-layered urban properties across India.
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'}`}>
                <Box className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                3D Volumetric Cadastre
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                3D watertight mesh extrusion for apartments, commercial units, common utility corridors, and parking basements.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                Topology & Compliance
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Automated detection of setback violations, legal parcel encroachments, and overlapping volume conflicts.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)]'}`}>
                <Globe className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                International Standards
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Built strictly on ISO 19152 LADM Part 2 (3D Spatial Units), OGC CityGML 3.0, and India Bhu-Aadhaar ULPIN.
              </p>
            </div>
          </div>

          {/* Role Access Matrix */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
              Integrated Stakeholder Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[var(--color-surface-2)]'}`}>
                <span className="font-bold text-[var(--color-accent-primary)] block mb-1">🏢 Citizen & Public</span>
                <span className="text-slate-500">Public search, 3D deed verification, property ownership vault, and volumetric tax preview.</span>
              </div>
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[var(--color-surface-2)]'}`}>
                <span className="font-bold text-[var(--color-accent-primary)] block mb-1">📐 Cadastral Surveyor</span>
                <span className="text-slate-500">BIM/CAD/LiDAR ingestion, automated 2.5D extrusion engine, and watertight geometry checks.</span>
              </div>
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[var(--color-surface-2)]'}`}>
                <span className="font-bold text-[var(--color-accent-primary)] block mb-1">⚖️ Revenue Officer</span>
                <span className="text-slate-500">Government compliance dashboard, legal parcel splitting, mutation workflows, and audit logs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="text-xs font-mono text-slate-500">
            STRATA Engine v1.0 • Node.js + PostGIS + Three.js
          </div>
          <button
            onClick={() => {
              onClose()
              if (onLaunchPlatform) onLaunchPlatform()
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-md'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)] shadow-[0_0_15px_rgba(0,208,132,0.3)]'
            }`}
          >
            <span>EXPLORE 3D CADASTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
