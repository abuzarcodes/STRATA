import React, { useState, useCallback } from 'react'
import initialSocietyData from './data/societyData.json'
import Viewer3D from './components/Viewer3D'
import Navbar from './components/Navbar'
import LayerControls from './components/LayerControls'
import PropertyDeedCard from './components/PropertyDeedCard'
import GovtAdminDashboard from './components/GovtAdminDashboard'
import CitizenLocker from './components/CitizenLocker'
import SurveyorUploadModal from './components/SurveyorUploadModal'
import ParcelSplitModal from './components/ParcelSplitModal'
import MutationModal from './components/MutationModal'
import AIReviewModal from './components/AIReviewModal'

// Pre-app components
import LandingScene from './components/LandingScene'
import RoleSelectPanel from './components/RoleSelectPanel'
import AuthModal from './components/AuthModal'
import PublicLocationSearch from './components/PublicLocationSearch'

export default function App() {
  // ── Top-level app phase ────────────────────────────────────────────────
  const [appPhase, setAppPhase] = useState('LANDING')
  // 'LANDING' | 'ROLE_SELECT' | 'AUTH' | 'LOCATE' | 'APP'

  const [societyData, setSocietyData] = useState(initialSocietyData)
  const [activeRole, setActiveRole] = useState('CITIZEN')
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [activeFloor, setActiveFloor] = useState('ALL')
  const [viewMode, setViewMode] = useState('CADASTRE')
  const [cameraPreset, setCameraPreset] = useState('OVERVIEW')
  const [searchQuery, setSearchQuery] = useState('')
  const [explodedOffset, setExplodedOffset] = useState(0)
  const [showLeftSearch, setShowLeftSearch] = useState(true)
  
  // Theme state
  const [theme, setTheme] = useState('LIGHT')

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'LIGHT' ? 'CYBER' : 'LIGHT'))
  }, [])

  // Modals state
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitTargetUnit, setSplitTargetUnit] = useState(null)
  const [showMutationModal, setShowMutationModal] = useState(false)
  const [mutationTargetUnit, setMutationTargetUnit] = useState(null)
  const [showLocker, setShowLocker] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAIReviewModal, setShowAIReviewModal] = useState(false)

  // flyToTarget state
  const [flyTarget, setFlyTarget] = useState(null)
  const [flightProgress, setFlightProgress] = useState(null)

  // Notification Toast State
  const [toast, setToast] = useState(null)

  const showNotification = (title, message, type = 'INFO') => {
    setToast({ title, message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // ── Phase transitions ──────────────────────────────────────────────────
  const handleScrollBegin = useCallback(() => {
    setAppPhase('ROLE_SELECT')
  }, [])

  const handleRoleSelect = useCallback((role) => {
    setActiveRole(role)
    setAppPhase('AUTH')
  }, [])

  const handleAuthSuccess = useCallback(() => {
    if (activeRole === 'GOVT') {
      setAppPhase('APP')
      setShowAdminDashboard(true)
      showNotification('Revenue Officer Portal', 'Accessed Government Cadastre Compliance Dashboard', 'INFO')
    } else if (activeRole === 'SURVEYOR') {
      setAppPhase('APP')
      setShowUploadModal(true)
      showNotification('Surveyor Ingestion Tool', 'Ready for BIM / CAD / LiDAR Ingestion', 'INFO')
    } else if (activeRole === 'OWNER') {
      setAppPhase('APP')
      setShowLocker(true)
      showNotification('Citizen Vault', 'Authenticated Property Locker Opened', 'SUCCESS')
    } else {
      setAppPhase('APP')
    }
  }, [activeRole])

  // ── flyToTarget handler ────────────────────────────────────────────────
  const handleFlyToTarget = useCallback((target) => {
    setFlyTarget(target)
    setFlightProgress(null)
  }, [])

  const handleFlightProgress = useCallback((phase) => {
    setFlightProgress(phase)
    if (phase === 'SETTLED') {
      const targetUnit = societyData?.units?.find((u) => u.unit_id === flyTarget?.targetUnitId)
      if (targetUnit) {
        setSelectedUnit(targetUnit)
        showNotification('Unit Inspected', `${targetUnit.name} (${targetUnit.ulpin_3d})`, 'INFO')
      }
      setTimeout(() => {
        setFlyTarget(null)
        setFlightProgress(null)
      }, 800)
    }
  }, [societyData, flyTarget])

  // Handle role change (in-app, from Navbar)
  const handleRoleChange = (role) => {
    setActiveRole(role)
    if (role === 'GOVT') {
      setShowAdminDashboard(true)
      showNotification('Revenue Officer Portal', 'Accessed Government Cadastre Compliance Dashboard', 'INFO')
    } else if (role === 'OWNER') {
      setShowLocker(true)
      showNotification('Citizen Vault', 'Authenticated Property Locker Opened', 'SUCCESS')
    } else if (role === 'SURVEYOR') {
      setShowUploadModal(true)
      showNotification('Surveyor Ingestion Tool', 'Ready for BIM / CAD / LiDAR Ingestion', 'INFO')
    } else {
      showNotification('Public Portal', 'Viewing Public Cadastral Digital Twin', 'INFO')
    }
  }

  // Handle unit selection
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit)
    if (unit && unit.level !== undefined && activeFloor !== 'ALL' && activeFloor !== unit.level) {
      setActiveFloor(unit.level)
    }
    if (unit) {
      showNotification('Unit Inspected', `${unit.name} (${unit.ulpin_3d})`, 'INFO')
    }
  }

  // Handle 3D Parcel Split
  const handleApplySplit = ({ parentUnitId, childA, childB }) => {
    setSocietyData((prev) => {
      const parentIndex = prev.units.findIndex((u) => u.unit_id === parentUnitId)
      if (parentIndex === -1) return prev

      const parentUnit = prev.units[parentIndex]
      
      const childA_Unit = {
        ...parentUnit,
        ...childA,
        vertices_local: parentUnit.vertices_local.map((v) => [
          v[0] < parentUnit.centroid_local[0] ? v[0] : (v[0] + parentUnit.centroid_local[0]) / 2,
          v[1],
          v[2]
        ]),
        faces: parentUnit.faces
      }

      const childB_Unit = {
        ...parentUnit,
        ...childB,
        vertices_local: parentUnit.vertices_local.map((v) => [
          v[0] >= parentUnit.centroid_local[0] ? v[0] : (v[0] + parentUnit.centroid_local[0]) / 2,
          v[1],
          v[2]
        ]),
        faces: parentUnit.faces
      }

      const newUnits = [...prev.units]
      newUnits.splice(parentIndex, 1, childA_Unit, childB_Unit)

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          total_registered_units: newUnits.length
        },
        units: newUnits
      }
    })

    setSelectedUnit(childA)
    showNotification('3D Parcel Subdivided', `Created ${childA.name} & ${childB.name}`, 'SUCCESS')
  }

  // Handle Title Mutation Transfer
  const handleApplyMutation = (unitId, newOwnerName) => {
    setSocietyData((prev) => {
      const updatedUnits = prev.units.map((u) => {
        if (u.unit_id === unitId) {
          return { ...u, owner: newOwnerName }
        }
        return u
      })
      return { ...prev, units: updatedUnits }
    })

    setSelectedUnit((prev) => (prev && prev.unit_id === unitId ? { ...prev, owner: newOwnerName } : prev))
    showNotification('Title Mutation Complete', `Ownership transferred to ${newOwnerName}`, 'SUCCESS')
  }

  // Handle AI Review Acceptance
  const handleAcceptAIResult = (unitCode) => {
    showNotification('AI Cadastre Minted', `${unitCode} validated and added to 3D Registry`, 'SUCCESS')
  }

  const violationsCount = societyData?.audit_summary?.violation_count || 0
  const isLight = theme === 'LIGHT'

  return (
    <div
      data-theme={theme}
      className={`w-screen h-screen relative overflow-hidden font-sans select-none transition-colors duration-500 ${
        isLight ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#060B12] text-white'
      }`}
    >
      {/* ── PRE-APP PHASES ────────────────────────────────────────────── */}

      {appPhase === 'LANDING' && (
        <LandingScene
          onScrollBegin={handleScrollBegin}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {appPhase === 'ROLE_SELECT' && (
        <RoleSelectPanel
          onSelectRole={handleRoleSelect}
          onBack={() => setAppPhase('LANDING')}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {appPhase === 'AUTH' && (
        <AuthModal
          activeRole={activeRole}
          onBack={() => setAppPhase('ROLE_SELECT')}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* ── APP PHASE (Full 3D digital cadastre twin) ─────────────────── */}
      {appPhase === 'APP' && (
        <>
          {/* Top Main Navbar matching Figma */}
          <Navbar
            societyData={societyData}
            activeRole={activeRole}
            onSelectRole={handleRoleChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectUnitFromSearch={handleSelectUnit}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenLocker={() => setShowLocker(true)}
            onOpenAIReviewModal={() => setShowAIReviewModal(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onNavClick={(dest) => {
              if (dest === 'about') setAppPhase('LANDING')
            }}
          />

          {/* Sub-Header Top Telemetry Bar matching Figma Frame 11:171 */}
          <div className={`absolute top-16 left-0 right-0 z-20 px-8 py-2 border-b flex items-center justify-between text-[11px] font-mono backdrop-blur-md transition-colors duration-300 ${
            isLight
              ? 'bg-white/90 border-[#C8E6C9] text-slate-700'
              : 'bg-[#0B131E]/80 border-[#1E293B]/60 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isLight ? 'text-[#1B5E20]' : 'text-white'}`}>MH-MUM-WARD-04</span>
              <span className="text-slate-400">/</span>
              <span className={`font-bold ${isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}`}>PARCEL-1092-B3</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                LAT: <strong className={isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}>18.9226° N</strong>
              </div>
              <div>
                LONG: <strong className={isLight ? 'text-[#1B5E20]' : 'text-[#00D084]'}>72.8339° E</strong>
              </div>
              <div>
                DATUM_ELEV: <strong className={isLight ? 'text-[#2E7D32]' : 'text-[#00D084]'}>+34.20m MSL</strong>
              </div>
            </div>
          </div>

          {/* 3D Viewport with HUD Cybernetic Frame matching Figma Frame 11:171 */}
          <div className="absolute inset-0 z-0">
            <Viewer3D
              societyData={societyData}
              selectedUnit={selectedUnit}
              onSelectUnit={handleSelectUnit}
              activeFloor={activeFloor}
              viewMode={viewMode}
              cameraPreset={cameraPreset}
              explodedOffset={explodedOffset}
              theme={theme}
              flyTarget={flyTarget}
              onFlightProgress={handleFlightProgress}
            />

            {/* HUD Viewport Framing & Corner Crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
              {/* Top Row Markers */}
              <div className="flex justify-between items-start">
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#1B5E20]/70' : 'text-[#00D084]/60'}`}>
                  <span className={`w-3 h-3 border-t-2 border-l-2 ${isLight ? 'border-[#1B5E20]' : 'border-[#00D084]'}`} />
                  <span>GRID_01 / EPSG:4326</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#1B5E20]/70' : 'text-[#00D084]/60'}`}>
                  <span>3D_ORTHO_ALIGN_ACTIVE</span>
                  <span className={`w-3 h-3 border-t-2 border-r-2 ${isLight ? 'border-[#1B5E20]' : 'border-[#00D084]'}`} />
                </div>
              </div>

              {/* Bottom Row Markers */}
              <div className="flex justify-between items-end">
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#1B5E20]/70' : 'text-[#00D084]/60'}`}>
                  <span className={`w-3 h-3 border-b-2 border-l-2 ${isLight ? 'border-[#1B5E20]' : 'border-[#00D084]'}`} />
                  <span>CADASTRE_SCAN: LIVE</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#1B5E20]/70' : 'text-[#00D084]/60'}`}>
                  <span>VOLUMETRIC_TOLERANCE: 0.02°</span>
                  <span className={`w-3 h-3 border-b-2 border-r-2 ${isLight ? 'border-[#1B5E20]' : 'border-[#00D084]'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel: Public Location Search & Floor Slicer matching Figma Frame 11:171 */}
          <div className="absolute top-28 left-6 z-20 transition-all duration-300">
            {showLeftSearch && (
              <PublicLocationSearch
                societyData={societyData}
                activeFloor={activeFloor}
                onSelectFloor={setActiveFloor}
                onFlyToTarget={handleFlyToTarget}
                theme={theme}
                onRetrieveModel={() => {
                  showNotification('Query Dispatched', 'Loaded Dwarka / Mumbai Cadastral Ward Mesh', 'INFO')
                }}
              />
            )}
          </div>

          {/* Right Panel: View Mode Selector matching Figma Frame 11:171 */}
          <div className="absolute top-28 right-6 z-20 transition-all duration-300">
            {!selectedUnit && (
              <LayerControls
                viewMode={viewMode}
                onSelectViewMode={setViewMode}
                violationsCount={violationsCount}
                onResetCamera={() => setCameraPreset('OVERVIEW')}
                theme={theme}
              />
            )}

            {/* Right Panel: Property Deed Card matching Figma Frame 11:266 */}
            {selectedUnit && (
              <PropertyDeedCard
                unit={selectedUnit}
                onClose={() => setSelectedUnit(null)}
                theme={theme}
                onOpenSplitModal={(u) => {
                  setSplitTargetUnit(u)
                  setShowSplitModal(true)
                }}
                onInitiateMutation={(u) => {
                  setMutationTargetUnit(u)
                  setShowMutationModal(true)
                }}
              />
            )}
          </div>

          {/* Modals & Dashboards matching Figma */}
          {showAdminDashboard && (
            <GovtAdminDashboard
              societyData={societyData}
              theme={theme}
              onClose={() => setShowAdminDashboard(false)}
              onFocusUnit={(u) => {
                handleSelectUnit(u)
                setCameraPreset('ENCROACHMENT')
                setViewMode('ENCROACHMENT')
              }}
              onOpenSplitModal={(u) => {
                setSplitTargetUnit(u)
                setShowSplitModal(true)
              }}
            />
          )}

          {showLocker && (
            <CitizenLocker
              theme={theme}
              onClose={() => setShowLocker(false)}
              onFocusUnit={(unitId) => {
                const target = societyData?.units?.find((u) => u.unit_id === unitId) || societyData?.units?.[0]
                if (target) handleSelectUnit(target)
              }}
            />
          )}

          {showUploadModal && (
            <SurveyorUploadModal
              theme={theme}
              onClose={() => setShowUploadModal(false)}
              onIngestSuccess={() => {
                showNotification('Mesh Ingestion', 'New CAD geometry ingested and extruded into 3D twin.', 'SUCCESS')
              }}
            />
          )}

          <AIReviewModal
            isOpen={showAIReviewModal}
            onClose={() => setShowAIReviewModal(false)}
            onAcceptAIResult={handleAcceptAIResult}
          />

          {showSplitModal && splitTargetUnit && (
            <ParcelSplitModal
              unit={splitTargetUnit}
              onClose={() => {
                setShowSplitModal(false)
                setSplitTargetUnit(null)
              }}
              onApplySplit={handleApplySplit}
            />
          )}

          {showMutationModal && mutationTargetUnit && (
            <MutationModal
              unit={mutationTargetUnit}
              onClose={() => {
                setShowMutationModal(false)
                setMutationTargetUnit(null)
              }}
              onApplyMutation={handleApplyMutation}
            />
          )}

          {toast && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-[#0F172A] border border-[#00D084]/60 text-xs font-mono shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
              <span className={`w-2 h-2 rounded-full ${toast.type === 'SUCCESS' ? 'bg-[#00D084]' : 'bg-emerald-400'} animate-ping`} />
              <div>
                <span className="font-bold text-[#00D084] mr-2">{toast.title}:</span>
                <span className="text-slate-200">{toast.message}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
