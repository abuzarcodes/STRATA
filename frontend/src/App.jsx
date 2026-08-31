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
import AboutModal from './components/AboutModal'
import DocumentationModal from './components/DocumentationModal'
import APIModal from './components/APIModal'
import AboutPage from './components/AboutPage'
import DocumentationPage from './components/DocumentationPage'

// Pre-app components
import LandingScene from './components/LandingScene'
import RoleSelectPanel from './components/RoleSelectPanel'
import AuthModal from './components/AuthModal'
import PublicLocationSearch from './components/PublicLocationSearch'

export default function App() {
  // ── Top-level app phase ────────────────────────────────────────────────
  const [appPhase, setAppPhase] = useState('LANDING')
  // 'LANDING' | 'ROLE_SELECT' | 'AUTH' | 'APP' | 'ABOUT' | 'DOCUMENTATION'

  const [societyData, setSocietyData] = useState(initialSocietyData)
  const [activeRole, setActiveRole] = useState('CITIZEN')
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [activeFloor, setActiveFloor] = useState('ALL')
  const [viewMode, setViewMode] = useState('CADASTRE')
  const [cameraPreset, setCameraPreset] = useState('OVERVIEW')
  const [searchQuery, setSearchQuery] = useState('')
  const [explodedOffset, setExplodedOffset] = useState(0)
  const [showLeftSearch, setShowLeftSearch] = useState(true)
  const [showBounds, setShowBounds] = useState(true)
  const [measureMode, setMeasureMode] = useState(false)
  
  // Theme state
  const [theme, setTheme] = useState('CYBER')

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
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [showAPIModal, setShowAPIModal] = useState(false)

  // flyToTarget state
  const [flyTarget, setFlyTarget] = useState(null)
  const [flightProgress, setFlightProgress] = useState(null)

  // Notification Toast State
  const [toast, setToast] = useState(null)

  const showNotification = (title, message, type = 'INFO') => {
    setToast({ title, message, type })
    setTimeout(() => {
      setToast(null)
    }, 4500)
  }

  // ── Global Navbar Navigation Handler ──────────────────────────────────
  const handleNavClick = useCallback((dest) => {
    if (dest === 'about') {
      setAppPhase('ABOUT')
    } else if (dest === 'documentation') {
      setAppPhase('DOCUMENTATION')
    } else if (dest === 'api') {
      setShowAPIModal(true)
    } else if (dest === 'landing') {
      setAppPhase('LANDING')
    } else if (dest === 'public_search') {
      setActiveRole('CITIZEN')
      setAppPhase('APP')
      setShowLeftSearch(true)
    }
  }, [])

  // ── Phase transitions ──────────────────────────────────────────────────
  const handleScrollBegin = useCallback(() => {
    setAppPhase('ROLE_SELECT')
  }, [])

  const handleRoleSelect = useCallback((role) => {
    setActiveRole(role)
    setAppPhase('AUTH')
  }, [])

  const handleAuthSuccess = useCallback(({ role }) => {
    const targetRole = role || activeRole
    setActiveRole(targetRole)
    setAppPhase('APP')

    if (targetRole === 'GOVT') {
      setShowAdminDashboard(true)
      showNotification('Revenue Officer Portal', 'Signed in as DILRMP Revenue Administrator (Dwarka Ward 4).', 'SUCCESS')
    } else if (targetRole === 'SURVEYOR') {
      setShowUploadModal(true)
      showNotification('Surveyor Ingestion Tool', 'Signed in as Licensed Cadastral Surveyor. Ready for BIM/CAD/LiDAR ingestion.', 'SUCCESS')
    } else if (targetRole === 'OWNER') {
      setShowLocker(true)
      showNotification('Citizen Vault', 'Authenticated Property Owner Vault Opened (Deepak Joshi).', 'SUCCESS')
    } else {
      showNotification('Public Portal', 'Welcome to STRATA National 3D Cadastral Digital Twin.', 'INFO')
    }
  }, [activeRole])

  // ── flyToTarget handler ────────────────────────────────────────────────
  const handleFlyToTarget = useCallback((target) => {
    setFlyTarget(target)
    setFlightProgress(null)
    showNotification('Camera Fly-To', 'Navigating 3D spatial viewport to target parcel coordinates.', 'INFO')
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
      showNotification('Unit Inspected', `${unit.name} • 3D-ULPIN: ${unit.ulpin_3d}`, 'INFO')
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
    showNotification('AI Cadastre Minted', `${unitCode} validated and added to Authoritative 3D Registry`, 'SUCCESS')
  }

  const violationsCount = societyData?.audit_summary?.violation_count || 0
  const isLight = theme === 'LIGHT'
  const isScrollablePhase = appPhase === 'LANDING' || appPhase === 'ABOUT' || appPhase === 'DOCUMENTATION'

  return (
    <div
      data-theme={theme}
      className={`theme-app responsive-app-shell w-screen h-screen relative font-sans transition-colors duration-500 ${
        isScrollablePhase ? 'overflow-y-auto overflow-x-hidden scroll-smooth' : 'overflow-hidden select-none'
      }`}
    >
      {/* ── PRE-APP PHASES ────────────────────────────────────────────── */}

      {appPhase === 'LANDING' && (
        <LandingScene
          onScrollBegin={handleScrollBegin}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onNavClick={handleNavClick}
        />
      )}

      {appPhase === 'ABOUT' && (
        <AboutPage
          onBack={() => setAppPhase('LANDING')}
          onLaunchPlatform={() => setAppPhase('APP')}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {appPhase === 'DOCUMENTATION' && (
        <DocumentationPage
          onBack={() => setAppPhase('LANDING')}
          onLaunchPlatform={() => setAppPhase('APP')}
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
          onNavClick={handleNavClick}
        />
      )}

      {appPhase === 'AUTH' && (
        <AuthModal
          activeRole={activeRole}
          onBack={() => setAppPhase('ROLE_SELECT')}
          onSuccess={handleAuthSuccess}
          theme={theme}
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
            onOpenRoleSelect={() => setAppPhase('ROLE_SELECT')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectUnitFromSearch={handleSelectUnit}
            onOpenUploadModal={() => setShowUploadModal(true)}
            onOpenLocker={() => setShowLocker(true)}
            onOpenAIReviewModal={() => setShowAIReviewModal(true)}
            onOpenGovtDashboard={() => setShowAdminDashboard(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onNavClick={handleNavClick}
          />

          {/* Sub-Header Top Telemetry Bar */}
          <div className="theme-surface responsive-telemetry absolute top-16 left-0 right-0 z-20 px-8 py-2 border-b flex items-center justify-between text-[11px] font-mono backdrop-blur-md transition-colors duration-300">
            <div className="flex items-center gap-2">
                  <span className="font-bold theme-text-primary">DL-DWR-SEC10-07</span>
              <span className="text-slate-400">/</span>
                  <span className="font-bold theme-accent">PARCEL-IND280145987621</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                LAT: <strong className="theme-accent">28.5823° N</strong>
              </div>
              <div>
                LONG: <strong className="theme-accent">77.0602° E</strong>
              </div>
              <div>
                DATUM_ELEV: <strong className="theme-accent">+215.0m MSL</strong>
              </div>
            </div>
          </div>

          {/* 3D Viewport with HUD Cybernetic Frame */}
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
              showBounds={showBounds}
              measureMode={measureMode}
            />

            {/* HUD Viewport Framing & Corner Crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
              {/* Top Row Markers */}
              <div className="flex justify-between items-start mt-20">
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#2e7d63]/80' : 'text-[#7ee7d2]/70'}`}>
                  <span className={`w-3 h-3 border-t-2 border-l-2 ${isLight ? 'border-[#2e7d63]' : 'border-[#7ee7d2]'}`} />
                  <span>GRID_01 / EPSG:4326 WGS84</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#2e7d63]/80' : 'text-[#7ee7d2]/70'}`}>
                  <span>3D_CADASTRE_SYNC_ONLINE</span>
                  <span className={`w-3 h-3 border-t-2 border-r-2 ${isLight ? 'border-[#2e7d63]' : 'border-[#7ee7d2]'}`} />
                </div>
              </div>

              {/* Bottom Row Markers */}
              <div className="flex justify-between items-end">
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#2e7d63]/80' : 'text-[#7ee7d2]/70'}`}>
                  <span className={`w-3 h-3 border-b-2 border-l-2 ${isLight ? 'border-[#2e7d63]' : 'border-[#7ee7d2]'}`} />
                  <span>ISO 19152:2024 LADM PART 2</span>
                </div>
                <div className={`flex items-center gap-2 font-mono text-[10px] ${isLight ? 'text-[#2e7d63]/80' : 'text-[#7ee7d2]/70'}`}>
                  <span>VOLUMETRIC_TOLERANCE: 0.02m</span>
                  <span className={`w-3 h-3 border-b-2 border-r-2 ${isLight ? 'border-[#2e7d63]' : 'border-[#7ee7d2]'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel: Public Location Search & Floor Slicer */}
          <div className="responsive-left-panel absolute top-28 left-6 z-20 transition-all duration-300">
            {showLeftSearch && (
              <PublicLocationSearch
                societyData={societyData}
                activeFloor={activeFloor}
                onSelectFloor={setActiveFloor}
                onFlyToTarget={handleFlyToTarget}
                theme={theme}
                onRetrieveModel={() => {
                  showNotification('Query Dispatched', 'Loaded Dwarka Sector 10 Cadastral Society Mesh.', 'SUCCESS')
                }}
              />
            )}
          </div>

          {/* Right Panel: View Mode Selector */}
          <div className="responsive-right-panel absolute top-28 right-6 z-20 transition-all duration-300">
            {!selectedUnit && (
              <LayerControls
                viewMode={viewMode}
                onSelectViewMode={setViewMode}
                violationsCount={violationsCount}
                onResetCamera={() => {
                  setCameraPreset('OVERVIEW')
                  showNotification('Camera Reset', 'Returned camera to overview perspective.', 'INFO')
                }}
                onToggleBounds={() => {
                  setShowBounds(!showBounds)
                  showNotification('Parcel Bounds', `Cadastral property boundary ${!showBounds ? 'enabled' : 'hidden'}.`, 'INFO')
                }}
                onToggleMeasure={() => {
                  setMeasureMode(!measureMode)
                  showNotification('3D Coordinate Grid', `Spatial coordinate measuring grid ${!measureMode ? 'enabled' : 'hidden'}.`, 'INFO')
                }}
                onFocusCenter={() => {
                  handleFlyToTarget({
                    targetPosition: [0, 6, 0],
                    targetUnitId: null
                  })
                }}
                showBounds={showBounds}
                measureMode={measureMode}
                explodedOffset={explodedOffset}
                onExplodedChange={setExplodedOffset}
                theme={theme}
              />
            )}

            {/* Right Panel: Property Deed Card */}
            {selectedUnit && (
              <PropertyDeedCard
                unit={selectedUnit}
                onClose={() => setSelectedUnit(null)}
                theme={theme}
                activeRole={activeRole}
                onOpenSplitModal={(u) => {
                  setSplitTargetUnit(u)
                  setShowSplitModal(true)
                }}
                onInitiateMutation={(u) => {
                  setMutationTargetUnit(u)
                  setShowMutationModal(true)
                }}
                onRestrictedAction={(action, reason) => {
                  showNotification(`Role Restricted: ${action}`, reason, 'WARNING')
                }}
              />
            )}
          </div>

          {/* Modals & Dashboards */}
          {showAdminDashboard && (
            <GovtAdminDashboard
              societyData={societyData}
              theme={theme}
              onClose={() => setShowAdminDashboard(false)}
              onFocusUnit={(u) => {
                handleSelectUnit(u)
                setCameraPreset('ENCROACHMENT')
                setViewMode('ENCROACHMENT')
                setShowAdminDashboard(false)
              }}
              onOpenSplitModal={(u) => {
                setSplitTargetUnit(u)
                setShowSplitModal(true)
                setShowAdminDashboard(false)
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
              onNotify={showNotification}
            />
          )}

          {showUploadModal && (
            <SurveyorUploadModal
              theme={theme}
              onClose={() => setShowUploadModal(false)}
              onIngestSuccess={(meshInfo) => {
                showNotification('CAD/BIM Ingestion Complete', `Ingested ${meshInfo.name} (${meshInfo.ulpin_3d}) into 3D cadastre.`, 'SUCCESS')
              }}
            />
          )}

          <AIReviewModal
            isOpen={showAIReviewModal}
            onClose={() => setShowAIReviewModal(false)}
            onAcceptAIResult={handleAcceptAIResult}
            theme={theme}
          />

          {showSplitModal && splitTargetUnit && (
            <ParcelSplitModal
              unit={splitTargetUnit}
              onClose={() => {
                setShowSplitModal(false)
                setSplitTargetUnit(null)
              }}
              onApplySplit={handleApplySplit}
              theme={theme}
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
              theme={theme}
            />
          )}

          {/* Notification Toast */}
          {toast && (
            <div className={`responsive-notification absolute top-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-2xl border text-xs font-mono shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 backdrop-blur-xl ${
              isLight
                ? toast.type === 'WARNING'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-500/10'
                  : 'bg-white/95 border-[#b9d8ca] text-[#173b36] shadow-[#2e7d63]/15'
                : toast.type === 'WARNING'
                ? 'bg-[#1C1205] border-amber-500/60 text-amber-300'
                : 'bg-[#071216]/95 border-[#7ee7d2]/40 text-[#f4f0e8]'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${
                toast.type === 'SUCCESS' ? 'bg-[#7ee7d2]' : toast.type === 'WARNING' ? 'bg-amber-500' : 'bg-[#c8ff33]'
              } animate-ping`} />
              <div>
                <span className={`font-bold mr-2 ${
                  toast.type === 'WARNING'
                    ? 'text-amber-500'
                    : isLight ? 'text-[#2e7d63]' : 'text-[#7ee7d2]'
                }`}>
                  {toast.title}:
                </span>
                <span className={isLight ? 'text-[#4d6d64]' : 'text-[#a5c1b9]'}>{toast.message}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Global Modals Accessible From Any Phase */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        onLaunchPlatform={() => {
          setShowAboutModal(false)
          setAppPhase('APP')
        }}
        theme={theme}
      />

      <DocumentationModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        theme={theme}
      />

      <APIModal
        isOpen={showAPIModal}
        onClose={() => setShowAPIModal(false)}
        theme={theme}
      />
    </div>
  )
}
