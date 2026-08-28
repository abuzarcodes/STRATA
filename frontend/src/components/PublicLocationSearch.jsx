import React, { useState } from 'react'
import { Search, ChevronDown, CheckCircle, Sliders } from 'lucide-react'

export default function PublicLocationSearch({
  societyData,
  onFlyToTarget,
  activeFloor = 'ALL',
  onSelectFloor,
  onRetrieveModel,
  theme = 'CYBER'
}) {
  const [stateVal, setStateVal] = useState('Maharashtra')
  const [district, setDistrict] = useState('Mumbai City')
  const [taluka, setTaluka] = useState('Kurla')
  const [ward, setWard] = useState('Ward 4 - BKC')
  const [surveyNo, setSurveyNo] = useState('3D-IN-MH-MUM-1092-B3')
  const [pincode, setPincode] = useState('400051')
  const [sliderLevel, setSliderLevel] = useState(12)

  const isLight = theme === 'LIGHT'

  const handleRetrieve = (e) => {
    e.preventDefault()
    if (onRetrieveModel) {
      onRetrieveModel()
    } else if (onFlyToTarget && societyData?.units?.length > 0) {
      const targetUnit = societyData.units[0]
      onFlyToTarget({
        targetPosition: targetUnit.centroid_local,
        targetUnitId: targetUnit.unit_id,
        skipLocatePing: false,
      })
    }
  }

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10)
    setSliderLevel(val)
    if (onSelectFloor) {
      onSelectFloor(val === 0 ? 'ALL' : val)
    }
  }

  return (
    <div className={`w-80 border rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-xs font-sans pointer-events-auto transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-[#C8E6C9] text-[#1B5E20]'
        : 'bg-[#0B131E]/95 border-[#1E293B] text-white'
    }`}>
      {/* Header matching Figma Frame 11:171 */}
      <div>
        <h2 className={`text-base font-black tracking-wide ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
          Parcel Search
        </h2>
        <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
          isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'
        }`}>
          3D BHU-AADHAAR QUERY
        </p>
      </div>

      <form onSubmit={handleRetrieve} className="space-y-3">
        {/* State */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            State
          </label>
          <div className="relative">
            <select
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
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
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Mumbai City">Mumbai City</option>
              <option value="Mumbai Suburban">Mumbai Suburban</option>
              <option value="New Delhi">New Delhi</option>
              <option value="South West Delhi">South West Delhi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Taluka/Tehsil */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Taluka/Tehsil
          </label>
          <div className="relative">
            <select
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Kurla">Kurla</option>
              <option value="Andheri">Andheri</option>
              <option value="Dwarka">Dwarka</option>
              <option value="Vasant Vihar">Vasant Vihar</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Village/Ward */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Village/Ward
          </label>
          <div className="relative">
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border appearance-none text-xs focus:outline-none ${
                isLight
                  ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
              }`}
            >
              <option value="Ward 4 - BKC">Ward 4 - BKC</option>
              <option value="Ward 7 - Bandra">Ward 7 - Bandra</option>
              <option value="Dwarka Sec-10">Dwarka Sec-10</option>
              <option value="Dwarka Sec-11">Dwarka Sec-11</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Survey No / ULPIN */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Survey No / ULPIN
          </label>
          <div className="relative">
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
        </div>

        {/* Pincode */}
        <div>
          <label className={`block text-[11px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            maxLength={6}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className={`w-full px-3 py-2 rounded-lg border font-mono text-xs focus:outline-none ${
              isLight
                ? 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20] focus:border-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-200 focus:border-[#00D084]'
            }`}
          />
        </div>

        {/* Retrieve 3D Model Action Button matching Figma */}
        <button
          type="submit"
          className={`w-full py-2.5 mt-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isLight
              ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[0_0_15px_rgba(27,94,32,0.25)]'
              : 'bg-[#00D084] hover:bg-[#00b875] text-[#080E17] shadow-[0_0_20px_rgba(0,208,132,0.4)]'
          }`}
        >
          <span>RETRIEVE 3D MODEL</span>
        </button>
      </form>

      {/* Vertical Floor Slicer matching Figma */}
      <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-[#C8E6C9]' : 'border-[#1E293B]'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Vertical Floor Slicer
          </span>
          <span className={`font-mono font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            {sliderLevel === 0 ? 'ALL LEVELS' : `Floor L${sliderLevel}`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          value={sliderLevel}
          onChange={handleSliderChange}
          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
            isLight ? 'bg-[#C8E6C9] accent-[#1B5E20]' : 'bg-[#0F172A] accent-[#00D084]'
          }`}
        />
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Basement B2</span>
          <span>Level 25+</span>
        </div>
      </div>
    </div>
  )
}
