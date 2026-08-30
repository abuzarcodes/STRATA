import React, { useState } from 'react'
import {
  Compass, Lock, Crosshair, Scale, ArrowLeft,
  ChevronRight, ArrowRight, Shield, CheckCircle2, Sparkles
} from 'lucide-react'
import StrataLogo from './StrataLogo'

const ROLES = [
  {
    id: 'CITIZEN',
    title: 'Public Explorer',
    badge: 'Free Public Access / Aadhaar Optional',
    description: 'Search parcels, view 3D volumetric ownership boundaries, and inspect public land records.',
    features: ['3D-ULPIN Instant Search', 'Volumetric Deed Inspection', 'Interactive Floor Explorer'],
    accentColor: 'var(--color-accent-primary)',
    Icon: Compass,
  },
  {
    id: 'OWNER',
    title: 'Property Owner',
    badge: 'DigiLocker Linked / Aadhaar Verified',
    description: 'Access your authenticated digital deed vault, track volumetric mutations, and download certificates.',
    features: ['Encrypted DigiLocker Deed', 'Volumetric Property Tax Preview', 'Mutation Lineage Tracker'],
    accentColor: 'var(--color-status-info)',
    Icon: Lock,
  },
  {
    id: 'SURVEYOR',
    title: 'Licensed Cadastral Surveyor',
    badge: 'Govt. License & Surveyor Auth Required',
    description: 'Ingest CAD/BIM/LiDAR datasets, edit 3D parcel boundaries, and run watertight geometry checks.',
    features: ['Automated 2.5D Extrusion Engine', 'Euler χ=2 Topology Verification', 'IFC / DXF / LAS Ingestion'],
    accentColor: '#A855F7',
    Icon: Crosshair,
  },
  {
    id: 'GOVT',
    title: 'Revenue Administrator',
    badge: 'Authorized Revenue Officers Only',
    description: 'Run automated AI encroachment detection, FAR compliance audits, and approve title mutations.',
    features: ['Automated Setback Breach Engine', '3D Parcel Subdivision (Split)', 'Legal Mutation Sign-off'],
    accentColor: 'var(--color-status-warning)',
    Icon: Scale,
  },
]

export default function RoleSelectPanel({ onSelectRole, onBack, theme = 'CYBER', onToggleTheme, onNavClick }) {
  const [hoveredRole, setHoveredRole] = useState(null)
  const [exitingRole, setExitingRole] = useState(null)
  const isLight = theme === 'LIGHT'

  const handleClick = (roleId) => {
    setExitingRole(roleId)
    setTimeout(() => {
      onSelectRole(roleId)
    }, 200)
  }

  return (
    <div
      className="theme-app responsive-role-screen fixed inset-0 z-40 flex flex-col items-center justify-between px-6 py-8 overflow-y-auto transition-colors duration-500 backdrop-blur-2xl"
    >
      {/* Top Header Bar */}
      <div
        className="theme-surface responsive-role-header w-full max-w-6xl px-6 py-3.5 flex items-center justify-between rounded-2xl border backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center gap-3">
          <StrataLogo size={34} isLight={isLight} />
          <div>
            <div className="font-black text-sm tracking-wider theme-text-primary">
              STRATA
            </div>
            <div className="text-[10px] font-mono font-bold uppercase theme-accent">
              Bhu-Aadhaar 3D
            </div>
          </div>
        </div>

        <div
          className="hidden md:flex items-center gap-6 text-xs font-mono font-bold theme-text-muted"
        >
          <button
            onClick={() => onNavClick && onNavClick('about')}
            className="cursor-pointer transition-colors theme-hover-accent"
          >
            About Platform
          </button>
          <span>•</span>
          <button
            onClick={() => onNavClick && onNavClick('documentation')}
            className="cursor-pointer transition-colors theme-hover-accent"
          >
            Documentation
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleClick('CITIZEN')}
            className="theme-button-primary px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider transition-all cursor-pointer border flex items-center gap-1.5 shadow-md"
          >
            <span>QUICK EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="responsive-role-content relative z-10 flex flex-col items-center w-full max-w-5xl my-auto py-8">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="theme-surface theme-hover-surface self-start mb-6 flex items-center gap-2 text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer px-3 py-1.5 rounded-lg border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOMEPAGE</span>
        </button>

        {/* Header Titles */}
        <div className="text-center mb-8 space-y-2">
          <div
            className="theme-accent-surface inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest border"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>National Spatial Portal Access</span>
          </div>
          <h1 className="theme-text-primary text-3xl sm:text-4xl font-black tracking-tight">
            Select Your Cadastral Persona
          </h1>
          <p className="theme-text-secondary text-xs sm:text-sm max-w-md mx-auto">
            Choose your stakeholder role to load customized 3D spatial tools, layer controls, and legal workflows.
          </p>
        </div>

        {/* 4 Role Cards in 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {ROLES.map((role) => {
            const Icon = role.Icon
            const isHovered = hoveredRole === role.id
            const isExiting = exitingRole === role.id

            return (
              <div
                key={role.id}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleClick(role.id)}
                className={`theme-surface theme-hover-surface relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden ${isExiting ? 'scale-95 opacity-80' : 'hover:-translate-y-1'}`}
              >
                {/* Accent Top Gradient Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all opacity-80 group-hover:opacity-100"
                  style={{ backgroundColor: role.accentColor }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="theme-accent-surface w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110"
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className="theme-surface-secondary theme-text-muted text-[10px] font-mono font-bold px-3 py-1 rounded-full border"
                    >
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="theme-text-primary text-lg font-black tracking-tight mb-2">
                    {role.title}
                  </h3>

                  <p className="theme-text-secondary text-xs leading-relaxed mb-4">
                    {role.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-accent-primary)] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/40">
                  <span className="theme-accent text-xs font-mono font-bold">
                    ACCESS PORTAL
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform group-hover:translate-x-1 ${
                      isLight
                        ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]'
                        : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-300 group-hover:text-[var(--color-accent-primary)]'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Clean Bottom Footer */}
      <footer className="text-center text-[11px] font-mono text-slate-500">
        BHU-AADHAAR • ISO 19152 LADM PART 2 VOLUMETRIC SPATIAL REGISTRY
      </footer>
    </div>
  )
}
