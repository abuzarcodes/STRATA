import React, { useState, useEffect } from 'react'

/**
 * Text3DFlip component inspired by MagicUI
 * Splits text into uniform character tiles that flip on a 3D axis with staggered spring animations.
 * Supports auto-cycling, interactive hover, customizable flip text, and automatic centering.
 */
export default function Text3DFlip({
  children,
  flipText,
  className = '',
  textClassName = '',
  flipTextClassName = '',
  rotateDirection = 'top', // 'top' or 'bottom'
  staggerDuration = 0.035,
  autoFlip = true,
  autoFlipInterval = 4000,
  centerAlign = true,
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const primaryRaw = typeof children === 'string' ? children : String(children || '')
  const secondaryRaw = flipText || primaryRaw

  const maxLength = Math.max(primaryRaw.length, secondaryRaw.length)

  // Pad both strings symmetrically if centerAlign is enabled
  const padCentered = (str, targetLen) => {
    if (str.length >= targetLen) return str
    const totalPad = targetLen - str.length
    const padLeft = Math.floor(totalPad / 2)
    const padRight = totalPad - padLeft
    return ' '.repeat(padLeft) + str + ' '.repeat(padRight)
  }

  const primaryText = centerAlign ? padCentered(primaryRaw, maxLength) : primaryRaw
  const secondaryText = centerAlign ? padCentered(secondaryRaw, maxLength) : secondaryRaw

  // Periodic auto-flip wave if enabled
  useEffect(() => {
    if (!autoFlip) return
    const interval = setInterval(() => {
      if (!isHovered) {
        setIsFlipped((prev) => !prev)
      }
    }, autoFlipInterval)
    return () => clearInterval(interval)
  }, [autoFlip, autoFlipInterval, isHovered])

  const characters = primaryText.split('')
  const flipCharacters = secondaryText.split('')

  const isRotateTop = rotateDirection === 'top'

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true)
        setIsFlipped(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsFlipped(false)
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none [perspective:1200px] ${className}`}
    >
      <div className="flex items-center justify-center font-mono">
        {Array.from({ length: maxLength }).map((_, idx) => {
          const char = characters[idx] !== undefined ? characters[idx] : ' '
          const flipChar = flipCharacters[idx] !== undefined ? flipCharacters[idx] : ' '

          const delay = `${idx * staggerDuration}s`

          return (
            <span
              key={idx}
              className="relative inline-flex items-center justify-center w-[0.62em] h-[1.15em] [transform-style:preserve-3d] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transitionDelay: delay,
                transform: isFlipped
                  ? isRotateTop
                    ? 'rotateX(90deg)'
                    : 'rotateX(-90deg)'
                  : 'rotateX(0deg)',
              }}
            >
              {/* Primary / Front Face */}
              <span
                className={`absolute inset-0 inline-flex items-center justify-center [backface-visibility:hidden] [transform:translateZ(0.55em)] ${textClassName}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>

              {/* Secondary / Flipped Face */}
              <span
                className={`absolute inset-0 inline-flex items-center justify-center [backface-visibility:hidden] ${
                  isRotateTop
                    ? '[transform:rotateX(-90deg)_translateZ(0.55em)]'
                    : '[transform:rotateX(90deg)_translateZ(0.55em)]'
                } ${flipTextClassName || textClassName}`}
              >
                {flipChar === ' ' ? '\u00A0' : flipChar}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
