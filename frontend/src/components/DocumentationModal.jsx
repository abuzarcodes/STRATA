import React, { useState } from 'react'
import { X, BookOpen, Layers, ShieldCheck, Code, FileText, CheckCircle2, ChevronRight, Hash, Box, Cpu } from 'lucide-react'

export default function DocumentationModal({ isOpen, onClose, theme = 'CYBER' }) {
  const [activeTab, setActiveTab] = useState('standards')
  const [sampleUnit, setSampleUnit] = useState({
    baseUlpin: 'IND280145987621',
    domain: 'A',
    floor: 4,
    unit: '402'
  })

  if (!isOpen) return null

  const isLight = theme === 'LIGHT'

  // Dynamic 3D-ULPIN calculator preview
  const generated3dUlpin = `${sampleUnit.baseUlpin}-${sampleUnit.domain}+0${sampleUnit.floor}-7F9C`

  return (
    <div className="responsive-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`responsive-modal-panel relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col transition-all duration-300 ${
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono ${
                isLight
                  ? 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)]/60 text-[var(--color-accent-primary)]'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-extrabold tracking-wide ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                STRATA 3D Cadastre Documentation
              </h2>
              <p className={`text-[11px] font-mono ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'}`}>
                Technical Specifications • Bhu-Aadhaar 3D • ISO 19152 LADM
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

        {/* Tab Navigation */}
        <div
          className={`flex border-b px-6 gap-2 text-xs font-mono font-bold overflow-x-auto ${
            isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)]/50 border-[var(--color-border-default)]'
          }`}
        >
          <button
            onClick={() => setActiveTab('standards')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'standards'
                ? isLight
                  ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                  : 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. STANDARDS & FRAMEWORK</span>
          </button>
          <button
            onClick={() => setActiveTab('ulpin')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'ulpin'
                ? isLight
                  ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                  : 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>2. 3D-ULPIN FORMULATION</span>
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'topology'
                ? isLight
                  ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                  : 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. TOPOLOGY & WATERTIGHTNESS</span>
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'workflows'
                ? isLight
                  ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                  : 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>4. MUTATION & LEGAL DIVISION</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {activeTab === 'standards' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                <h3 className={`font-bold text-sm ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  ISO 19152: Land Administration Domain Model (LADM Part 2)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  STRATA implements 3D Spatial Units (<code className="px-1 py-0.5 rounded bg-slate-800/40 font-mono">LA_SpatialUnit</code>) and Legal Building Units (<code className="px-1 py-0.5 rounded bg-slate-800/40 font-mono">LA_LegalSpaceBuildingUnit</code>) to record volumetric rights, restrictions, and responsibilities (RRR).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-[var(--color-accent-primary)]">
                    OGC CityGML 3.0 / CityJSON
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-500">
                    <li>• <strong>LoD 2:</strong> Outer building envelope with roof & wall boundaries.</li>
                    <li>• <strong>LoD 3:</strong> Interior unit boundaries, floor slabs & common corridors.</li>
                    <li>• <strong>LoD 4:</strong> Architectural detail with utility conduit volumes.</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-[var(--color-accent-primary)]">
                    Spatial Reference Systems
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-500">
                    <li>• <strong>EPSG:4326 (WGS 84):</strong> Global geodetic standard (Latitude, Longitude).</li>
                    <li>• <strong>EPSG:7755 / UTM 43N:</strong> India National Grid Cartesian projected CRS.</li>
                    <li>• <strong>Vertical Datum:</strong> Mean Sea Level (MSL) Orthometric heights in meters.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ulpin' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                <h3 className={`font-bold text-sm ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  Standard 3D Bhu-Aadhaar Structure
                </h3>
                <div className="mt-3 font-mono text-xs p-3 rounded-lg bg-black/40 text-[var(--color-accent-primary)] border border-[var(--color-border-default)] flex items-center justify-between">
                  <span>[14-digit Base ULPIN] - [Domain Flag] [Floor Index (+/-)] - [Spatial Bounding Hash]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2 rounded bg-black/20 border border-slate-800">
                    <strong className="text-slate-400">Base ULPIN:</strong><br />
                    14 chars (State, District, Village, 2D Parcel ID)
                  </div>
                  <div className="p-2 rounded bg-black/20 border border-slate-800">
                    <strong className="text-slate-400">Domain Flag:</strong><br />
                    A = Above Ground<br />U = Underground / Subterranean
                  </div>
                  <div className="p-2 rounded bg-black/20 border border-slate-800">
                    <strong className="text-slate-400">BBox Checksum:</strong><br />
                    4-hex CRC16 checksum of local watertight bounding prism
                  </div>
                </div>
              </div>

              {/* Interactive ULPIN Simulator */}
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'}`}>
                <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-[var(--color-accent-primary)]">
                  Interactive 3D-ULPIN Generator Simulator
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Base ULPIN</label>
                    <input
                      type="text"
                      value={sampleUnit.baseUlpin}
                      onChange={(e) => setSampleUnit({ ...sampleUnit, baseUlpin: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border bg-black/30 font-mono text-xs border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Domain Flag</label>
                    <select
                      value={sampleUnit.domain}
                      onChange={(e) => setSampleUnit({ ...sampleUnit, domain: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border bg-black/30 font-mono text-xs border-slate-700"
                    >
                      <option value="A">A - Above Ground</option>
                      <option value="U">U - Underground</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Floor Level</label>
                    <input
                      type="number"
                      value={sampleUnit.floor}
                      onChange={(e) => setSampleUnit({ ...sampleUnit, floor: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1.5 rounded border bg-black/30 font-mono text-xs border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Unit Code</label>
                    <input
                      type="text"
                      value={sampleUnit.unit}
                      onChange={(e) => setSampleUnit({ ...sampleUnit, unit: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border bg-black/30 font-mono text-xs border-slate-700"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Generated 3D Bhu-Aadhaar:</span>
                  <span className="font-mono font-bold text-sm text-[var(--color-accent-primary)]">{generated3dUlpin}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topology' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                <h3 className={`font-bold text-sm ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  Watertight 2-Manifold Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Every 3D property unit is verified against Euler's Formula for closed convex polyhedra:
                  <code className="mx-2 px-2 py-0.5 rounded bg-black/40 text-[var(--color-accent-primary)] font-mono">χ = V - E + F = 2</code>
                  where each edge must be shared by exactly two adjacent polygonal faces with consistent outward-pointing normal vectors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-[var(--color-accent-primary)]">
                    Encroachment & Setback Engine
                  </h4>
                  <p className="text-slate-500 leading-relaxed">
                    Evaluates Constructive Solid Geometry (CSG) intersection between unit bounding volumes and the master 2D parcel extrusion column. If any volumetric slice exceeds setback offsets, an encroachment violation ticket is automatically generated.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[var(--color-surface-2)]/70 border-[var(--color-border-default)]'}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-[var(--color-accent-primary)]">
                    Volumetric Overlap Detection
                  </h4>
                  <p className="text-slate-500 leading-relaxed">
                    Calculates 3D spatial intersection <code className="font-mono text-[var(--color-accent-primary)]">Vol(A ∩ B) &gt; 0.001 m³</code>. Prohibits conflicting ownership claims in multi-storey apartments and common elevator shafts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                <h3 className={`font-bold text-sm ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  3D Legal Mutation & Sub-Parcel Division
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  When a property owner sells, divides, or mutates a unit, the STRATA system assigns new child 3D-ULPINs with an immutable cryptographic lineage link to the parent asset record.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-slate-800 bg-black/20 flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] flex items-center justify-center font-bold font-mono">1</span>
                  <div>
                    <strong className="text-slate-200">BIM / Architectural Drawing Ingestion:</strong>
                    <p className="text-slate-500 mt-0.5">Surveyor uploads DXF/GeoJSON/IFC floor plans with assigned ceiling and floor datum heights.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-800 bg-black/20 flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] flex items-center justify-center font-bold font-mono">2</span>
                  <div>
                    <strong className="text-slate-200">Automated Topology Validation:</strong>
                    <p className="text-slate-500 mt-0.5">PostGIS 3D spatial queries check for self-intersections, legal setback breaches, and watertight closure.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-slate-800 bg-black/20 flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] flex items-center justify-center font-bold font-mono">3</span>
                  <div>
                    <strong className="text-slate-200">Revenue Officer Sign-Off & Registry Entry:</strong>
                    <p className="text-slate-500 mt-0.5">Official 3D-ULPIN is minted and encrypted into the National Bhu-Aadhaar registry.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="text-xs font-mono text-slate-500">
            Compliant with MoLR National Geospatial Policy
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)]'
            }`}
          >
            CLOSE DOCUMENTATION
          </button>
        </div>
      </div>
    </div>
  )
}
