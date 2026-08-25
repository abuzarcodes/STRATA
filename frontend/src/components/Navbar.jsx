import React from 'react'
import {
  Layers,
  Search,
  ShieldCheck,
  Building2,
  User,
  Compass,
  AlertTriangle,
  FileCheck,
  HardHat
} from 'lucide-react'

export default function Navbar({
  societyData,
  activeRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  onSelectUnitFromSearch,
  onOpenUploadModal,
  onOpenLocker
}) {
  const stats = societyData?.metadata || {}
  const violationsCount = societyData?.audit_summary?.violation_count || 0

  // Filter search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !societyData?.units) return []
    const q = searchQuery.toLowerCase()
    return societyData.units
      .filter(
        (u) =>
          u.unit_id.toLowerCase().includes(q) ||
          u.ulpin_3d.toLowerCase().includes(q) ||
          u.name.toLowerCase().includes(q) ||
          u.owner.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [searchQuery, societyData])

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-6 py-3.5 glass-panel border-b border-slate-800 flex items-center justify-between gap-4">
      {/* Brand & National Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                AuraCadastre 3D
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SIH PS-011
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              3D ULPIN & Volumetric Land Administration | {stats.district || 'Dwarka, Delhi'}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">Base ULPIN:</span>
            <span className="text-sky-300 font-bold">{stats.base_ulpin || 'IND280145987621'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">Units:</span>
            <span className="text-emerald-400 font-bold">{stats.total_registered_units || 29}</span>
          </div>
          {violationsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-800/40 text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{violationsCount} Encroachments</span>
            </div>
          )}
        </div>
      </div>

      {/* Global Instant Search */}
      <div className="relative flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="cadastre-search-input"
            name="cadastreSearch"
            type="text"
            aria-label="Search 3D-ULPIN, Flat number, or Owner name"
            placeholder="Search 3D-ULPIN, Flat No. (e.g. 202), Owner name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 glass-panel-accent rounded-xl shadow-2xl p-2 z-50 max-h-64 overflow-y-auto space-y-1">
            {searchResults.map((u) => (
              <button
                key={u.unit_id}
                onClick={() => {
                  onSelectUnitFromSearch(u)
                  onSearchChange('')
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-sky-500/10 transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-sky-300">
                    {u.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">{u.ulpin_3d}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                    {u.carpet_area_m2} m² / {u.volume_m3} m³
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role Switcher & Action Tabs */}
      <div className="flex items-center gap-2">
        {/* Role Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => onSelectRole('CITIZEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'CITIZEN'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Public</span>
          </button>

          <button
            onClick={() => onSelectRole('OWNER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'OWNER'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Owner</span>
          </button>

          <button
            onClick={() => onSelectRole('SURVEYOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'SURVEYOR'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Surveyor</span>
          </button>

          <button
            onClick={() => onSelectRole('GOVT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeRole === 'GOVT'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Govt Admin</span>
          </button>
        </div>

        {/* Quick Modal Triggers based on role */}
        {activeRole === 'OWNER' && (
          <button
            onClick={onOpenLocker}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>My 3D Locker</span>
          </button>
        )}

        {activeRole === 'SURVEYOR' && (
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Upload CAD/LiDAR</span>
          </button>
        )}
      </div>
    </header>
  )
}
