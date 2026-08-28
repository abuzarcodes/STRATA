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
import confetti from 'canvas-confetti'

export default function AIReviewModal({ isOpen, onClose, onAcceptAIResult }) {
  const [selectedExtraction, setSelectedExtraction] = useState('UNIT-203')
  const [zOffsetAdjustment, setZOffsetAdjustment] = useState(0.0)
  const [confidenceScore] = useState(96.4)
  const [isProcessing, setIsProcessing] = useState(false)
  const [decisionFeedback, setDecisionFeedback] = useState(null)

  if (!isOpen) return null

  const handleAccept = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setDecisionFeedback({
        type: 'ACCEPTED',
        message: 'AI Extrusion Accepted! 3D-ULPIN Minted & Promoted to Tier 1 Authoritative Cadastre.'
      })
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
      setTimeout(() => {
        if (onAcceptAIResult) onAcceptAIResult(selectedExtraction)
        onClose()
      }, 1800)
    }, 800)
  }

  const handleReject = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setDecisionFeedback({
        type: 'REJECTED',
        message: 'AI Extraction Rejected. Flagged for manual LiDAR land survey inspection.'
      })
      setTimeout(() => {
        onClose()
      }, 1500)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-panel-accent rounded-3xl p-6 shadow-2xl border border-purple-500/40 text-slate-100 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  AI Model v2.4 • Ingestion Review
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {confidenceScore}% Confidence
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
                AI Cadastral Mesh Extraction & Boundary Verification
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

        {/* Feedback Alert if Action Taken */}
        {decisionFeedback && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-200 ${
            decisionFeedback.type === 'ACCEPTED'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-hud-emerald'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-hud-rose'
          }`}>
            {decisionFeedback.type === 'ACCEPTED' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div className="text-xs font-semibold">{decisionFeedback.message}</div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Extraction Details */}
          <div className="space-y-3 md:col-span-1">
            <div className="text-xs font-mono text-[#00D084] uppercase tracking-wider">
              1. Extracted Cadastral Entity
            </div>
            
            <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Unit:</span>
                <span className="font-bold text-white font-mono">Unit 203 (3BHK East Wing)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Floor Level:</span>
                <span className="font-mono text-[#00D084]">Level 2 (+6.0m to +9.0m)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Source Input:</span>
                <span className="font-mono text-purple-300">AutoCAD DXF + LiDAR Cloud</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                  AI-Extracted (Tier 3)
                </span>
              </div>
            </div>

            {/* AI Confidence Meter */}
            <div className="p-3.5 rounded-2xl bg-obsidian-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Mesh Watertightness:</span>
                <span className="text-emerald-400 font-mono font-bold">100% Certified</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00D084] h-full rounded-full w-[96.4%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Tolerance: ±0.02m</span>
                <span>Self-Intersect: 0</span>
              </div>
            </div>
          </div>

          {/* Center/Right Column: Geometric Comparison & Review Sliders */}
          <div className="space-y-4 md:col-span-2">
            <div className="text-xs font-mono text-[#00D084] uppercase tracking-wider">
              2. Volumetric Geometry & Fine Tuning
            </div>

            {/* Comparison Bento Tiles */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-obsidian-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans">Predicted RERA Volume</span>
                <div className="text-lg font-bold text-[#00D084] mt-1">
                  302.40 <span className="text-xs font-normal text-slate-400">m³</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-obsidian-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-sans">Extruded Carpet Area</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  108.00 <span className="text-xs font-normal text-slate-400">m²</span>
                </div>
              </div>
            </div>

            {/* Interactive Geometry Correction Slider */}
            <div className="p-4 rounded-2xl bg-obsidian-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#00D084]" />
                  <span>Manual Elevation (Z-Axis) Offset Correction:</span>
                </span>
                <span className="font-mono text-[#00D084]">
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
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D084]"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>-0.50m (Lower)</span>
                <span>Standard (0.00m)</span>
                <span>+0.50m (Raise)</span>
              </div>
            </div>

            {/* Deterministic Hash Simulation */}
            <div className="p-3 rounded-2xl bg-obsidian-900/90 border border-purple-500/20 text-xs font-mono space-y-1">
              <div className="text-[10px] text-purple-300 uppercase">
                Simulated 3D-ULPIN to be Minted:
              </div>
              <div className="text-[#00D084] font-bold text-sm tracking-wide">
                IND280145987621-A+02-6D3E
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-obsidian-900 hover:bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all hover:border-rose-400"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject / Request Field Survey</span>
          </button>

          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-[#00D084] hover:bg-[#00b875] text-[#080E17] text-xs font-extrabold flex items-center gap-2 shadow-[0_0_15px_rgba(0,208,132,0.3)] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Minting 3D-ULPIN...' : 'Accept & Mint Authoritative 3D-ULPIN'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
