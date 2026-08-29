import React, { useState } from 'react'
import { Search, ChevronDown, CheckCircle, Sliders, Layers, MapPin, Building, Crosshair } from 'lucide-react'

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
  const [stateVal, setStateVal] = useState('Delhi NCT (07)')
  const [district, setDistrict] = useState('South West Delhi')
  const [taluka, setTaluka] = useState('Kapashera / Dwarka')
  const [ward, setWard] = useState('Sector 10 - Plot 12')
  const [surveyNo, setSurveyNo] = useState('IND280145987621')
  const [pincode, setPincode] = useState('110075')

  const isLight = theme === 'LIGHT'

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
    <div className={`w-80 border rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-xs font-sans pointer-events-auto transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-[#C8E6C9] text-slate-800'
        : 'bg-[#0B131E]/95 border-[#1E293B] text-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-base font-black tracking-wide ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
            Cadastral Query
          </h2>
          <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
            isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'
          }`}>
            3D BHU-AADHAAR SPATIAL DRILLDOWN
          </p>
        </div>
        <div className={`p-2 rounded-xl border ${isLight ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]' : 'bg-[#0F172A] border-[#1E293B] text-[#00D084]'}`}>
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      <form onSubmit={handleRetrieve} className="space-y-3">
        {/* State */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            State / UT
          </label>
          <div className="relative">
            <select
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none font-medium ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Delhi NCT (07)">07 - Delhi NCT</option>
              <option value="Maharashtra (27)">27 - Maharashtra</option>
              <option value="Karnataka (29)">29 - Karnataka</option>
              <option value="Gujarat (24)">24 - Gujarat</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* District */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            District
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none font-medium ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="South West Delhi">South West Delhi</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai City">Mumbai City</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Ward / Society */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Society / Locality
          </label>
          <div className="relative">
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none font-medium ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Sector 10 - Plot 12">Aura Residency CGHS (Dwarka Sec-10)</option>
              <option value="Sector 11 - Plot 4">DDA Pocket 4 (Dwarka Sec-11)</option>
              <option value="BKC - Bandra">BKC G-Block Complex</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Base 2D-ULPIN */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Base ULPIN (Surface Parcel)
          </label>
          <input
            type="text"
            value={surveyNo}
            onChange={(e) => setSurveyNo(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border font-mono text-xs focus:outline-none ${
              isLight
                ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
            }`}
          />
        </div>

        {/* Retrieve 3D Model Action Button */}
        <button
          type="submit"
          className={`w-full py-2.5 mt-1 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[0_0_15px_rgba(27,94,32,0.25)]'
              : 'bg-[#00D084] hover:bg-[#00b875] text-[#080E17] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>LOAD 3D DIGITAL TWIN</span>
        </button>
      </form>

      {/* Vertical Floor Slicer & Isolation Chips */}
      <div className={`pt-3 border-t space-y-2.5 ${isLight ? 'border-[#C8E6C9]' : 'border-[#1E293B]'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <Sliders className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Vertical Floor Slicer</span>
          </span>
          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full border ${
            isLight ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]' : 'bg-[#0F172A] border-[#1E293B] text-[#00D084]'
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
                className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? isLight
                      ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-sm'
                      : 'bg-[#00D084] text-[#080E17] border-[#00D084] shadow-[0_0_10px_rgba(0,208,132,0.3)]'
                    : isLight
                    ? 'bg-[#F1F8E9] border-[#C8E6C9] text-slate-700 hover:bg-[#E8F5E9]'
                    : 'bg-[#0F172A] border-[#1E293B] text-slate-300 hover:bg-[#1E293B]'
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
