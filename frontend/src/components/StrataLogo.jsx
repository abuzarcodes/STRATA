import React from 'react'

export default function StrataLogo({ size = 32, className = '', isLight = false }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="strataGrad1" x1="2" y1="6" x2="34" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor={isLight ? 'var(--color-accent-primary)' : 'var(--color-accent-primary)'} />
            <stop offset="1" stopColor={isLight ? 'var(--color-accent-primary-hover)' : 'var(--color-status-success)'} />
          </linearGradient>
          <linearGradient id="strataGrad2" x1="2" y1="14" x2="34" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor={isLight ? 'var(--color-accent-primary-hover)' : '#00E676'} />
            <stop offset="1" stopColor={isLight ? '#43A047' : '#00B0FF'} />
          </linearGradient>
          <linearGradient id="strataGrad3" x1="2" y1="22" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor={isLight ? '#388E3C' : '#76FF03'} />
            <stop offset="1" stopColor={isLight ? 'var(--color-status-success)' : 'var(--color-accent-primary)'} />
          </linearGradient>
        </defs>

        {/* Layer 1: Top 3D Spatial Plane (LoD 3 Legal Space) */}
        <path
          d="M18 4L32 10.5L18 17L4 10.5L18 4Z"
          fill="url(#strataGrad1)"
          fillOpacity={isLight ? "0.95" : "0.9"}
          stroke={isLight ? "var(--color-accent-primary)" : "#A7F3D0"}
          strokeWidth="1.2"
        />

        {/* Layer 2: Middle Spatial Plane (Floor / Unit Volumetric Prism) */}
        <path
          d="M4 17.5L18 24L32 17.5"
          stroke="url(#strataGrad2)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Layer 3: Ground / 2D Parcel Base Datum */}
        <path
          d="M4 24.5L18 31L32 24.5"
          stroke="url(#strataGrad3)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Vertical Cadastral Datum Axis */}
        <circle cx="18" cy="10.5" r="1.8" fill={isLight ? "var(--color-surface-1)" : "var(--color-bg-app)"} stroke={isLight ? "var(--color-accent-primary)" : "var(--color-accent-primary)"} strokeWidth="1" />
      </svg>
    </div>
  )
}
