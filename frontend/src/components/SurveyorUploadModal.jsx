import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  Upload,
  Layers,
  Box,
  HardHat,
  Crosshair,
  FileCode,
  CheckCircle2,
  X,
  Compass,
  FileCheck2,
  RefreshCw,
  FolderOpen,
  Sliders
} from 'lucide-react'

// Interactive 3D Boundary Editor Scene
function BoundaryEditorScene({ isCalibrating }) {
  const meshGroupRef = useRef()

  useFrame((state) => {
    if (meshGroupRef.current && isCalibrating) {
      meshGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group position={[0, -1, 0]}>
      {/* CAD Calibration Grid */}
      <gridHelper args={[20, 10, '#00D084', '#1E293B']} position={[0, 0, 0]} />

      <group ref={meshGroupRef}>
        {/* Main Extruded Volumetric Parcel (Solid Grey Body) */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 6]} />
          <meshStandardMaterial color="#334155" transparent={false} opacity={1.0} roughness={0.65} />
        </mesh>

        {/* Precision Wireframe Edges */}
        <lineSegments position={[0, 2.5, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 6)]} />
          <lineBasicMaterial color="#00D084" linewidth={2} />
        </lineSegments>

        {/* 8 Vertex Calibration Nodes (Interactive Pulsing Spheres) */}
        {[
          [-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3],
          [-3, 5, -3], [3, 5, -3], [3, 5, 3], [-3, 5, 3]
        ].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#00D084' : '#F59E0B'} />
          </mesh>
        ))}

        {/* Dimension Line Vector from Node A to Node B */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-3, 5, -3, 3, 5, 3])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial color="#00D084" dashSize={0.4} gapSize={0.2} />
        </line>
      </group>
    </group>
  )
}

export default function SurveyorUploadModal({ onClose, onIngestSuccess }) {
  const [activeNav, setActiveNav] = useState('INGESTION')
  const [selectedGateway, setSelectedGateway] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)

  const jobs = [
    {
      id: 'JOB-401',
      location: 'Kurla East, Mumbai',
      type: 'Boundary Survey',
      status: 'Active',
      statusColor: 'text-[#00D084] bg-[#00D084]/15 border-[#00D084]/40',
      deadline: '18 Mar 2025'
    },
    {
      id: 'JOB-402',
      location: 'BKC Plot C-12',
      type: 'Subdivision',
      status: 'Review',
      statusColor: 'text-amber-400 bg-amber-400/15 border-amber-400/40',
      deadline: '24 Mar 2025'
    },
    {
      id: 'JOB-403',
      location: 'Chembur Ward 8',
      type: 'Amalgamation',
      status: 'Completed',
      statusColor: 'text-[#00D084] bg-[#00D084]/15 border-[#00D084]/40',
      deadline: 'Completed'
    }
  ]

  const handleUploadSimulate = (gatewayName) => {
    setSelectedGateway(gatewayName)
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      if (onIngestSuccess) onIngestSuccess()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080E17]/95 backdrop-blur-2xl flex flex-col text-slate-100 font-sans overflow-hidden">
      {/* Top Header matching Figma Frame 13:544 */}
      <header className="px-8 py-4 bg-[#0B131E] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00D084]/20 border border-[#00D084]/60 flex items-center justify-center">
              <span className="font-mono font-black text-sm text-[#00D084]">S</span>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white">STRATA</div>
              <div className="text-[10px] text-[#00D084] font-mono">Bhu-Aadhaar 3D</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="text-[#00D084] font-semibold cursor-pointer">Documentation</span>
            <span className="hover:text-white cursor-pointer">API</span>
            <span className="hover:text-white cursor-pointer">Public Search</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F172A] border border-[#1E293B] text-xs font-mono">
            <span className="text-[#00D084] font-bold text-[11px]">LICENSED_SURVEYOR</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[10px]">SYS_V2.05</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 3-Column Body matching Figma */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-[#0B131E] border-r border-[#1E293B] p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveNav('DASHBOARD')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('JOBS')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Survey Jobs</span>
            </button>
            <button
              onClick={() => setActiveNav('INGESTION')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-[#00D084] bg-[#00D084]/15 border border-[#00D084] flex items-center gap-3 transition-colors shadow-[0_0_15px_rgba(0,208,132,0.15)]"
            >
              <Upload className="w-4 h-4 text-[#00D084]" />
              <span>Data Ingestion</span>
            </button>
            <button
              onClick={() => setActiveNav('EDITOR')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Crosshair className="w-4 h-4" />
              <span>3D Editor</span>
            </button>
            <button
              onClick={() => setActiveNav('REPORTS')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => setActiveNav('CALIBRATION')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Calibration</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#1E293B] text-[10px] font-mono text-slate-500 space-y-1">
            <div className="text-slate-400 font-bold uppercase tracking-wider">CRYPTOGRAPHIC NODE</div>
            <div className="flex items-center gap-1.5 text-[#00D084]">
              <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
              <span>NIC-MUM-NODE-881</span>
            </div>
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Section 1: Active Survey Jobs */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Active Survey Jobs</h2>
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080E17] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1E293B]">
                  <tr>
                    <th className="p-3.5 pl-5">JOB ID</th>
                    <th className="p-3.5">LOCATION</th>
                    <th className="p-3.5">TYPE</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 pr-5">DEADLINE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/70 font-medium">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-[#131F37] transition-colors">
                      <td className="p-3.5 pl-5 font-mono text-[#00D084] font-bold">{j.id}</td>
                      <td className="p-3.5 text-white">{j.location}</td>
                      <td className="p-3.5 text-slate-300">{j.type}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${j.statusColor}`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-slate-400 font-mono">{j.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Data Ingestion Gateways matching Figma */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Data Ingestion Gateways</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BIM (IFC) */}
              <div
                onClick={() => handleUploadSimulate('BIM')}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/60 rounded-2xl p-5 cursor-pointer group transition-all shadow-xl hover:shadow-[0_0_20px_rgba(0,208,132,0.15)] flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#080E17] border border-[#1E293B] flex items-center justify-center text-[#00D084]">
                      <Box className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      DRAG & DROP
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-[#00D084] transition-colors">
                    BIM (IFC Format)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ingest native structural levels, slab heights, and vertical limits.
                  </p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#00D084]">
                  {selectedGateway === 'BIM' && isProcessing ? 'PARSING IFC GEOMETRY...' : 'SELECT .IFC FILE →'}
                </div>
              </div>

              {/* LiDAR (LAS/LAZ) */}
              <div
                onClick={() => handleUploadSimulate('LiDAR')}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/60 rounded-2xl p-5 cursor-pointer group transition-all shadow-xl hover:shadow-[0_0_20px_rgba(0,208,132,0.15)] flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#080E17] border border-[#1E293B] flex items-center justify-center text-[#00D084]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      DRAG & DROP
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-[#00D084] transition-colors">
                    LiDAR (LAS/LAZ)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Point cloud mapping with geo-referenced height datums.
                  </p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#00D084]">
                  {selectedGateway === 'LiDAR' && isProcessing ? 'PROCESSING CLOUD...' : 'SELECT .LAZ FILE →'}
                </div>
              </div>

              {/* Drone Ortho (GeoTIFF) */}
              <div
                onClick={() => handleUploadSimulate('Ortho')}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/60 rounded-2xl p-5 cursor-pointer group transition-all shadow-xl hover:shadow-[0_0_20px_rgba(0,208,132,0.15)] flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#080E17] border border-[#1E293B] flex items-center justify-center text-amber-400">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      DRAG & DROP
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-amber-400 transition-colors">
                    Drone Ortho (GeoTIFF)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    High-res surface maps aligned to survey coordinate systems.
                  </p>
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-400">
                  {selectedGateway === 'Ortho' && isProcessing ? 'GEOREFERENCING...' : 'SELECT .TIFF FILE →'}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Interactive 3D Boundary Editor */}
        <aside className="w-80 bg-[#0B131E] border-l border-[#1E293B] p-6 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>3D Boundary Editor</span>
              </h3>
              <p className="text-[10px] font-mono text-[#00D084] uppercase tracking-wider mt-0.5">
                SURVEY_VIEWPORT_PREVIEW (3D Orbit)
              </p>
            </div>

            {/* Interactive 3D Three.js Preview */}
            <div className="w-full h-52 rounded-xl bg-[#080E17] border border-[#1E293B] relative overflow-hidden mb-6">
              <Canvas camera={{ position: [10, 8, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 15, 10]} intensity={1.2} color="#00D084" />
                <BoundaryEditorScene isCalibrating={isCalibrating} />
                <OrbitControls enableDamping autoRotate autoRotateSpeed={0.5} />
              </Canvas>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0B131E]/80 border border-[#1E293B] text-[9px] font-mono text-slate-400">
                8 Vertices • Watertight
              </div>
            </div>

            {/* Calculations Box matching Figma */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                MEASUREMENT CALCULATIONS
              </div>
              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Node A to Node B</span>
                  <span className="font-mono font-bold text-[#00D084]">12.45 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Interior Splay Angle</span>
                  <span className="font-mono font-bold text-[#00D084]">90.04° Compliant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volumetric Enclosure</span>
                  <span className="font-mono font-bold text-[#00D084]">240.00 m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Figma */}
          <div className="space-y-2 pt-4">
            <button
              onClick={() => {
                setIsCalibrating(!isCalibrating)
                alert("Feature not yet implemented")
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                isCalibrating
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-[#0F172A] hover:bg-[#1E293B] border-[#1E293B] text-slate-200'
              }`}
            >
              {isCalibrating ? 'LOCK CALIBRATION' : 'CALIBRATE NODES'}
            </button>
            <button
              onClick={() => {
                alert("Feature not yet implemented");
                if (onIngestSuccess) onIngestSuccess();
              }}
              className="w-full py-2.5 rounded-xl bg-[#00D084] hover:bg-[#00b875] text-[#080E17] font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(0,208,132,0.3)] cursor-pointer"
            >
              SUBMIT BIM
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
