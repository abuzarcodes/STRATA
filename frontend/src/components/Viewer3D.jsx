import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

// Concrete hex palettes matching STRATA Landing Page Design System
export const VIEWER_PALETTES = {
  CYBER: {
    bg: '#071216',
    fog: '#071216',
    gridPrimary: '#7ee7d2',
    gridSecondary: '#163238',
    ambientLight: '#ffffff',
    ambientIntensity: 0.55,
    dirLight1: '#a5e9d4',
    dirLight1Intensity: 1.7,
    dirLight2: '#c8ff33',
    dirLight2Intensity: 0.8,
    pointLight: '#7ee7d2',
    pointLightIntensity: 12,
    boundaryRing: '#7ee7d2',
    measureGrid: '#c8ff33',
    unitDefault: '#0d2226',
    unitDefaultEmissive: '#061316',
    unitSelected: '#7ee7d2',
    unitSelectedEmissive: '#7ee7d2',
    unitHovered: '#9ef3e2',
    unitHoveredEmissive: '#26545b',
    unitEncroachment: '#f43f5e',
    unitEncroachmentEmissive: '#f43f5e',
    unitSubsurface: '#0d9488',
    unitSubsurfaceEmissive: '#0d9488',
    unitTax: ['#7ee7d2', '#c8ff33', '#f59e0b', '#f43f5e'],
    edgeDefault: '#26545b',
    edgeHovered: '#c8ff33',
    edgeSelected: '#ffffff',
    edgeEncroachment: '#f43f5e',
    treeTrunk: '#0f2923',
    treeFoliage1: '#134e42',
    treeFoliage2: '#1b5e4d',
    pole: '#1e293b',
    rooftopHeadroom: '#162e33',
    rooftopDoor: '#7ee7d2',
    rooftopTank: '#0d2226',
    solarFrame: '#081519',
    solarGrid: '#7ee7d2',
    parapet: '#7ee7d2',
    scanPlane: '#7ee7d2',
    dataStream: '#7ee7d2',
  },
  LIGHT: {
    bg: '#edf4ef',
    fog: '#edf4ef',
    gridPrimary: '#2e7d63',
    gridSecondary: '#b9d8ca',
    ambientLight: '#ffffff',
    ambientIntensity: 1.1,
    dirLight1: '#ffffff',
    dirLight1Intensity: 1.7,
    dirLight2: '#b2dfcc',
    dirLight2Intensity: 0.8,
    pointLight: '#2e7d63',
    pointLightIntensity: 10,
    boundaryRing: '#2e7d63',
    measureGrid: '#b45309',
    unitDefault: '#d5e2dc',
    unitDefaultEmissive: '#c4d7cf',
    unitSelected: '#2e7d63',
    unitSelectedEmissive: '#2e7d63',
    unitHovered: '#1b5e4d',
    unitHoveredEmissive: '#2e7d63',
    unitEncroachment: '#be123c',
    unitEncroachmentEmissive: '#be123c',
    unitSubsurface: '#0f766e',
    unitSubsurfaceEmissive: '#0f766e',
    unitTax: ['#2e7d63', '#6d9500', '#b45309', '#be123c'],
    edgeDefault: '#8aa69b',
    edgeHovered: '#173b36',
    edgeSelected: '#173b36',
    edgeEncroachment: '#be123c',
    treeTrunk: '#5c4033',
    treeFoliage1: '#2e7d63',
    treeFoliage2: '#1b5e4d',
    pole: '#475569',
    rooftopHeadroom: '#c8dcd3',
    rooftopDoor: '#2e7d63',
    rooftopTank: '#e2ece6',
    solarFrame: '#2c3e39',
    solarGrid: '#2e7d63',
    parapet: '#2e7d63',
    scanPlane: '#2e7d63',
    dataStream: '#2e7d63',
  }
}

// Stylized 3D Tree for Society Landscaping
function Tree({ position, scale = 1, isLight = false, palette }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color={palette.treeTrunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[1.2, 1.6, 7]} />
        <meshStandardMaterial color={palette.treeFoliage1} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.9, 1.4, 7]} />
        <meshStandardMaterial color={palette.treeFoliage2} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Street Light with Warm Point Light & Glowing Fixture
function StreetLight({ position, rotation = [0, 0, 0], palette }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 8]} />
        <meshStandardMaterial color={palette.pole} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.4, 4.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color={palette.pole} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[0.7, 4.5, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#090d16" />
      </mesh>
      {/* Bulb Glow */}
      <mesh position={[0.7, 4.42, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={palette.gridPrimary} />
      </mesh>
      <pointLight position={[0.7, 4.2, 0]} color={palette.gridPrimary} intensity={0.9} distance={14} decay={2} />
    </group>
  )
}

// Animated Data Stream along Access Roads
function RoadDataStream({ roadType = 'NORTH', palette }) {
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
        color={palette.dataStream}
        size={0.4}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Procedural Indian Rooftop Details (Water Tanks, Lift Room, Solar Arrays)
function RooftopDetails({ position = [0, 15, 0], palette }) {
  return (
    <group position={position}>
      {/* Lift Machine & Staircase Headroom */}
      <mesh position={[-2, 1.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.4, 3]} />
        <meshStandardMaterial color={palette.rooftopHeadroom} roughness={0.7} />
      </mesh>
      {/* Lift Room Access Door */}
      <mesh position={[-2, 0.9, 0.52]}>
        <planeGeometry args={[0.9, 1.8]} />
        <meshStandardMaterial color={palette.rooftopDoor} metalness={0.8} />
      </mesh>

      {/* Rooftop Water Storage Tanks (Sintex Style) */}
      <group position={[3.5, 0.7, -2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 16]} />
          <meshStandardMaterial color={palette.rooftopTank} roughness={0.4} />
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
          <meshStandardMaterial color={palette.solarFrame} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Solar grid cells line */}
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[4.8, 2]} />
          <meshBasicMaterial color={palette.solarGrid} wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Parapet Perimeter Railing */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[14.2, 0.8, 10.2]} />
        <meshBasicMaterial color={palette.parapet} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Reticle Focus Beam for Selected Unit
function SelectedReticle({ position, isViolating = false, palette }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 1.5
    }
  })

  const color = isViolating ? '#f43f5e' : palette.unitSelected

  return (
    <group position={position}>
      {/* Hologram Reticle Ring */}
      <group position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <mesh>
          <ringGeometry args={[1.4, 1.55, 32]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.85} />
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
  isLight = false,
  palette
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

  // Solid Architectural Cadastre Material Colors
  const materialProps = useMemo(() => {
    // 1. Encroachment / FAR Violation Mode
    if ((viewMode === 'ENCROACHMENT' || viewMode === 'AUDIT') && isViolating) {
      return {
        color: palette.unitEncroachment,
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.18 : 0.95,
        roughness: 0.4,
        metalness: 0.1,
        emissive: palette.unitEncroachmentEmissive,
        emissiveIntensity: 0.35
      }
    }

    // 2. Taxation / Circle Rate Heatmap Mode
    if (viewMode === 'TAXATION' || viewMode === 'TAX') {
      const taxTierColors = palette.unitTax
      const col = taxTierColors[Math.abs(unit.level) % taxTierColors.length]
      return {
        color: col,
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.18 : 0.9,
        roughness: 0.5,
        metalness: 0.05,
        emissive: col,
        emissiveIntensity: 0.2
      }
    }

    // 3. Subsurface / Utilities Isolation Mode
    if ((viewMode === 'SUBSURFACE' || viewMode === 'UTILITIES') && unit.level < 0) {
      return {
        color: palette.unitSubsurface,
        transparent: isFloorDimmed,
        opacity: isFloorDimmed ? 0.25 : 0.95,
        roughness: 0.5,
        metalness: 0.1,
        emissive: palette.unitSubsurfaceEmissive,
        emissiveIntensity: 0.3
      }
    }

    // 4. Selected Unit Focus (Vibrant Primary Emerald/Mint Glow)
    if (isSelected) {
      return {
        color: palette.unitSelected,
        transparent: false,
        opacity: 1.0,
        roughness: 0.3,
        metalness: 0.15,
        emissive: palette.unitSelectedEmissive,
        emissiveIntensity: 0.4
      }
    }

    // 5. Hovered Unit Focus
    if (isHovered) {
      return {
        color: palette.unitHovered,
        transparent: false,
        opacity: 1.0,
        roughness: 0.35,
        metalness: 0.1,
        emissive: palette.unitHoveredEmissive,
        emissiveIntensity: 0.25
      }
    }

    // 6. Regular Solid Architectural Unit Body
    return {
      color: palette.unitDefault,
      transparent: isFloorDimmed,
      opacity: isFloorDimmed ? 0.12 : 0.88,
      roughness: 0.6,
      metalness: 0.05,
      emissive: palette.unitDefaultEmissive,
      emissiveIntensity: isLight ? 0.08 : 0.18
    }
  }, [viewMode, isViolating, isFloorDimmed, isSelected, isHovered, isLight, unit.level, palette])

  // Wireframe Edge Color
  const edgeColor = useMemo(() => {
    if (isViolating && (viewMode === 'ENCROACHMENT' || viewMode === 'AUDIT')) return palette.edgeEncroachment
    if (isSelected) return palette.edgeSelected
    if (isHovered) return palette.edgeHovered
    return palette.edgeDefault
  }, [isViolating, viewMode, isSelected, isHovered, palette])

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
          opacity={isFloorDimmed ? 0.2 : (isSelected ? 1.0 : 0.85)}
        />
      </lineSegments>

      {/* Reticle Focus Indicator when selected */}
      {isSelected && (
        <SelectedReticle
          position={[unit.centroid_local[0], unit.centroid_local[2], -unit.centroid_local[1]]}
          isViolating={isViolating}
          palette={palette}
        />
      )}

      {/* Floating 3D Spatial Tag for Selected / Hovered Unit */}
      {(isSelected || (isHovered && isFloorVisible)) && (
        <Html
          position={[unit.centroid_local[0], unit.centroid_local[2] + 1.2, -unit.centroid_local[1]]}
          center
          distanceFactor={35}
        >
          <div className="pointer-events-none px-2.5 py-1 rounded-lg bg-[var(--color-surface-1)]/95 border border-[var(--color-accent-primary)] text-[10px] font-mono theme-text-primary shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 animate-in fade-in zoom-in-90 duration-150">
            <span className={`w-2 h-2 rounded-full ${isViolating ? 'bg-rose-500' : 'bg-[var(--color-accent-primary)]'} animate-ping`} />
            <span className="font-bold theme-accent">{unit.name}</span>
            <span className="theme-text-muted">({unit.rera_volume_m3 || 435.75} m³)</span>
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
        animCamPos.current.set(tx + 14, ty + 9, tz + 16)
      }
    } else {
      lastSelectedId.current = null
    }
  }, [selectedUnit])

  useEffect(() => {
    if (flyTarget && flyTarget.targetPosition) {
      isTransitioning.current = true
      const [fx, fy, fz] = flyTarget.targetPosition
      animTargetPos.current.set(fx, fy !== undefined ? fy : 6, fz !== undefined ? -fz : 0)
      animCamPos.current.set(fx + 22, (fy || 6) + 16, (fz ? -fz : 0) + 26)
    }
  }, [flyTarget])

  useEffect(() => {
    if (cameraPreset !== lastPreset.current) {
      lastPreset.current = cameraPreset
      isTransitioning.current = true

      if (cameraPreset === 'TOP_DOWN') {
        animCamPos.current.set(0, 52, 0.001)
        animTargetPos.current.set(0, 0, 0)
      } else if (cameraPreset === 'FRONT_ELEVATION') {
        animCamPos.current.set(0, 8, 38)
        animTargetPos.current.set(0, 7, 0)
      } else if (cameraPreset === 'OVERVIEW') {
        animCamPos.current.set(28, 22, 34)
        animTargetPos.current.set(0, 6, 0)
      }
    }
  }, [cameraPreset])

  useEffect(() => {
    if (activeFloor !== 'ALL' && !selectedUnit) {
      isTransitioning.current = true
      const targetY = typeof activeFloor === 'number' ? activeFloor * 3 + 1.5 : 6
      animTargetPos.current.set(0, targetY, 0)
      animCamPos.current.set(24, targetY + 12, 28)
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
  theme = 'CYBER',
  flyTarget,
  onFlightProgress,
  showBounds = true,
  measureMode = false
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null)
  const isLight = theme === 'LIGHT'
  const palette = isLight ? VIEWER_PALETTES.LIGHT : VIEWER_PALETTES.CYBER

  const units = societyData?.units || []
  const auditSummary = societyData?.audit_summary || {}
  const violatingUnitIds = useMemo(() => {
    const ids = new Set()
    auditSummary.air_rights_violations?.forEach((v) => ids.add(v.unit_id))
    auditSummary.subsurface_violations?.forEach((v) => ids.add(v.unit_id))
    return ids
  }, [auditSummary])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden transition-colors duration-500 ${isLight ? 'bg-[#edf4ef]' : 'bg-[#071216]'}`}>
      <Canvas
        camera={{ position: [28, 22, 34], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={[palette.bg]} />
        <fog attach="fog" args={[palette.fog, 40, 140]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={palette.ambientIntensity} color={palette.ambientLight} />
        <directionalLight
          position={[30, 45, 25]}
          intensity={palette.dirLight1Intensity}
          color={palette.dirLight1}
          castShadow
        />
        <directionalLight
          position={[-20, 15, -20]}
          intensity={palette.dirLight2Intensity}
          color={palette.dirLight2}
        />
        <pointLight
          position={[0, 8, 0]}
          intensity={palette.pointLightIntensity}
          color={palette.pointLight}
          distance={50}
          decay={2}
        />

        {/* Ground Grid with Cadastral Coordinates */}
        <gridHelper
          args={[160, 80, palette.gridPrimary, palette.gridSecondary]}
          position={[0, -0.05, 0]}
        />

        {/* Ground Cadastral Property Boundary Ring */}
        {showBounds && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[15, 15.3, 4]} />
            <meshBasicMaterial color={palette.boundaryRing} transparent opacity={0.85} />
          </mesh>
        )}

        {/* Optional 3D Measurement Visual Grid Guide */}
        {measureMode && (
          <gridHelper
            args={[30, 30, palette.measureGrid, palette.measureGrid]}
            position={[0, 0.04, 0]}
          />
        )}

        {/* Street Lights along Boundary */}
        <StreetLight position={[-14, 0, -10]} rotation={[0, Math.PI / 2, 0]} palette={palette} />
        <StreetLight position={[-14, 0, 10]} rotation={[0, Math.PI / 2, 0]} palette={palette} />
        <StreetLight position={[14, 0, -10]} rotation={[0, -Math.PI / 2, 0]} palette={palette} />
        <StreetLight position={[14, 0, 10]} rotation={[0, -Math.PI / 2, 0]} palette={palette} />

        {/* Landscape Trees */}
        <Tree position={[-16, 0, -12]} scale={1.2} isLight={isLight} palette={palette} />
        <Tree position={[-16, 0, 12]} scale={1.1} isLight={isLight} palette={palette} />
        <Tree position={[16, 0, -12]} scale={1.2} isLight={isLight} palette={palette} />
        <Tree position={[16, 0, 12]} scale={1.1} isLight={isLight} palette={palette} />

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
              isLight={isLight}
              palette={palette}
            />
          ))}

          {/* Procedural Rooftop Elements */}
          <RooftopDetails position={[0, 15, 0]} palette={palette} />
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
