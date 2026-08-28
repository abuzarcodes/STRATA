import React from 'react'
import {
  Layers,
  Search,
  ShieldCheck,
  Building2,
  User,
  Compass,
  AlertTriangle,
  HardHat,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'

export default function Navbar({
  societyData,
  activeRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  onSelectUnitFromSearch,
  onOpenUploadModal,
  onOpenLocker,
  onOpenAIReviewModal,
  theme = 'CYBER',
  onToggleTheme,
  onNavClick
}) {
  const isLight = theme === 'LIGHT'

  // Filter search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery?.trim() || !societyData?.units) return []
    const q = searchQuery.toLowerCase()
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

  const roleLabels = {
    CITIZEN: 'PUBLIC_EXPLORER',
    OWNER: 'PROPERTY_OWNER',
    SURVEYOR: 'LICENSED_SURVEYOR',
    GOVT: 'REVENUE_ADMINISTRATOR'
  }

  return (
    <header className={`absolute top-0 left-0 right-0 z-30 px-6 py-3 border-b flex items-center justify-between gap-4 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-[#C8E6C9] text-[#1B5E20]'
        : 'bg-[#0B131E]/95 border-[#1E293B] text-white'
    }`}>
      {/* Brand & National Spatial Identity matching Figma */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg p-0.5 flex items-center justify-center border shadow-md ${
            isLight
              ? 'bg-[#1B5E20]/10 border-[#1B5E20]/40'
              : 'bg-[#00D084]/20 border-[#00D084]/60 shadow-[0_0_15px_rgba(0,208,132,0.3)]'
          }`}>
            <span className={`font-mono font-black text-sm ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-base tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </span>
            </div>
            <p className={`text-[10px] font-mono tracking-wide font-medium ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
              Bhu-Aadhaar 3D
            </p>
          </div>
        </div>

        {/* Center Nav Links matching Figma */}
        <nav className={`hidden lg:flex items-center gap-6 text-xs font-medium ${
          isLight ? 'text-[#2E7D32]' : 'text-slate-400'
        }`}>
          <button
            onClick={() => onNavClick && onNavClick('about')}
            className={`transition-colors ${isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'}`}
          >
            About
          </button>
          <button
            onClick={() => onNavClick && onNavClick('documentation')}
            className={`transition-colors ${isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'}`}
          >
            Documentation
          </button>
          <button
            onClick={() => onNavClick && onNavClick('api')}
            className={`transition-colors ${isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'}`}
          >
            API
          </button>
          <button
            onClick={() => onSelectRole('CITIZEN')}
            className={`transition-colors ${
              activeRole === 'CITIZEN'
                ? isLight ? 'text-[#1B5E20] font-bold' : 'text-[#00D084] font-bold'
                : isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'
            }`}
          >
            Public Search
          </button>
        </nav>
      </div>

      {/* Global Instant 3D-ULPIN Search */}
      <div className="relative flex-1 max-w-sm mx-2">
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`} />
          <input
            id="cadastre-search-input"
            name="cadastreSearch"
            type="text"
            aria-label="Search 3D-ULPIN, Flat number, or Owner name"
            placeholder="Search 3D-ULPIN, Flat, Owner..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-8 pr-8 py-1.5 rounded-lg border text-xs focus:outline-none transition-all font-mono ${
              isLight
                ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] placeholder-slate-500 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-100 placeholder-slate-500 focus:border-[#00D084] focus:ring-1 focus:ring-[#00D084]'
            }`}
          />
          <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            isLight
              ? 'bg-white border-[#C8E6C9] text-[#1B5E20]'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            /
          </span>
        </div>

        {/* Instant Search Dropdown */}
        {searchResults.length > 0 && (
          <div className={`absolute left-0 right-0 top-full mt-2 rounded-xl border p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl ${
            isLight
              ? 'bg-white/95 border-[#A5D6A7]'
              : 'bg-[#0F172A]/95 border-[#00D084]/40'
          }`}>
            <div className={`text-[10px] font-mono px-2 py-1 uppercase tracking-wider ${isLight ? 'text-[#1B5E20] font-bold' : 'text-[#00D084]'}`}>
              Matching Records ({searchResults.length})
            </div>
            {searchResults.map((u) => (
              <button
                key={u.unit_id}
                onClick={() => {
                  onSelectUnitFromSearch(u)
                  onSearchChange('')
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-all flex items-center justify-between group ${
                  isLight
                    ? 'hover:bg-[#E8F5E9] border-transparent hover:border-[#81C784]'
                    : 'hover:bg-[#1E293B] border-transparent hover:border-[#00D084]/40'
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white group-hover:text-[#00D084]'}`}>
                    {u.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {u.ulpin_3d}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isLight
                      ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]'
                      : 'bg-slate-800/80 text-[#00D084] border-slate-700'
                  }`}>
                    L{u.level} • {u.rera_volume_m3} m³
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons & Role Cockpit */}
      <div className="flex items-center gap-3">
        {/* AI Result Review Action Button */}
        <button
          onClick={onOpenAIReviewModal}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
            isLight
              ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white'
              : 'bg-[#062817] border-[#00D084]/60 text-[#00D084] hover:bg-[#00D084] hover:text-[#0B131E] shadow-[0_0_12px_rgba(0,208,132,0.2)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Cadastre Review</span>
        </button>

        {/* Role Badge Indicator matching Figma */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
          isLight
            ? 'bg-[#F1F8E9] border-[#C8E6C9]'
            : 'bg-[#0F172A] border-[#1E293B]'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-[#1B5E20]' : 'bg-[#00D084]'}`} />
          <span className={`font-bold tracking-wider text-[11px] ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {roleLabels[activeRole] || 'PUBLIC_EXPLORER'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 text-[10px]">SYS_V2.05</span>
        </div>

        {/* Role Quick Switcher */}
        <div className={`flex items-center p-1 rounded-lg border ${
          isLight
            ? 'bg-[#F1F8E9] border-[#C8E6C9]'
            : 'bg-[#0F172A] border-[#1E293B]'
        }`}>
          <button
            onClick={() => onSelectRole('CITIZEN')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              activeRole === 'CITIZEN'
                ? isLight ? 'bg-[#1B5E20] text-white' : 'bg-[#00D084] text-[#0B131E]'
                : 'text-slate-400 hover:text-[#1B5E20]'
            }`}
            title="Public Explorer"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectRole('OWNER')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              activeRole === 'OWNER'
                ? isLight ? 'bg-[#1B5E20] text-white' : 'bg-[#00D084] text-[#0B131E]'
                : 'text-slate-400 hover:text-[#1B5E20]'
            }`}
            title="Property Owner Vault"
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectRole('SURVEYOR')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              activeRole === 'SURVEYOR'
                ? isLight ? 'bg-[#1B5E20] text-white' : 'bg-[#00D084] text-[#0B131E]'
                : 'text-slate-400 hover:text-[#1B5E20]'
            }`}
            title="Licensed Surveyor"
          >
            <HardHat className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectRole('GOVT')}
            className={`p-1.5 rounded-md text-xs transition-all ${
              activeRole === 'GOVT'
                ? isLight ? 'bg-[#1B5E20] text-white' : 'bg-[#00D084] text-[#0B131E]'
                : 'text-slate-400 hover:text-[#1B5E20]'
            }`}
            title="Revenue Administrator"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#F1F8E9]'
                : 'bg-[#0F172A] border-[#1E293B] hover:border-[#00D084] text-slate-300'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <Moon className="w-3.5 h-3.5 text-[#1B5E20]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[#00D084]" />
            )}
          </button>
        )}
      </div>
    </header>
  )
}
