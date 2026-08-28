import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sun, Moon, ArrowRight } from 'lucide-react'

// Holographic Wireframe City Tower for Figma Frame 11:8 with Light/Dark Themes
function HologramTower({ position, size = [6, 18, 6], isLight, wireColor = '#00D084' }) {
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  
  return (
    <group position={position}>
      {/* Solid Architectural Grey Body */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={isLight ? '#CBD5E1' : '#334155'}
          transparent={false}
          opacity={1.0}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>
      {/* Radiant Wireframe Outline */}
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial
          color={isLight ? '#2E7D32' : wireColor}
          transparent
          opacity={isLight ? 0.9 : 0.65}
          linewidth={1.5}
        />
      </lineSegments>
    </group>
  )
}

// 3D Isometric City Grid matching Figma Frame 11:8 (NO concentric circles)
function HolographicCityScene({ isLight }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[0, -6, 0]}>
      {/* Base Grid Plane (NO circles) */}
      <gridHelper
        args={[180, 60, isLight ? '#2E7D32' : '#00D084', isLight ? '#C8E6C9' : '#1E293B']}
        position={[0, 0, 0]}
      />

      {/* Central Skyscraper Cluster */}
      <HologramTower position={[0, 14, 0]} size={[8, 28, 8]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[0, 29, 0]} size={[5, 6, 5]} isLight={isLight} wireColor="#10B981" />
      <HologramTower position={[0, 33, 0]} size={[1, 4, 1]} isLight={isLight} wireColor="#00D084" />

      {/* Surrounding Tower Matrix */}
      <HologramTower position={[-12, 10, -10]} size={[7, 20, 7]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[12, 9, -10]} size={[6, 18, 6]} isLight={isLight} wireColor="#10B981" />
      <HologramTower position={[-14, 8, 12]} size={[8, 16, 8]} isLight={isLight} wireColor="#10B981" />
      <HologramTower position={[14, 11, 10]} size={[7, 22, 7]} isLight={isLight} wireColor="#00D084" />

      {/* Mid-Rise Cadastral Blocks */}
      <HologramTower position={[-24, 6, -2]} size={[10, 12, 12]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[24, 6, 2]} size={[10, 12, 12]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[0, 5, -24]} size={[14, 10, 8]} isLight={isLight} wireColor="#10B981" />
      <HologramTower position={[0, 6, 26]} size={[12, 12, 10]} isLight={isLight} wireColor="#00D084" />
    </group>
  )
}

export default function LandingScene({ onScrollBegin, theme = 'CYBER', onToggleTheme }) {
  const isLight = theme === 'LIGHT'

  // Wheel listener for smooth scroll transition into Role Selection
  useEffect(() => {
    let accumulatedDelta = 0
    const handleWheel = (e) => {
      accumulatedDelta += e.deltaY
      if (Math.abs(accumulatedDelta) > 60) {
        onScrollBegin()
        accumulatedDelta = 0
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [onScrollBegin])

  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
        isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#060B12] text-white'
      }`}
    >
      {/* 3D Holographic City Matrix Background (Clean Grid, No Circles) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [38, 30, 48], fov: 40 }} gl={{ antialias: true }}>
          <color attach="background" args={[isLight ? '#E8F5E9' : '#060B12']} />
          <ambientLight intensity={isLight ? 0.9 : 0.4} />
          <directionalLight
            position={[20, 40, 20]}
            intensity={isLight ? 1.8 : 1.5}
            color={isLight ? '#FFFFFF' : '#00D084'}
          />
          <directionalLight
            position={[-20, 20, -20]}
            intensity={0.8}
            color={isLight ? '#66BB6A' : '#00D084'}
          />
          <HolographicCityScene isLight={isLight} />
        </Canvas>
      </div>

      {/* Top Navbar matching Figma Frame 11:8 */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isLight
                ? 'bg-[#1B5E20]/10 border-[#1B5E20]/40'
                : 'bg-[#00D084]/20 border-[#00D084]/60'
            }`}>
              <span className={`font-mono font-black text-sm ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                S
              </span>
            </div>
            <div>
              <div className={`font-extrabold text-sm tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
                Bhu-Aadhaar 3D
              </div>
            </div>
          </div>

          <nav className={`hidden md:flex items-center gap-8 text-xs font-medium ml-4 ${
            isLight ? 'text-[#2E7D32]' : 'text-slate-300'
          }`}>
            <span className={`font-semibold cursor-pointer ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              About
            </span>
            <span className="hover:opacity-80 cursor-pointer transition-opacity">Documentation</span>
            <span className="hover:opacity-80 cursor-pointer transition-opacity">API</span>
            <span className="hover:opacity-80 cursor-pointer transition-opacity">Public Search</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#F1F8E9]'
                : 'bg-[#0B131E] border-[#1E293B] text-slate-300 hover:text-[#00D084]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Launch Platform Button matching Figma */}
          <button
            onClick={onScrollBegin}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all cursor-pointer border ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white border-[#1B5E20] shadow-[0_0_15px_rgba(27,94,32,0.2)]'
                : 'bg-transparent hover:bg-[#00D084]/15 border-[#00D084] text-[#00D084] shadow-[0_0_15px_rgba(0,208,132,0.2)]'
            }`}
          >
            LAUNCH PLATFORM
          </button>
        </div>
      </header>

      {/* Center Hero Content matching Figma Frame 11:8 */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 pointer-events-none">
        {/* Ministry Badge */}
        <div className={`pointer-events-auto px-3 py-1 rounded-md border text-[11px] font-mono tracking-wider flex items-center gap-2 mb-4 ${
          isLight
            ? 'bg-white/90 border-[#C8E6C9] text-[#1B5E20]'
            : 'bg-[#0B131E]/90 border-[#1E293B] text-slate-300'
        }`}>
          <span className={`w-2 h-2 rounded-sm ${isLight ? 'bg-[#1B5E20]' : 'bg-slate-400'}`} />
          MINISTRY OF LAND RESOURCES
        </div>

        {/* Hero Titles */}
        <div className="pointer-events-auto text-center">
          <h1 className={`text-7xl sm:text-8xl md:text-9xl font-black tracking-[0.18em] ${
            isLight
              ? 'text-[#1B5E20] drop-shadow-[0_4px_20px_rgba(27,94,32,0.2)]'
              : 'text-white drop-shadow-[0_0_40px_rgba(0,208,132,0.35)]'
          }`}>
            STRATA
          </h1>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.35em] font-mono uppercase mt-2 ${
            isLight
              ? 'text-[#2E7D32] drop-shadow-[0_2px_10px_rgba(46,125,50,0.3)]'
              : 'text-[#00D084] drop-shadow-[0_0_20px_rgba(0,208,132,0.8)]'
          }`}>
            BHU-AADHAAR 3D
          </div>
        </div>

        {/* Tagline */}
        <p className={`mt-4 max-w-xl text-sm md:text-base tracking-wider font-semibold text-center px-4 leading-relaxed ${
          isLight ? 'text-[#1B5E20]' : 'text-slate-300'
        }`}>
          3D Volumetric Digital Cadastre for India
        </p>

        {/* 3 Spec Badges matching Figma Frame 11:8 */}
        <div className="pointer-events-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl w-full">
          <div className={`p-4 rounded-xl border shadow-xl text-left ${
            isLight
              ? 'bg-white/95 border-[#C8E6C9]'
              : 'bg-[#0B131E]/90 border-[#1E293B]'
          }`}>
            <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              ISO 19152 LADM
            </div>
            <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Land Administration
            </div>
          </div>

          <div className={`p-4 rounded-xl border shadow-xl text-left ${
            isLight
              ? 'bg-white/95 border-[#C8E6C9]'
              : 'bg-[#0B131E]/90 border-[#1E293B]'
          }`}>
            <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              OGC CityGML 3.0
            </div>
            <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              3D Spatial Standard
            </div>
          </div>

          <div className={`p-4 rounded-xl border shadow-xl text-left ${
            isLight
              ? 'bg-white/95 border-[#C8E6C9]'
              : 'bg-[#0B131E]/90 border-[#1E293B]'
          }`}>
            <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              ULPIN Integrated
            </div>
            <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Unique Land Parcel
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt matching Figma Frame 11:8 (NO status bar) */}
      <div
        onClick={onScrollBegin}
        className="relative z-10 pb-8 flex flex-col items-center cursor-pointer group transition-all"
      >
        <span className={`text-[11px] font-mono font-bold tracking-widest transition-colors mb-2 ${
          isLight
            ? 'text-[#1B5E20] group-hover:text-[#2E7D32]'
            : 'text-[#00D084] group-hover:text-[#00E676]'
        }`}>
          EXPLORE VOLUMETRIC SYSTEM
        </span>
        <div className={`w-5 h-8 rounded-full border-2 flex items-start justify-center p-1 transition-colors ${
          isLight
            ? 'border-[#1B5E20] group-hover:border-[#2E7D32]'
            : 'border-[#00D084] group-hover:border-[#00E676]'
        }`}>
          <div className={`w-1 h-2 rounded-full animate-bounce ${
            isLight ? 'bg-[#1B5E20] group-hover:bg-[#2E7D32]' : 'bg-[#00D084] group-hover:bg-[#00E676]'
          }`} />
        </div>
      </div>
    </div>
  )
}
