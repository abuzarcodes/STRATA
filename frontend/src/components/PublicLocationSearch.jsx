import React, { useState } from 'react'
import {
  Search, ChevronDown, CheckCircle, Sliders, Layers,
  MapPin, Building, Crosshair, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react'

const DWARKA_SECTOR10_ZONES = [
  {
    id: 'ZONE_HIGHRISE',
    name: 'Aura Heights Gated Enclave (Towers T01 - T12)',
    type: 'High-Rise Residential (12 to 22 Storeys)',
    ulpin: 'IND280145987621',
    pincode: '110075',
    centroid: [-28, 20, 30],
    unitCount: 12
  },
  {
    id: 'ZONE_PLOTTED',
    name: 'Sector 10 Plotted Enclave (Plots P01 - P16)',
    type: 'Low-Rise Villas & Builder Floors (G+2 / G+3)',
    ulpin: 'IND280145987624',
    pincode: '110075',
    centroid: [28, 6, 30],
    unitCount: 16
  },
  {
    id: 'ZONE_COMMERCIAL',
    name: 'Commercial & Corporate District (Plazas C01 - C08)',
    type: 'Retail, Banks & Tech Offices (G+4 to G+8)',
    ulpin: 'IND280145987622',
    pincode: '110075',
    centroid: [-28, 12, -30],
    unitCount: 8
  },
  {
    id: 'ZONE_CIVIC',
    name: 'Civic, Healthcare & Police Campus (CIV01 - CIV06)',
    type: 'Hospital, DDA Sports, Library & Substation',
    ulpin: 'IND280145987625',
    pincode: '110075',
    centroid: [28, 8, -30],
    unitCount: 6
  },
  {
    id: 'ZONE_SUBSURFACE',
    name: 'Subsurface DMRC Blue Line Metro Corridor',
    type: 'Subterranean Transit & 11kV Conduits',
    ulpin: 'IND280145987626',
    pincode: '110075',
    centroid: [0, -3, 0],
    unitCount: 2
  }
]

export default function PublicLocationSearch({
  societyData,
  onFlyToTarget,
  activeFloor = 'ALL',
  onSelectFloor,
  onRetrieveModel,
  theme = 'CYBER'
}) {
  const [selectedZoneId, setSelectedZoneId] = useState('ZONE_HIGHRISE')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isLight = theme === 'LIGHT'

  const selectedZone = DWARKA_SECTOR10_ZONES.find((z) => z.id === selectedZoneId) || DWARKA_SECTOR10_ZONES[0]

  const handleZoneChange = (zoneId) => {
    setSelectedZoneId(zoneId)
    const zone = DWARKA_SECTOR10_ZONES.find((z) => z.id === zoneId)
    if (zone && onFlyToTarget) {
      onFlyToTarget({
        targetPosition: zone.centroid,
        targetUnitId: null
      })
    }
  }

  const handleRetrieve = (e) => {
    e?.preventDefault()
    if (onRetrieveModel) onRetrieveModel()
    if (onFlyToTarget && selectedZone) {
      onFlyToTarget({
        targetPosition: selectedZone.centroid,
        targetUnitId: null
      })
    }
  }

  // Collapsed Minimal Tab
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className={`pointer-events-auto px-4 py-2.5 rounded-2xl border shadow-2xl flex items-center gap-2.5 font-mono text-xs font-bold transition-all duration-300 cursor-pointer ${
          isLight
            ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-slate-50 shadow-md'
            : 'bg-[#071216] border-[var(--color-border-default)] text-white hover:border-[var(--color-accent-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
        }`}
        title="Open Cadastral Query Panel"
      >
        <MapPin className="w-4 h-4 text-[var(--color-accent-primary)]" />
        <span>Cadastral Query</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    )
  }

  return (
    <div
      className={`responsive-query-panel relative w-84 border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-3.5 text-xs font-sans pointer-events-auto transition-all duration-300 ${
        isLight
          ? 'bg-white/95 border-[var(--color-border-default)] text-slate-800 shadow-[0_15px_45px_rgba(27,94,32,0.12)]'
          : 'bg-[var(--color-surface-1)]/95 border-[var(--color-border-default)] text-white shadow-[0_15px_50px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Header & Collapse Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)] animate-pulse'}`} />
            <h2 className={`text-base font-black tracking-wide ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              Cadastral Query
            </h2>
          </div>
          <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
            isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'
          }`}>
            Dwarka Sector 10 Digital Twin
          </p>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
            isLight
              ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-slate-600 hover:text-[var(--color-accent-primary)]'
              : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-400 hover:text-white'
          }`}
          title="Hide Query Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleRetrieve} className="space-y-3">
        {/* State & Zone */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              State & Revenue District
            </label>
            <span className="text-[9px] font-mono text-[var(--color-accent-primary)] font-bold">STATE CODE 07</span>
          </div>
          <div
            className={`w-full px-3 py-1.5 rounded-xl border font-mono text-[11px] font-bold flex items-center justify-between ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200'
            }`}
          >
            <span>07 - NCT of Delhi / South West Delhi</span>
            <CheckCircle className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
          </div>
        </div>

        {/* Municipal Ward */}
        <div>
          <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Municipal Ward / Sector
          </label>
          <div
            className={`w-full px-3 py-1.5 rounded-xl border font-mono text-[11px] font-bold flex items-center justify-between ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-slate-700' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200'
            }`}
          >
            <span>Ward 04 - Dwarka Sector 10</span>
            <span className="text-[10px] text-slate-400 font-normal">PIN 110075</span>
          </div>
        </div>

        {/* Sector Enclave Zone Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Cadastral Enclave / Sector Zone
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              {selectedZone.unitCount} Buildings
            </span>
          </div>
          <div className="relative">
            <select
              value={selectedZoneId}
              onChange={(e) => handleZoneChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border appearance-none text-xs focus:outline-none font-bold transition-all ${
                isLight
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200 focus:border-[var(--color-accent-primary)]'
              }`}
            >
              {DWARKA_SECTOR10_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Base ULPIN Readout */}
        <div
          className={`p-2.5 rounded-2xl border flex items-center justify-between font-mono ${
            isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase">Sector ULPIN</div>
            <div className="text-xs font-bold text-[var(--color-accent-primary)] mt-0.5">
              {selectedZone.ulpin}
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded border border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)] font-bold">
            AUTHORITATIVE
          </span>
        </div>

        {/* Navigate to Zone Button */}
        <button
          type="submit"
          className={`w-full py-2.5 mt-1 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isLight
              ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/25'
              : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-surface-3)] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>FOCUS ON ENCLAVE</span>
        </button>
      </form>
    </div>
  )
}
