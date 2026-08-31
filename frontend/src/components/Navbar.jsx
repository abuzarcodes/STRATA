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
  activeCitizen = 'Deepak Joshi',
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
    CITIZEN: { label: 'Public Citizen (Guest)', icon: Compass, color: 'var(--color-accent-primary)', badge: 'PUBLIC' },
    OWNER: { label: `${activeCitizen} (Owner)`, icon: Lock, color: 'var(--color-status-info)', badge: 'OWNER' },
    SURVEYOR: { label: 'Er. Alok Saxena (Surveyor)', icon: HardHat, color: '#A855F7', badge: 'SURVEYOR' },
    GOVT: { label: 'SDM Dwarka (Revenue Officer)', icon: Scale, color: 'var(--color-status-warning)', badge: 'GOVT' }
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
      className="theme-surface responsive-navbar absolute top-0 left-0 right-0 z-30 h-16 px-6 border-b flex items-center justify-between gap-4 backdrop-blur-2xl transition-colors duration-300 shadow-xl"
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
              <span className="font-black text-base tracking-wider theme-text-primary">
                STRATA
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-wide font-bold uppercase theme-accent">
              Bhu-Aadhaar 3D
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-5 text-xs font-mono font-bold theme-text-muted"
        >
          <button
            onClick={() => onNavClick && onNavClick('about')}
            className="transition-colors cursor-pointer theme-hover-accent"
          >
            About
          </button>
          <button
            onClick={() => onNavClick && onNavClick('documentation')}
            className="transition-colors cursor-pointer theme-hover-accent"
          >
            Documentation
          </button>
          <button
            onClick={() => onNavClick && onNavClick('api')}
            className="transition-colors cursor-pointer flex items-center gap-1 theme-hover-accent"
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
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 theme-accent"
          />
          <input
            id="cadastre-search-input"
            name="cadastreSearch"
            type="text"
            aria-label="Search 3D-ULPIN, Building, Tower, or Owner name"
            placeholder="Search 3D-ULPIN, Building / Tower (e.g. T-01, P-04), or Owner..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setIsSearchOpen(true)
            }}
            className="theme-input theme-focus w-full pl-10 pr-9 py-2 rounded-xl border text-xs font-mono transition-all focus:outline-none"
          />
          <span
            className="theme-surface-secondary absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border theme-text-muted"
          >
            /
          </span>
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchOpen && filteredUnits.length > 0 && (
          <div
              className="theme-surface absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="theme-surface-secondary theme-text-muted px-3.5 py-2 border-b text-[10px] font-mono font-bold uppercase flex justify-between items-center">
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
                  className="theme-hover-surface p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs theme-accent">
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
                    <div className={isLight ? 'text-[var(--color-accent-primary)] font-bold' : 'text-white'}>{u.rera_volume_m3 || u.volume_m3} m³</div>
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
        {/* Authenticated Persona & Role Pill */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="theme-surface theme-hover-surface px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RoleIcon className="w-4 h-4" style={{ color: currentRole.color }} />
            <span>{currentRole.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Session Details & Sign Out Modal */}
          {isRoleMenuOpen && (
            <div
              className="theme-surface absolute top-full right-0 mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden z-50 backdrop-blur-2xl p-3 space-y-3"
            >
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Authenticated Session
                </div>
                <div className="text-xs font-bold theme-text-primary mt-0.5">
                  {currentRole.label}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SESSION VERIFIED & LOCKED</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-default)] text-[11px] font-mono text-slate-400 space-y-1">
                <div>Role Access: <strong className="text-slate-200">{currentRole.badge}</strong></div>
                <div>Status: <strong className="text-emerald-400">Authorized</strong></div>
              </div>

              <div className="theme-divider pt-2 border-t">
                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false)
                    if (onOpenRoleSelect) onOpenRoleSelect()
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Role</span>
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
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[var(--color-bg-app)] font-mono text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
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
              ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
              : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-slate-300 hover:text-[var(--color-accent-primary)]'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[var(--color-accent-primary)]" />}
        </button>
      </div>
    </header>
  )
}
