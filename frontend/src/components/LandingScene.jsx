import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  CircleDot,
  Database,
  Globe2,
  Layers3,
  Moon,
  Orbit,
  ScanLine,
  ShieldCheck,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react'
import StrataLogo from './StrataLogo'

const SIGNALS = [
  { label: 'AIR RIGHTS', value: '04', color: '#c8ff33' },
  { label: 'SUBSURFACE', value: '02', color: '#7ee7d2' },
  { label: 'REGISTERED', value: '128', color: '#f4f0e8' },
]

function playInteractionSound(audioContextRef, muted, cue = 'tower') {
  if (muted || typeof window === 'undefined') return

  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  if (!audioContextRef.current) audioContextRef.current = new AudioContext()
  const context = audioContextRef.current
  if (context.state === 'suspended') context.resume()

  const now = context.currentTime
  const master = context.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(cue === 'scan' ? 0.12 : 0.08, now + 0.012)
  master.gain.exponentialRampToValueAtTime(0.0001, now + (cue === 'scan' ? 0.42 : 0.2))
  master.connect(context.destination)

  const oscillator = context.createOscillator()
  oscillator.type = cue === 'scan' ? 'sine' : 'triangle'
  oscillator.frequency.setValueAtTime(cue === 'scan' ? 180 : 280, now)
  oscillator.frequency.exponentialRampToValueAtTime(cue === 'scan' ? 62 : 680, now + (cue === 'scan' ? 0.34 : 0.14))
  oscillator.connect(master)
  oscillator.start(now)
  oscillator.stop(now + (cue === 'scan' ? 0.42 : 0.2))

  if (cue === 'tower') {
    const harmonic = context.createOscillator()
    const harmonicGain = context.createGain()
    harmonic.type = 'sine'
    harmonic.frequency.setValueAtTime(560, now)
    harmonic.frequency.exponentialRampToValueAtTime(920, now + 0.12)
    harmonicGain.gain.setValueAtTime(0.0001, now)
    harmonicGain.gain.exponentialRampToValueAtTime(0.035, now + 0.015)
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    harmonic.connect(harmonicGain)
    harmonicGain.connect(context.destination)
    harmonic.start(now)
    harmonic.stop(now + 0.17)
  }
}

function HologramTower({
  position,
  size = [6, 18, 6],
  isLight,
  wireColor = '#c8ff33',
  opacity = 1,
  towerId,
  active = false,
  onHover,
  onClick,
}) {
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  const towerRef = useRef(null)
  const fillColor = isLight ? '#d6e5dc' : '#10252a'
  const edgeColor = active ? '#f4f0e8' : isLight ? '#1b5e4d' : wireColor

  useFrame(() => {
    if (!towerRef.current) return
    const targetScale = active ? 1.035 : 1
    const nextScale = THREE.MathUtils.lerp(towerRef.current.scale.x, targetScale, 0.16)
    towerRef.current.scale.setScalar(nextScale)
  })

  return (
    <group
      ref={towerRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover?.(towerId)
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHover?.(null)
      }}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(towerId)
      }}
    >
      <mesh>
        <boxGeometry args={size} />
          <meshStandardMaterial
          color={fillColor}
          transparent
          opacity={opacity * (isLight ? 0.78 : 0.72)}
          roughness={0.52}
          metalness={0.18}
          emissive={active ? wireColor : '#000000'}
          emissiveIntensity={active ? 0.38 : 0}
        />
      </mesh>
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial color={edgeColor} transparent opacity={opacity * (isLight ? 0.68 : 0.9)} />
      </lineSegments>
      {active && (
        <mesh position={[0, size[1] / 2 + 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.22, 32]} />
          <meshBasicMaterial color={wireColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function SignalBeacon({ position, color }) {
  const groupRef = useRef(null)
  const ringRef = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(t * 1.7 + position[0]) * 0.18
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + ((Math.sin(t * 2.2 + position[2]) + 1) / 2) * 0.6)
      ringRef.current.material.opacity = 0.22 + ((Math.sin(t * 2.2 + position[2]) + 1) / 2) * 0.35
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.38, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function HolographicCityScene({ isLight, onTowerSelect, onScanPulse }) {
  const { pointer } = useThree()
  const groupRef = useRef(null)
  const scanRef = useRef(null)
  const scanRippleRef = useRef(null)
  const scanPulseRef = useRef(0)
  const [activeTower, setActiveTower] = useState(null)

  const handleTowerSelect = (towerId) => {
    setActiveTower(towerId)
    onTowerSelect?.(towerId)
    window.setTimeout(() => setActiveTower(null), 900)
  }

  const handleScanClick = (event) => {
    event.stopPropagation()
    scanPulseRef.current = 1
    onScanPulse?.()
  }

  const towerProps = (towerId) => ({
    towerId,
    active: activeTower === towerId,
    onHover: setActiveTower,
    onClick: handleTowerSelect,
  })

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const delta = state.clock.getDelta()
    const pointerX = pointer.x || 0
    const pointerY = pointer.y || 0

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.027 + pointerX * 0.055, 0.035)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointerY * -0.026, 0.035)
      groupRef.current.position.y = -6 + Math.sin(t * 0.24) * 0.15
    }
    if (scanRef.current) {
      scanPulseRef.current = Math.max(0, scanPulseRef.current - delta * 2.8)
      const pulse = scanPulseRef.current
      scanRef.current.position.y = 4 + Math.sin(t * 0.42) * 8
      scanRef.current.scale.setScalar(1 + pulse * 0.035)
      scanRef.current.material.opacity = 0.07 + ((Math.sin(t * 0.42) + 1) / 2) * 0.08 + pulse * 0.18
    }
    if (scanRippleRef.current) {
      const pulse = scanPulseRef.current
      scanRippleRef.current.position.y = scanRef.current?.position.y || 4
      scanRippleRef.current.scale.setScalar(1 + (1 - pulse) * 1.6)
      scanRippleRef.current.material.opacity = pulse * 0.46
    }
  })

  return (
    <>
      <group ref={groupRef} position={[0, -6, 0]}>
        <gridHelper
          args={[180, 46, isLight ? '#2e7d63' : '#7ee7d2', isLight ? '#c5ded4' : '#18343a']}
          position={[0, 0, 0]}
          raycast={() => null}
        />
        <HologramTower position={[0, 15, 0]} size={[8, 30, 8]} isLight={isLight} wireColor="#c8ff33" {...towerProps('core')} />
        <HologramTower position={[0, 32, 0]} size={[4.8, 6, 4.8]} isLight={isLight} wireColor="#7ee7d2" {...towerProps('spire')} />
        <HologramTower position={[0, 36, 0]} size={[1.2, 3, 1.2]} isLight={isLight} wireColor="#c8ff33" {...towerProps('antenna')} />
        <HologramTower position={[-14, 11, -12]} size={[7, 22, 7]} isLight={isLight} wireColor="#7ee7d2" opacity={0.84} {...towerProps('northwest')} />
        <HologramTower position={[15, 10, -12]} size={[6, 19, 6]} isLight={isLight} wireColor="#c8ff33" opacity={0.84} {...towerProps('northeast')} />
        <HologramTower position={[-17, 8, 14]} size={[8, 16, 8]} isLight={isLight} wireColor="#c8ff33" opacity={0.74} {...towerProps('southwest')} />
        <HologramTower position={[17, 12, 13]} size={[7, 23, 7]} isLight={isLight} wireColor="#7ee7d2" opacity={0.76} {...towerProps('southeast')} />
        <HologramTower position={[-28, 7, -2]} size={[10, 14, 12]} isLight={isLight} wireColor="#c8ff33" opacity={0.62} {...towerProps('west')} />
        <HologramTower position={[28, 7, 2]} size={[10, 14, 12]} isLight={isLight} wireColor="#7ee7d2" opacity={0.62} {...towerProps('east')} />
        <HologramTower position={[0, 5, -27]} size={[14, 10, 8]} isLight={isLight} wireColor="#c8ff33" opacity={0.52} {...towerProps('south')} />
        <HologramTower position={[1, 6, 28]} size={[12, 12, 10]} isLight={isLight} wireColor="#7ee7d2" opacity={0.52} {...towerProps('foreground')} />
        <SignalBeacon position={[-14, 23, -12]} color="#7ee7d2" />
        <SignalBeacon position={[15, 20, -12]} color="#c8ff33" />
        <SignalBeacon position={[17, 23, 13]} color="#f4f0e8" />
      </group>
      <mesh
        ref={scanRef}
        rotation={[0, 0, 0]}
        position={[0, 5, 0]}
        onPointerDown={handleScanClick}
      >
        <boxGeometry args={[78, 0.08, 78]} />
        <meshBasicMaterial color={isLight ? '#2e7d63' : '#c8ff33'} transparent opacity={0.1} />
      </mesh>
      <mesh ref={scanRippleRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <ringGeometry args={[6, 6.08, 64]} />
        <meshBasicMaterial color={isLight ? '#2e7d63' : '#c8ff33'} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

function DataChip({ icon: Icon, label, value, detail, isLight, accent = 'mint', delay = 0 }) {
  const accentClass = accent === 'lime' ? 'landing-accent-lime' : 'landing-accent-mint'

  return (
    <div className={`landing-data-chip ${isLight ? 'landing-data-chip-light' : ''} landing-reveal`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`landing-chip-icon ${accentClass}`}>
        <Icon size={15} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="landing-chip-label">{label}</div>
        <div className={`landing-chip-value ${isLight ? 'text-[#173b36]' : 'text-[#f4f0e8]'}`}>{value}</div>
        <div className={`landing-chip-detail ${isLight ? 'text-[#4d6d64]' : 'text-[#87aaa1]'}`}>{detail}</div>
      </div>
    </div>
  )
}

export default function LandingScene({ onScrollBegin, theme = 'CYBER', onToggleTheme, onNavClick }) {
  const isLight = theme === 'LIGHT'
  const audioContextRef = useRef(null)
  const [activeSignal, setActiveSignal] = useState(0)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return window.localStorage.getItem('strata-audio-muted') === 'true'
    } catch {
      return false
    }
  })
  const [interactionMessage, setInteractionMessage] = useState('Hover a tower to inspect it')
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % SIGNALS.length)
    }, 3000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('strata-audio-muted', String(isMuted))
    } catch {
      // Audio preference persistence is optional.
    }
  }, [isMuted])

  useEffect(() => () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close()
  }, [])

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleTowerSelect = (towerId) => {
    playInteractionSound(audioContextRef, isMuted, 'tower')
    setInteractionMessage(`Tower ${towerId} selected · spatial pulse sent`)
    window.setTimeout(() => setInteractionMessage('Hover a tower to inspect it'), 2200)
  }

  const handleScanPulse = () => {
    playInteractionSound(audioContextRef, isMuted, 'scan')
    setInteractionMessage('Scan pulse dispatched · recalibrating spatial layer')
    window.setTimeout(() => setInteractionMessage('Hover a tower to inspect it'), 2200)
  }

  return (
    <div
      className={`strata-landing ${isLight ? 'strata-landing-light' : ''}`}
      data-theme={theme}
      onPointerMove={handlePointerMove}
      style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` }}
    >
      <div className="landing-ambient landing-ambient-one" />
      <div className="landing-ambient landing-ambient-two" />
      <div className="landing-noise" />

      <div className="landing-canvas-layer fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Canvas
          camera={{ position: [40, 31, 50], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ pointerEvents: 'none' }}
        >
          <color attach="background" args={[isLight ? '#edf4ef' : '#071216']} />
          <fog attach="fog" args={[isLight ? '#edf4ef' : '#071216', 48, 138]} />
          <ambientLight intensity={isLight ? 1.1 : 0.55} />
          <directionalLight position={[25, 45, 25]} intensity={isLight ? 1.7 : 1.7} color={isLight ? '#ffffff' : '#a5e9d4'} />
          <directionalLight position={[-25, 25, -25]} intensity={0.8} color={isLight ? '#b2dfcc' : '#c8ff33'} />
          <pointLight position={[0, 15, 14]} intensity={isLight ? 10 : 13} distance={75} color={isLight ? '#c8ff33' : '#7ee7d2'} />
          <HolographicCityScene isLight={isLight} onTowerSelect={handleTowerSelect} onScanPulse={handleScanPulse} />
        </Canvas>
      </div>

      <div className="landing-grid-overlay" />
      <div className="landing-vignette" />

      <header className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
        <button className="landing-brand landing-reveal" onClick={() => onNavClick?.('landing')} aria-label="Return to STRATA landing page">
          <span className="landing-brand-mark">
            <StrataLogo size={39} isLight={isLight} />
          </span>
          <span>
            <span className={`landing-brand-name ${isLight ? 'text-[#173b36]' : 'text-[#f4f0e8]'}`}>STRATA</span>
            <span className={`landing-brand-subtitle ${isLight ? 'text-[#2e7d63]' : 'text-[#7ee7d2]'}`}>BHU-AADHAAR 3D</span>
          </span>
        </button>

        <nav className="landing-nav landing-reveal delay-1" aria-label="Primary navigation">
          <button onClick={() => onNavClick?.('about')}>About platform</button>
          <button onClick={() => onNavClick?.('documentation')}>Documentation</button>
          <span className="landing-nav-divider" />
          <span className="landing-nav-status"><span className="landing-status-dot" /> Registry online</span>
        </nav>

        <div className="flex items-center gap-3 landing-reveal delay-2">
          <div className="hidden rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#87aaa1] sm:block">
            v2.6 / Delhi pilot
          </div>
          <button
            onClick={() => setIsMuted((muted) => !muted)}
            className="landing-theme-toggle"
            title={isMuted ? 'Enable interaction sounds' : 'Mute interaction sounds'}
            aria-label={isMuted ? 'Enable interaction sounds' : 'Mute interaction sounds'}
            aria-pressed={isMuted}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onToggleTheme}
            className="landing-theme-toggle"
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      <main className="landing-hero-section relative z-10 mx-auto flex min-h-0 w-full max-w-[1480px] flex-1 flex-col justify-center px-5 pb-7 pt-2 sm:px-8 lg:px-12 lg:pb-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)] lg:gap-16">
          <section className="max-w-[650px]">
            <div className={`landing-kicker landing-reveal ${isLight ? 'landing-kicker-light' : ''}`}>
              <span className="landing-kicker-line" />
              <span>National 3D cadastral infrastructure</span>
              <span className="landing-kicker-code">/ 01</span>
            </div>

            <h1 className={`landing-headline landing-reveal delay-1 ${isLight ? 'landing-headline-light' : ''}`}>
              See the land
              <span>between</span>
              <em>the lines.</em>
            </h1>

            <p className={`landing-lede landing-reveal delay-2 ${isLight ? 'landing-lede-light' : ''}`}>
              STRATA turns layered property records into a living 3D registry—so rights, boundaries, and the spaces between them are finally legible.
            </p>

            <div className="landing-hero-actions landing-reveal delay-3">
              <button onClick={onScrollBegin} className="landing-primary-action">
                <span>Enter the registry</span>
                <ArrowRight size={17} />
              </button>
            </div>

            <div className={`landing-proof-row landing-reveal delay-4 ${isLight ? 'landing-proof-row-light' : ''}`}>
              <div className="landing-proof-avatar-stack" aria-hidden="true">
                <span className="landing-proof-avatar avatar-one">IN</span>
                <span className="landing-proof-avatar avatar-two">DL</span>
                <span className="landing-proof-avatar avatar-three">3D</span>
              </div>
              <div>
                <div className={`landing-proof-title ${isLight ? 'text-[#173b36]' : 'text-[#f4f0e8]'}`}>Built for the ground truth</div>
                <div className={`landing-proof-caption ${isLight ? 'text-[#4d6d64]' : 'text-[#87aaa1]'}`}>ISO 19152 LADM · CityGML 3.0 · EPSG:4326</div>
              </div>
            </div>
          </section>

          <section className="relative min-h-[390px] lg:min-h-[540px]" aria-label="Live registry preview">
            <div className="landing-orbit-label landing-reveal delay-2">
              <Orbit size={14} />
              <span>Live volumetric index</span>
            </div>

            <div className="landing-preview-card landing-reveal delay-2">
              <div className="landing-preview-topline">
                <div>
                  <div className="landing-preview-eyebrow">Spatial unit / 001284</div>
                  <div className={`landing-preview-title ${isLight ? 'text-[#173b36]' : 'text-[#f4f0e8]'}`}>Dwarka Sector 10</div>
                </div>
                <span className="landing-preview-chip"><span className="landing-status-dot" /> verified</span>
              </div>
              <div className="landing-preview-coordinates">
                <span>28°34'56.3&quot; N</span>
                <span>77°03'36.7&quot; E</span>
                <span>+215.0 MSL</span>
              </div>
              <div className="landing-preview-scanline" />
              <div className="landing-preview-footer">
                <span>3D-ULPIN <strong>IN-DL-DWR-001284</strong></span>
                <span className="landing-preview-footer-arrow"><ChevronRight size={14} /></span>
              </div>
            </div>

            <div className="landing-signal-card landing-reveal delay-3 pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="landing-signal-heading"><ScanLine size={14} /> Spatial audit pulse</div>
                <span className="landing-signal-time">00:03:12</span>
              </div>
              <div className="landing-signal-main">
                <div className="landing-signal-value">{SIGNALS[activeSignal].value}</div>
                <div>
                  <div className="landing-signal-label">{SIGNALS[activeSignal].label}</div>
                  <div className="landing-signal-copy">records flagged for review</div>
                </div>
              </div>
              <div className="landing-signal-bars" aria-hidden="true">
                {SIGNALS.map((signal, index) => (
                  <button
                    key={signal.label}
                    onClick={() => setActiveSignal(index)}
                    className={`landing-signal-bar ${index === activeSignal ? 'is-active' : ''}`}
                    style={{ '--signal-color': signal.color, '--signal-height': `${34 + index * 19}%` }}
                    aria-label={`Show ${signal.label} audit signal`}
                  />
                ))}
              </div>
            </div>

            <div className="landing-interaction-hud landing-reveal delay-4" aria-live="polite">
              <div className="landing-interaction-heading"><CircleDot size={13} /><span>3D interaction layer</span></div>
              <div className="landing-interaction-message">{interactionMessage}</div>
              <div className="landing-interaction-legend"><span><i className="landing-legend-dot landing-legend-dot-hover" /> hover to elevate</span><span><i className="landing-legend-dot landing-legend-dot-click" /> click to scan</span></div>
            </div>

            <div className="landing-floating-tag landing-floating-tag-one landing-reveal delay-4"><CircleDot size={13} /><span>LOD 2—4</span></div>
            <div className="landing-floating-tag landing-floating-tag-two landing-reveal delay-5"><Check size={13} /><span>Watertight geometry</span></div>
          </section>
        </div>

        <div className="landing-data-grid mt-8 lg:mt-5">
          <DataChip icon={Layers3} label="Cadastre layer" value="ISO 19152 LADM" detail="Rights + restrictions + responsibilities" isLight={isLight} accent="lime" delay={420} />
          <DataChip icon={Globe2} label="City model" value="CityGML 3.0" detail="Buildings mapped as volumes" isLight={isLight} delay={500} />
          <DataChip icon={ShieldCheck} label="Identity layer" value="3D-ULPIN" detail="One unique key per spatial unit" isLight={isLight} accent="lime" delay={580} />
          <DataChip icon={Database} label="Authority" value="DILRMP ready" detail="A trusted public record" isLight={isLight} delay={660} />
        </div>
      </main>

      <section id="landing-field-notes" className={`landing-field-notes relative z-20 mx-auto w-full max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28 ${isLight ? 'landing-field-notes-light' : ''}`}>
        <div className="landing-field-notes-intro">
          <div className="landing-section-kicker"><span className="landing-kicker-line" /><span>Field notes / 02</span></div>
          <h2 className="landing-section-title">One registry.<br /><span>Every dimension.</span></h2>
          <p className="landing-section-lede">A parcel is more than a footprint. STRATA connects geometry, identity, and legal context in one spatial record built to be inspected, shared, and trusted.</p>
        </div>
        <div className="landing-field-notes-grid">
          <article className="landing-note-card">
            <span className="landing-note-index">01</span>
            <div className="landing-note-icon">⌘</div>
            <h3>See the volume</h3>
            <p>Move from flat parcel lines to watertight building volumes, floor by floor and boundary by boundary.</p>
            <span className="landing-note-meta">CityGML 3.0 / LOD 2—4</span>
          </article>
          <article className="landing-note-card">
            <span className="landing-note-index">02</span>
            <div className="landing-note-icon">◎</div>
            <h3>Trace the rights</h3>
            <p>Keep ownership, restrictions, responsibilities, and mutations attached to the same spatial unit.</p>
            <span className="landing-note-meta">ISO 19152 LADM / Part 2</span>
          </article>
          <article className="landing-note-card">
            <span className="landing-note-index">03</span>
            <div className="landing-note-icon">↗</div>
            <h3>Act with confidence</h3>
            <p>Give every stakeholder a clear audit trail—from public lookup to certified surveyor and revenue workflows.</p>
            <span className="landing-note-meta">3D-ULPIN / DILRMP ready</span>
          </article>
        </div>
        <div className="landing-field-notes-footer"><span>Spatial records, made legible.</span><span>Scroll to explore the registry ↓</span></div>
      </section>

      <footer className={`relative z-20 mx-auto flex w-full max-w-[1480px] flex-col gap-3 border-t px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 ${isLight ? 'border-[#b9d8ca] text-[#4d6d64]' : 'border-white/10 text-[#77968e]'}`}>
        <div className="flex items-center gap-3"><span className="landing-footer-pulse" /> <span>Registry status: authoritative</span></div>
        <div className="flex flex-wrap gap-x-5 gap-y-1"><span>Part 2 compliant</span><span>EPSG:7755</span><span>Delhi / India</span></div>
      </footer>
    </div>
  )
}
