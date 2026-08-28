import React, { useState, useEffect } from 'react'
import { Clock, Calendar, MapPin, Sun, Moon } from 'lucide-react'

export default function StatusBar({ theme = 'LIGHT', onToggleTheme }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
  const dateStr = time.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
  const isLight = theme === 'LIGHT'

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 px-6 py-2.5 glass-hud-neon-lime border-t flex items-center justify-between ${
        isLight ? 'border-t-slate-200 bg-white/95 text-slate-800' : 'border-t-[#1E2532] bg-[#06080B] text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#66BB6A]">
          <MapPin className="w-4 h-4 text-[#1B5E20]" />
        </div>
        <span className={`text-xs font-medium tracking-wide ${isLight ? 'text-[#1B5E20] font-black' : 'text-[#A5D6A7]'}`}>
          Dwarka Sec-10, Delhi
        </span>
      </div>

      <div className="flex items-center gap-5 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-[#2E7D32]' : 'text-[#66BB6A]'}`} />
          <span className={isLight ? 'text-[#1B5E20] font-bold' : 'text-[#E8F5E9]'}>{timeStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className={`w-3.5 h-3.5 ${isLight ? 'text-[#2E7D32]' : 'text-[#66BB6A]'}`} />
          <span className={isLight ? 'text-[#1B5E20] font-bold' : 'text-[#E8F5E9]'}>{dateStr}</span>
        </div>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isLight
                ? 'bg-white border-[#A5D6A7] text-[#1B5E20] hover:border-[#66BB6A] hover:bg-[#E8F5E9]'
                : 'bg-[#112F15] border-[#1B5E20] text-[#A5D6A7] hover:border-[#66BB6A] hover:text-[#FFFFFF]'
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isLight ? <Moon className="w-3.5 h-3.5 text-[#1B5E20]" /> : <Sun className="w-3.5 h-3.5 text-[#66BB6A]" />}
            <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
