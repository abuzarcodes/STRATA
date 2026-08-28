import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

// Stylized 3D Tree for Society Landscaping
function Tree({ position, scale = 1, theme = 'CYBER' }) {
  const isLight = theme === 'LIGHT'
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color={isLight ? '#1B5E20' : '#112F15'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[1.2, 1.6, 7]} />
        <meshStandardMaterial color={isLight ? '#2E7D32' : '#062817'} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.9, 1.4, 7]} />
        <meshStandardMaterial color="#00D084" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Street Light with Warm Point Light & Glowing Fixture
function StreetLight({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.4, 4.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[0.7, 4.5, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#090d16" />
      </mesh>
      {/* Bulb Glow */}
      <mesh position={[0.7, 4.42, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#00D084" />
      </mesh>
      <pointLight position={[0.7, 4.2, 0]} color="#00D084" intensity={0.9} distance={14} decay={2} />
    </group>
  )
}

// Animated Data Stream along Access Roads
function RoadDataStream({ roadType = 'NORTH' }) {
  const pointsRef = useRef()
  const count = 16

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      if (roadType === 'NORTH') {
        arr[i * 3 + 0] = -12.5 + (Math.random() - 0.5) * 1.5
        arr[i * 3 + 1] = 0.1
        arr[i * 3 + 2] = -25 + (i / count) * 50
      } else {
        arr[i * 3 + 0] = -25 + (i / count) * 50
        arr[i * 3 + 1] = 0.1
        arr[i * 3 + 2] = -16.5 + (Math.random() - 0.5) * 1.5
      }
    }
    return arr
  }, [roadType])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      if (roadType === 'NORTH') {
        pos[i * 3 + 2] += delta * 14
        if (pos[i * 3 + 2] > 25) pos[i * 3 + 2] = -25
      } else {
        pos[i * 3 + 0] += delta * 14
        if (pos[i * 3 + 0] > 25) pos[i * 3 + 0] = -25
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00D084"
        size={0.4}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Procedural Indian Rooftop Details (Water Tanks, Lift Room, Solar Arrays)
function RooftopDetails({ position = [0, 15, 0] }) {
  return (
    <group position={position}>
      {/* Lift Machine & Staircase Headroom */}
      <mesh position={[-2, 1.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.4, 3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* Lift Room Access Door */}
      <mesh position={[-2, 0.9, 0.52]}>
        <planeGeometry args={[0.9, 1.8]} />
        <meshStandardMaterial color="#00D084" metalness={0.8} />
      </mesh>

      {/* Rooftop Water Storage Tanks (Sintex Style) */}
      <group position={[3.5, 0.7, -2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 16]} />
          <meshStandardMaterial color="#0B131E" roughness={0.4} />
        </mesh>
        {/* Metal Support Staging */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[1.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>

      <group position={[3.5, 0.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[1.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>

      {/* Rooftop Solar Panels Array */}
      <group position={[-2, 0.4, 3]} rotation={[Math.PI / 8, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[5, 0.08, 2.2]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Solar grid cells line */}
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[4.8, 2]} />
          <meshBasicMaterial color="#00D084" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Parapet Perimeter Railing */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[14.2, 0.8, 10.2]} />
        <meshBasicMaterial color="#00D084" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Laser Scanning Plane passing vertically
function ScanPlane({ bounds = [16, 12] }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = ((Math.sin(state.clock.elapsedTime * 1.2) + 1) / 2) * 16
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[bounds[0] + 4, bounds[1] + 4]} />
      <meshBasicMaterial
        color="#00D084"
        transparent
        opacity={0.18}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Reticle Focus Beam for Selected Unit
function SelectedReticle({ position, isViolating = false }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 1.5
    }
  })

  const color = isViolating ? '#f43f5e' : '#00D084'

  return (
    <group position={position}>
      {/* Hologram Reticle Ring */}
      <group position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <mesh>
          <ringGeometry args={[1.4, 1.55, 32]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
            <boxGeometry args={[0.3, 0.06, 0.02]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Vertical Focus Beam */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// Volumetric Unit Polyhedron Component with Holographic Cadastre Shading
function VolumetricUnit({
  unit,
  selectedUnit,
  onSelectUnit,
  hoveredUnit,
  onHoverUnit,
  activeFloor,
  viewMode,
  isViolating,
  explodedOffset = 0,
  theme = 'CYBER'
}) {
  const meshRef = useRef()
  const isSelected = selectedUnit?.unit_id === unit.unit_id
  const isHovered = hoveredUnit?.unit_id === unit.unit_id

  const isFloorVisible = activeFloor === 'ALL' || activeFloor === unit.level
  const isFloorDimmed = activeFloor !== 'ALL' && activeFloor !== unit.level

  // Dynamic Y-displacement for Exploded View
  const verticalExplode = unit.level > 0 ? unit.level * explodedOffset : 0

  // Construct Three.js BufferGeometry from vertices and faces
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const vertices = unit.vertices_local
    const faces = unit.faces

    const positions = []
    for (let face of faces) {
      const v0 = vertices[face[0]]
      const v1 = vertices[face[1]]
      const v2 = vertices[face[2]]

      positions.push(v0[0], v0[2], -v0[1])
      positions.push(v1[0], v1[2], -v1[1])
      positions.push(v2[0], v2[2], -v2[1])
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.computeVertexNormals()
    return geom
  }, [unit])

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 25)
  }, [geometry])

  const isLight = theme === 'LIGHT'

  // Solid Architectural Cadastre Material Colors
  const materialProps = useMemo(() => {
    if (viewMode === 'ENCROACHMENT' && isViolating) {
      return {
        color: '#F43F5E',
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.15 : 1.0,
        roughness: 0.5,
        metalness: 0.05,
        emissive: '#F43F5E',
        emissiveIntensity: 0.25
      }
    }

    if (viewMode === 'TAXATION') {
      const taxTierColors = ['#10B981', '#00D084', '#F59E0B', '#F43F5E']
      const col = taxTierColors[Math.abs(unit.level) % taxTierColors.length]
      return {
        color: col,
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.15 : 1.0,
        roughness: 0.55,
        metalness: 0.05,
        emissive: col,
        emissiveIntensity: 0.15
      }
    }

    if (viewMode === 'SUBSURFACE' && unit.level < 0) {
      return {
        color: '#059669',
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.2 : 1.0,
        roughness: 0.6,
        metalness: 0.05,
        emissive: '#059669',
        emissiveIntensity: 0.2
      }
    }

    // Selected Unit Focus (Solid Vibrant Emerald)
    if (isSelected) {
      return {
        color: '#00D084',
        transparent: false,
        opacity: 1.0,
        roughness: 0.35,
        metalness: 0.1,
        emissive: '#00D084',
        emissiveIntensity: 0.3
      }
    }

    // Hovered Unit Focus (Solid Emerald Tint)
    if (isHovered) {
      return {
        color: '#10B981',
        transparent: false,
        opacity: 1.0,
        roughness: 0.4,
        metalness: 0.1,
        emissive: '#10B981',
        emissiveIntensity: 0.2
      }
    }

    // Regular Solid Architectural Grey Unit Body (Opaque Matte Concrete Finish)
    return {
      color: isLight ? '#CBD5E1' : '#334155',
      transparent: isFloorDimmed,
      opacity: isFloorDimmed ? 0.1 : 1.0,
      roughness: 0.65,
      metalness: 0.05,
      emissive: isLight ? '#94A3B8' : '#1E293B',
      emissiveIntensity: isLight ? 0.05 : 0.12
    }
  }, [viewMode, isViolating, isFloorDimmed, isSelected, isHovered, isLight, unit.level])

  // Wireframe Edge Color
  const edgeColor = useMemo(() => {
    if (isViolating && viewMode === 'ENCROACHMENT') return '#F43F5E'
    if (isSelected) return '#FFFFFF'
    if (isHovered) return '#00E676'
    return isLight ? '#2E7D32' : '#00D084'
  }, [isViolating, viewMode, isSelected, isHovered, isLight])

  return (
    <group position={[0, verticalExplode, 0]}>
      {/* 3D Polyhedral Volume */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={(e) => {
          e.stopPropagation()
          onSelectUnit(unit)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHoverUnit(unit)
        }}
        onPointerOut={() => onHoverUnit(null)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Glowing Cadastral Wireframe Edges */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial
          color={edgeColor}
          linewidth={isSelected || isHovered ? 2.5 : 1.2}
          transparent
          opacity={isFloorDimmed ? 0.2 : (isSelected ? 1.0 : 0.8)}
        />
      </lineSegments>

      {/* Reticle Focus Indicator when selected */}
      {isSelected && (
        <SelectedReticle
          position={[unit.centroid_local[0], unit.centroid_local[2], -unit.centroid_local[1]]}
          isViolating={isViolating}
        />
      )}

      {/* Floating 3D Spatial Tag for Selected / Hovered Unit */}
      {(isSelected || (isHovered && isFloorVisible)) && (
        <Html
          position={[unit.centroid_local[0], unit.centroid_local[2] + 1.2, -unit.centroid_local[1]]}
          center
          distanceFactor={35}
        >
          <div className="pointer-events-none px-2.5 py-1 rounded-lg bg-[#0B131E]/95 border border-[#00D084] text-[10px] font-mono text-white shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 animate-in fade-in zoom-in-90 duration-150">
            <span className={`w-2 h-2 rounded-full ${isViolating ? 'bg-rose-500' : 'bg-[#00D084]'} animate-ping`} />
            <span className="font-bold text-[#00D084]">{unit.name}</span>
            <span className="text-slate-400">({unit.rera_volume_m3 || 435.75} m³)</span>
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Adaptive Camera Controller based on Property Facing & Level ────────────
function AdaptiveCameraController({ selectedUnit, cameraPreset, activeFloor, flyTarget }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  const animTargetPos = useRef(new THREE.Vector3(0, 6, 0))
  const animCamPos = useRef(new THREE.Vector3(28, 22, 34))
  const isTransitioning = useRef(false)
  const lastSelectedId = useRef(null)
  const lastPreset = useRef(cameraPreset)

  useEffect(() => {
    if (selectedUnit) {
      if (selectedUnit.unit_id !== lastSelectedId.current) {
        lastSelectedId.current = selectedUnit.unit_id
        isTransitioning.current = true

        const tx = selectedUnit.centroid_local[0]
        const ty = selectedUnit.centroid_local[2] !== undefined ? selectedUnit.centroid_local[2] : (selectedUnit.level * 3 + 1.5)
        const tz = -selectedUnit.centroid_local[1]

        animTargetPos.current.set(tx, ty, tz)

        // Calculate dynamic optimal viewing angle:
        // Position camera on the specific exterior side that directly faces the selected property
        const dx = tx
        const dz = tz
        const dist = Math.sqrt(dx * dx + dz * dz)

        let dirX = 0.707
        let dirZ = 0.707
        if (dist > 0.4) {
          dirX = dx / dist
          dirZ = dz / dist
        }

        // Add an eye-level aesthetic parallax angle (offset by ~22 degrees) so both facade and depth are visible
        const angle = Math.atan2(dirZ, dirX) + 0.38
        const finalDirX = Math.cos(angle)
        const finalDirZ = Math.sin(angle)

        // Distance adapted to floor level and unit volume
        const viewDistance = selectedUnit.level < 0 ? 15 : 18
        const viewElevation = selectedUnit.level < 0 ? Math.max(1.5, ty + 3.5) : ty + 5.5

        animCamPos.current.set(
          tx + finalDirX * viewDistance,
          viewElevation,
          tz + finalDirZ * viewDistance
        )
      }
    } else if (cameraPreset !== lastPreset.current) {
      lastPreset.current = cameraPreset
      lastSelectedId.current = null
      isTransitioning.current = true

      if (cameraPreset === 'OVERVIEW') {
        animTargetPos.current.set(0, 6, 0)
        animCamPos.current.set(28, 22, 34)
      } else if (cameraPreset === 'ENCROACHMENT') {
        animTargetPos.current.set(0, 8, 0)
        animCamPos.current.set(-20, 22, 26)
      } else if (cameraPreset === 'TOP') {
        animTargetPos.current.set(0, 0, 0)
        animCamPos.current.set(0, 48, 0.1)
      }
    } else if (!selectedUnit && lastSelectedId.current) {
      lastSelectedId.current = null
      isTransitioning.current = true
      animTargetPos.current.set(0, 6, 0)
      animCamPos.current.set(28, 22, 34)
    }
  }, [selectedUnit, cameraPreset, activeFloor])

  useFrame((state, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      const t = 1 - Math.exp(-delta * 4.8)

      camera.position.lerp(animCamPos.current, t)
      controlsRef.current.target.lerp(animTargetPos.current, t)
      controlsRef.current.update()

      if (
        camera.position.distanceTo(animCamPos.current) < 0.04 &&
        controlsRef.current.target.distanceTo(animTargetPos.current) < 0.04
      ) {
        isTransitioning.current = false
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={6}
      maxDistance={110}
      onStart={() => {
        isTransitioning.current = false
      }}
    />
  )
}

// ─── Main 3D Digital Twin Viewer Canvas ─────────────────────────────────────
export default function Viewer3D({
  societyData,
  selectedUnit,
  onSelectUnit,
  activeFloor = 'ALL',
  viewMode = 'CADASTRE',
  cameraPreset = 'OVERVIEW',
  explodedOffset = 0,
  theme = 'LIGHT',
  flyTarget,
  onFlightProgress
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null)
  const isLight = theme === 'LIGHT'

  const units = societyData?.units || []
  const auditSummary = societyData?.audit_summary || {}
  const violatingUnitIds = useMemo(() => {
    const ids = new Set()
    auditSummary.air_rights_violations?.forEach((v) => ids.add(v.unit_id))
    auditSummary.subsurface_violations?.forEach((v) => ids.add(v.unit_id))
    return ids
  }, [auditSummary])

  return (
    <div className="absolute inset-0 z-0 bg-[#080E17] overflow-hidden">
      <Canvas
        camera={{ position: [28, 22, 34], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={[isLight ? '#E8F5E9' : '#080E17']} />
        <fog attach="fog" args={[isLight ? '#C8E6C9' : '#080E17', 40, 140]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={isLight ? 0.9 : 0.35} />
        <directionalLight
          position={[30, 45, 25]}
          intensity={isLight ? 1.5 : 1.2}
          color={isLight ? '#FFFFFF' : '#00D084'}
          castShadow
        />
        <directionalLight position={[-20, 15, -20]} intensity={0.3} color="#10B981" />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#00D084" distance={50} decay={2} />

        {/* Ground Grid with Cadastral Coordinates */}
        <gridHelper
          args={[160, 80, isLight ? '#2E7D32' : '#00D084', isLight ? '#C8E6C9' : '#1E293B']}
          position={[0, -0.05, 0]}
        />

        {/* Ground Cadastral Property Boundary Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[15, 15.3, 4]} />
          <meshBasicMaterial color="#00D084" transparent opacity={0.85} />
        </mesh>

        {/* Volumetric Laser Scanline Sweep */}
        <ScanPlane bounds={[16, 12]} />

        {/* Access Road Networks with Particle Flows */}
        <RoadDataStream roadType="NORTH" />
        <RoadDataStream roadType="EAST" />

        {/* Street Lights along Boundary */}
        <StreetLight position={[-14, 0, -10]} rotation={[0, Math.PI / 2, 0]} />
        <StreetLight position={[-14, 0, 10]} rotation={[0, Math.PI / 2, 0]} />
        <StreetLight position={[14, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />
        <StreetLight position={[14, 0, 10]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Landscape Trees */}
        <Tree position={[-16, 0, -12]} scale={1.2} theme={theme} />
        <Tree position={[-16, 0, 12]} scale={1.1} theme={theme} />
        <Tree position={[16, 0, -12]} scale={1.2} theme={theme} />
        <Tree position={[16, 0, 12]} scale={1.1} theme={theme} />

        {/* Volumetric Building Units */}
        <group position={[0, 0, 0]}>
          {units.map((unit) => (
            <VolumetricUnit
              key={unit.unit_id}
              unit={unit}
              selectedUnit={selectedUnit}
              onSelectUnit={onSelectUnit}
              hoveredUnit={hoveredUnit}
              onHoverUnit={setHoveredUnit}
              activeFloor={activeFloor}
              viewMode={viewMode}
              isViolating={violatingUnitIds.has(unit.unit_id)}
              explodedOffset={explodedOffset}
              theme={theme}
            />
          ))}

          {/* Procedural Rooftop Elements */}
          <RooftopDetails position={[0, 15 + (activeFloor === 'ALL' ? 0 : 0), 0]} />
        </group>

        {/* Adaptive Dynamic Camera Orbit Controls */}
        <AdaptiveCameraController
          selectedUnit={selectedUnit}
          cameraPreset={cameraPreset}
          activeFloor={activeFloor}
          flyTarget={flyTarget}
        />
      </Canvas>
    </div>
  )
}
