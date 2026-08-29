import React, { useState } from 'react'
import {
  FileText, Download, Share2, Shield, Building,
  Key, Lock, CheckCircle2, AlertCircle, RefreshCw, X, HardHat,
  ExternalLink, Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'
import StrataLogo from './StrataLogo'

export default function CitizenLocker({ onClose, onFocusUnit, onNotify, theme = 'CYBER' }) {
  const [downloadingEC, setDownloadingEC] = useState(false)
  const isLight = theme === 'LIGHT'

  // Citizen's registered 3D properties in society
  const myProperties = [
    {
      id: 'prop_01',
      unitId: 'FLAT-104',
      ulpin: 'IND280145987621-A+01-4DAC',
      name: 'Flat 104 (Level 1)',
      location: 'Aura Residency Complex, Sector 10, Dwarka, New Delhi',
      area: '1050 sq.ft (97.5 m²)',
      carpetArea: '81.0 m²',
      volume: '226.8 m³',
      level: 1,
      share: '100% Freehold',
      status: 'VERIFIED & REGISTERED',
      registrationDate: '12-OCT-2023',
      deedNo: 'DEL-DWK-2023-88901',
      mortgage: 'NONE (Clear Title)',
      taxStatus: 'PAID (FY 2025-26)'
    },
    {
      id: 'prop_02',
      unitId: 'FLAT-302',
      ulpin: 'IND280145987621-A+03-9FB2',
      name: 'Flat 302 (Level 3)',
      location: 'Aura Residency Complex, Sector 10, Dwarka, New Delhi',
      area: '1450 sq.ft (134.7 m²)',
      carpetArea: '112.5 m²',
      volume: '315.0 m³',
      level: 3,
      share: '100% Freehold',
      status: 'VERIFIED & REGISTERED',
      registrationDate: '04-JAN-2025',
      deedNo: 'DEL-DWK-2025-10492',
      mortgage: 'SBI Home Loan (Active Lien: ₹42.5 L)',
      taxStatus: 'PAID (FY 2025-26)'
    }
  ]

  const mutationApplications = [
    {
      appId: 'MUT-2026-0891',
      property: 'Flat 104 (Level 1)',
      type: 'TITLE_MUTATION_TRANSFER',
      toParty: 'Priya Sharma (Daughter)',
      submittedOn: '18-FEB-2026',
      status: 'PENDING_REVENUE_APPROVAL',
      step: 'Revenue Officer Field Verification (Step 2 of 3)'
    }
  ]

  const handleDownloadEC = () => {
    setDownloadingEC(true)
    setTimeout(() => {
      const ecCertificate = {
        document_type: "DIGILOCKER_CERTIFIED_ENCUMBRANCE_CERTIFICATE",
        issuer: "Department of Revenue & Land Records, Government of NCT of Delhi",
        bhu_aadhaar_authority: "STRATA 3D Cadastre Division",
        holder: "Deepak Joshi",
        digilocker_id: "DL-8849-2026-IN",
        timestamp: new Date().toISOString(),
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
            <Lock className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-bold text-[11px]">DEEPAK_JOSHI_VAULT</span>
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

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Vault Identity Summary Banner */}
            <div
              className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg font-black ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>
                    Deepak Joshi • Registered Citizen
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D084]/15 text-[#00D084] border border-[#00D084]/40">
                    AADHAAR VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  DigiLocker ID: DL-8849-2026-IN • 2 Properties Registered
                </p>
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

                      <h4 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        {prop.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{prop.location}</p>

                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-slate-500">3D-ULPIN</div>
                          <div className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                            {prop.ulpin}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Volumetric Volume</div>
                          <div className="font-bold text-slate-700 dark:text-slate-300">{prop.volume}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Carpet Area</div>
                          <div className="font-bold text-slate-700 dark:text-slate-300">{prop.carpetArea}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Encumbrance / Lien</div>
                          <div className="font-bold text-slate-700 dark:text-slate-300">{prop.mortgage}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">Deed #{prop.deedNo}</span>
                      <button
                        onClick={() => {
                          onFocusUnit(prop.unitId)
                          onClose()
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isLight
                            ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20] hover:bg-[#C8E6C9]'
                            : 'bg-[#00D084]/20 border-[#00D084] text-[#00D084] hover:bg-[#00D084] hover:text-[#060B12]'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>VIEW IN 3D DIGITAL TWIN</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mutation Applications Ledger */}
            <div className="space-y-4">
              <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}`}>
                Live Title Mutation Tracking
              </h3>

              <div
                className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
                  isLight ? 'bg-white border-[#C8E6C9]' : 'bg-[#0B131E] border-[#1E293B]'
                }`}
              >
                {mutationApplications.map((mut) => (
                  <div key={mut.appId} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#00D084]">{mut.appId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                          {mut.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Transfer of <strong>{mut.property}</strong> to <strong>{mut.toParty}</strong>
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Stage: <span className={isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}>{mut.step}</span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-500 text-right">
                      Submitted on: {mut.submittedOn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
