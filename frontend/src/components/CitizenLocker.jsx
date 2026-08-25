import React from 'react'
import {
  FileCheck,
  Building,
  KeyRound,
  Download,
  ExternalLink,
  QrCode,
  ShieldCheck,
  X,
  CreditCard,
  Layers
} from 'lucide-react'

export default function CitizenLocker({
  societyData,
  onClose,
  onSelectUnit
}) {
  // Filter sample properties owned by logged-in citizen (e.g. Rajesh Kumar)
  const myProperties = societyData?.units?.filter(
    (u) => u.owner.includes('Rajesh Kumar') || u.unit_id === 'FLAT-101' || u.unit_id === 'PARK-B101'
  ) || []

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-panel-accent rounded-3xl p-6 shadow-2xl border border-emerald-500/30 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DigiLocker / Bhu-Aadhaar Authenticated</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                My 3D Cadastral Property Vault
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="my-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-slate-950 font-black text-sm">
              RK
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Rajesh Kumar</h4>
              <p className="text-slate-400 font-mono">Aadhaar: XXXX-XXXX-4912 • Delhi Resident</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Citizen
            </span>
          </div>
        </div>

        {/* Owned 3D Units List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Registered 3D Volumetric Holdings ({myProperties.length})
          </div>

          {myProperties.map((unit) => (
            <div
              key={unit.unit_id}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-300">
                    {unit.ulpin_3d}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {unit.type}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100">{unit.name}</h4>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                  <span>Carpet: <strong className="text-slate-200">{unit.carpet_area_m2} m²</strong></span>
                  <span>Volume: <strong className="text-emerald-400">{unit.volume_m3} m³</strong></span>
                  <span>Level: <strong className="text-slate-200">{unit.level}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose()
                    onSelectUnit(unit)
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 transition-all"
                >
                  View in 3D
                </button>

                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(unit, null, 2))
                    const dl = document.createElement('a')
                    dl.setAttribute("href", dataStr)
                    dl.setAttribute("download", `3D_DEED_${unit.ulpin_3d}.json`)
                    dl.click()
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Download Deed Certificate"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Municipal Tax Estimate */}
        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 font-medium">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Volumetric Property Tax (MCD Delhi, FY 2026-27):</span>
          </div>
          <div className="font-mono font-bold text-emerald-400 text-sm">
            ₹ 14,280 <span className="text-[10px] text-slate-400 font-normal">/ year</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  )
}
