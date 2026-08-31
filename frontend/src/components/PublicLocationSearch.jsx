import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, CheckCircle, Sliders, Layers, MapPin, Building, Crosshair, Sparkles } from 'lucide-react'

const DWARKA_SECTOR10_BLOCKS = [
  {
    id: 'BLOCK_A',
    name: 'Aura Residency CGHS (Towers A & B)',
    type: 'Multi-Storey Residential (G+5)',
    ulpin: 'IND280145987621',
    pincode: '110075',
    centroid: [-8, 6, -6],
    unitCount: 16
  },
  {
    id: 'BLOCK_B',
    name: 'Sector 10 Commercial Arcade & Market Plaza',
    type: 'Commercial Retail & Offices (G+2)',
    ulpin: 'IND280145987622',
    pincode: '110075',
    centroid: [10, 4, -8],
    unitCount: 7
  },
  {
    id: 'BLOCK_C',
    name: 'Vardhman Mahavir Heights (Tower C)',
    type: 'Residential Society (G+3)',
    ulpin: 'IND280145987623',
    pincode: '110075',
    centroid: [-8, 6, 10],
    unitCount: 6
  },
  {
    id: 'BLOCK_D',
    name: 'Sector 10 Plotted Row Houses (Block D)',
    type: 'Plotted Duplex Bungalows (G+1)',
    ulpin: 'IND280145987624',
    pincode: '110075',
    centroid: [10, 4, 10],
    unitCount: 2
  },
  {
    id: 'CORRIDOR_U',
    name: 'Subsurface Blue Line Metro & Utilities',
    type: 'Subterranean Corridor (Level -1 / -2)',
    ulpin: 'IND280145987625',
    pincode: '110075',
    centroid: [0, -3, 0],
    unitCount: 3
  }
]

const AVAILABLE_FLOORS = [
  { id: 'ALL', label: 'All Levels', short: 'ALL' },
  { id: -2, label: 'Metro Tunnel (L-2)', short: 'B2' },
  { id: -1, label: 'Basement Parking (B1)', short: 'B1' },
  { id: 0, label: 'Ground Floor (G)', short: 'G' },
  { id: 1, label: 'Level 1', short: 'L1' },
  { id: 2, label: 'Level 2', short: 'L2' },
  { id: 3, label: 'Level 3', short: 'L3' },
  { id: 4, label: 'Level 4 / Penthouse', short: 'L4' },
  { id: 5, label: 'Terrace & Solar Roof', short: 'R' }
]

export default function PublicLocationSearch({
  societyData,
  onFlyToTarget,
  activeFloor = 'ALL',
  onSelectFloor,
  onRetrieveModel,
  theme = 'CYBER'
}) {
  const [selectedBlockId, setSelectedBlockId] = useState('BLOCK_A')
  const isLight = theme === 'LIGHT'

  const selectedBlock = DWARKA_SECTOR10_BLOCKS.find((b) => b.id === selectedBlockId) || DWARKA_SECTOR10_BLOCKS[0]

  const handleBlockChange = (blockId) => {
    setSelectedBlockId(blockId)
    const block = DWARKA_SECTOR10_BLOCKS.find((b) => b.id === blockId)
    if (block && onFlyToTarget) {
      onFlyToTarget({
        targetPosition: block.centroid,
        targetUnitId: null
      })
    }
  }

  const handleRetrieve = (e) => {
    e?.preventDefault()
    if (onRetrieveModel) onRetrieveModel()
    if (onFlyToTarget && selectedBlock) {
      onFlyToTarget({
        targetPosition: selectedBlock.centroid,
        targetUnitId: null
      })
    }
  }

  return (
    <div
      className={`responsive-query-panel w-84 border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-xs font-sans pointer-events-auto transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-[var(--color-border-default)] text-slate-800 shadow-[0_15px_45px_rgba(27,94,32,0.12)]'
          : 'bg-[var(--color-surface-1)]/95 border-[var(--color-border-default)] text-white shadow-[0_15px_50px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Header */}
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
        <div className={`p-2 rounded-xl border ${isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]'}`}>
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      <form onSubmit={handleRetrieve} className="space-y-3">
        {/* State & Zone */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[11px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              State & Revenue District
            </label>
            <span className="text-[10px] font-mono text-[var(--color-accent-primary)] font-bold">STATE CODE 07</span>
          </div>
          <div
            className={`w-full px-3 py-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-between ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200'
            }`}
          >
            <span>07 - NCT of Delhi / South West Delhi</span>
            <CheckCircle className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
          </div>
        </div>

        {/* Municipal Ward */}
        <div>
          <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Municipal Ward / Sector
          </label>
          <div
            className={`w-full px-3 py-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-between ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-slate-700' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200'
            }`}
          >
            <span>Ward 04 - Dwarka Sector 10</span>
            <span className="text-[10px] text-slate-400 font-normal">PIN 110075</span>
          </div>
        </div>

        {/* Urban Block / Complex Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[11px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Urban Block / Society Complex
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              {selectedBlock.unitCount} Units
            </span>
          </div>
          <div className="relative">
            <select
              value={selectedBlockId}
              onChange={(e) => handleBlockChange(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border appearance-none text-xs focus:outline-none font-bold transition-all ${
                isLight
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200 focus:border-[var(--color-accent-primary)]'
              }`}
            >
              {DWARKA_SECTOR10_BLOCKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Base ULPIN Readout */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between font-mono ${
            isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Base Surface ULPIN</div>
            <div className="text-xs font-bold text-[var(--color-accent-primary)] mt-0.5">
              {selectedBlock.ulpin}
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded border border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)] font-bold">
            3D PARCEL
          </span>
        </div>

        {/* Load 3D Twin Button */}
        <button
          type="submit"
          className={`w-full py-3 mt-1 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isLight
              ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/25'
              : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-surface-3)] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>NAVIGATE TO BLOCK</span>
        </button>
      </form>

      {/* Vertical Floor Slicer */}
      <div className={`pt-3 border-t space-y-2.5 ${isLight ? 'border-[var(--color-border-default)]' : 'border-[var(--color-border-default)]'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <Sliders className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
            <span>Vertical Floor Slicer</span>
          </span>
          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full border ${
            isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]'
          }`}>
            {activeFloor === 'ALL' ? 'ALL FLOORS' : `LEVEL ${activeFloor}`}
          </span>
        </div>

        {/* Floor Quick Chips */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {AVAILABLE_FLOORS.map((fl) => {
            const isSelected = activeFloor === fl.id
            return (
              <button
                key={fl.short}
                type="button"
                onClick={() => onSelectFloor && onSelectFloor(fl.id)}
                className={`py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? isLight
                      ? 'bg-[var(--color-accent-primary)] text-white border-[var(--color-accent-primary)] shadow-sm'
                      : 'bg-[var(--color-accent-primary)] text-[var(--color-surface-3)] border-[var(--color-accent-primary)] shadow-[0_0_10px_rgba(0,208,132,0.3)]'
                    : isLight
                    ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-700 hover:bg-[var(--color-surface-muted)]'
                    : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-300 hover:bg-[var(--color-border-default)]'
                }`}
                title={fl.label}
              >
                {fl.short} ({fl.label.split('(')[0].trim()})
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
