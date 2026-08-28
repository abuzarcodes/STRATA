import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  Home,
  FileText,
  Clock,
  AlertCircle,
  Settings,
  ShieldCheck,
  Download,
  Share2,
  X,
  ExternalLink,
  Layers,
  Building,
  CheckCircle2,
  Radio
} from 'lucide-react'

// Mini 3D Floor Plan Preview for Apartment Card
function MiniFloorPlan() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Outer Wall Boundary */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(7, 2.5, 5)]} />
        <lineBasicMaterial color="#00D084" linewidth={2} />
      </lineSegments>
      {/* Interior Room Partitions */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.1, 2.4, 4.8]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.5} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2.8, 2.4, 0.1]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.5} />
      </mesh>
      {/* Floor Plate with grey base */}
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Mini 3D Commercial Suite Tower
function MiniCommercialTower() {
  return (
    <group position={[0, -1, 0]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[4, 5, 4]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.7} />
      </mesh>
      <lineSegments position={[0, 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 5, 4)]} />
        <lineBasicMaterial color="#F59E0B" linewidth={2} />
      </lineSegments>
      {/* Floor Slabs */}
      {[-0.5, 0.7, 1.9, 3.1, 4.3].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color="#F59E0B" wireframe transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export default function CitizenLocker({ onClose, onFocusUnit }) {
  const [activeNav, setActiveNav] = useState('PROPERTIES')

  const deeds = [
    {
      id: 'd1',
      title: 'Sale Deed - BKC Heights Floor 12',
      date: '14 Jan 2025',
      size: '4.2 MB',
      verified: true
    },
    {
      id: 'd2',
      title: 'Encumbrance Certificate (EC)',
      date: '28 Jan 2025',
      size: '1.8 MB',
      verified: true
    },
    {
      id: 'd3',
      title: 'Property Tax Receipt FY 2024-25',
      date: '02 Feb 2025',
      size: '840 KB',
      verified: true
    }
  ]

  const mutations = [
    {
      date: '14 Jan 2025',
      title: 'Sale Transfer',
      desc: 'A. S. Kumar → Priya Nair',
      status: 'Completed',
      statusColor: 'text-[#00D084] bg-[#00D084]/15 border-[#00D084]/40'
    },
    {
      date: '08 Feb 2025',
      title: 'Partition Deed',
      desc: 'BKC Family Trust Split',
      status: 'Pending Approval',
      statusColor: 'text-amber-400 bg-amber-400/15 border-amber-400/40'
    },
    {
      date: '22 Feb 2025',
      title: 'Mortgage NOC',
      desc: 'SBI Bank Clearance',
      status: 'Under Review',
      statusColor: 'text-sky-400 bg-sky-400/15 border-sky-400/40'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 bg-[#080E17]/95 backdrop-blur-2xl flex flex-col text-slate-100 font-sans overflow-hidden">
      {/* Top Header matching Figma Frame 13:396 */}
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F172A] border border-[#1E293B] text-xs font-mono">
            <span className="text-[#00D084] font-bold text-[11px]">PROPERTY_OWNER</span>
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

      {/* 3-Column Dashboard Body matching Figma */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 bg-[#0B131E] border-r border-[#1E293B] p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveNav('DASHBOARD')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Building className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveNav('PROPERTIES')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-[#00D084] bg-[#00D084]/15 border border-[#00D084] flex items-center gap-3 transition-colors shadow-[0_0_15px_rgba(0,208,132,0.15)]"
            >
              <Home className="w-4 h-4 text-[#00D084]" />
              <span>My Properties</span>
            </button>
            <button
              onClick={() => setActiveNav('LOCKER')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Digital Deed Locker</span>
            </button>
            <button
              onClick={() => setActiveNav('MUTATIONS')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Mutation Tracker</span>
            </button>
            <button
              onClick={() => setActiveNav('DISPUTES')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Disputes</span>
            </button>
            <button
              onClick={() => setActiveNav('SETTINGS')}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] flex items-center gap-3 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
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

        {/* Center Main Content */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Section 1: My Properties */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">My Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Property 1 with Interactive 3D Canvas */}
              <div
                onClick={() => { onFocusUnit && onFocusUnit('unit_302'); onClose(); }}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/60 rounded-2xl p-5 cursor-pointer group transition-all shadow-xl hover:shadow-[0_0_20px_rgba(0,208,132,0.15)]"
              >
                <div className="w-full h-40 rounded-xl bg-[#080E17] border border-[#1E293B] mb-4 relative overflow-hidden group-hover:border-[#00D084]/40 transition-colors">
                  <Canvas camera={{ position: [9, 7, 9], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1.2} color="#00D084" />
                    <MiniFloorPlan />
                    <OrbitControls enableDamping autoRotate autoRotateSpeed={1.0} enableZoom={false} />
                  </Canvas>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0B131E]/80 border border-[#1E293B] text-[9px] font-mono text-[#00D084]">
                    3D Twin Ready
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-sm group-hover:text-[#00D084] transition-colors">
                    Apartment 12A, BKC Heights
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#00D084]/15 border border-[#00D084]/40 text-[#00D084] font-mono text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#00D084] mb-1">
                  3D-IN-MH-MUM-1092-B3-L12
                </div>
                <div className="text-xs text-slate-400">
                  Carpet Area: <strong className="text-white font-mono">124.50 Sq. Meters</strong>
                </div>
              </div>

              {/* Property 2 with Interactive 3D Canvas */}
              <div className="bg-[#0F172A] border border-[#1E293B] hover:border-amber-400/60 rounded-2xl p-5 cursor-pointer group transition-all shadow-xl">
                <div className="w-full h-40 rounded-xl bg-[#080E17] border border-[#1E293B] mb-4 relative overflow-hidden group-hover:border-amber-400/40 transition-colors">
                  <Canvas camera={{ position: [8, 6, 8], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1.2} color="#F59E0B" />
                    <MiniCommercialTower />
                    <OrbitControls enableDamping autoRotate autoRotateSpeed={1.0} enableZoom={false} />
                  </Canvas>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#0B131E]/80 border border-[#1E293B] text-[9px] font-mono text-amber-400">
                    Partition Queued
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    Commercial Suite 4B
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 font-mono text-[10px] font-bold">
                    Pending Mutation
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#00D084] mb-1">
                  3D-IN-MH-MUM-1095-B2-L04
                </div>
                <div className="text-xs text-slate-400">
                  Carpet Area: <strong className="text-white font-mono">210.00 Sq. Meters</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Digital Deed Locker */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Digital Deed Locker</h2>
              <span className="text-xs font-mono text-[#00D084] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                DigiLocker Integration: Active
              </span>
            </div>

            <div className="space-y-3">
              {deeds.map((deed) => (
                <div
                  key={deed.id}
                  className="bg-[#0F172A] border border-[#1E293B] hover:border-[#00D084]/40 rounded-xl p-4 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-[#080E17] text-[#00D084] border border-[#1E293B]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{deed.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">Added: {deed.date} · {deed.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00D084]/15 border border-[#00D084]/40 text-[#00D084] text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      DIGILOCKER
                    </span>
                    <button
                      onClick={() => alert(`Downloading verified copy of ${deed.title}`)}
                      className="p-2 rounded-lg bg-[#080E17] border border-[#1E293B] hover:border-[#00D084] text-slate-300 hover:text-[#00D084] transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Shareable link generated with cryptographic hash.`)}
                      className="p-2 rounded-lg bg-[#080E17] border border-[#1E293B] hover:border-[#00D084] text-slate-300 hover:text-[#00D084] transition-colors"
                      title="Share Deed"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Mutation Tracker */}
        <aside className="w-80 bg-[#0B131E] border-l border-[#1E293B] p-6 flex flex-col justify-between flex-shrink-0 overflow-y-auto">
          <div>
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">Mutation Tracker</h3>
              <p className="text-[10px] font-mono text-[#00D084] uppercase tracking-wider mt-0.5">
                REAL-TIME LEDGER QUEUE
              </p>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E293B]">
              {mutations.map((mut, idx) => (
                <div key={idx} className="relative pl-8 space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#080E17] border-2 border-[#00D084] -translate-x-1/2" />
                  <div className="text-[11px] font-mono text-slate-400">{mut.date}</div>
                  <div className="font-bold text-white text-xs">{mut.title}</div>
                  <div className="text-xs text-slate-400">{mut.desc}</div>
                  <div className="pt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold ${mut.statusColor}`}>
                      {mut.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
