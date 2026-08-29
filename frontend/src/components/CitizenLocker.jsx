import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  Home, FileText, Clock, AlertCircle, Settings,
  ShieldCheck, Download, Share2, X, ExternalLink,
  Layers, Building, CheckCircle2, Radio, Lock, Box, Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'
import StrataLogo from './StrataLogo'

// Mini 3D Floor Plan Preview for Apartment Card
function MiniFloorPlan({ isLight }) {
  return (
    <group position={[0, -0.5, 0]}>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(7, 2.5, 5)]} />
        <lineBasicMaterial color={isLight ? '#1B5E20' : '#00D084'} linewidth={2} />
      </lineSegments>
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.1, 2.4, 4.8]} />
        <meshStandardMaterial color={isLight ? '#CBD5E1' : '#475569'} transparent opacity={0.5} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2.8, 2.4, 0.1]} />
        <meshStandardMaterial color={isLight ? '#CBD5E1' : '#475569'} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color={isLight ? '#E2E8F0' : '#334155'} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function CitizenLocker({ onClose, onFocusUnit, onNotify, theme = 'CYBER' }) {
  const [downloadingEC, setDownloadingEC] = useState(false)
  const isLight = theme === 'LIGHT'

  const myProperties = [
    {
      id: 'PROP-01',
      unitId: 'FLAT-104',
      ulpin: 'IND280145987621-A+01-4DAC',
      name: 'Apartment 104 (2BHK Premium)',
      location: 'Aura Residency, Dwarka Sector 10, New Delhi',
      carpetArea: '81.0 m²',
      volume: '226.8 m³',
      level: 1,
      taxStatus: 'PAID (FY 2026-27)',
      status: 'FREEHOLD VERIFIED',
      mortgage: 'NONE (Unencumbered)'
    },
    {
      id: 'PROP-02',
      unitId: 'FLAT-302',
      ulpin: 'IND280145987621-A+03-8E2B',
      name: 'Apartment 302 (3BHK Executive)',
      location: 'Aura Residency, Dwarka Sector 10, New Delhi',
      carpetArea: '108.0 m²',
      volume: '302.4 m³',
      level: 3,
      taxStatus: 'PAID (FY 2026-27)',
      status: 'AUDIT REVIEW',
      mortgage: 'SBI Home Loan #884920'
    }
  ]

  const handleDownloadEC = () => {
    setDownloadingEC(true)
    setTimeout(() => {
      const ecCertificate = {
        title: "CERTIFICATE OF ENCUMBRANCE ON 3D PROPERTY (FORM NO. 15)",
        certificate_no: `EC-DILRMP-2026-${Date.now().toString().slice(-6)}`,
        government_authority: "Department of Land Resources, Ministry of Rural Development",
        applicant_name: "Deepak Joshi",
        digilocker_id: "DL-8849-2026-IN",
        search_period: "01-Jan-2015 to 29-Aug-2026",
        certified_properties: myProperties.map(p => ({
          ulpin_3d: p.ulpin,
          unit: p.name,
          location: p.location,
          floor_level: p.level,
          volumetric_space: p.volume,
          carpet_area: p.carpetArea,
          encumbrance_status: p.mortgage
        })),
        digital_signature: {
          signed_by: "Sub-Registrar Kapashera, Delhi NCT",
          algorithm: "SHA256withRSA",
          timestamp: new Date().toISOString()
        }
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ecCertificate, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `ENCUMBRANCE_CERTIFICATE_DEEPAK_JOSHI.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setDownloadingEC(false)
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } })
      if (onNotify) {
        onNotify('Encumbrance Certificate Downloaded', 'Official DigiLocker signed EC Form 15 saved successfully.', 'SUCCESS')
      }
    }, 600)
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
                Citizen Property Vault (DigiLocker Linked)
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
            <Lock className="w-3.5 h-3.5 text-[#00D084]" />
            <span className="font-bold text-[11px]">AADHAAR eKYC VERIFIED</span>
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

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto w-full space-y-8">
        {/* User Identity Banner */}
        <div
          className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isLight
              ? 'bg-gradient-to-r from-white to-[#E8F5E9] border-[#C8E6C9]'
              : 'bg-gradient-to-r from-[#0B131E] to-[#0F172A] border-[#1E293B]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border font-black text-lg ${
                isLight ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]' : 'bg-[#0F172A] border-[#1E293B] text-[#00D084]'
              }`}
            >
              DJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                  Deepak Joshi
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00D084]/20 text-[#00D084] font-mono text-[10px] font-bold border border-[#00D084]/40">
                  DigiLocker ID: DL-8849-2026-IN
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Registered Spatial Assets: <strong>2 Units</strong> • Total Volumetric Space: <strong>529.2 m³</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadEC}
            disabled={downloadingEC}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
              isLight
                ? 'bg-white border-[#C8E6C9] text-[#1B5E20] hover:bg-[#E8F5E9]'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-200 hover:border-[#00D084]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#00D084]" />
            <span>{downloadingEC ? 'PREPARING SIGNED EC...' : 'DOWNLOAD ENCUMBRANCE CERTIFICATE'}</span>
          </button>
        </div>

        {/* Properties Grid */}
        <div className="space-y-4">
          <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
            Registered 3D Cadastral Properties
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
                  isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/30">
                      {prop.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Floor Level {prop.level}</span>
                  </div>

                  <h4 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    {prop.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{prop.ulpin}</p>
                </div>

                {/* 3D Mini Floor Plan Canvas */}
                <div className="w-full h-44 rounded-2xl bg-black/40 border border-slate-700/50 relative overflow-hidden">
                  <Canvas camera={{ position: [9, 7, 9], fov: 38 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 15, 10]} intensity={1.2} color="#00D084" />
                    <MiniFloorPlan isLight={isLight} />
                    <OrbitControls enableDamping autoRotate autoRotateSpeed={1.0} />
                  </Canvas>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-[#F9FBF9] border-slate-200' : 'bg-[#0F172A] border-[#1E293B]'}`}>
                    <span className="text-slate-500 text-[10px]">Carpet Area:</span><br />
                    <strong className={isLight ? 'text-[#1B5E20]' : 'text-white'}>{prop.carpetArea}</strong>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-[#F9FBF9] border-slate-200' : 'bg-[#0F172A] border-[#1E293B]'}`}>
                    <span className="text-slate-500 text-[10px]">Volumetric Space:</span><br />
                    <strong className="text-[#00D084]">{prop.volume}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      if (onFocusUnit) onFocusUnit(prop.unitId)
                      onClose()
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isLight
                        ? 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white'
                        : 'bg-[#00D084] hover:bg-[#00b875] text-[#060B12]'
                    }`}
                  >
                    <span>VIEW IN 3D DIGITAL TWIN</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
