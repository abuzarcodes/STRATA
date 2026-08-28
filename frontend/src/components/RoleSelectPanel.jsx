import React, { useState } from 'react'
import {
  Compass,
  Lock,
  Crosshair,
  Scale,
  ArrowLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react'

const ROLES = [
  {
    id: 'CITIZEN',
    title: 'Public Explorer',
    badge: 'Free Access / Aadhaar Optional',
    description: 'Search parcels, view 3D ownership maps, and access public volumetric land records.',
    Icon: Compass,
  },
  {
    id: 'OWNER',
    title: 'Property Owner',
    badge: 'DigiLocker Linked / Aadhaar Verified',
    description: 'Access your digital deed locker, track volumetric mutations, and verify ownership with 3D ULPIN.',
    Icon: Lock,
  },
  {
    id: 'SURVEYOR',
    title: 'Licensed Surveyor',
    badge: 'Govt. License Required',
    description: 'Ingest BIM/CAD/LiDAR data, edit 3D parcel boundaries, and submit compliance reports.',
    Icon: Crosshair,
  },
  {
    id: 'GOVT',
    title: 'Revenue Administrator',
    badge: 'Authorized Revenue Officers Only',
    description: 'Run automated AI encroachment detection, FAR violation auditing, and resolve title disputes.',
    Icon: Scale,
  },
]

export default function RoleSelectPanel({ onSelectRole, onBack, theme = 'CYBER', onToggleTheme }) {
  const [exitingRole, setExitingRole] = useState(null)
  const isLight = theme === 'LIGHT'

  const handleClick = (roleId) => {
    setExitingRole(roleId)
    setTimeout(() => {
      onSelectRole(roleId)
    }, 250)
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-between px-6 py-8 overflow-y-auto transition-colors duration-300 ${
        isLight ? 'bg-[#E8F5E9]/95 text-[#1B5E20]' : 'bg-[#080E17]/95 text-white'
      } backdrop-blur-2xl`}
    >
      {/* Top Header Bar matching Figma */}
      <div className={`w-full max-w-6xl px-4 py-3 flex items-center justify-between border-b ${
        isLight ? 'border-[#C8E6C9]' : 'border-[#1E293B]/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isLight
              ? 'bg-[#1B5E20]/10 border-[#1B5E20]/40'
              : 'bg-[#00D084]/20 border-[#00D084]/60'
          }`}>
            <span className={`font-mono font-black text-sm ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              S
            </span>
          </div>
          <div>
            <div className={`font-extrabold text-sm tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
              STRATA
            </div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
              Bhu-Aadhaar 3D
            </div>
          </div>
        </div>

        <div className={`hidden md:flex items-center gap-8 text-xs font-medium ${
          isLight ? 'text-[#2E7D32]' : 'text-slate-400'
        }`}>
          <span className="hover:opacity-80 cursor-pointer transition-opacity">About</span>
          <span className="hover:opacity-80 cursor-pointer transition-opacity">Documentation</span>
          <span className="hover:opacity-80 cursor-pointer transition-opacity">API</span>
          <span className="hover:opacity-80 cursor-pointer transition-opacity">Public Search</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#F1F8E9]'
                : 'bg-[#0B131E] border-[#1E293B] text-slate-300 hover:text-[#00D084]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleClick('CITIZEN')}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider transition-all cursor-pointer border ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white border-[#1B5E20]'
                : 'bg-transparent hover:bg-[#00D084] border-[#00D084] text-[#00D084] hover:text-[#080E17]'
            }`}
          >
            LAUNCH PLATFORM
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl my-auto py-8">
        {/* Back Link */}
        <button
          onClick={onBack}
          className={`self-start mb-6 flex items-center gap-2 text-xs font-mono tracking-wider transition-colors cursor-pointer ${
            isLight ? 'text-[#2E7D32] hover:text-[#1B5E20]' : 'text-slate-400 hover:text-[#00D084]'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Overview
        </button>

        {/* Eyebrow & Titles matching Figma */}
        <p className={`text-[10px] font-mono tracking-[0.35em] uppercase font-bold mb-2 ${
          isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'
        }`}>
          SECURE GATEWAY
        </p>
        <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-2 text-center ${
          isLight ? 'text-[#1B5E20]' : 'text-white'
        }`}>
          Select Your Role
        </h2>
        <p className={`text-xs md:text-sm text-center max-w-lg mb-8 font-medium ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Choose your workspace to interface with India's volumetric spatial record database.
        </p>

        {/* 4 Role Cards in 2x2 Grid matching Figma Frame 11:47 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {ROLES.map((role) => {
            const isExiting = exitingRole === role.id
            return (
              <div
                key={role.id}
                onClick={() => handleClick(role.id)}
                className={`
                  rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-200 cursor-pointer group shadow-xl border
                  ${
                    isLight
                      ? 'bg-white hover:bg-[#F9FCF9] border-[#C8E6C9] hover:border-[#1B5E20]/60 hover:shadow-[0_0_20px_rgba(27,94,32,0.12)]'
                      : 'bg-[#0F172A]/90 hover:bg-[#131F37] border-[#1E293B] hover:border-[#00D084]/60 hover:shadow-[0_0_25px_rgba(0,208,132,0.15)]'
                  }
                  ${isExiting ? 'scale-95 opacity-50' : ''}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                      isLight
                        ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]'
                        : 'bg-[#080E17] border-[#1E293B] text-[#00D084]'
                    }`}>
                      <role.Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${
                      isLight
                        ? 'text-[#1B5E20] bg-[#1B5E20]/10 border-[#1B5E20]/30'
                        : 'text-[#00D084] bg-[#00D084]/10 border-[#00D084]/30'
                    }`}>
                      {role.badge}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mb-2 transition-colors ${
                    isLight
                      ? 'text-[#1B5E20] group-hover:text-[#2E7D32]'
                      : 'text-white group-hover:text-[#00D084]'
                  }`}>
                    {role.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {role.description}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-mono font-bold group-hover:translate-x-1 transition-transform ${
                  isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'
                }`}>
                  <span>ACCESS PLATFORM</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div />
    </div>
  )
}
