import React, { useState, useMemo } from 'react'
import { KeyRound, ArrowRight, Building2, Loader } from 'lucide-react'

export default function OwnerPropertyEntry({ societyData, onFlyToTarget, flightProgress, onComplete }) {
  const [propertyCode, setPropertyCode] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Mock: list of units that belong to the "owner" — in a real app, this would be filtered by auth session
  const ownedUnits = useMemo(() => {
    if (!societyData?.units) return []
    // Show units owned by "Alok Nath" as demo owner, or all units if no match
    const ownerUnits = societyData.units.filter((u) => u.owner === 'Alok Nath')
    return ownerUnits.length > 0 ? ownerUnits : societyData.units.slice(0, 4)
  }, [societyData])

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!propertyCode.trim()) return

    // Find matching unit by code or ULPIN
    const q = propertyCode.trim().toUpperCase()
    const match = societyData?.units?.find(
      (u) => u.unit_id.toUpperCase() === q || u.ulpin_3d.toUpperCase().includes(q)
    )
    if (!match) return

    setIsSearching(true)
    onFlyToTarget({
      targetPosition: match.centroid_local,
      targetUnitId: match.unit_id,
      skipLocatePing: true,
    })
  }

  const handleQuickSelect = (unit) => {
    setPropertyCode(unit.unit_id)
    setIsSearching(true)
    onFlyToTarget({
      targetPosition: unit.centroid_local,
      targetUnitId: unit.unit_id,
      skipLocatePing: true,
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto glass-panel w-full max-w-md mx-4 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C8FF33] flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#06080B]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">Your Property</h2>
            <p className="text-xs text-slate-500">Enter property code or select from your portfolio</p>
          </div>
        </div>

        {/* Code Input */}
        {!isSearching && (
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-1.5">
              Property Code or 3D-ULPIN
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={propertyCode}
                onChange={(e) => setPropertyCode(e.target.value)}
                placeholder="FLAT-404"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A0E14] border border-[#1E2532] text-sm text-slate-100 placeholder-slate-600 font-mono tracking-widest focus:outline-none focus:border-[#C8FF33] focus:ring-1 focus:ring-[#C8FF33]/40 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#C8FF33] text-[#06080B] font-bold hover:brightness-110 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Owned units list */}
        {!isSearching && ownedUnits.length > 0 && (
          <div>
            <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-3">
              Your Registered Properties
            </p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {ownedUnits.map((unit) => (
                <button
                  key={unit.unit_id}
                  onClick={() => handleQuickSelect(unit)}
                  className="w-full glass-panel-accent p-3 flex items-center gap-3 hover:border-[#C8FF33] transition-all group cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0A0E14] border border-[#1E2532] flex items-center justify-center group-hover:border-[#C8FF33] transition-all">
                    <Building2 className="w-4 h-4 text-slate-500 group-hover:text-[#C8FF33] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#C8FF33] transition-colors truncate">
                      {unit.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      {unit.ulpin_3d}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0E14] border border-[#1E2532] text-slate-500">
                    L{unit.level}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Flight Progress */}
        {isSearching && (
          <div className="space-y-3 py-4">
            <div className="w-full h-1 rounded-full bg-[#1E2532] overflow-hidden">
              <div
                className="h-full bg-[#C8FF33] rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: flightProgress === 'FLYOVER' ? '50%'
                    : flightProgress === 'DESCEND' ? '80%'
                    : flightProgress === 'SETTLED' ? '100%'
                    : '15%'
                }}
              />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Loader className="w-4 h-4 text-[#C8FF33] animate-spin" />
              <span className="text-xs text-slate-400 font-mono">
                {flightProgress === 'FLYOVER' && 'Approaching property...'}
                {flightProgress === 'DESCEND' && 'Descending...'}
                {flightProgress === 'SETTLED' && 'Arrived ✓'}
                {!flightProgress && 'Navigating...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
