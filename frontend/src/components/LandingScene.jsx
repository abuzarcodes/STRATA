import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sun, Moon, ArrowRight, ShieldCheck, Layers, Box, Globe, Sparkles, CheckCircle2 } from 'lucide-react'
import StrataLogo from './StrataLogo'

// Holographic Wireframe City Tower with Light/Dark Themes
function HologramTower({ position, size = [6, 18, 6], isLight, wireColor = '#00D084' }) {
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  
  return (
    <group position={position}>
      {/* Solid Architectural Body */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={isLight ? '#CBD5E1' : '#1E293B'}
          transparent={false}
          opacity={1.0}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>
      {/* Radiant Wireframe Outline */}
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial
          color={isLight ? '#2E7D32' : wireColor}
          transparent
          opacity={isLight ? 0.9 : 0.75}
          linewidth={1.5}
        />
      </lineSegments>
    </group>
  )
}

// 3D Isometric City Grid Scene
function HolographicCityScene({ isLight }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.035
    }
  })

  return (
    <group ref={groupRef} position={[0, -6, 0]}>
      {/* Base Spatial Coordinate Grid */}
      <gridHelper
        args={[200, 60, isLight ? '#2E7D32' : '#00D084', isLight ? '#C8E6C9' : '#1E293B']}
        position={[0, 0, 0]}
      />

      {/* Central Skyscraper Cluster */}
      <HologramTower position={[0, 14, 0]} size={[8, 28, 8]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[0, 29, 0]} size={[5, 6, 5]} isLight={isLight} wireColor="#00F0FF" />
      <HologramTower position={[0, 33, 0]} size={[1.2, 4, 1.2]} isLight={isLight} wireColor="#00D084" />

      {/* Surrounding Tower Matrix */}
      <HologramTower position={[-14, 10, -12]} size={[7, 20, 7]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[14, 9, -12]} size={[6, 18, 6]} isLight={isLight} wireColor="#00F0FF" />
      <HologramTower position={[-16, 8, 14]} size={[8, 16, 8]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[16, 11, 12]} size={[7, 22, 7]} isLight={isLight} wireColor="#00D084" />

      {/* Mid-Rise Cadastral Blocks */}
      <HologramTower position={[-26, 6, -2]} size={[10, 12, 12]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[26, 6, 2]} size={[10, 12, 12]} isLight={isLight} wireColor="#00F0FF" />
      <HologramTower position={[0, 5, -26]} size={[14, 10, 8]} isLight={isLight} wireColor="#00D084" />
      <HologramTower position={[0, 6, 28]} size={[12, 12, 10]} isLight={isLight} wireColor="#00D084" />
    </group>
  )
}

export default function LandingScene({ onScrollBegin, theme = 'CYBER', onToggleTheme, onNavClick }) {
  const isLight = theme === 'LIGHT'

  return (
    <div
      className={`fixed inset-0 z-30 flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 ${
        isLight ? 'bg-[#F4FAF5] text-slate-800' : 'bg-[#060B12] text-white'
      }`}
    >
      {/* 3D Holographic City Viewport Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [40, 32, 50], fov: 38 }} gl={{ antialias: true }}>
          <color attach="background" args={[isLight ? '#F4FAF5' : '#060B12']} />
          <ambientLight intensity={isLight ? 0.95 : 0.45} />
          <directionalLight
            position={[25, 45, 25]}
            intensity={isLight ? 1.8 : 1.6}
            color={isLight ? '#FFFFFF' : '#00D084'}
          />
          <directionalLight
            position={[-25, 25, -25]}
            intensity={0.8}
            color={isLight ? '#81C784' : '#00F0FF'}
          />
          <HolographicCityScene isLight={isLight} />
        </Canvas>
      </div>

      {/* Floating Glassmorphic Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group">
            <StrataLogo size={36} isLight={isLight} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className={`font-black text-base tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
                Bhu-Aadhaar 3D
              </div>
            </div>
          </div>

          <nav
            className={`hidden md:flex items-center gap-6 px-5 py-2 rounded-full border text-xs font-mono font-bold backdrop-blur-xl ${
              isLight
                ? 'bg-white/80 border-[#C8E6C9] text-slate-700 shadow-sm'
                : 'bg-[#0B131E]/80 border-[#1E293B] text-slate-300 shadow-lg'
            }`}
          >
            <button
              onClick={() => onNavClick && onNavClick('about')}
              className={`transition-colors cursor-pointer ${
                isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'
              }`}
            >
              About Platform
            </button>
            <span className="text-slate-500">•</span>
            <button
              onClick={() => onNavClick && onNavClick('documentation')}
              className={`transition-colors cursor-pointer ${
                isLight ? 'hover:text-[#1B5E20]' : 'hover:text-[#00D084]'
              }`}
            >
              Documentation
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-md ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#E8F5E9]'
                : 'bg-[#0B131E] border-[#1E293B] text-slate-300 hover:text-[#00D084] hover:border-[#00D084]/40'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#00D084]" />}
          </button>
        </div>
      </header>

      {/* Center Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 pointer-events-none">
        {/* Ministry Authority Capsule */}
        <div
          className={`pointer-events-auto px-4 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-wider flex items-center gap-2 mb-6 shadow-md backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500 ${
            isLight
              ? 'bg-white/90 border-[#C8E6C9] text-[#1B5E20]'
              : 'bg-[#0B131E]/90 border-[#1E293B] text-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#1B5E20]' : 'bg-[#00D084] animate-pulse'}`} />
          <span>MINISTRY OF LAND RESOURCES • GOVERNMENT OF INDIA</span>
        </div>

        {/* Clean Static Hero Title Card */}
        <div className="pointer-events-auto text-center">
          <h1
            className={`text-7xl sm:text-8xl md:text-9xl font-black tracking-[0.16em] ${
              isLight
                ? 'text-[#1B5E20] drop-shadow-[0_4px_25px_rgba(27,94,32,0.18)]'
                : 'text-white drop-shadow-[0_0_40px_rgba(0,208,132,0.35)]'
            }`}
          >
            STRATA
          </h1>

          <div
            className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.35em] font-mono uppercase mt-2 ${
              isLight
                ? 'text-[#2E7D32] drop-shadow-[0_2px_10px_rgba(46,125,50,0.25)]'
                : 'text-[#00D084] drop-shadow-[0_0_20px_rgba(0,208,132,0.6)]'
            }`}
          >
            BHU-AADHAAR 3D
          </div>
        </div>

        {/* Hero Tagline: Full Form of STRATA */}
        <p
          className={`mt-4 max-w-2xl text-sm md:text-base tracking-wide font-medium text-center px-4 leading-relaxed ${
            isLight ? 'text-slate-700' : 'text-slate-200'
          }`}
        >
          Spatial Topology & Registration Administration for Three-dimensional Assets
        </p>

        {/* 3 Geospatial Specification Capsules */}
        <div className="pointer-events-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl w-full">
          <div
            className={`p-4 rounded-2xl border shadow-xl text-left backdrop-blur-xl transition-all hover:scale-[1.02] ${
              isLight
                ? 'bg-white/90 border-[#C8E6C9]'
                : 'bg-[#0B131E]/90 border-[#1E293B] hover:border-[#00D084]/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Box className={`w-4 h-4 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`} />
              <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                ISO 19152 LADM
              </div>
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              3D Spatial Land Units
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-xl text-left backdrop-blur-xl transition-all hover:scale-[1.02] ${
              isLight
                ? 'bg-white/90 border-[#C8E6C9]'
                : 'bg-[#0B131E]/90 border-[#1E293B] hover:border-[#00D084]/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Globe className={`w-4 h-4 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`} />
              <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                OGC CityGML 3.0
              </div>
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              LoD 2–4 Watertight Polyhedra
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-xl text-left backdrop-blur-xl transition-all hover:scale-[1.02] ${
              isLight
                ? 'bg-white/90 border-[#C8E6C9]'
                : 'bg-[#0B131E]/90 border-[#1E293B] hover:border-[#00D084]/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`} />
              <div className={`font-mono font-bold text-xs ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                3D-ULPIN Minting
              </div>
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Unique Volumetric Bhu-Aadhaar
            </div>
          </div>
        </div>

        {/* Primary Hero Launch Button */}
        <div className="pointer-events-auto mt-10">
          <button
            onClick={onScrollBegin}
            className={`relative group px-9 py-4 rounded-2xl font-mono text-sm font-black tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-2xl hover:scale-105 ${
              isLight
                ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-[0_0_30px_rgba(27,94,32,0.35)]'
                : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12] shadow-[0_0_35px_rgba(0,208,132,0.6)]'
            }`}
          >
            <span>LAUNCH 3D CADASTRE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Clean Bottom Telemetry Bar */}
      <footer
        className={`relative z-10 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono gap-2 border-t backdrop-blur-md ${
          isLight ? 'bg-white/80 border-[#C8E6C9] text-slate-600' : 'bg-[#060B12]/80 border-[#1E293B]/60 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[#1B5E20]' : 'bg-[#00D084]'}`} />
          <span>BHU-AADHAAR • ISO 19152 LADM PART 2 COMPLIANT</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SECURE 3D SPATIAL LEDGER</span>
          <span>•</span>
          <span>EPSG:4326 WGS 84</span>
          <span>•</span>
          <span>EPSG:7755</span>
        </div>
      </footer>
    </div>
  )
}
