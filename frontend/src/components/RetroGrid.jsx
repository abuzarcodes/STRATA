import React from 'react'

/**
 * RetroGrid component using Color Hunt palette:
 * #E8F5E9 (Foam), #A5D6A7 (Pastel Mint), #66BB6A (Vibrant Green), #1B5E20 (Deep Forest)
 */
export default function RetroGrid({
  className = '',
  angle = 65,
  theme = 'LIGHT',
  cellSize = 52,
  opacity = 0.95,
}) {
  const isLight = theme === 'LIGHT'

  // Precision 4-color mapping
  const gridColor = isLight ? 'rgba(102, 187, 106, 0.45)' : 'rgba(102, 187, 106, 0.55)'
  const subGridColor = isLight ? 'rgba(165, 214, 167, 0.35)' : 'rgba(165, 214, 167, 0.25)'

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden [perspective:450px] ${className}`}
      style={{
        opacity,
        // Center mask: fades grid in the middle so text is super crisp
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,1) 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,1) 85%)',
      }}
    >
      {/* Grid container with 3D rotation */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <div
          className="animate-retro-grid absolute -top-[60%] -left-[50%] h-[340%] w-[200%]"
          style={{
            transform: `rotateX(${angle}deg)`,
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1.5px, transparent 1.5px),
              linear-gradient(to bottom, ${gridColor} 1.5px, transparent 1.5px),
              linear-gradient(to right, ${subGridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${subGridColor} 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px, ${cellSize}px ${cellSize}px, ${cellSize / 4}px ${cellSize / 4}px, ${cellSize / 4}px ${cellSize / 4}px`,
            backgroundRepeat: 'repeat',
            transformOrigin: '50% 0',
          }}
        />
      </div>

      {/* Top and bottom gradient fades */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(to top, rgba(232, 245, 233, 0.95) 0%, rgba(232, 245, 233, 0.05) 50%, rgba(232, 245, 233, 0.95) 100%)'
            : 'linear-gradient(to top, rgba(11, 32, 14, 0.95) 0%, rgba(11, 32, 14, 0.05) 50%, rgba(11, 32, 14, 0.95) 100%)',
        }}
      />
    </div>
  )
}
