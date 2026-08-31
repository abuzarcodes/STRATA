import React, { useState } from 'react'
import {
  ShieldAlert, Layers, FileCheck2, FileSpreadsheet,
  AlertTriangle, Flame, CheckCircle2, X, Radio,
  Check, TrendingUp, Scale, FolderKanban, Shield,
  Building, Award, ExternalLink, ArrowRight, Eye, UserCheck
} from 'lucide-react'
import StrataLogo from './StrataLogo'

export default function GovtAdminDashboard({
  societyData,
  onClose,
  onFocusUnit,
  onOpenSplitModal,
  theme = 'CYBER',
  mutationApplications = [],
  onApproveMutation,
  onRejectMutation
}) {
  const [activeNav, setActiveNav] = useState('DASHBOARD')
  const isLight = theme === 'LIGHT'

  const auditSummary = societyData?.audit_summary || {}
  const violationsList = societyData?.units?.filter((u) => u.violation?.has_violation) || []
  const pendingMutations = mutationApplications.filter((m) => m.status === 'PENDING_REVENUE_APPROVAL')

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
                Revenue Administrator Compliance Center • Dwarka Sub-District
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
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Encroachment Radar ({violationsList.length})</span>
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
              <FileCheck2 className="w-4 h-4 text-amber-500" />
              <span>Mutation Approvals ({pendingMutations.length})</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
            <div className="font-bold uppercase tracking-wider">SECURE REVENUE NODE</div>
            <div className={`flex items-center gap-1.5 font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
              <span>MoLR-NODE-DEL-04 (Dwarka Sec-10)</span>
            </div>
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className="responsive-workspace-main flex-1 p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                PENDING MUTATIONS
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  {pendingMutations.length}
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
                <span className="text-3xl font-black text-rose-500 font-mono">0{violationsList.length}</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30">
                  Flagged by AI
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
                  94.6%
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
                  Authoritative
                </span>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                TOTAL UNITS AUDITED
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-3xl font-black font-mono ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  {societyData?.units?.length || 37}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/15 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/30">
                  Dwarka Sec-10
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeNav === 'DASHBOARD' && (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-3xl border shadow-xl ${
                  isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      Dwarka Sector 10 Urban Zone Cadastral Summary
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Integrated 3D Bhu-Aadhaar Land Registry with Automated Spatial Audit
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    ISO 19152 LADM SYNCHRONIZED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'}`}>
                    <div className="text-slate-500 text-[10px]">TOTAL REGISTERED PARCELS</div>
                    <div className="text-lg font-bold mt-1 text-slate-800 dark:text-white">{societyData?.units?.length || 37} Units</div>
                    <div className="text-[10px] text-slate-400 mt-1">4 Urban Blocks + Blue Line Metro Corridor</div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'}`}>
                    <div className="text-slate-500 text-[10px]">REGISTERED CARPET AREA</div>
                    <div className="text-lg font-bold mt-1 text-slate-800 dark:text-white">{societyData?.metadata?.total_carpet_area_m2 || 3420} m²</div>
                    <div className="text-[10px] text-slate-400 mt-1">Total Built Volume: {societyData?.metadata?.total_volume_m3 || 9580} m³</div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-[var(--color-border-default)]' : 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]'}`}>
                    <div className="text-slate-500 text-[10px]">TAX & CIRCLE RATE VALUATION</div>
                    <div className="text-lg font-bold mt-1 text-slate-800 dark:text-white">₹38.4 Cr</div>
                    <div className="text-[10px] text-emerald-500 mt-1">100% Tax Assessment Mapped</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
                    isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Municipal Encroachment Inspection</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {violationsList.length} active spatial encroachments detected exceeding municipal setback rules.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav('RADAR')}
                    className="mt-4 px-4 py-2 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 text-xs font-mono font-bold hover:bg-rose-500/25 flex items-center justify-between cursor-pointer"
                  >
                    <span>View Flagged Units ({violationsList.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
                    isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-amber-500" />
                      <span>Title Mutation Approval Queue</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {pendingMutations.length} legal mutation applications submitted by registered citizens awaiting officer e-Sign.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav('QUEUE')}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 text-xs font-mono font-bold hover:bg-amber-500/25 flex items-center justify-between cursor-pointer"
                  >
                    <span>Open Mutation Queue ({pendingMutations.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENCROACHMENT RADAR */}
          {activeNav === 'RADAR' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    AI-Detected Spatial Setback & FAR Encroachments
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    3D Volumetric Breaches Against Delhi Master Plan (MPD 2041) Statutory Setbacks
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {violationsList.map((unit) => (
                  <div
                    key={unit.unit_id}
                    className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isLight ? 'bg-white border-rose-300' : 'bg-[var(--color-surface-1)] border-rose-500/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-500 border border-rose-500/40">
                          {String(unit.violation?.violation_type || unit.violation?.type || 'SETBACK_VIOLATION').replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-mono text-slate-500">Severity: {unit.violation?.severity || 'HIGH'}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-800 dark:text-white">
                        {unit.name} • <span className="text-slate-500 font-normal">{unit.owner}</span>
                      </h4>

                      <p className="text-xs text-rose-600 dark:text-rose-400 font-mono">
                        {unit.violation?.description || 'AI spatial audit detected volumetric breach beyond statutory FAR envelope.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                        <span>3D-ULPIN: <strong className="theme-accent">{unit.ulpin_3d}</strong></span>
                        <span>Excess Volume: <strong className="text-rose-500">+{unit.violation?.excess_volume_m3 || unit.violation?.encroachment_volume_m3 || 14.5} m³</strong></span>
                        <span>Penalty: <strong className="text-rose-500">₹{(unit.violation?.penalty_inr || 125000).toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onFocusUnit) onFocusUnit(unit)
                        onClose()
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                      <span>INSPECT IN 3D CADASTRE</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MUTATION APPROVALS QUEUE */}
          {activeNav === 'QUEUE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Statutory Title Mutation Transfer Applications
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Delhi Land Revenue Act (Section 89) Electronic Approval Workflow
                  </p>
                </div>
              </div>

              {mutationApplications.length === 0 ? (
                <div className="p-8 text-center rounded-3xl border border-dashed text-slate-500 font-mono text-xs">
                  No title mutation applications currently submitted in queue.
                </div>
              ) : (
                <div className="space-y-4">
                  {mutationApplications.map((app) => (
                    <div
                      key={app.appId}
                      className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isLight ? 'bg-white border-[var(--color-border-default)]' : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs theme-accent">{app.appId}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs font-mono text-slate-500">Submitted: {app.submittedOn}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-800 dark:text-white">
                          {app.property} — Transfer from <span className="theme-accent">{app.fromCitizen}</span> to <span className="text-emerald-500">{app.toParty}</span>
                        </h4>

                        <div className="text-xs text-slate-500 font-mono">
                          Mode: {app.type.replace(/_/g, ' ')} • SRO: {app.sroOffice || 'Dwarka (SRO-IX)'} • Stamp Receipt: {app.stampReceiptNo || 'DLR-STAMP-90412'}
                        </div>
                      </div>

                      {app.status === 'PENDING_REVENUE_APPROVAL' ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => onRejectMutation && onRejectMutation(app.appId)}
                            className="px-3.5 py-2 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-mono text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => onApproveMutation && onApproveMutation(app)}
                            className="px-4 py-2 rounded-xl bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Execute Title Transfer</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>TITLE TRANSFERRED TO {app.toParty.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
