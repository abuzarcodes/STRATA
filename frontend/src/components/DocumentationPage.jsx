import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft, Sun, Moon, ArrowRight, BookOpen, Layers, ShieldCheck,
  Hash, Code, FileText, CheckCircle2, ChevronRight, Copy, Check,
  Terminal, Globe, Cpu, Database, Info, ExternalLink
} from 'lucide-react'
import StrataLogo from './StrataLogo'

export default function DocumentationPage({ onBack, onLaunchPlatform, theme = 'CYBER', onToggleTheme }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [copiedCode, setCopiedCode] = useState(null)
  const containerRef = useRef(null)

  // Interactive 3D-ULPIN generator state
  const [simState, setSimState] = useState({
    stateCode: 'IND28',
    district: '014',
    parcel: '5987621',
    domain: 'A',
    floor: 4,
    unit: '402'
  })

  const isLight = theme === 'LIGHT'

  const fullBaseUlpin = `${simState.stateCode}${simState.district}${simState.parcel}`
  const generated3DULPIN = `${fullBaseUlpin}-${simState.domain}+0${simState.floor}-7F9C`

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    { id: 'overview', title: '1. Platform & Acronym', icon: Info },
    { id: 'standards', title: '2. International Standards', icon: Layers },
    { id: 'ulpin', title: '3. 3D-ULPIN Formulation', icon: Hash },
    { id: 'topology', title: '4. Topology & Watertightness', icon: ShieldCheck },
    { id: 'encroachment', title: '5. Encroachment & CSG', icon: Cpu },
    { id: 'mutation', title: '6. 3D Mutation & Split', icon: FileText },
    { id: 'api', title: '7. REST API Endpoints', icon: Terminal }
  ]

  // Auto scroll-spy to update active table of contents on scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPos = container.scrollTop + 180
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i]
        const el = document.getElementById(sec.id)
        if (el) {
          if (scrollPos >= el.offsetTop) {
            setActiveSection(sec.id)
            break
          }
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`h-screen w-full overflow-y-auto transition-colors duration-300 ${
        isLight ? 'bg-[var(--color-surface-2)] text-slate-800' : 'bg-[var(--color-bg-app)] text-slate-100'
      }`}
    >
      {/* Sticky Top Header */}
      <header
        className={`sticky top-0 z-30 px-6 sm:px-12 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
          isLight ? 'bg-white/90 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)]/90 border-[var(--color-border-default)]'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              isLight
                ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 hover:text-white hover:border-[var(--color-accent-primary)]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <StrataLogo size={32} isLight={isLight} />
            <div>
              <div className={`font-black text-sm tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'}`}>
                Documentation
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noreferrer"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              isLight
                ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 hover:text-[var(--color-accent-primary)]'
            }`}
          >
            <span>Swagger API</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-3)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 hover:text-[var(--color-accent-primary)]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[var(--color-accent-primary)]" />}
          </button>

          <button
            onClick={onLaunchPlatform}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-md'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)] shadow-[0_0_15px_rgba(0,208,132,0.3)]'
            }`}
          >
            <span>LAUNCH 3D CADASTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Two-Column Documentation Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sticky Sidebar Nav */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3 mb-3">
              Table of Contents
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon
              const isCurrent = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id)
                    const el = document.getElementById(sec.id)
                    if (el && containerRef.current) {
                      containerRef.current.scrollTo({
                        top: el.offsetTop - 90,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    isCurrent
                      ? isLight
                        ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30 shadow-sm'
                        : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.title}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-16 text-sm">
          {/* Section 1: Platform & Acronym */}
          <section id="overview" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 1
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  Platform Nomenclature & Full Form
                </h2>
              </div>

              <div className={`p-4 rounded-xl border mt-4 ${
                isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}>
                <div className={`text-xs font-mono font-bold mb-1 uppercase ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  Formal Acronym Definition:
                </div>
                <div className={`text-lg sm:text-xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  <span className="text-[var(--color-accent-primary)]">S</span>patial{' '}
                  <span className="text-[var(--color-accent-primary)]">T</span>opology,{' '}
                  <span className="text-[var(--color-accent-primary)]">R</span>egistration and{' '}
                  <span className="text-[var(--color-accent-primary)]">A</span>dministration of{' '}
                  <span className="text-[var(--color-accent-primary)]">T</span>hree-dimensional{' '}
                  <span className="text-[var(--color-accent-primary)]">A</span>ssets
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                STRATA represents the digital transformation from two-dimensional flat boundary demarcation into multi-tiered volumetric spatial parcel registry, complying with Ministry of Land Resources directives and National Geospatial Policy guidelines.
              </p>
            </div>
          </section>

          {/* Section 2: Standards */}
          <section id="standards" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 2
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  International Cadastral & GIS Standards
                </h2>
              </div>

              <div className="space-y-4 mt-4">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                    ISO 19152: Land Administration Domain Model (LADM Part 2)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    STRATA implements the 3D Land Administration Domain Model standard. It uses:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    <li>• <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[var(--color-accent-primary)]">LA_SpatialUnit</code>: Base parcel and multi-dimensional spatial representation.</li>
                    <li>• <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[var(--color-accent-primary)]">LA_LegalSpaceBuildingUnit</code>: Individual 3D residential apartment, commercial unit, or basement asset.</li>
                    <li>• <code className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[var(--color-accent-primary)]">LA_RRR</code>: Volumetric Rights, Restrictions, and Responsibilities.</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                    Spatial Reference Systems & Datums
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/20 border border-slate-800">
                      <strong>Horizontal CRS:</strong><br />
                      EPSG:4326 (WGS 84 Geodetic) & EPSG:7755 (India National Grid)
                    </div>
                    <div className="p-3 rounded-lg bg-black/20 border border-slate-800">
                      <strong>Vertical Datum:</strong><br />
                      Mean Sea Level (MSL) Orthometric heights in meters (m)
                    </div>
                    <div className="p-3 rounded-lg bg-black/20 border border-slate-800">
                      <strong>OGC CityGML:</strong><br />
                      LoD 2 (Building Envelope) to LoD 3 (Internal Unit Volumes)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 3D-ULPIN Formulation */}
          <section id="ulpin" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 3
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  3D-ULPIN (Bhu-Aadhaar 3D) Syntax
                </h2>
              </div>

              {/* Syntax Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-[var(--color-border-default)] font-mono text-xs space-y-2 mt-4">
                <div className="text-slate-400">Canonical 3D-ULPIN Format:</div>
                <div className="p-3 rounded-lg bg-black/60 text-[var(--color-accent-primary)] font-bold text-sm tracking-wider flex items-center justify-between">
                  <span>[14-digit Base ULPIN] - [Domain Flag][Floor Index (+/-)] - [CRC16 BBox Checksum]</span>
                  <button
                    onClick={() => handleCopy('IND280145987621-A+04-7F9C', 'syntax')}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
                  >
                    {copiedCode === 'syntax' ? <Check className="w-4 h-4 text-[var(--color-accent-primary)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Interactive Simulator */}
              <div className={`p-5 rounded-xl border mt-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                <h3 className={`font-bold text-xs uppercase tracking-wider mb-4 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  Live 3D-ULPIN Generator Simulator
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">State Code</label>
                    <input
                      type="text"
                      value={simState.stateCode}
                      onChange={(e) => setSimState({ ...simState, stateCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-700 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">District / Ward</label>
                    <input
                      type="text"
                      value={simState.district}
                      onChange={(e) => setSimState({ ...simState, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-700 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Domain</label>
                    <select
                      value={simState.domain}
                      onChange={(e) => setSimState({ ...simState, domain: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-700 font-mono text-xs"
                    >
                      <option value="A">A - Above Ground</option>
                      <option value="U">U - Underground</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Floor Level</label>
                    <input
                      type="number"
                      value={simState.floor}
                      onChange={(e) => setSimState({ ...simState, floor: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-700 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Generated 3D Bhu-Aadhaar Identifier:</div>
                    <div className="text-base font-black font-mono text-[var(--color-accent-primary)]">{generated3DULPIN}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(generated3DULPIN, 'gen')}
                    className="px-3 py-1.5 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-app)] text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-[var(--color-accent-primary-hover)] transition-all"
                  >
                    {copiedCode === 'gen' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'gen' ? 'COPIED' : 'COPY ULPIN'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Topology & Watertightness */}
          <section id="topology" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 4
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  Volumetric Topology & Watertightness Verification
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-[var(--color-border-default)] font-mono text-xs space-y-3 mt-4">
                <div className="text-[var(--color-accent-primary)] font-bold">Euler's Formula for 2-Manifold Closed Polyhedra:</div>
                <div className="text-lg text-white font-bold p-3 bg-black/60 rounded-lg text-center">
                  χ = V - E + F = 2
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Every legal spatial unit boundary representation must be a closed, orientable 2-manifold surface. For genus-0 polyhedra, the alternating sum of vertices ($V$), edges ($E$), and faces ($F$) must strictly evaluate to 2.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs text-slate-500">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                  <strong className="text-slate-200 block mb-1">Manifold Edge Invariance:</strong>
                  Every edge in the 3D property boundary mesh must be shared by exactly two adjacent faces with inverse cyclic vertex winding order.
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'}`}>
                  <strong className="text-slate-200 block mb-1">Volume Continuity:</strong>
                  Divergence Theorem is computed across all triangular and polygonal face normals to yield exact signed volumetric displacement ($m^3$).
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Encroachment & CSG */}
          <section id="encroachment" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 5
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  CSG Overlap & Encroachment Auditing
                </h2>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                STRATA runs automated Constructive Solid Geometry (CSG) intersection queries to detect spatial violations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/10 border-red-900/30'}`}>
                  <h4 className="font-bold text-red-400 mb-1">Setback Encroachment:</h4>
                  <p className="text-slate-500">
                    Computes difference <code className="font-mono text-red-400">Vol(Unit \setminus LegalParcelExtrusion) &gt; 0</code> to catch cantilevered overhangs breaching statutory municipal margins.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/10 border-red-900/30'}`}>
                  <h4 className="font-bold text-red-400 mb-1">Volumetric Title Overlap:</h4>
                  <p className="text-slate-500">
                    Calculates pairwise intersection <code className="font-mono text-red-400">Vol(Unit_A \cap Unit_B) &gt; 0.001 m^3</code> to prevent double-titling or unauthorized hallway annexation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Mutation & Split */}
          <section id="mutation" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 6
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  3D Legal Mutation & Sub-Parcel Division
                </h2>
              </div>

              <div className="space-y-3 mt-4 text-xs text-slate-500">
                <p>
                  When a property owner transfers title or divides a spatial asset (e.g. splitting a floor into two sub-units), the system executes a cryptographic mutation workflow:
                </p>
                <div className="p-4 rounded-xl bg-black/40 border border-[var(--color-border-default)] font-mono space-y-1">
                  <div className="text-slate-400">// Parent Unit:</div>
                  <div className="text-[var(--color-accent-primary)]">Parent: IND280145987621-A+04-7F9C (226.8 m³)</div>
                  <div className="text-slate-400 mt-2">// Child Subdivided Units (Split S01 & S02):</div>
                  <div className="text-blue-400">Child A: IND280145987621-A+04-7F9C-S01 (113.4 m³) [Owner: Anand Verma]</div>
                  <div className="text-blue-400">Child B: IND280145987621-A+04-7F9C-S02 (113.4 m³) [Owner: Sunil Narang]</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: REST API Endpoints */}
          <section id="api" className="space-y-4 scroll-mt-28">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLight ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-accent-primary)] text-[var(--color-bg-app)]'
                }`}>
                  Section 7
                </span>
                <h2 className={`text-xl font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  REST Microservice Endpoints
                </h2>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                The Express / TypeScript backend runs on port 3001 and provides REST endpoints documented via Swagger:
              </p>

              <div className="space-y-2 mt-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/30 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                    <span>/api/v1/health</span>
                  </div>
                  <span className="text-slate-500">System health diagnostic</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                    <span>/api/v1/parcels</span>
                  </div>
                  <span className="text-slate-500">2D base parcels & boundary coordinates</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">GET</span>
                    <span>/api/v1/spatial-assets</span>
                  </div>
                  <span className="text-slate-500">3D spatial units & 3D-ULPIN registry</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
                    <span>/api/v1/geometry/extrude</span>
                  </div>
                  <span className="text-slate-500">Extrudes 2D polygon to watertight 3D mesh</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer
        className={`px-6 sm:px-12 py-8 border-t text-xs font-mono text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-[var(--color-border-default)] text-slate-500' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-slate-500'
        }`}
      >
        <div>
          STRATA Documentation Engine • ISO 19152 LADM Part 2 & OGC CityGML 3.0
        </div>
        <a
          href="http://localhost:3001/api-docs"
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-accent-primary)] hover:underline flex items-center gap-1"
        >
          <span>Open Interactive Swagger Docs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </footer>
    </div>
  )
}
