import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  ShieldAlert,
  Layers,
  FileCheck2,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  CheckCircle2,
  X,
  Radio,
  Check,
  TrendingUp,
  Scale,
  FolderKanban
} from 'lucide-react'

// Mini 3D Radar Visualizer
function MiniRadarScene() {
  const radarSweepRef = useRef()
  const buildingsGroupRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.z = t * 1.8
    }
    if (buildingsGroupRef.current) {
      buildingsGroupRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group position={[0, -2, 0]}>
      {/* Ground Grid */}
      <gridHelper args={[40, 20, '#00D084', '#1E293B']} position={[0, 0, 0]} />

      {/* Radar Sweep Circle */}
      <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={radarSweepRef}>
        <mesh>
          <ringGeometry args={[1, 16, 32]} />
          <meshBasicMaterial color="#00D084" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[8, 0, 0]}>
          <planeGeometry args={[16, 0.1]} />
          <meshBasicMaterial color="#00D084" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* City Blocks Cluster */}
      <group ref={buildingsGroupRef}>
        {/* Compliant Buildings (Solid Grey Bodies, Emerald Wireframes) */}
        <mesh position={[-6, 2.5, -4]}>
          <boxGeometry args={[4, 5, 4]} />
          <meshStandardMaterial color="#334155" transparent={false} opacity={1.0} roughness={0.65} />
        </mesh>
        <lineSegments position={[-6, 2.5, -4]}>
          <edgesGeometry args={[new THREE.BoxGeometry(4, 5, 4)]} />
          <lineBasicMaterial color="#00D084" />
        </lineSegments>

        <mesh position={[6, 4, 3]}>
          <boxGeometry args={[5, 8, 5]} />
          <meshStandardMaterial color="#334155" transparent={false} opacity={1.0} roughness={0.65} />
        </mesh>
        <lineSegments position={[6, 4, 3]}>
          <edgesGeometry args={[new THREE.BoxGeometry(5, 8, 5)]} />
          <lineBasicMaterial color="#00D084" />
        </lineSegments>

        <mesh position={[-3, 3, 5]}>
          <boxGeometry args={[3, 6, 3]} />
          <meshStandardMaterial color="#334155" transparent={false} opacity={1.0} roughness={0.65} />
        </mesh>
        <lineSegments position={[-3, 3, 5]}>
          <edgesGeometry args={[new THREE.BoxGeometry(3, 6, 3)]} />
          <lineBasicMaterial color="#00D084" />
        </lineSegments>

        {/* Encroaching Building (Pulsing Red Envelopes) */}
        <mesh position={[0, 4.5, -2]}>
          <boxGeometry args={[6, 9, 6]} />
          <meshStandardMaterial color="#F43F5E" transparent opacity={0.5} />
        </mesh>
        <lineSegments position={[0, 4.5, -2]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 9, 6)]} />
          <lineBasicMaterial color="#F43F5E" linewidth={2} />
        </lineSegments>

        {/* Illegal Cantilever Overhang Envelope */}
        <mesh position={[0, 7.5, 2]}>
          <boxGeometry args={[6, 2, 2.5]} />
          <meshStandardMaterial color="#F43F5E" transparent opacity={0.75} />
        </mesh>
        <lineSegments position={[0, 7.5, 2]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 2, 2.5)]} />
          <lineBasicMaterial color="#FFFFFF" linewidth={2} />
        </lineSegments>
      </group>
    </group>
  )
}

export default function GovtAdminDashboard({
  societyData,
  onClose,
  onFocusUnit,
  onOpenSplitModal
}) {
  const [activeNav, setActiveNav] = useState('DASHBOARD')
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-983',
      applicant: 'Anil Ambani Trust',
      ulpin: 'MH-MUM-1029-B1',
      type: 'New Title Verification',
      status: 'PENDING'
    },
    {
      id: 'APP-984',
      applicant: 'Rajesh Developers',
      ulpin: 'MH-MUM-1104-D4',
      type: 'Volumetric Subdivision',
      status: 'PENDING'
    }
  ])

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    )
  }

  const handleReject = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080E17]/95 backdrop-blur-2xl flex flex-col text-slate-100 font-sans overflow-hidden">
      {/* Top Header matching Figma Frame 13:665 */}
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
            <span className="hover:text-white cursor-pointer">Documentation</span>
            <span className="hover:text-white cursor-pointer">API</span>
            <span className="text-[#00D084] font-semibold cursor-pointer">Public Search</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080E17] border border-[#1E293B] font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-ping" />
            <span className="text-[#00D084] font-bold text-[11px]">REVENUE_ADMINISTRATOR</span>
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

      {/* Main Dashboard Layout matching Figma */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-[#0B131E] border-r border-[#1E293B] p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveNav('DASHBOARD')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-[#00D084] bg-[#00D084]/15 border border-[#00D084] flex items-center gap-3 transition-colors shadow-[0_0_15px_rgba(0,208,132,0.15)]"
            >
              <FolderKanban className="w-4 h-4 text-[#00D084]" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('QUEUE')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Approvals Queue</span>
            </button>
            <button
              onClick={() => setActiveNav('RADAR')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Encroachment Radar</span>
            </button>
            <button
              onClick={() => setActiveNav('FAR')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>FAR Audit</span>
            </button>
            <button
              onClick={() => setActiveNav('DISPUTES')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Scale className="w-4 h-4" />
              <span>Title Disputes</span>
            </button>
            <button
              onClick={() => setActiveNav('REPORTS')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Reports</span>
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

        {/* Center Main Dashboard Content Area */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Top 4 KPI Cards matching Figma Frame 13:665 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                PENDING APPROVALS
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">42</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/30">
                  +12%
                </span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                ACTIVE ENCROACHMENTS
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">08</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Critical
                </span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                FAR VIOLATIONS
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">14</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/30">
                  -3%
                </span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                REVENUE COLLECTED
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">₹4.8 Cr</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/30">
                  +18%
                </span>
              </div>
            </div>
          </div>

          {/* Center 2-Column Section: Interactive 3D AI Encroachment Radar + Alert Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Interactive 3D Radar Map View (2 cols) */}
            <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>AI Encroachment Radar Map View</span>
                  <span className="text-[11px] font-mono text-[#00D084] font-normal">(Interactive 3D Ward Orbit)</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  SCANNING LIVE WARD
                </span>
              </div>

              {/* Interactive 3D Radar Canvas */}
              <div className="w-full h-72 rounded-xl bg-[#080E17] border border-[#1E293B] relative overflow-hidden">
                <Canvas camera={{ position: [18, 14, 20], fov: 42 }}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 20, 10]} intensity={1.2} color="#00D084" />
                  <directionalLight position={[-10, -10, -10]} intensity={0.3} color="#F43F5E" />
                  <MiniRadarScene />
                  <OrbitControls enableDamping autoRotate autoRotateSpeed={0.8} />
                </Canvas>
                
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#0B131E]/90 border border-[#1E293B] text-[10px] font-mono text-slate-400">
                  Dwarka / BKC Multi-Level Cadastre Ward Mesh • WGS84 EPSG:4326
                </div>
              </div>
            </div>

            {/* Right Violation Alert Stream (1 col) matching Figma */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                VIOLATION ALERT STREAM
              </div>

              <div className="space-y-3">
                {/* Alert 1 */}
                <div className="p-4 rounded-xl bg-[#080E17] border border-rose-500/40 space-y-1.5 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:border-rose-500 transition-colors cursor-pointer">
                  <div className="text-[11px] font-mono font-bold text-rose-400">
                    ULPIN: MH-MUM-1044-A2
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Slab Encroachment on Public Space (Level 04)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Criticality: <strong className="text-rose-400">Severe</strong>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-4 rounded-xl bg-[#080E17] border border-[#1E293B] space-y-1.5 hover:border-amber-400/40 transition-colors cursor-pointer">
                  <div className="text-[11px] font-mono font-bold text-[#00D084]">
                    ULPIN: MH-MUM-1092-B3
                  </div>
                  <div className="text-xs font-semibold text-white">
                    FAR Violation: Extra terrace coverage built
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Criticality: <strong className="text-amber-400">Warning</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table: Pending Title Approval Queue matching Figma */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Pending Title Approval Queue</h3>
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080E17] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1E293B]">
                  <tr>
                    <th className="p-3.5 pl-5">APP ID</th>
                    <th className="p-3.5">APPLICANT</th>
                    <th className="p-3.5">PARCEL ULPIN</th>
                    <th className="p-3.5">MUTATION TYPE</th>
                    <th className="p-3.5 pr-5">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/70 font-medium">
                  {approvals.map((app) => (
                    <tr key={app.id} className="hover:bg-[#131F37] transition-colors">
                      <td className="p-3.5 pl-5 font-mono text-[#00D084] font-bold">{app.id}</td>
                      <td className="p-3.5 text-white font-semibold">{app.applicant}</td>
                      <td className="p-3.5 font-mono text-slate-300">{app.ulpin}</td>
                      <td className="p-3.5 text-slate-300">{app.type}</td>
                      <td className="p-3.5 pr-5">
                        {app.status === 'APPROVED' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#00D084]/20 text-[#00D084] font-mono text-[10px] font-bold">
                            APPROVED ✓
                          </span>
                        ) : app.status === 'REJECTED' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                            REJECTED ✕
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-3 py-1 rounded-lg bg-[#00D084]/20 hover:bg-[#00D084] text-[#00D084] hover:text-[#080E17] border border-[#00D084]/40 font-mono text-[10px] font-bold transition-all cursor-pointer"
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/40 font-mono text-[10px] font-bold transition-all cursor-pointer"
                            >
                              REJECT
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
