import React, { useState } from 'react'
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Scissors,
  Layers,
  Send,
  Building,
  FileCheck2,
  X
} from 'lucide-react'

export default function GovtAdminDashboard({
  societyData,
  onClose,
  onFocusUnit,
  onOpenSplitModal
}) {
  const [activeTab, setActiveTab] = useState('AUDIT')
  const [noticeSentId, setNoticeSentId] = useState(null)

  const audit = societyData?.audit_summary || {}
  const airViolations = audit.air_rights_violations || []
  const subViolations = audit.subsurface_violations || []
  const allViolations = [...airViolations, ...subViolations]

  const handleSendNotice = (unitId) => {
    setNoticeSentId(unitId)
    setTimeout(() => setNoticeSentId(null), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[85vh] glass-panel-accent rounded-3xl p-6 shadow-2xl border border-indigo-500/30 flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Government Land Administration Portal (DILRMP / Bhu-Aadhaar)
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Revenue & Cadastral Compliance Command Center
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'AUDIT'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Encroachment & Topology Audit ({allViolations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'QUEUE'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Pending 3D Registrations (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('REGISTRY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'REGISTRY'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ISO 19152 LADM Log</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-3">
          {activeTab === 'AUDIT' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between text-xs text-red-300">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>
                    Automated 3D Cadastral Engine detected <strong>{allViolations.length} violations</strong> in Aura Residency CGHS.
                  </span>
                </div>
                <span className="font-mono font-bold text-red-400">
                  Status: NON-COMPLIANT
                </span>
              </div>

              {allViolations.map((v) => (
                <div
                  key={v.unit_id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-red-900/40 hover:border-red-500/50 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {v.violation.violation_type}
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-300">
                        {v.ulpin_3d}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-100">{v.name}</h4>
                    <p className="text-xs text-slate-400">{v.violation.description}</p>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3 pt-1">
                      <span>Owner: <strong className="text-slate-300">{v.owner}</strong></span>
                      <span>Overhang: <strong className="text-red-400">{v.violation.encroachment_area_m2} m²</strong></span>
                      <span>Volume: <strong className="text-red-400">{v.violation.encroachment_volume_m3} m³</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose()
                        const targetUnit = societyData.units.find((u) => u.unit_id === v.unit_id)
                        if (targetUnit) onFocusUnit(targetUnit)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all"
                    >
                      Focus in 3D
                    </button>

                    <button
                      onClick={() => handleSendNotice(v.unit_id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        noticeSentId === v.unit_id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{noticeSentId === v.unit_id ? 'Notice Issued!' : 'Issue Eviction Notice'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'QUEUE' && (
            <div className="space-y-3">
              {[
                { id: 'REQ-301', title: '3D Subdivision Request: Penthouse 401 -> 401A & 401B', applicant: 'Rohan Singhania', date: '2026-08-24' },
                { id: 'REQ-302', title: 'Subsurface Utility Passage Approval: Dwarka Gas Pipeline', applicant: 'Indraprastha Gas Ltd.', date: '2026-08-25' },
                { id: 'REQ-303', title: 'Mutation (Title Transfer): Flat 103 -> Ankit Sethi', applicant: 'Karan Kapoor', date: '2026-08-25' },
              ].map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {q.id}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100 mt-1">{q.title}</h4>
                    <p className="text-xs text-slate-400">Applicant: {q.applicant} • Submitted: {q.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">
                      View Dossier
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20">
                      Approve & Seal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'REGISTRY' && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-slate-300 space-y-1">
                <div>Standard: <strong>ISO 19152:2024 LADM Part 2 (3D Land Registration)</strong></div>
                <div>Cadastral Authority: <strong>Ministry of Rural Development / Bhu-Aadhaar DILRMP</strong></div>
                <div>Hash Standard: <strong>SHA-256 Polyhedral Centroid Truncation</strong></div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(societyData?.metadata, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Digital Signature Verified: <strong>DL-SWD-CAD-2026-9041</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
