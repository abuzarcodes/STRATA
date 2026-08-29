import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  Upload, Layers, Box, HardHat, Crosshair,
  FileCode, CheckCircle2, X, Compass, FileCheck2,
  RefreshCw, FolderOpen, Sliders, ShieldCheck, Sparkles,
  Check
} from 'lucide-react'
import confetti from 'canvas-confetti'
import StrataLogo from './StrataLogo'

// Interactive 3D Boundary Calibration Scene
function BoundaryEditorScene({ isCalibrating, isLight }) {
  const meshGroupRef = useRef()

  useFrame((state) => {
    if (meshGroupRef.current && isCalibrating) {
      meshGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group position={[0, -1, 0]}>
      <gridHelper args={[20, 10, isLight ? '#1B5E20' : '#00D084', isLight ? '#C8E6C9' : '#1E293B']} position={[0, 0, 0]} />

      <group ref={meshGroupRef}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 6]} />
          <meshStandardMaterial color={isLight ? '#CBD5E1' : '#334155'} roughness={0.65} />
        </mesh>

        <lineSegments position={[0, 2.5, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 6)]} />
          <lineBasicMaterial color={isLight ? '#1B5E20' : '#00D084'} linewidth={2} />
        </lineSegments>

        {/* 8 Vertex Calibration Nodes */}
        {[
          [-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3],
          [-3, 5, -3], [3, 5, -3], [3, 5, 3], [-3, 5, 3]
        ].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#00D084' : '#F59E0B'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function SurveyorUploadModal({ onClose, onIngestSuccess, theme = 'CYBER' }) {
  const [activeNav, setActiveNav] = useState('INGESTION')
  const [selectedGateway, setSelectedGateway] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  const isLight = theme === 'LIGHT'

  const handleUploadSimulate = (gatewayName) => {
    setSelectedGateway(gatewayName)
    setIsProcessing(true)
    setSuccessMessage(null)

    setTimeout(() => {
      setIsProcessing(false)
      setSuccessMessage(`Successfully parsed ${gatewayName} architectural spatial boundaries. Certified 2-manifold watertight mesh (Euler χ=2). Minted 3D-ULPIN IND280145987621-A+04-89C1.`)
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      if (onIngestSuccess) {
        onIngestSuccess({
          gateway: gatewayName,
          ulpin_3d: 'IND280145987621-A+04-89C1',
          name: 'Surveyor Verified Spatial Unit L4',
          volume: 245.0,
          area: 87.5
        })
      }
    }, 1200)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col font-sans overflow-hidden backdrop-blur-2xl transition-colors duration-500 ${
        isLight ? 'bg-[#F4FAF5]/95 text-slate-800' : 'bg-[#060B12]/95 text-slate-100'
      }`}
    >
      {/* Top Header */}
      <header
        className={`px-8 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
          isLight ? 'bg-white/90 border-[#C8E6C9]' : 'bg-[#0B131E]/90 border-[#1E293B]'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <StrataLogo size={34} isLight={isLight} />
            <div>
              <div className={`font-black text-sm tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>
                Surveyor 3D Ingestion & Extrusion Studio
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${
              isLight ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]' : 'bg-[#080E17] border-[#1E293B] text-slate-300'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-[11px]">LICENSED_SURVEYOR_NODE</span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-slate-600 hover:text-[#1B5E20]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`w-64 border-r p-4 flex flex-col justify-between flex-shrink-0 backdrop-blur-xl ${
            isLight ? 'bg-white/80 border-[#C8E6C9]' : 'bg-[#0B131E]/80 border-[#1E293B]'
          }`}
        >
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveNav('INGESTION')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'INGESTION'
                  ? isLight
                    ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                    : 'bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/40 shadow-[0_0_15px_rgba(0,208,132,0.15)]'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Data Ingestion</span>
            </button>

            <button
              onClick={() => setActiveNav('EDITOR')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'EDITOR'
                  ? isLight
                    ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                    : 'bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/40'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>3D Boundary Calibrator</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
            <div className="font-bold uppercase tracking-wider">TOPOLOGY ENGINE</div>
            <div className={`flex items-center gap-1.5 font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
              <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
              <span>EULER χ=2 WATERTIGHT</span>
            </div>
          </div>
        </aside>

        {/* Center Canvas / Ingestion Area */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Success Banner */}
            {successMessage && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-200 ${
                isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              }`}>
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs font-semibold">{successMessage}</div>
              </div>
            )}

            {/* Dropzone Gateways Grid */}
            <div className="space-y-4">
              <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                Spatial File Gateways (Auto 2.5D Extrusion)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Gateway 1: CAD / BIM */}
                <div
                  onClick={() => handleUploadSimulate('BIM/CAD (IFC/DXF)')}
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] ${
                    isLight ? 'bg-white border-[#C8E6C9] hover:border-[#1B5E20]' : 'bg-[#0B131E] border-[#1E293B] hover:border-[#00D084]/60'
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4">
                      <Box className="w-6 h-6" />
                    </div>
                    <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      BIM / CAD Models
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct parsing of IFC 4.0, AutoCAD DXF, and LandXML architectural floor boundaries.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    CLICK TO INGEST IFC / DXF
                  </div>
                </div>

                {/* Gateway 2: LiDAR Point Clouds */}
                <div
                  onClick={() => handleUploadSimulate('LiDAR Point Cloud (LAS/LAZ)')}
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] ${
                    isLight ? 'bg-white border-[#C8E6C9] hover:border-[#1B5E20]' : 'bg-[#0B131E] border-[#1E293B] hover:border-[#00D084]/60'
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center mb-4">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      LiDAR / Drone Mesh
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Dense point cloud mesh reconstruction with automated roof plane detection (LAS/LAZ).
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                    CLICK TO INGEST LAS / OBJ
                  </div>
                </div>

                {/* Gateway 3: GIS 2.5D GeoJSON */}
                <div
                  onClick={() => handleUploadSimulate('2.5D GeoJSON Footprints')}
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] ${
                    isLight ? 'bg-white border-[#C8E6C9] hover:border-[#1B5E20]' : 'bg-[#0B131E] border-[#1E293B] hover:border-[#00D084]/60'
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      2.5D Cadastral Footprints
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Extrude building footprint polygons into true 3D polyhedra using min/max elevation tags.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    CLICK TO INGEST GEOJSON
                  </div>
                </div>
              </div>
            </div>

            {/* Ingestion Processing Indicator */}
            {isProcessing && (
              <div
                className={`p-6 rounded-3xl border flex items-center gap-4 animate-in zoom-in-95 duration-200 ${
                  isLight ? 'bg-white border-[#1B5E20] text-[#1B5E20]' : 'bg-[#0B131E] border-[#00D084] text-[#00D084]'
                }`}
              >
                <RefreshCw className="w-6 h-6 animate-spin" />
                <div>
                  <div className="font-bold text-sm">Processing {selectedGateway} Ingestion & Extrusion...</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Validating Euler formula χ = V - E + F = 2 • Minting 3D-ULPIN Checksum
                  </div>
                </div>
              </div>
            )}

            {/* 3D Interactive Calibration Preview */}
            <div
              className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`text-base font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                  Real-time 3D Boundary Vertex Calibration Canvas
                </h4>
                <button
                  onClick={() => setIsCalibrating(!isCalibrating)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCalibrating
                      ? 'bg-amber-500 text-[#060B12] border-amber-500'
                      : isLight
                      ? 'bg-white border-[#C8E6C9] text-slate-700'
                      : 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                  }`}
                >
                  {isCalibrating ? 'PAUSE CALIBRATION' : 'ROTATE CALIBRATION'}
                </button>
              </div>

              <div className="w-full h-80 rounded-2xl bg-black/40 border border-slate-700/50 relative overflow-hidden">
                <Canvas camera={{ position: [12, 10, 12], fov: 40 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 15, 10]} intensity={1.2} color="#00D084" />
                  <BoundaryEditorScene isCalibrating={isCalibrating} isLight={isLight} />
                  <OrbitControls enableDamping />
                </Canvas>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 border border-slate-700 text-[10px] font-mono text-slate-300">
                  Cadastral Boundary Mesh Node Inspector • Snap Tolerance: 0.001m
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
