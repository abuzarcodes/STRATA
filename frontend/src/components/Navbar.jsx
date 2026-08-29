import React, { useState, useRef, useEffect } from 'react'
import {
  Layers, Search, ShieldCheck, Building2, User,
  Compass, AlertTriangle, HardHat, Sparkles, Sun, Moon,
  ChevronDown, ExternalLink, Box, Terminal, Lock, Scale, LogOut,
  FolderKanban, Check
} from 'lucide-react'
import StrataLogo from './StrataLogo'

export default function Navbar({
  societyData,
  activeRole = 'CITIZEN',
  onSelectRole,
  onOpenRoleSelect,
  searchQuery,
  onSearchChange,
  onSelectUnitFromSearch,
  onOpenUploadModal,
  onOpenLocker,
  onOpenAIReviewModal,
  onOpenGovtDashboard,
  theme = 'CYBER',
  onToggleTheme,
  onNavClick,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const isLight = theme === 'LIGHT'

  // Filter units dynamically for live search dropdown
  const filteredUnits = React.useMemo(() => {
    if (!searchQuery?.trim() || !societyData?.units) return []
    const q = searchQuery.toLowerCase().trim()
    return societyData.units
      .filter(
        (u) =>
          u.unit_id?.toLowerCase().includes(q) ||
          u.ulpin_3d?.toLowerCase().includes(q) ||
          u.name?.toLowerCase().includes(q) ||
          u.owner?.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [searchQuery, societyData])

  const roleConfigs = {
    CITIZEN: { label: 'Public Explorer', icon: Compass, color: '#00D084', badge: 'PUBLIC' },
    OWNER: { label: 'Property Owner', icon: Lock, color: '#38BDF8', badge: 'OWNER' },
    SURVEYOR: { label: 'Licensed Surveyor', icon: HardHat, color: '#A855F7', badge: 'SURVEYOR' },
    GOVT: { label: 'Revenue Admin', icon: Scale, color: '#F59E0B', badge: 'GOVT' }
  }

  const currentRole = roleConfigs[activeRole] || roleConfigs.CITIZEN
  const RoleIcon = currentRole.icon

  // Global hotkey '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        document.getElementById('cadastre-search-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-30 px-6 py-3 border-b flex items-center justify-between gap-4 backdrop-blur-2xl transition-colors duration-300 ${
        isLight
          ? 'bg-white/90 border-[#C8E6C9] text-slate-800 shadow-sm'
          : 'bg-[#060B12]/90 border-[#1E293B] text-white shadow-2xl'
      }`}
    >
      {/* Brand & National Spatial Identity */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => onNavClick && onNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to STRATA Home"
        >
          <StrataLogo size={36} isLight={isLight} className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-black text-base tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </span>
            </div>
            <p className={`text-[10px] font-mono tracking-wide font-bold uppercase ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
              Bhu-Aadhaar 3D
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav
          className={`hidden lg:flex items-center gap-5 text-xs font-mono font-bold ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          <button
            onClick={() => onNavClick && onNavClick('about')}
            className={`transition-colors cursor-pointer ${isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'}`}
          >
            About
          </button>
          <button
            onClick={() => onNavClick && onNavClick('documentation')}
            className={`transition-colors cursor-pointer ${isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'}`}
          >
            Documentation
          </button>
          <button
            onClick={() => onNavClick && onNavClick('api')}
            className={`transition-colors cursor-pointer flex items-center gap-1 ${
              isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'
            }`}
          >
            <span>REST API</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </nav>
      </div>

      {/* Global 3D-ULPIN Instant Omnibar */}
      <div className="relative flex-1 max-w-md mx-2" ref={searchRef}>
        <div className="relative">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'
            }`}
          />
          <input
            id="cadastre-search-input"
            name="cadastreSearch"
            type="text"
            aria-label="Search 3D-ULPIN, Flat number, or Owner name"
            placeholder="Search 3D-ULPIN, Flat (e.g. 104), or Owner..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setIsSearchOpen(true)
            }}
            className={`w-full pl-10 pr-9 py-2 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
              isLight
                ? 'bg-[#F9FBF9] border-[#C8E6C9] text-slate-800 placeholder-slate-400 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]'
                : 'bg-[#0B131E] border-[#1E293B] text-white placeholder-slate-500 focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]'
            }`}
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-slate-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            /
          </span>
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchOpen && filteredUnits.length > 0 && (
          <div
            className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
              isLight
                ? 'bg-white/95 border-[#C8E6C9] text-slate-800'
                : 'bg-[#0B131E]/95 border-[#1E293B] text-white'
            }`}
          >
            <div className={`px-3.5 py-2 border-b text-[10px] font-mono font-bold uppercase flex justify-between items-center ${
              isLight ? 'text-slate-500 border-slate-200 bg-[#F9FBF9]' : 'text-slate-400 border-slate-800 bg-[#0F172A]'
            }`}>
              <span>Matching 3D Cadastral Records ({filteredUnits.length})</span>
              <span>ESC to Close</span>
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
              {filteredUnits.map((u) => (
                <div
                  key={u.unit_id}
                  onClick={() => {
                    onSelectUnitFromSearch(u)
                    setIsSearchOpen(false)
                    onSearchChange('')
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isLight
                      ? 'border-transparent hover:border-[#1B5E20]/30 hover:bg-[#E8F5E9]/50'
                      : 'border-transparent hover:border-[#00D084]/40 hover:bg-[#0F172A]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                        {u.ulpin_3d}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isLight ? 'bg-slate-200 text-slate-700' : 'bg-black/40 text-slate-400'
                      }`}>
                        Level {u.level}
                      </span>
                    </div>
                    <div className="text-xs font-semibold mt-0.5">
                      {u.name} • <span className="text-slate-500">{u.owner}</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-400">
                    <div className={isLight ? 'text-[#1B5E20] font-bold' : 'text-white'}>{u.volume_m3} m³</div>
                    <div className="text-[10px] text-slate-500">{u.carpet_area_m2} m²</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls & Role Management */}
      <div className="flex items-center gap-3">
        {/* Role Pill Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-slate-700 hover:border-[#1B5E20]'
                : 'bg-[#0B131E] border-[#1E293B] text-slate-200 hover:border-[#00D084]'
            }`}
          >
            <RoleIcon className="w-4 h-4" style={{ color: currentRole.color }} />
            <span>{currentRole.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Role Dropdown */}
          {isRoleMenuOpen && (
            <div
              className={`absolute top-full right-0 mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50 backdrop-blur-2xl p-1.5 space-y-1 ${
                isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase">
                Switch Stakeholder Persona
              </div>

              {Object.entries(roleConfigs).map(([rKey, rCfg]) => {
                const Icon = rCfg.icon
                const isSelected = activeRole === rKey
                return (
                  <button
                    key={rKey}
                    onClick={() => {
                      onSelectRole(rKey)
                      setIsRoleMenuOpen(false)
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                          : 'bg-[#00D084]/20 text-[#00D084] border border-[#00D084]/30'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" style={{ color: rCfg.color }} />
                      <span>{rCfg.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                )
              })}

              <div className={`pt-1.5 mt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false)
                    if (onOpenRoleSelect) onOpenRoleSelect()
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Change Persona / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role-Specific Action Tools */}
        {activeRole === 'SURVEYOR' && (
          <button
            onClick={onOpenUploadModal}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>INGEST CAD/BIM</span>
          </button>
        )}

        {activeRole === 'OWNER' && (
          <button
            onClick={onOpenLocker}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-600/25 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>CITIZEN VAULT</span>
          </button>
        )}

        {activeRole === 'GOVT' && (
          <>
            <button
              onClick={onOpenGovtDashboard}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>COMPLIANCE DASHBOARD</span>
            </button>
            <button
              onClick={onOpenAIReviewModal}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060B12] font-mono text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI REVIEW</span>
            </button>
          </>
        )}

        {/* Global Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm ${
            isLight
              ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#E8F5E9]'
              : 'bg-[#0B131E] border-[#1E293B] text-slate-300 hover:text-[#00D084]'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#00D084]" />}
        </button>
      </div>
    </header>
  )
}
