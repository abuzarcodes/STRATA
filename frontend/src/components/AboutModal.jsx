import React from 'react'
import { X, Shield, Layers, Globe, Box, CheckCircle2, ArrowRight, ExternalLink, Cpu, Database } from 'lucide-react'

export default function AboutModal({ isOpen, onClose, onLaunchPlatform, theme = 'CYBER' }) {
  if (!isOpen) return null

  const isLight = theme === 'LIGHT'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col transition-all duration-300 ${
          isLight
            ? 'bg-white border-[#C8E6C9] text-slate-800'
            : 'bg-[#0B131E] border-[#1E293B] text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isLight ? 'bg-[#F1F8E9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-black text-base ${
                isLight
                  ? 'bg-[#1B5E20]/10 border-[#1B5E20]/40 text-[#1B5E20]'
                  : 'bg-[#00D084]/20 border-[#00D084]/60 text-[#00D084]'
              }`}
            >
              S
            </div>
            <div>
              <h2 className={`text-base font-extrabold tracking-wide ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                About STRATA Bhu-Aadhaar 3D
              </h2>
              <p className={`text-[11px] font-mono ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
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
                ? 'bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] border-[#C8E6C9]'
                : 'bg-gradient-to-r from-[#0F172A] to-[#0B131E] border-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'bg-[#1B5E20] text-white' : 'bg-[#00D084] text-[#060B12]'
              }`}>
                National Digital Cadastre
              </span>
              <span className="text-xs text-slate-500">• Ministry of Land Resources</span>
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
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
                isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A]/70 border-[#1E293B]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/15 text-[#00D084]'}`}>
                <Box className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                3D Volumetric Cadastre
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                3D watertight mesh extrusion for apartments, commercial units, common utility corridors, and parking basements.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A]/70 border-[#1E293B]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/15 text-[#00D084]'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                Topology & Compliance
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Automated detection of setback violations, legal parcel encroachments, and overlapping volume conflicts.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-[#F9FBF9] border-[#C8E6C9]' : 'bg-[#0F172A]/70 border-[#1E293B]'
              }`}
            >
              <div className={`p-2 w-fit rounded-lg mb-3 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/15 text-[#00D084]'}`}>
                <Globe className="w-5 h-5" />
              </div>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                International Standards
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Built strictly on ISO 19152 LADM Part 2 (3D Spatial Units), OGC CityGML 3.0, and India Bhu-Aadhaar ULPIN.
              </p>
            </div>
          </div>

          {/* Role Access Matrix */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              Integrated Stakeholder Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0F172A]'}`}>
                <span className="font-bold text-[#00D084] block mb-1">🏢 Citizen & Public</span>
                <span className="text-slate-500">Public search, 3D deed verification, property ownership vault, and volumetric tax preview.</span>
              </div>
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0F172A]'}`}>
                <span className="font-bold text-[#00D084] block mb-1">📐 Cadastral Surveyor</span>
                <span className="text-slate-500">BIM/CAD/LiDAR ingestion, automated 2.5D extrusion engine, and watertight geometry checks.</span>
              </div>
              <div className={`p-3 rounded-lg border text-xs ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0F172A]'}`}>
                <span className="font-bold text-[#00D084] block mb-1">⚖️ Revenue Officer</span>
                <span className="text-slate-500">Government compliance dashboard, legal parcel splitting, mutation workflows, and audit logs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-[#F1F8E9] border-[#C8E6C9]' : 'bg-[#0F172A] border-[#1E293B]'
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
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-md'
                : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12] shadow-[0_0_15px_rgba(0,208,132,0.3)]'
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
