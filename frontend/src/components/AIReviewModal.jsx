import React, { useState } from 'react'
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  RefreshCw,
  Sliders,
  ArrowRight,
  Eye,
  Check,
  XCircle
} from 'lucide-react'

export default function AIReviewModal({ isOpen, onClose, onAcceptAIResult, theme = 'CYBER' }) {
  const [selectedExtraction, setSelectedExtraction] = useState('UNIT-203')
  const [zOffsetAdjustment, setZOffsetAdjustment] = useState(0.0)
  const [confidenceScore] = useState(96.4)
  const [isProcessing, setIsProcessing] = useState(false)
  const [decisionFeedback, setDecisionFeedback] = useState(null)

  const isLight = theme === 'LIGHT'

  if (!isOpen) return null

  const handleAccept = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setDecisionFeedback({
        type: 'ACCEPTED',
        message: 'AI Extrusion Accepted! 3D-ULPIN Minted & Promoted to Tier 1 Authoritative Cadastre.'
      })
      setTimeout(() => {
        if (onAcceptAIResult) onAcceptAIResult(selectedExtraction)
        onClose()
      }, 1500)
    }, 800)
  }

  const handleReject = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setDecisionFeedback({
        type: 'REJECTED',
        message: 'Mesh rejected. Flagged for manual surveyor boundary realignment.'
      })
      setTimeout(() => {
        onClose()
      }, 1200)
    }, 500)
  }

  return (
    <div className={`responsive-modal-backdrop fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200 ${
      isLight ? 'bg-[var(--color-surface-muted)]/80' : 'bg-slate-950/80'
    }`}>
      <div className={`responsive-modal-panel relative w-full max-w-4xl rounded-3xl p-6 shadow-2xl border space-y-6 transition-all ${
        isLight
          ? 'bg-white border-[var(--color-border-default)] text-slate-800'
          : 'bg-[var(--color-surface-1)] border-purple-500/40 text-slate-100'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-[var(--color-border-default)]' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  AI Model v2.4 • Ingestion Review
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {confidenceScore}% Confidence
                </span>
              </div>
              <h2 className={`text-lg font-extrabold tracking-tight mt-0.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                AI Cadastral Mesh Extraction & Boundary Verification
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert if Action Taken */}
        {decisionFeedback && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-200 ${
            decisionFeedback.type === 'ACCEPTED'
              ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : isLight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}>
            {decisionFeedback.type === 'ACCEPTED' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <div className="text-xs font-semibold">{decisionFeedback.message}</div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Extraction Details */}
          <div className="space-y-3 md:col-span-1">
            <div className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
              1. Extracted Cadastral Entity
            </div>
            
            <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Unit:</span>
                <span className={`font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>Unit 203 (3BHK East Wing)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Floor Level:</span>
                <span className={`font-mono font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>Level 2 (+6.0m to +9.0m)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source Input:</span>
                <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">AutoCAD DXF + LiDAR Cloud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                  AI-Extracted (Tier 3)
                </span>
              </div>
            </div>

            {/* AI Confidence Meter */}
            <div className={`p-3.5 rounded-2xl border space-y-2 ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Mesh Watertightness:</span>
                <span className={`font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>100% Certified</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--color-accent-primary)] h-full rounded-full w-[96.4%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Tolerance: ±0.02m</span>
                <span>Self-Intersect: 0</span>
              </div>
            </div>
          </div>

          {/* Center/Right Column: Geometric Comparison & Review Sliders */}
          <div className="space-y-4 md:col-span-2">
            <div className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
              2. Volumetric Geometry & Fine Tuning
            </div>

            {/* Comparison Bento Tiles */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-3 rounded-2xl border ${
                isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-slate-800'
              }`}>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Predicted RERA Volume</span>
                <div className={`text-lg font-bold mt-1 ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  302.40 <span className="text-xs font-normal text-slate-500">m³</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${
                isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-slate-800'
              }`}>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Extruded Carpet Area</span>
                <div className={`text-lg font-bold mt-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  108.00 <span className="text-xs font-normal text-slate-500">m²</span>
                </div>
              </div>
            </div>

            {/* Interactive Geometry Correction Slider */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isLight ? 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <Sliders className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                  <span>Manual Elevation (Z-Axis) Offset Correction:</span>
                </span>
                <span className={`font-mono font-bold ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                  {zOffsetAdjustment > 0 ? `+${zOffsetAdjustment.toFixed(2)}m` : `${zOffsetAdjustment.toFixed(2)}m`}
                </span>
              </div>
              <input
                id="z-offset-slider"
                name="zOffsetAdjustment"
                type="range"
                min="-0.5"
                max="0.5"
                step="0.05"
                value={zOffsetAdjustment}
                onChange={(e) => setZOffsetAdjustment(parseFloat(e.target.value))}
                aria-label="Adjust Z-axis elevation offset"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-primary)]"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>-0.50m (Lower)</span>
                <span>Standard (0.00m)</span>
                <span>+0.50m (Raise)</span>
              </div>
            </div>

            {/* Deterministic Hash Simulation */}
            <div className={`p-3 rounded-2xl border text-xs font-mono space-y-1 ${
              isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-950/20 border-purple-500/20'
            }`}>
              <div className="text-[10px] text-purple-600 dark:text-purple-300 font-bold uppercase">
                Simulated 3D-ULPIN to be Minted:
              </div>
              <div className={`font-bold text-sm tracking-wide ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-accent-primary)]'}`}>
                IND280145987621-A+02-6D3E
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
          isLight ? 'border-[var(--color-border-default)]' : 'border-slate-800'
        }`}>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject / Request Field Survey</span>
          </button>

          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shadow-[var(--color-accent-primary)]/20'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-surface-3)] shadow-[0_0_15px_rgba(0,208,132,0.3)]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Minting 3D-ULPIN...' : 'Accept & Mint Authoritative 3D-ULPIN'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
