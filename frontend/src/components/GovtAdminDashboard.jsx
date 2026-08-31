import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  ShieldAlert, Layers, FileCheck2, FileSpreadsheet,
  AlertTriangle, Flame, CheckCircle2, X, Radio,
  Check, TrendingUp, Scale, FolderKanban, Shield,
  Building, Award, ExternalLink, ArrowRight
} from 'lucide-react'
import StrataLogo from './StrataLogo'

// Mini 3D Ward Cadastre Preview for Government Dashboard
function MiniWardCadastre({ isLight }) {
  return (
    <group position={[0, -2, 0]}>
      {/* Ground Grid */}
      <gridHelper args={[40, 20, isLight ? 'var(--color-accent-primary)' : 'var(--color-accent-primary)', isLight ? 'var(--color-border-default)' : 'var(--color-border-default)']} position={[0, 0, 0]} />

      {/* Society Blocks Cluster */}
      <group>
        <mesh position={[-6, 2.5, -4]}>
          <boxGeometry args={[4, 5, 4]} />
          <meshStandardMaterial color={isLight ? '#CBD5E1' : 'var(--color-border-strong)'} roughness={0.65} />
        </mesh>
        <lineSegments position={[-6, 2.5, -4]}>
          <edgesGeometry args={[new THREE.BoxGeometry(4, 5, 4)]} />
          <lineBasicMaterial color={isLight ? 'var(--color-accent-primary)' : 'var(--color-accent-primary)'} />
        </lineSegments>

        <mesh position={[6, 4, 3]}>
          <boxGeometry args={[5, 8, 5]} />
          <meshStandardMaterial color={isLight ? '#CBD5E1' : 'var(--color-border-strong)'} roughness={0.65} />
        </mesh>
        <lineSegments position={[6, 4, 3]}>
          <edgesGeometry args={[new THREE.BoxGeometry(5, 8, 5)]} />
          <lineBasicMaterial color={isLight ? 'var(--color-accent-primary)' : 'var(--color-accent-primary)'} />
        </lineSegments>

        {/* Encroaching Cantilever Unit (Highlighted Red) */}
        <mesh position={[0, 4.5, -2]}>
          <boxGeometry args={[6, 9, 6]} />
          <meshStandardMaterial color="var(--color-status-danger)" transparent opacity={0.65} />
        </mesh>
        <lineSegments position={[0, 4.5, -2]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6, 9, 6)]} />
          <lineBasicMaterial color="var(--color-status-danger)" linewidth={2} />
        </lineSegments>
      </group>
    </group>
  )
}

export default function GovtAdminDashboard({
  societyData,
  onClose,
  onFocusUnit,
  onOpenSplitModal,
  theme = 'CYBER'
}) {
  const [activeNav, setActiveNav] = useState('DASHBOARD')
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-983',
      applicant: 'Anil Ambani Trust',
      ulpin: 'IND280145987621-A+04-7F9C',
      type: 'New 3D Title Registration',
      status: 'PENDING'
    },
    {
      id: 'APP-984',
      applicant: 'Rajesh Developers',
      ulpin: 'IND280145987621-A+01-4DAC',
      type: 'Volumetric 3D Subdivision (Split)',
      status: 'PENDING'
    },
    {
      id: 'APP-985',
      applicant: 'Sunil Narang',
      ulpin: 'IND280145987621-A+01-4DAC',
      type: 'Title Mutation Transfer',
      status: 'PENDING'
    }
  ])

  const isLight = theme === 'LIGHT'

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
    <div
      className={`responsive-workspace fixed inset-0 z-50 flex flex-col font-sans overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#edf4ef] text-slate-800' : 'bg-[#071216] text-slate-100'
      }`}
    >
      {/* Top Header */}
      <header
        className={`responsive-workspace-header px-6 lg:px-8 py-3.5 border-b flex items-center justify-between backdrop-blur-xl ${
          isLight ? 'bg-white/95 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)]/95 border-[var(--color-border-default)]'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <StrataLogo size={34} isLight={isLight} />
            <div>
              <div className={`font-black text-sm tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                STRATA
              </div>
              <div className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'}`}>
                Revenue Administrator Compliance Center
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${
              isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-accent-primary)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-accent-primary)] animate-pulse'}`} />
            <span className="font-bold text-[11px]">REVENUE_OFFICER_AUTH</span>
          </div>

          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer shadow-sm ${
              isLight
                ? 'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]'
                : 'bg-[var(--color-accent-primary)] text-[#071216] hover:bg-[#9ef3e2] shadow-[0_0_15px_rgba(126,231,210,0.3)]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>VIEW 3D DIGITAL TWIN</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close Compliance Center"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[var(--color-border-default)] text-slate-600 hover:text-[var(--color-accent-primary)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="responsive-workspace-body flex-1 flex overflow-hidden">
        {/* Left Sidebar Nav */}
        <aside
          className={`responsive-workspace-sidebar w-64 border-r p-4 flex flex-col justify-between flex-shrink-0 backdrop-blur-xl ${
            isLight ? 'bg-white/80 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)]/80 border-[var(--color-border-default)]'
          }`}
        >
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveNav('DASHBOARD')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'DASHBOARD'
                  ? isLight
                    ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)] border border-[var(--color-border-default)]'
                    : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/40 shadow-[0_0_15px_rgba(0,208,132,0.15)]'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Executive Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('RADAR')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'RADAR'
                  ? isLight
                    ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)] border border-[var(--color-border-default)]'
                    : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/40'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Encroachment Radar</span>
            </button>

            <button
              onClick={() => setActiveNav('QUEUE')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-mono font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'QUEUE'
                  ? isLight
                    ? 'bg-[var(--color-surface-muted)] text-[var(--color-accent-primary)] border border-[var(--color-border-default)]'
                    : 'bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/40'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Mutation Approvals ({approvals.filter(a => a.status === 'PENDING').length})</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
            <div className="font-bold uppercase tracking-wider">SECURE LEDGER NODE</div>
            <div className={`flex items-center gap-1.5 font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
              <span>MoLR-NODE-DEL-04 (Dwarka)</span>
            </div>
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className="responsive-workspace-main flex-1 p-8 overflow-y-auto space-y-8">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                PENDING APPROVALS
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  {approvals.filter(a => a.status === 'PENDING').length}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
                  Active Queue
                </span>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                ACTIVE ENCROACHMENTS
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-rose-500 font-mono">02</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  Critical
                </span>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                FAR COMPLIANCE RATE
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  97.8%
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
                  +1.2%
                </span>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                VOLUMETRIC REVENUE
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  ₹4.8 Cr
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
                  +18%
                </span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Radar + Alert Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className={`lg:col-span-2 p-6 rounded-2xl border shadow-xl flex flex-col justify-between ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  <span>AI Encroachment Radar Map View</span>
                  <span className="text-[11px] font-mono text-[var(--color-accent-primary)] font-normal">(Interactive 3D Ward Orbit)</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  SCANNING LIVE WARD
                </span>
              </div>

              <div className="w-full h-72 rounded-2xl bg-black/40 border border-slate-700/50 relative overflow-hidden">
                <Canvas camera={{ position: [18, 14, 20], fov: 42 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 20, 10]} intensity={1.2} color="var(--color-accent-primary)" />
                  <directionalLight position={[-10, -10, -10]} intensity={0.3} color="var(--color-status-danger)" />
                  <MiniWardCadastre isLight={isLight} />
                  <OrbitControls enableDamping autoRotate autoRotateSpeed={0.8} />
                </Canvas>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 border border-slate-700 text-[10px] font-mono text-slate-300">
                  Dwarka Sector 10 Ward • Multi-Level Cadastre Mesh • EPSG:4326 WGS84
                </div>
              </div>
            </div>

            {/* Violation Alert Stream */}
            <div
              className={`p-6 rounded-2xl border shadow-xl space-y-4 ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center justify-between">
                <span>LIVE VIOLATION STREAM</span>
                <span className="text-[10px] text-slate-400">Click to Focus in 3D</span>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => {
                    const unit = societyData?.units?.find(u => u.unit_id === 'FLAT-202') || { unit_id: 'FLAT-202', name: 'Apartment 202 (3BHK Deluxe Encroached)' }
                    if (onFocusUnit) onFocusUnit(unit)
                    onClose()
                  }}
                  className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-1 hover:border-rose-500 transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-mono font-bold text-rose-400">
                    ULPIN: IND280145987621-A+02-244A
                  </div>
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Cantilever Balcony Setback Encroachment (Level 02)
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Encroachment Volume: <strong className="text-rose-400">39.2 m³</strong></span>
                    <span className="text-[var(--color-accent-primary)] font-bold flex items-center gap-1 font-mono">
                      <span>INSPECT IN 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    const unit = societyData?.units?.find(u => u.unit_id === 'PARK-B106') || { unit_id: 'PARK-B106', name: 'Basement Parking Bay #06' }
                    if (onFocusUnit) onFocusUnit(unit)
                    onClose()
                  }}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-1 hover:border-amber-400 transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-mono font-bold text-amber-400">
                    ULPIN: IND280145987621-U-01-5FAF
                  </div>
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Basement Subsurface Over-Excavation (Level -01)
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Severity: <strong className="text-amber-400">HIGH AUDIT</strong></span>
                    <span className="text-[var(--color-accent-primary)] font-bold flex items-center gap-1 font-mono">
                      <span>INSPECT IN 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Title Approval Table */}
          <div>
            <h3 className={`text-base font-bold mb-4 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
              Pending Title Approval & Mutation Queue
            </h3>
            <div
              className={`rounded-2xl border overflow-hidden shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <table className="w-full text-left text-xs">
                <thead className={`font-mono text-[11px] uppercase border-b ${
                  isLight ? 'bg-[var(--color-surface-2)] text-slate-600 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] text-slate-400 border-[var(--color-border-default)]'
                }`}>
                  <tr>
                    <th className="p-3.5 pl-5">APPLICATION ID</th>
                    <th className="p-3.5">APPLICANT</th>
                    <th className="p-3.5">PARCEL 3D-ULPIN</th>
                    <th className="p-3.5">MUTATION TYPE</th>
                    <th className="p-3.5 pr-5">OFFICER ACTIONS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-medium ${
                  isLight ? 'divide-slate-200' : 'divide-[var(--color-border-default)]/70'
                }`}>
                  {approvals.map((app) => (
                    <tr key={app.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-[#131F37]'}`}>
                      <td className="p-3.5 pl-5 font-mono text-[var(--color-accent-primary)] font-bold">{app.id}</td>
                      <td className={`p-3.5 font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>{app.applicant}</td>
                      <td className="p-3.5 font-mono text-slate-400">{app.ulpin}</td>
                      <td className="p-3.5 text-slate-500">{app.type}</td>
                      <td className="p-3.5 pr-5">
                        {app.status === 'APPROVED' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] font-mono text-[10px] font-bold">
                            APPROVED ✓
                          </span>
                        ) : app.status === 'REJECTED' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-500 font-mono text-[10px] font-bold">
                            REJECTED ✕
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-3 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 hover:bg-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:text-[var(--color-surface-3)] border border-[var(--color-accent-primary)]/40 font-mono text-[10px] font-bold transition-all cursor-pointer"
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/40 font-mono text-[10px] font-bold transition-all cursor-pointer"
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
