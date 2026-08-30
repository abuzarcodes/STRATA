import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ArrowDownRight,
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
} from 'lucide-react'
import StrataLogo from './StrataLogo'

const SIGNALS = [
  { label: 'AIR RIGHTS', value: '04', color: '#c8ff33' },
  { label: 'SUBSURFACE', value: '02', color: '#7ee7d2' },
  { label: 'REGISTERED', value: '128', color: '#f4f0e8' },
]

function HologramTower({ position, size = [6, 18, 6], isLight, wireColor = '#c8ff33', opacity = 1 }) {
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  const fillColor = isLight ? '#d6e5dc' : '#10252a'
  const edgeColor = isLight ? '#1b5e4d' : wireColor

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={fillColor}
          transparent
          opacity={opacity * (isLight ? 0.78 : 0.72)}
          roughness={0.52}
          metalness={0.18}
        />
      </mesh>
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial color={edgeColor} transparent opacity={opacity * (isLight ? 0.68 : 0.9)} />
      </lineSegments>
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

function HolographicCityScene({ isLight }) {
  const groupRef = useRef(null)
  const scanRef = useRef(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.027
      groupRef.current.position.y = -6 + Math.sin(t * 0.24) * 0.15
    }
    if (scanRef.current) {
      scanRef.current.position.y = 4 + Math.sin(t * 0.42) * 8
      scanRef.current.material.opacity = 0.07 + ((Math.sin(t * 0.42) + 1) / 2) * 0.08
    }
  })

  return (
    <>
      <group ref={groupRef} position={[0, -6, 0]}>
        <gridHelper
          args={[180, 46, isLight ? '#2e7d63' : '#7ee7d2', isLight ? '#c5ded4' : '#18343a']}
          position={[0, 0, 0]}
        />
        <HologramTower position={[0, 15, 0]} size={[8, 30, 8]} isLight={isLight} wireColor="#c8ff33" />
        <HologramTower position={[0, 32, 0]} size={[4.8, 6, 4.8]} isLight={isLight} wireColor="#7ee7d2" />
        <HologramTower position={[0, 36, 0]} size={[1.2, 3, 1.2]} isLight={isLight} wireColor="#c8ff33" />
        <HologramTower position={[-14, 11, -12]} size={[7, 22, 7]} isLight={isLight} wireColor="#7ee7d2" opacity={0.84} />
        <HologramTower position={[15, 10, -12]} size={[6, 19, 6]} isLight={isLight} wireColor="#c8ff33" opacity={0.84} />
        <HologramTower position={[-17, 8, 14]} size={[8, 16, 8]} isLight={isLight} wireColor="#c8ff33" opacity={0.74} />
        <HologramTower position={[17, 12, 13]} size={[7, 23, 7]} isLight={isLight} wireColor="#7ee7d2" opacity={0.76} />
        <HologramTower position={[-28, 7, -2]} size={[10, 14, 12]} isLight={isLight} wireColor="#c8ff33" opacity={0.62} />
        <HologramTower position={[28, 7, 2]} size={[10, 14, 12]} isLight={isLight} wireColor="#7ee7d2" opacity={0.62} />
        <HologramTower position={[0, 5, -27]} size={[14, 10, 8]} isLight={isLight} wireColor="#c8ff33" opacity={0.52} />
        <HologramTower position={[1, 6, 28]} size={[12, 12, 10]} isLight={isLight} wireColor="#7ee7d2" opacity={0.52} />
        <SignalBeacon position={[-14, 23, -12]} color="#7ee7d2" />
        <SignalBeacon position={[15, 20, -12]} color="#c8ff33" />
        <SignalBeacon position={[17, 23, 13]} color="#f4f0e8" />
      </group>
      <mesh ref={scanRef} rotation={[0, 0, 0]} position={[0, 5, 0]}>
        <boxGeometry args={[78, 0.08, 78]} />
        <meshBasicMaterial color={isLight ? '#2e7d63' : '#c8ff33'} transparent opacity={0.1} />
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
  const [activeSignal, setActiveSignal] = useState(0)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % SIGNALS.length)
    }, 3000)
    return () => window.clearInterval(interval)
  }, [])

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
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

      <div className="absolute inset-0 z-0 overflow-hidden">
        <Canvas camera={{ position: [40, 31, 50], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={[isLight ? '#edf4ef' : '#071216']} />
          <fog attach="fog" args={[isLight ? '#edf4ef' : '#071216', 48, 138]} />
          <ambientLight intensity={isLight ? 1.1 : 0.55} />
          <directionalLight position={[25, 45, 25]} intensity={isLight ? 1.7 : 1.7} color={isLight ? '#ffffff' : '#a5e9d4'} />
          <directionalLight position={[-25, 25, -25]} intensity={0.8} color={isLight ? '#b2dfcc' : '#c8ff33'} />
          <pointLight position={[0, 15, 14]} intensity={isLight ? 10 : 13} distance={75} color={isLight ? '#c8ff33' : '#7ee7d2'} />
          <HolographicCityScene isLight={isLight} />
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
            onClick={onToggleTheme}
            className="landing-theme-toggle"
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1480px] flex-1 flex-col justify-center px-5 pb-7 pt-2 sm:px-8 lg:px-12 lg:pb-10">
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
              <button onClick={() => onNavClick?.('documentation')} className={`landing-secondary-action ${isLight ? 'landing-secondary-action-light' : ''}`}>
                <span>Read the field notes</span>
                <ArrowDownRight size={17} />
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

            <div className="landing-signal-card landing-reveal delay-3">
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

      <footer className={`relative z-20 mx-auto flex w-full max-w-[1480px] flex-col gap-3 border-t px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 ${isLight ? 'border-[#b9d8ca] text-[#4d6d64]' : 'border-white/10 text-[#77968e]'}`}>
        <div className="flex items-center gap-3"><span className="landing-footer-pulse" /> <span>Registry status: authoritative</span></div>
        <div className="flex flex-wrap gap-x-5 gap-y-1"><span>Part 2 compliant</span><span>EPSG:7755</span><span>Delhi / India</span></div>
      </footer>
    </div>
  )
}
