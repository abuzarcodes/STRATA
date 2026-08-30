import React, { useState, useEffect } from 'react'
import { X, Terminal, ExternalLink, Check, Copy, Activity, Server, Shield, Layers } from 'lucide-react'

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/health',
    desc: 'System health check and database connectivity diagnostic',
    auth: 'None',
    sampleResponse: JSON.stringify({
      success: true,
      message: "STRATA Backend Service Status",
      data: {
        status: "operational",
        uptimeSeconds: 1420,
        environment: "development",
        database: { status: "connected" }
      }
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/api/v1/projects',
    desc: 'List all cadastral housing societies & development schemes with pagination',
    auth: 'Bearer JWT',
    sampleResponse: JSON.stringify({
      success: true,
      data: [
        {
          id: "proj_01",
          name: "Aura Residency Complex",
          location: "Sector 10, Dwarka, New Delhi",
          state: "Delhi",
          pincode: "110075",
          totalBuildings: 2,
          totalUnits: 48
        }
      ]
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/api/v1/parcels',
    desc: 'Query 2D base parcels and parent spatial boundary polygons',
    auth: 'Bearer JWT',
    sampleResponse: JSON.stringify({
      success: true,
      data: [
        {
          parcelId: "IND280145987621",
          surveyNo: "3D-DL-DWK-1092-B3",
          areaM2: 4500.0,
          setbackMinDistanceM: 6.0
        }
      ]
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/api/v1/spatial-assets',
    desc: 'Retrieve 3D spatial units, volume, carpet area, and 3D-ULPIN records',
    auth: 'Bearer JWT',
    sampleResponse: JSON.stringify({
      success: true,
      data: [
        {
          unitId: "FLAT-104",
          ulpin3D: "IND280145987621-A+01-4DAC",
          volumeM3: 226.8,
          carpetAreaM2: 81.0,
          isWatertight: true,
          level: 1,
          domain: "A"
        }
      ]
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/api/v1/violations',
    desc: 'Encroachment detection, setback violation audit & overlap conflicts',
    auth: 'Bearer JWT (Govt/Admin)',
    sampleResponse: JSON.stringify({
      success: true,
      data: [
        {
          id: "viol_01",
          unitId: "FLAT-302",
          violationType: "SETBACK_ENCROACHMENT",
          severity: "CRITICAL",
          encroachmentVolumeM3: 4.25,
          status: "OPEN"
        }
      ]
    }, null, 2)
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    desc: 'Authenticate citizen, surveyor, or government officer role with JWT',
    auth: 'None',
    sampleResponse: JSON.stringify({
      success: true,
      data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "usr_01",
          name: "Rajesh Kumar (Surveyor)",
          role: "SURVEYOR"
        }
      }
    }, null, 2)
  }
]

export default function APIModal({ isOpen, onClose, theme = 'CYBER' }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0])
  const [copied, setCopied] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')

  const isLight = theme === 'LIGHT'

  useEffect(() => {
    if (!isOpen) return
    let isMounted = true

    fetch('http://localhost:3001/api/v1/health')
      .then(res => res.json())
      .then(data => {
        if (isMounted) setBackendStatus(data?.success ? 'online' : 'degraded')
      })
      .catch(() => {
        if (isMounted) setBackendStatus('offline')
      })

    return () => { isMounted = false }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopyCurl = (ep) => {
    const curl = `curl -X ${ep.method} "http://localhost:3001${ep.path}" -H "Content-Type: application/json"`
    navigator.clipboard.writeText(curl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col transition-all duration-300 ${
          isLight
            ? 'bg-white border-[var(--color-border-default)] text-slate-800'
            : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border font-mono ${
                isLight
                  ? 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)]/40 text-[var(--color-accent-primary)]'
                  : 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)]/60 text-[var(--color-accent-primary)]'
              }`}
            >
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-extrabold tracking-wide ${isLight ? 'text-[var(--color-accent-primary)]' : 'text-white'}`}>
                  STRATA REST API & Swagger UI
                </h2>
                {/* Live Backend Pulse */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                    backendStatus === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : backendStatus === 'degraded'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {backendStatus.toUpperCase()} (Port 3001)
                </span>
              </div>
              <p className={`text-[11px] font-mono ${isLight ? 'text-[var(--color-accent-primary-hover)]' : 'text-[var(--color-accent-primary)]'}`}>
                Spatial Queries • Volumetric Ingestion • ULPIN Minting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3001/api-docs"
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-white border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white'
                  : 'bg-[var(--color-accent-primary)]/20 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-bg-app)]'
              }`}
            >
              <span>SWAGGER DOCS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isLight
                  ? 'hover:bg-slate-100 text-slate-500 border-slate-200'
                  : 'hover:bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Endpoint List (Left Column) */}
          <div className="md:col-span-5 flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
              Core Endpoints
            </div>
            {API_ENDPOINTS.map((ep, idx) => {
              const isSelected = selectedEndpoint.path === ep.path
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? isLight
                        ? 'bg-[var(--color-surface-muted)] border-[var(--color-accent-primary)] shadow-sm'
                        : 'bg-[var(--color-accent-primary)]/10 border-[var(--color-accent-primary)] shadow-[0_0_10px_rgba(0,208,132,0.15)]'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono font-black text-[10px] ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className={`font-mono text-xs font-semibold truncate ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{ep.desc}</p>
                </button>
              )
            })}
          </div>

          {/* Endpoint Details & Preview (Right Column) */}
          <div className="md:col-span-7 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
            <div
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-black text-xs ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className={`font-mono text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{selectedEndpoint.path}</span>
                </div>
                <button
                  onClick={() => handleCopyCurl(selectedEndpoint)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500'
                      : isLight
                      ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED CURL' : 'COPY CURL'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500">{selectedEndpoint.desc}</p>
              <div className="mt-2 text-[11px] font-mono text-slate-400">
                Auth: <span className={isLight ? 'text-[var(--color-accent-primary)] font-bold' : 'text-emerald-400'}>{selectedEndpoint.auth}</span>
              </div>
            </div>

            {/* Response JSON Preview */}
            <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden ${
              isLight ? 'border-[var(--color-border-default)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border-default)] bg-black/40'
            }`}>
              <div className={`px-3 py-2 border-b flex items-center justify-between text-[11px] font-mono ${
                isLight ? 'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-slate-600' : 'bg-black/60 border-[var(--color-border-default)] text-slate-400'
              }`}>
                <span>Response Schema (200 OK)</span>
                <span>application/json</span>
              </div>
              <pre className={`p-3 font-mono text-xs overflow-x-auto max-h-[30vh] ${
                isLight ? 'text-[var(--color-accent-primary)]' : 'text-emerald-400/90'
              }`}>
                {selectedEndpoint.sampleResponse}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-[var(--color-surface-3)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border-default)]'
          }`}
        >
          <div className="text-xs font-mono text-slate-500">
            Base URL: <code className="text-[var(--color-accent-primary)]">http://localhost:3001/api/v1</code>
          </div>
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white'
                : 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-bg-app)]'
            }`}
          >
            <span>OPEN INTERACTIVE SWAGGER</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
