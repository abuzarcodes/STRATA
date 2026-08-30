import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, CheckCircle, Sliders, Layers, MapPin, Building, Crosshair, Sparkles } from 'lucide-react'

const DELHI_HIERARCHY = {
  'South West Delhi': {
    wards: {
      'Ward 04 - Dwarka Sector 10': [
        { name: 'Aura Residency CGHS (Dwarka Sec-10)', ulpin: 'IND280145987621', pincode: '110075' },
        { name: 'Pragjyotishpur CGHS (Dwarka Sec-10)', ulpin: 'IND280145987622', pincode: '110075' },
        { name: 'Navketan Apartments (Dwarka Sec-10)', ulpin: 'IND280145987623', pincode: '110075' }
      ],
      'Ward 05 - Dwarka Sector 11 & 12': [
        { name: 'DDA SFS Pocket 4 (Dwarka Sec-11)', ulpin: 'IND280145988104', pincode: '110075' },
        { name: 'KM Apartment CGHS (Dwarka Sec-12)', ulpin: 'IND280145988210', pincode: '110078' }
      ],
      'Ward 08 - Janakpuri & Uttam Nagar': [
        { name: 'DDA C-Block Multi-Storey (Janakpuri)', ulpin: 'IND280145989301', pincode: '110058' }
      ]
    }
  },
  'New Delhi': {
    wards: {
      'Ward 01 - Connaught Place & Barakhamba': [
        { name: 'Barakhamba Commercial Tower', ulpin: 'IND280145990112', pincode: '110001' },
        { name: 'Kasturba Gandhi Marg Complex', ulpin: 'IND280145990230', pincode: '110001' }
      ],
      'Ward 02 - Lodhi Colony & Jor Bagh': [
        { name: 'Jor Bagh Multi-Level Enclave', ulpin: 'IND280145991405', pincode: '110003' }
      ]
    }
  },
  'South Delhi': {
    wards: {
      'Ward 12 - Vasant Kunj & Mehrauli': [
        { name: 'DDA Sector D Pocket 6 (Vasant Kunj)', ulpin: 'IND280145992819', pincode: '110070' },
        { name: 'Heritage City View Apartments', ulpin: 'IND280145992950', pincode: '110070' }
      ],
      'Ward 14 - Saket & Malviya Nagar': [
        { name: 'Saket Institutional District Towers', ulpin: 'IND280145993101', pincode: '110017' }
      ]
    }
  },
  'North West Delhi': {
    wards: {
      'Ward 18 - Rohini Sector 9 & 13': [
        { name: 'Varun CGHS (Rohini Sec-9)', ulpin: 'IND280145994502', pincode: '110085' },
        { name: 'DDA Netaji Subhash Complex (Rohini)', ulpin: 'IND280145994611', pincode: '110085' }
      ]
    }
  }
}

const AVAILABLE_FLOORS = [
  { id: 'ALL', label: 'All Levels', short: 'ALL' },
  { id: -1, label: 'Basement B1 (Parking)', short: 'B1' },
  { id: 0, label: 'Ground Floor (L0)', short: 'G' },
  { id: 1, label: 'Level 1 (Residential)', short: 'L1' },
  { id: 2, label: 'Level 2 (Residential)', short: 'L2' },
  { id: 3, label: 'Level 3 (Residential)', short: 'L3' },
  { id: 4, label: 'Terrace & Rooftop', short: 'R' }
]

export default function PublicLocationSearch({
  societyData,
  onFlyToTarget,
  activeFloor = 'ALL',
  onSelectFloor,
  onRetrieveModel,
  theme = 'CYBER'
}) {
  const [district, setDistrict] = useState('South West Delhi')
  const [selectedWard, setSelectedWard] = useState('Ward 04 - Dwarka Sector 10')
  const [selectedSociety, setSelectedSociety] = useState('Aura Residency CGHS (Dwarka Sec-10)')
  const [baseUlpin, setBaseUlpin] = useState('IND280145987621')

  const isLight = theme === 'LIGHT'

  // Available wards under the selected district
  const availableWards = useMemo(() => {
    return Object.keys(DELHI_HIERARCHY[district]?.wards || {})
  }, [district])

  // Available societies under the selected ward
  const availableSocieties = useMemo(() => {
    return DELHI_HIERARCHY[district]?.wards[selectedWard] || []
  }, [district, selectedWard])

  const handleDistrictChange = (newDistrict) => {
    setDistrict(newDistrict)
    const firstWard = Object.keys(DELHI_HIERARCHY[newDistrict]?.wards || {})[0] || ''
    setSelectedWard(firstWard)
    const firstSociety = DELHI_HIERARCHY[newDistrict]?.wards[firstWard]?.[0]
    if (firstSociety) {
      setSelectedSociety(firstSociety.name)
      setBaseUlpin(firstSociety.ulpin)
    }
  }

  const handleWardChange = (newWard) => {
    setSelectedWard(newWard)
    const firstSociety = DELHI_HIERARCHY[district]?.wards[newWard]?.[0]
    if (firstSociety) {
      setSelectedSociety(firstSociety.name)
      setBaseUlpin(firstSociety.ulpin)
    }
  }

  const handleSocietyChange = (societyName) => {
    setSelectedSociety(societyName)
    const found = availableSocieties.find((s) => s.name === societyName)
    if (found) {
      setBaseUlpin(found.ulpin)
    }
  }

  const handleRetrieve = (e) => {
    e?.preventDefault()
    if (onRetrieveModel) {
      onRetrieveModel()
    }
    if (onFlyToTarget && societyData?.units?.length > 0) {
      const targetUnit = societyData.units[0]
      onFlyToTarget({
        targetPosition: targetUnit.centroid_local,
        targetUnitId: targetUnit.unit_id,
        skipLocatePing: false,
      })
    }
  }

  const handleFloorClick = (floorId) => {
    if (onSelectFloor) {
      onSelectFloor(floorId)
    }
  }

  return (
    <div
      className={`w-84 border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-xs font-sans pointer-events-auto transition-colors duration-300 ${
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
            Delhi NCT 3D Spatial Drilldown
          </p>
        </div>
        <div className={`p-2 rounded-xl border ${isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]'}`}>
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      <form onSubmit={handleRetrieve} className="space-y-3">
        {/* State (Fixed to NCT of Delhi) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[11px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              State / Union Territory
            </label>
            <span className="text-[10px] font-mono text-[var(--color-accent-primary)] font-bold">STATE CODE 07</span>
          </div>
          <div
            className={`w-full px-3 py-2 rounded-xl border font-mono text-xs font-bold flex items-center justify-between ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200'
            }`}
          >
            <span>07 - NCT of Delhi</span>
            <CheckCircle className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
          </div>
        </div>

        {/* Revenue District Selector */}
        <div>
          <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Revenue District / Zone
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border appearance-none text-xs focus:outline-none font-medium transition-all ${
                isLight
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200 focus:border-[var(--color-accent-primary)]'
              }`}
            >
              {Object.keys(DELHI_HIERARCHY).map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Municipal Ward Selector (Cascaded Narrow-Down) */}
        <div>
          <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Municipal Ward / Sector
          </label>
          <div className="relative">
            <select
              value={selectedWard}
              onChange={(e) => handleWardChange(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border appearance-none text-xs focus:outline-none font-medium transition-all ${
                isLight
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200 focus:border-[var(--color-accent-primary)]'
              }`}
            >
              {availableWards.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Housing Society / Scheme (Cascaded Narrow-Down) */}
        <div>
          <label className={`block text-[11px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Housing Society / Development Scheme
          </label>
          <div className="relative">
            <select
              value={selectedSociety}
              onChange={(e) => handleSocietyChange(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border appearance-none text-xs focus:outline-none font-medium transition-all ${
                isLight
                  ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-200 focus:border-[var(--color-accent-primary)]'
              }`}
            >
              {availableSocieties.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Base 2D-ULPIN (Auto-derived) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-[11px] font-mono font-bold uppercase ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Base Surface ULPIN
            </label>
            <span className="text-[10px] font-mono text-slate-500">2D Parcel ID</span>
          </div>
          <input
            type="text"
            value={baseUlpin}
            onChange={(e) => setBaseUlpin(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border font-mono text-xs font-bold focus:outline-none ${
              isLight
                ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
                : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]'
            }`}
          />
        </div>

        {/* Retrieve 3D Model Action Button */}
        <button
          type="submit"
          className={`w-full py-3 mt-1 rounded-2xl font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isLight
              ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/25'
              : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-surface-3)] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>LOAD 3D DIGITAL TWIN</span>
        </button>
      </form>

      {/* Vertical Floor Slicer & Isolation Chips */}
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
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {AVAILABLE_FLOORS.map((fl) => {
            const isSelected = activeFloor === fl.id
            return (
              <button
                key={fl.short}
                type="button"
                onClick={() => handleFloorClick(fl.id)}
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
                {fl.short}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
