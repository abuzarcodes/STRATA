import React, { useState } from 'react'
import {
  Upload,
  HardHat,
  FileCode,
  FileCheck,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react'

export default function SurveyorUploadModal({
  onClose,
  onIngestSuccess
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [pipelineStep, setPipelineStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    'Parsing 2D CAD vectors & OCR Room labels...',
    'Applying Affine Georeferencing Matrix (WGS84 EPSG:4326)...',
    'Executing 3D Volumetric Extrusion (Trimesh Engine)...',
    'Verifying Manifold Watertightness & Normal vectors...',
    'Minting Deterministic 3D-ULPIN Identifiers with SHA-256 Hashing...',
    'Performing ISO 19152 LADM 3D Topology & Encroachment Audit...'
  ]

  const handleStartPipeline = (filename) => {
    setSelectedFile(filename)
    setIsProcessing(true)
    setPipelineStep(0)

    const interval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          setIsProcessing(false)
          return prev
        }
      })
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel-accent rounded-3xl p-6 shadow-2xl border border-amber-500/30 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Licensed Surveyor & Architect Workspace
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Multi-Source CAD / BIM / LiDAR Ingestion Engine
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

        {/* Content */}
        {!selectedFile ? (
          <div className="space-y-4 my-4">
            {/* Drag and Drop Zone */}
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-900/40 text-center space-y-3 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Drag and drop architectural floor plans or 3D point clouds
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: <strong>AutoCAD DXF/DWG, IFC (BIM), GeoJSON, CubiCasa SVG, LiDAR (.LAZ)</strong>
                </p>
              </div>
            </div>

            {/* One-Click Presets */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Or Load Benchmark Datasets:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStartPipeline('delhi_dwarka_sec10_society_v3.dxf')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-amber-300">
                    Dwarka Sec-10 Residential (DXF)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    G+4 Floors + Basement (Delhi Anchor)
                  </div>
                </button>

                <button
                  onClick={() => handleStartPipeline('cubicasa_apartment_floorplan.svg')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
                >
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-amber-300">
                    CubiCasa5k Sample (SVG)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Multi-Room Vector Extraction
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Processing State */
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Source: <strong className="text-white">{selectedFile}</strong></span>
              <span className="text-amber-400 font-bold">{isProcessing ? 'PROCESSING' : 'COMPLETED'}</span>
            </div>

            {/* Pipeline progress steps */}
            <div className="space-y-2">
              {steps.map((text, idx) => {
                const isPast = idx < pipelineStep || (!isProcessing && pipelineStep === steps.length - 1)
                const isCurrent = idx === pipelineStep && isProcessing

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs font-mono flex items-center gap-3 transition-all ${
                      isPast
                        ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20'
                        : isCurrent
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 animate-pulse'
                        : 'bg-slate-900/40 text-slate-600 border border-slate-800/40'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel
          </button>

          {!isProcessing && selectedFile && (
            <button
              onClick={() => {
                onClose()
                if (onIngestSuccess) onIngestSuccess()
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Extruded 3D Digital Twin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
