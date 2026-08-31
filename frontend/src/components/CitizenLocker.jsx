import React, { useState, useMemo } from 'react'
import {
  FileText, Download, Share2, Shield, Building,
  Key, Lock, CheckCircle2, AlertCircle, RefreshCw, X, HardHat,
  ExternalLink, Sparkles, UserCheck, Send, ChevronRight, FileCheck
} from 'lucide-react'
import StrataLogo from './StrataLogo'
import { generateEncumbranceCertificatePDF } from '../utils/pdfGenerator'

export default function CitizenLocker({
  onClose,
  onFocusUnit,
  onNotify,
  theme = 'CYBER',
  activeCitizen = 'Deepak Joshi',
  onSelectCitizen,
  societyData,
  mutationApplications = [],
  onSubmitMutationApplication
}) {
  const [downloadingEC, setDownloadingEC] = useState(false)
  const [showMutationModal, setShowMutationModal] = useState(false)
  const isLight = theme === 'LIGHT'

  // Available Citizen Personas in Sector 10
  const citizenOptions = [
    { name: 'Deepak Joshi', id: 'DL-8849-2026-IN', aadhaar: 'XXXX-XXXX-4491' },
    { name: 'Rajesh Kumar', id: 'DL-1102-2026-IN', aadhaar: 'XXXX-XXXX-1102' },
    { name: 'Priya Sharma', id: 'DL-7731-2026-IN', aadhaar: 'XXXX-XXXX-7731' },
    { name: 'Vikram Malhotra', id: 'DL-3904-2026-IN', aadhaar: 'XXXX-XXXX-3904' }
  ]

  const currentCitizenObj = citizenOptions.find((c) => c.name === activeCitizen) || citizenOptions[0]

  // Dynamically extract registered properties for the selected citizen from live societyData
  const myProperties = useMemo(() => {
    if (!societyData?.units) return []
    return societyData.units
      .filter((u) => u.owner?.toLowerCase().includes(activeCitizen.toLowerCase()))
      .map((u) => ({
        id: u.unit_id,
        unitId: u.unit_id,
        ulpin: u.ulpin_3d,
        name: u.name,
        location: 'Aura Residency Complex, Sector 10, Dwarka, New Delhi',
        area: `${u.carpet_area_m2} m² (${(u.carpet_area_m2 * 10.764).toFixed(0)} sq.ft)`,
        carpetArea: `${u.carpet_area_m2} m²`,
        volume: `${u.rera_volume_m3} m³`,
        level: u.level,
        share: '100% Freehold',
        status: 'VERIFIED & REGISTERED',
        registrationDate: u.registration_date || '14-OCT-2023',
        deedNo: u.deed_no || 'DEL-DWK-2023-88904',
        mortgage: u.mortgage || 'NONE (Clear Title)',
        taxStatus: u.tax_status || 'PAID (FY 2025-26)',
        valuation: u.estimated_valuation_inr
      }))
  }, [societyData, activeCitizen])

  // Filter mutation applications for current citizen
  const citizenMutations = useMemo(() => {
    return mutationApplications.filter(
      (m) => m.fromCitizen === activeCitizen || m.toParty === activeCitizen
    )
  }, [mutationApplications, activeCitizen])

  // Mutation Form State
  const [mutationForm, setMutationForm] = useState({
    propertyUnitId: myProperties[0]?.unitId || '',
    mutationType: 'GIFT_DEED_BLOOD_RELATION',
    toParty: 'Priya Sharma (Daughter)',
    toAadhaar: 'XXXX-XXXX-7731',
    sroOffice: 'Dwarka Sub-District (SRO-IX)',
    stampReceiptNo: 'DLR-STAMP-2026-90412',
    applicantRemarks: 'Voluntary title mutation gift transfer executed with e-Sign.'
  })

  const handleDownloadEC = () => {
    setDownloadingEC(true)
    setTimeout(() => {
      try {
        generateEncumbranceCertificatePDF({
          citizenName: activeCitizen,
          properties: myProperties,
          digilockerId: currentCitizenObj.id
        })
        if (onNotify) {
          onNotify(
            'Encumbrance Certificate Generated',
            `Official Government Form 15 PDF downloaded for ${activeCitizen}.`,
            'SUCCESS'
          )
        }
      } catch (err) {
        console.error('Failed to generate EC PDF:', err)
        if (onNotify) onNotify('PDF Error', 'Could not compile EC PDF.', 'ERROR')
      }
      setDownloadingEC(false)
    }, 600)
  }

  const handleMutationSubmit = (e) => {
    e.preventDefault()
    const targetProp = myProperties.find((p) => p.unitId === mutationForm.propertyUnitId) || myProperties[0]
    if (!targetProp) return

    const newApp = {
      appId: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      unitId: targetProp.unitId,
      property: targetProp.name,
      ulpin_3d: targetProp.ulpin,
      fromCitizen: activeCitizen,
      toParty: mutationForm.toParty.split('(')[0].trim(),
      type: mutationForm.mutationType,
      sroOffice: mutationForm.sroOffice,
      stampReceiptNo: mutationForm.stampReceiptNo,
      submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      status: 'PENDING_REVENUE_APPROVAL',
      step: 'Revenue Officer Field & 3D Cadastre Verification (Step 2 of 3)'
    }

    if (onSubmitMutationApplication) {
      onSubmitMutationApplication(newApp)
    }

    setShowMutationModal(false)
    if (onNotify) {
      onNotify(
        'Mutation Application Dispatched',
        `Application ${newApp.appId} queued for Revenue Officer review.`,
        'SUCCESS'
      )
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col font-sans overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#edf4ef] text-slate-800' : 'bg-[#071216] text-slate-100'
      }`}
    >
      {/* Top Header */}
      <header
        className={`px-6 lg:px-8 py-3.5 border-b flex items-center justify-between backdrop-blur-xl ${
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
                Citizen Property Vault (DigiLocker Linked)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Citizen Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 theme-accent" />
            <select
              value={activeCitizen}
              onChange={(e) => onSelectCitizen && onSelectCitizen(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold appearance-none cursor-pointer focus:outline-none ${
                isLight ? 'bg-white border-[var(--color-border-default)] text-slate-800' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
              }`}
            >
              {citizenOptions.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
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
            aria-label="Close Property Vault"
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

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Vault Identity Summary Banner */}
            <div
              className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg font-black ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                    {activeCitizen} • Registered Citizen
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/40">
                    AADHAAR VERIFIED ({currentCitizenObj.aadhaar})
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  DigiLocker ID: {currentCitizenObj.id} • {myProperties.length} Properties Registered in Dwarka Sector 10
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMutationModal(true)}
                  disabled={myProperties.length === 0}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isLight
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>APPLY TITLE MUTATION</span>
                </button>

                <button
                  onClick={handleDownloadEC}
                  disabled={downloadingEC || myProperties.length === 0}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isLight
                      ? 'bg-white border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
                      : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-slate-200 hover:border-[var(--color-accent-primary)]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                  <span>{downloadingEC ? 'COMPILING OFFICIAL PDF...' : 'DOWNLOAD EC (FORM 15 PDF)'}</span>
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  Registered 3D Cadastral Properties ({myProperties.length})
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Authoritative Bhu-Aadhaar Digital Twin
                </span>
              </div>

              {myProperties.length === 0 ? (
                <div className="p-8 text-center rounded-3xl border border-dashed text-slate-500 font-mono text-xs">
                  No active 3D properties currently registered under {activeCitizen}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
                        isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
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
                            <div className={`font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
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
                            <div className={`font-bold ${prop.mortgage && !prop.mortgage.includes('NONE') ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {prop.mortgage}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500">Deed #{prop.deedNo}</span>
                        <button
                          onClick={() => {
                            if (onFocusUnit) onFocusUnit(prop.unitId)
                            onClose()
                          }}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isLight
                              ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-muted)]'
                              : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-[var(--color-accent-primary)] hover:border-[var(--color-accent-primary)]'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>VIEW IN 3D DIGITAL TWIN</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Mutation Applications Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                Live Title Mutation Tracking ({citizenMutations.length})
              </h3>

              {citizenMutations.length === 0 ? (
                <div className={`p-6 rounded-3xl border text-xs font-mono text-slate-500 flex items-center justify-between ${
                  isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                }`}>
                  <span>No active title mutation proceedings currently pending for {activeCitizen}.</span>
                  <button
                    onClick={() => setShowMutationModal(true)}
                    className="theme-accent font-bold hover:underline cursor-pointer"
                  >
                    + Initiate Transfer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {citizenMutations.map((mut) => (
                    <div
                      key={mut.appId}
                      className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs theme-accent">{mut.appId}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            mut.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {mut.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                          {mut.property} • Transfer to {mut.toParty}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Submitted on {mut.submittedOn} • {mut.step}
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs text-slate-500">
                        <div>SRO: {mut.sroOffice || 'Dwarka (SRO-IX)'}</div>
                        <div className="text-[10px] text-slate-400">Stamp Receipt: {mut.stampReceiptNo || 'DLR-STAMP-90412'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Official Delhi Revenue Title Mutation Application Modal */}
      {showMutationModal && (
        <div className="fixed inset-0 z-60 backdrop-blur-xl bg-slate-950/80 flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-3xl p-6 border shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 ${
            isLight ? 'bg-white border-[var(--color-border-default)] text-slate-800' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 theme-accent" />
                <div>
                  <h3 className="font-bold text-sm">Delhi Land Revenue Title Mutation Application</h3>
                  <p className="text-[10px] font-mono text-slate-500">Form No. 8 — Statutory 3D-ULPIN Mutation & Transfer</p>
                </div>
              </div>
              <button
                onClick={() => setShowMutationModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleMutationSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono font-bold text-[11px] mb-1">Select Property to Transfer</label>
                <select
                  value={mutationForm.propertyUnitId}
                  onChange={(e) => setMutationForm({ ...mutationForm, propertyUnitId: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                    isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
                  }`}
                >
                  {myProperties.map((p) => (
                    <option key={p.unitId} value={p.unitId}>
                      {p.name} ({p.ulpin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] mb-1">Mode of Title Mutation</label>
                  <select
                    value={mutationForm.mutationType}
                    onChange={(e) => setMutationForm({ ...mutationForm, mutationType: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
                    }`}
                  >
                    <option value="GIFT_DEED_BLOOD_RELATION">Gift Deed (Blood Relation)</option>
                    <option value="REGISTERED_SALE_CONVEYANCE">Registered Sale Conveyance</option>
                    <option value="INHERITANCE_TESTAMENTARY">Inheritance / Succession</option>
                    <option value="RELINQUISHMENT_DEED">Relinquishment Deed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] mb-1">Transferee / New Owner Name</label>
                  <input
                    type="text"
                    required
                    value={mutationForm.toParty}
                    onChange={(e) => setMutationForm({ ...mutationForm, toParty: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-[11px] mb-1">Transferee Aadhaar No</label>
                  <input
                    type="text"
                    required
                    value={mutationForm.toAadhaar}
                    onChange={(e) => setMutationForm({ ...mutationForm, toAadhaar: e.target.value })}
                    placeholder="XXXX-XXXX-7731"
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-[11px] mb-1">e-Stamp Receipt Ref</label>
                  <input
                    type="text"
                    required
                    value={mutationForm.stampReceiptNo}
                    onChange={(e) => setMutationForm({ ...mutationForm, stampReceiptNo: e.target.value })}
                    placeholder="DLR-STAMP-2026-90412"
                    className={`w-full p-2.5 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMutationModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-mono font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--color-accent-primary)] text-slate-950 font-mono font-bold text-xs hover:bg-[var(--color-accent-primary-hover)] cursor-pointer shadow-lg"
                >
                  Sign & Submit to Revenue Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
