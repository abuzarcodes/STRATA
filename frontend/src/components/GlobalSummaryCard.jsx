import React from 'react'

export default function GlobalSummaryCard({ societyData, visible }) {
  if (!societyData) return null

  // Calculate some global statistics
  const totalUnits = societyData.units?.length || 0
  const violations = societyData.audit_summary?.violation_count || 0
  const totalArea = societyData.metadata?.parcel_area_sqm || 0
  const buildArea = societyData.metadata?.total_built_up_area_sqm || 0

  return (
    <div
      className={`absolute top-24 right-6 w-[340px] z-20 flex flex-col gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
      }`}
    >
      {/* Condition Panel */}
      <div className="bg-[#06080B] rounded-2xl border border-slate-800/80 p-5 shadow-2xl">
        <h2 className="text-slate-300 text-[10px] tracking-[0.2em] font-bold uppercase mb-4">SOCIETY CONDITION</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Total Units</div>
            <div className="text-xl font-medium text-white flex items-center gap-2">
              {totalUnits}
              <span className="text-neon-lime">⬢</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Encroachments</div>
            <div className="text-xl font-medium text-white flex items-center gap-2">
              {violations} Cases
              {violations > 0 ? (
                <span className="text-rose-500">⚠</span>
              ) : (
                <span className="text-emerald-400">✓</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Total Parcel Area</div>
            <div className="text-xl font-medium text-white">
              {totalArea} <span className="text-xs text-slate-400">m²</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 mb-1">Built-up Area</div>
            <div className="text-xl font-medium text-white">
              {buildArea} <span className="text-xs text-slate-400">m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ecology / Region Stats Panel */}
      <div className="bg-[#06080B] rounded-2xl border border-slate-800/80 p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-slate-300 text-[10px] tracking-[0.2em] font-bold uppercase">CADASTRE STATUS</h2>
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
          </span>
        </div>
        
        <div className="w-full h-1 bg-slate-800 rounded-full mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-neon-lime rounded-full w-[85%]" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Compliance Rate</span>
            <span className="text-xs font-mono text-white">92%</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Last Synced</span>
            <span className="text-xs font-mono text-white">2 mins ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Survey Type</span>
            <span className="text-xs font-mono text-neon-lime bg-neon-lime/10 px-2 py-0.5 rounded-md">Drone LiDAR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
