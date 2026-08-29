import React from 'react'
import { ArrowLeft, Sun, Moon, ArrowRight, ShieldCheck, Box, Globe, Users, Layers, Award, FileText, CheckCircle2, Building, Cpu, Database, Check } from 'lucide-react'
import StrataLogo from './StrataLogo'

export default function AboutPage({ onBack, onLaunchPlatform, theme = 'CYBER', onToggleTheme }) {
  const isLight = theme === 'LIGHT'

  return (
    <div
      className={`h-screen w-full overflow-y-auto transition-colors duration-300 ${
        isLight ? 'bg-[#F9FBF9] text-slate-800' : 'bg-[#060B12] text-slate-100'
      }`}
    >
      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-30 px-6 sm:px-12 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
          isLight ? 'bg-white/90 border-[#C8E6C9]' : 'bg-[#0B131E]/90 border-[#1E293B]'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold transition-all ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#E8F5E9]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:text-white hover:border-[#00D084]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <StrataLogo size={32} isLight={isLight} />
            <div>
              <div className={`font-black text-sm tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
                About the Platform
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#F1F8E9]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:text-[#00D084]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#00D084]" />}
          </button>

          <button
            onClick={onLaunchPlatform}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-md'
                : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12] shadow-[0_0_15px_rgba(0,208,132,0.3)]'
            }`}
          >
            <span>LAUNCH 3D CADASTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-12 space-y-16">
        {/* Hero Section */}
        <section className="space-y-6 text-center sm:text-left">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              isLight
                ? 'bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B5E20]'
                : 'bg-[#00D084]/10 border border-[#00D084]/30 text-[#00D084]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Smart India Hackathon • Problem Statement PS-011</span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
              isLight ? 'text-[#1B5E20]' : 'text-white'
            }`}
          >
            Spatial Topology & Registration Administration for Three-dimensional Assets
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-3xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            STRATA is India's next-generation 3D Volumetric Digital Cadastre platform designed for the Ministry of Land Resources, Government of India. It transitions land administration from flat, 2D planar land records into verifiable, watertight 3D digital twins.
          </p>
        </section>

        {/* The 2D vs 3D Challenge Comparison */}
        <section className="space-y-6">
          <div>
            <h2 className={`text-2xl font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
              The Urban Land Record Challenge
            </h2>
            <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Why conventional 2D cadastre (RoR / 7/12) is insufficient for vertical cities:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2D Limitations */}
            <div
              className={`p-6 rounded-2xl border ${
                isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/10 border-red-900/30'
              }`}
            >
              <h3 className="font-bold text-base text-red-500 mb-3 flex items-center gap-2">
                <span>Traditional 2D Cadastre</span>
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Planar Ambiguity:</strong> Collapses entire 40-storey multi-unit towers onto a single 2D polygon with no spatial separation of apartments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Zero Subterranean Rights:</strong> Unable to demarcate underground metro tunnels, basements, and utility conduits with vertical coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Invisible Encroachments:</strong> Cantilevered balconies and unauthorized upper-floor extensions remain completely undetected on flat 2D maps.</span>
                </li>
              </ul>
            </div>

            {/* 3D Solution */}
            <div
              className={`p-6 rounded-2xl border ${
                isLight ? 'bg-[#E8F5E9]/60 border-[#C8E6C9]' : 'bg-[#00D084]/5 border-[#00D084]/20'
              }`}
            >
              <h3 className={`font-bold text-base mb-3 flex items-center gap-2 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                <span>STRATA 3D Volumetric Cadastre</span>
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-slate-500">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                  <span><strong>Unique 3D-ULPIN per Unit:</strong> Every apartment, commercial suite, and parking bay receives a dedicated volumetric Bhu-Aadhaar PIN.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                  <span><strong>Watertight Volumetric Ownership:</strong> Exact volume ($m^3$) and carpet area ($m^2$) mathematically sealed with 2-manifold B-Rep geometry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                  <span><strong>Automated Encroachment Engine:</strong> CSG Boolean spatial queries automatically detect setback breaches and overlapping titles in real-time.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture & Core Components */}
        <section className="space-y-6">
          <h2 className={`text-2xl font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            Core System Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-[#C8E6C9] shadow-sm' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/20 text-[#00D084]'}`}>
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                1. 3D Ingestion & Extrusion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Processes architectural CAD drawings, BIM IFC models, and LiDAR point clouds. Extrudes 2.5D polygons into closed 3D polyhedral meshes with floor ceiling heights.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-[#C8E6C9] shadow-sm' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/20 text-[#00D084]'}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                2. Topology & Spatial Audits
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verifies Euler polyhedral characteristic ($\chi = 2$), detects volumetric overlaps ($Vol(A \cap B) &gt; 0$), and calculates exact setback encroachment volumes.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-[#C8E6C9] shadow-sm' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#00D084]/20 text-[#00D084]'}`}>
                <Database className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                3. PostGIS Spatial Registry
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Maintains the immutable national 3D land ledger with legal mutation workflows, sub-parcel division tracking, and cryptographically verified deeds.
              </p>
            </div>
          </div>
        </section>

        {/* Stakeholder Portals */}
        <section className="space-y-6">
          <h2 className={`text-2xl font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            Integrated Stakeholder Portals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0B131E] border-[#1E293B]'}`}>
              <span className="text-2xl mb-3 block">🏢</span>
              <h3 className="font-bold text-sm text-[#00D084] mb-2">Public & Citizen Explorer</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Allows citizens to search parcels by 3D-ULPIN or state/district, view interactive 3D unit models, and access their authenticated digital deed vault.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0B131E] border-[#1E293B]'}`}>
              <span className="text-2xl mb-3 block">📐</span>
              <h3 className="font-bold text-sm text-[#00D084] mb-2">Licensed Surveyor Portal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provides CAD/BIM ingestion tools, automated 3D mesh extrusion, AI-assisted layer recognition, and instant geometry validation diagnostics.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0B131E] border-[#1E293B]'}`}>
              <span className="text-2xl mb-3 block">⚖️</span>
              <h3 className="font-bold text-sm text-[#00D084] mb-2">Revenue Administrator</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowers revenue officers to conduct FAR compliance audits, resolve boundary disputes, execute legal 3D parcel splits, and approve title mutations.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section
          className={`p-8 sm:p-12 rounded-3xl border text-center space-y-6 ${
            isLight
              ? 'bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]/40 border-[#C8E6C9]'
              : 'bg-gradient-to-br from-[#0B131E] to-[#0F172A] border-[#1E293B]'
          }`}
        >
          <StrataLogo size={54} isLight={isLight} className="mx-auto" />
          <div className="space-y-2">
            <h2 className={`text-3xl font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
              Experience the 3D Cadastre Live
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Explore our interactive 3D digital twin of Aura Residency, complete with volumetric deed viewing, floor explosion, and legal mutation simulations.
            </p>
          </div>

          <button
            onClick={onLaunchPlatform}
            className={`px-8 py-4 rounded-xl text-sm font-mono font-bold inline-flex items-center gap-3 transition-all cursor-pointer shadow-xl ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[#1B5E20]/20'
                : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12] shadow-[#00D084]/25'
            }`}
          >
            <span>LAUNCH 3D CADASTRE VIEWER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`px-6 sm:px-12 py-8 border-t text-xs font-mono text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isLight ? 'bg-white border-[#C8E6C9] text-slate-500' : 'bg-[#0B131E] border-[#1E293B] text-slate-500'
        }`}
      >
        <div>
          STRATA • Spatial Topology & Registration Administration for Three-dimensional Assets
        </div>
        <div className="flex items-center gap-4">
          <span>ISO 19152 LADM Part 2</span>
          <span>•</span>
          <span>OGC CityGML 3.0</span>
          <span>•</span>
          <span>EPSG:4326</span>
        </div>
      </footer>
    </div>
  )
}
