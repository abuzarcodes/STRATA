import React, { useState } from 'react'
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

export default function App() {
  const [societyData, setSocietyData] = useState(initialSocietyData)
  const [activeRole, setActiveRole] = useState('CITIZEN') // 'CITIZEN', 'OWNER', 'SURVEYOR', 'GOVT'
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [activeFloor, setActiveFloor] = useState('ALL')
  const [viewMode, setViewMode] = useState('CADASTRE') // 'CADASTRE', 'XRAY', 'ENCROACHMENT'
  const [cameraPreset, setCameraPreset] = useState('OVERVIEW')
  const [searchQuery, setSearchQuery] = useState('')
  const [explodedOffset, setExplodedOffset] = useState(0)
  const [theme, setTheme] = useState('CYBER') // 'CYBER', 'DAYLIGHT'

  // Modals state
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitTargetUnit, setSplitTargetUnit] = useState(null)
  const [showMutationModal, setShowMutationModal] = useState(false)
  const [mutationTargetUnit, setMutationTargetUnit] = useState(null)
  const [showLocker, setShowLocker] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Handle role change
  const handleRoleChange = (role) => {
    setActiveRole(role)
    if (role === 'GOVT') {
      setShowAdminDashboard(true)
    } else if (role === 'OWNER') {
      setShowLocker(true)
    } else if (role === 'SURVEYOR') {
      setShowUploadModal(true)
    }
  }

  // Handle unit selection
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit)
    if (unit && unit.level !== undefined && activeFloor !== 'ALL' && activeFloor !== unit.level) {
      setActiveFloor(unit.level)
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
  }

  const violationsCount = societyData?.audit_summary?.violation_count || 0

  return (
    <div className="w-screen h-screen relative bg-[#080c17] overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        societyData={societyData}
        activeRole={activeRole}
        onSelectRole={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectUnitFromSearch={handleSelectUnit}
        onOpenUploadModal={() => setShowUploadModal(true)}
        onOpenLocker={() => setShowLocker(true)}
      />

      {/* 3D WebGIS Scene */}
      <Viewer3D
        societyData={societyData}
        selectedUnit={selectedUnit}
        onSelectUnit={handleSelectUnit}
        activeFloor={activeFloor}
        viewMode={viewMode}
        cameraPreset={cameraPreset}
        explodedOffset={explodedOffset}
        theme={theme}
      />

      {/* Floating Left Layer & Floor Controls */}
      <LayerControls
        activeFloor={activeFloor}
        onSelectFloor={setActiveFloor}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={setCameraPreset}
        violationsCount={violationsCount}
        explodedOffset={explodedOffset}
        onExplodedOffsetChange={setExplodedOffset}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'CYBER' ? 'DAYLIGHT' : 'CYBER'))}
      />

      {/* Selected Unit 3D Property Deed Card */}
      {selectedUnit && (
        <PropertyDeedCard
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
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

      {/* Government Admin Dashboard Modal */}
      {showAdminDashboard && (
        <GovtAdminDashboard
          societyData={societyData}
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

      {/* Citizen Property Vault Modal */}
      {showLocker && (
        <CitizenLocker
          societyData={societyData}
          onClose={() => setShowLocker(false)}
          onSelectUnit={(u) => {
            handleSelectUnit(u)
            setCameraPreset('OVERVIEW')
          }}
        />
      )}

      {/* Surveyor Upload Modal */}
      {showUploadModal && (
        <SurveyorUploadModal
          onClose={() => setShowUploadModal(false)}
          onIngestSuccess={() => {}}
        />
      )}

      {/* 3D Parcel Subdivision Modal */}
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

      {/* 3D Mutation / Transfer Modal */}
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
    </div>
  )
}
