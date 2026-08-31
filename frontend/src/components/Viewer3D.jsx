import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import lidarPointsData from '../data/lidarPoints.json'

// Professional GIS Cadastral Hex Palettes
export const VIEWER_PALETTES = {
  CYBER: {
    bg: '#071216',
    fog: '#071216',
    gridPrimary: '#26545b',
    gridSecondary: '#112529',
    groundPlane: '#09181c',
    roadAsphalt: '#101f24',
    roadMarking: '#7ee7d2',
    roadCurb: '#2e7d63',
    medianGrass: '#0d2822',
    ambientLight: '#ffffff',
    ambientIntensity: 0.8,
    dirLight1: '#e2f7f2',
    dirLight1Intensity: 1.6,
    dirLight2: '#7ee7d2',
    dirLight2Intensity: 0.6,
    pointLight: '#7ee7d2',
    pointLightIntensity: 8,
    boundaryRing: '#7ee7d2',
    measureGrid: '#c8ff33',
    unitDefault: '#cbd5e1',           // Light architectural grey in Dark Mode
    unitDefaultEmissive: '#334155',   // Balanced depth
    unitHighRise: '#e2e8f0',          // Off-white architectural high-rise
    unitCommercial: '#94a3b8',        // Clean slate commercial
    unitPlotted: '#cbd5e1',           // Subtle residential concrete
    unitCivic: '#94a3b8',             // Civic campus slate
    unitSelected: '#7ee7d2',
    unitSelectedEmissive: '#7ee7d2',
    unitHovered: '#9ef3e2',
    unitHoveredEmissive: '#26545b',
    unitEncroachment: '#f43f5e',
    unitEncroachmentEmissive: '#f43f5e',
    unitSubsurface: '#0d9488',
    unitSubsurfaceEmissive: '#0d9488',
    unitTax: ['#7ee7d2', '#c8ff33', '#f59e0b', '#f43f5e'],
    edgeDefault: '#1e293b',           // Crisp dark slate wireframe
    edgeHovered: '#c8ff33',
    edgeSelected: '#ffffff',
    edgeEncroachment: '#f43f5e',
    treeTrunk: '#0f2923',
    treeFoliage1: '#134e42',
    treeFoliage2: '#1b5e4d',
    pole: '#334155',
    metroTube: '#38bdf8'
  },
  LIGHT: {
    bg: '#edf4ef',
    fog: '#edf4ef',
    gridPrimary: '#b9d8ca',
    gridSecondary: '#d8e8df',
    groundPlane: '#f1f7f3',
    roadAsphalt: '#dde5ed',
    roadMarking: '#2e7d63',
    roadCurb: '#94a3b8',
    medianGrass: '#c1e7d4',
    ambientLight: '#ffffff',
    ambientIntensity: 1.1,
    dirLight1: '#ffffff',
    dirLight1Intensity: 1.5,
    dirLight2: '#b2dfcc',
    dirLight2Intensity: 0.7,
    pointLight: '#2e7d63',
    pointLightIntensity: 8,
    boundaryRing: '#2e7d63',
    measureGrid: '#b45309',
    unitDefault: '#5a6e78',           // Dark grey of slightly higher pigment in Light Mode
    unitDefaultEmissive: '#334155',
    unitHighRise: '#475569',
    unitCommercial: '#52606d',
    unitPlotted: '#5a6e78',
    unitCivic: '#475569',
    unitSelected: '#2e7d63',
    unitSelectedEmissive: '#2e7d63',
    unitHovered: '#1b5e4d',
    unitHoveredEmissive: '#2e7d63',
    unitEncroachment: '#be123c',
    unitEncroachmentEmissive: '#be123c',
    unitSubsurface: '#0f766e',
    unitSubsurfaceEmissive: '#0f766e',
    unitTax: ['#2e7d63', '#6d9500', '#b45309', '#be123c'],
    edgeDefault: '#173b36',
    edgeHovered: '#173b36',
    edgeSelected: '#173b36',
    edgeEncroachment: '#be123c',
    treeTrunk: '#5c4033',
    treeFoliage1: '#2e7d63',
    treeFoliage2: '#1b5e4d',
    pole: '#475569',
    metroTube: '#0284c7'
  }
}

// ─── GPU LiDAR Point Cloud Layer (points.laz source) ────────────────────────
function LidarPointCloud({ visible, isLight }) {
  const pointsGeometry = useMemo(() => {
    if (!lidarPointsData || lidarPointsData.length === 0) return null
    const count = lidarPointsData.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorLow = new THREE.Color(isLight ? '#0284c7' : '#38bdf8')
    const colorMid = new THREE.Color(isLight ? '#16a34a' : '#4ade80')
    const colorHigh = new THREE.Color(isLight ? '#ca8a04' : '#facc15')
    const colorPeak = new THREE.Color(isLight ? '#dc2626' : '#f87171')

    for (let i = 0; i < count; i++) {
      const p = lidarPointsData[i]
      positions[i * 3] = p.pos[0]
      positions[i * 3 + 1] = p.pos[1]
      positions[i * 3 + 2] = p.pos[2]

      const t = Math.min(1.0, Math.max(0.0, p.pos[1] / 16.0))
      let c = new THREE.Color()
      if (t < 0.33) {
        c.lerpColors(colorLow, colorMid, t / 0.33)
      } else if (t < 0.66) {
        c.lerpColors(colorMid, colorHigh, (t - 0.33) / 0.33)
      } else {
        c.lerpColors(colorHigh, colorPeak, (t - 0.66) / 0.34)
      }

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [isLight])

  if (!visible || !pointsGeometry) return null

  return (
    <points geometry={pointsGeometry}>
      <pointsMaterial
        size={isLight ? 0.38 : 0.48}
        vertexColors={true}
        transparent={true}
        opacity={0.88}
        sizeAttenuation={true}
      />
    </points>
  )
}

// ─── Sector 10 Road Network & Urban Ground ──────────────────────────────────
function SectorRoadNetwork({ palette, viewMode }) {
  const isSubsurface = viewMode === 'SUBSURFACE' || viewMode === 'UTILITIES'

  return (
    <group position={[0, -0.02, 0]}>
      {/* Expanded Ground Substrate (260m x 260m) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial
          color={palette.groundPlane}
          roughness={0.92}
          transparent={true}
          opacity={isSubsurface ? 0.3 : 0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Diagonal Arterial Highway (Khurrampur-Dwarka Expressway) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]} receiveShadow>
        <planeGeometry args={[260, 10]} />
        <meshStandardMaterial
          color={palette.roadAsphalt}
          roughness={0.75}
          transparent={isSubsurface}
          opacity={isSubsurface ? 0.35 : 1.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary North-South Feeder Avenues (6m wide) */}
      {[-90, -55, -20, 15, 50, 85].map((x, i) => (
        <mesh key={`ns-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.0, 240]} />
          <meshStandardMaterial color={palette.roadAsphalt} roughness={0.78} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Secondary East-West Feeder Avenues (6m wide) */}
      {[-90, -55, -20, 15, 50, 85].map((z, i) => (
        <mesh key={`ew-${i}`} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[240, 6.0]} />
          <meshStandardMaterial color={palette.roadAsphalt} roughness={0.78} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Thinner Access Galis & Alleyways (3.5m wide) */}
      {[-72, -38, -2, 32, 68].map((row_z, r_idx) =>
        [-72, -38, -2, 32, 68].map((col_x, c_idx) => (
          <mesh
            key={`gali-${r_idx}-${c_idx}`}
            position={[col_x, 0.012, row_z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[24.0, 3.5]} />
            <meshStandardMaterial color="#334155" roughness={0.88} side={THREE.DoubleSide} />
          </mesh>
        ))
      )}

      {/* Sector Boundary Ring Roads */}
      <mesh position={[0, 0, 115]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 6]} />
        <meshStandardMaterial color={palette.roadAsphalt} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -115]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 6]} />
        <meshStandardMaterial color={palette.roadAsphalt} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-115, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 240]} />
        <meshStandardMaterial color={palette.roadAsphalt} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[115, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 240]} />
        <meshStandardMaterial color={palette.roadAsphalt} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Central Sector Park & Open Green Buffer */}
      <group position={[-10, 0.04, 15]}>
        <mesh receiveShadow>
          <boxGeometry args={[25, 0.08, 35]} />
          <meshStandardMaterial color={palette.medianGrass} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[23, 33]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Organic Urban Tree Clusters Spread Across the 240m Map */}
      {[
        [-80, 20], [-60, 40], [-40, 60], [-20, 80], [0, 95], [30, 70], [60, 85], [90, 40],
        [-90, -30], [-70, -50], [-40, -70], [-10, -85], [20, -90], [50, -75], [80, -60],
        [-15, 20], [-5, 30], [-15, -25], [10, -15], [35, 10], [55, -20], [-65, -10],
        [75, 15], [-35, -20], [25, 45], [-50, 10], [40, -45], [-75, 75], [85, -85]
      ].map(([tx, tz], idx) => (
        <group key={idx} position={[tx, 0, tz]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1.4, 6]} />
            <meshStandardMaterial color={palette.treeTrunk} roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <dodecahedronGeometry args={[idx % 2 === 0 ? 0.95 : 0.75, 0]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? palette.treeFoliage1 : palette.treeFoliage2}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}



// ─── Subsurface Blue Line Metro Tube & Utility Conduits ─────────────────────
function SubsurfaceCorridor({ viewMode, palette }) {
  const isUtilitiesActive = viewMode === 'SUBSURFACE' || viewMode === 'UTILITIES'

  return (
    <group position={[0, -5.5, 0]}>
      {/* Metro Tunnel Tube running along Z-axis */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.4, 2.4, 90, 24, 1, true]} />
        <meshStandardMaterial
          color={palette.metroTube}
          wireframe
          transparent
          opacity={isUtilitiesActive ? 0.85 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Track Rail Line */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[1.8, 0.1, 88]} />
        <meshStandardMaterial color="#475569" transparent opacity={isUtilitiesActive ? 0.9 : 0.12} />
      </mesh>

      {/* 11kV Power Trunk Conduit */}
      <mesh position={[5.5, 2.2, 0]}>
        <boxGeometry args={[0.4, 0.4, 78]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={isUtilitiesActive ? 0.9 : 0.15} />
      </mesh>
    </group>
  )
}

// ─── Reticle Focus Beam for Selected Unit ───────────────────────────────────
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
      <group position={[0, 1.4, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <mesh>
          <ringGeometry args={[1.4, 1.55, 32]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      </group>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

// ─── Volumetric Building Unit Polyhedron ────────────────────────────────────
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

  const verticalExplode = unit.level > 0 ? unit.level * (explodedOffset * 0.3) : 0

  // Construct BufferGeometry from bounding box or vertices and faces
  const geometry = useMemo(() => {
    if (unit.bbox_local) {
      const min = unit.bbox_local[0]
      const max = unit.bbox_local[1]
      const dx = Math.max(0.2, max[0] - min[0])
      const dy = Math.max(0.2, max[1] - min[1])
      const dz = Math.max(0.2, max[2] - min[2])
      const geom = new THREE.BoxGeometry(dx, dy, dz)
      geom.translate((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, -(min[2] + max[2]) / 2)
      return geom
    }

    if (unit.vertices_local && unit.faces) {
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
    }

    return new THREE.BoxGeometry(2, 2, 2)
  }, [unit])

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 25)
  }, [geometry])

  // Solid Architectural Cadastre Colors
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
        emissiveIntensity: 0.4
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
        emissiveIntensity: 0.25
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
        emissiveIntensity: 0.35
      }
    }

    // 4. Selected Unit Focus
    if (isSelected) {
      return {
        color: palette.unitSelected,
        transparent: false,
        opacity: 1.0,
        roughness: 0.3,
        metalness: 0.15,
        emissive: palette.unitSelectedEmissive,
        emissiveIntensity: 0.45
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
        emissiveIntensity: 0.3
      }
    }

    // 6. Base Architectural Unit Tint
    let baseColor = palette.unitDefault
    if (unit.type?.includes('HIGH_RISE')) baseColor = palette.unitHighRise
    else if (unit.type?.includes('COMMERCIAL')) baseColor = palette.unitCommercial
    else if (unit.type?.includes('CIVIC')) baseColor = palette.unitCivic
    else if (unit.type?.includes('TRANSIT')) baseColor = palette.unitSubsurface

    return {
      color: baseColor,
      transparent: isFloorDimmed,
      opacity: isFloorDimmed ? 0.12 : 0.92,
      roughness: 0.65,
      metalness: 0.05,
      emissive: palette.unitDefaultEmissive,
      emissiveIntensity: isLight ? 0.06 : 0.15
    }
  }, [viewMode, isViolating, isFloorDimmed, isSelected, isHovered, isLight, unit.level, unit.type, palette])

  const edgeColor = useMemo(() => {
    if (isViolating && (viewMode === 'ENCROACHMENT' || viewMode === 'AUDIT')) return palette.edgeEncroachment
    if (isSelected) return palette.edgeSelected
    if (isHovered) return palette.edgeHovered
    return palette.edgeDefault
  }, [isViolating, viewMode, isSelected, isHovered, palette])

  return (
    <group position={[0, verticalExplode, 0]}>
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

      {/* Cadastral Wireframe Edges */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial
          color={edgeColor}
          linewidth={isSelected || isHovered ? 2.0 : 1.0}
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

      {/* Floating 3D Spatial Tag */}
      {(isSelected || (isHovered && isFloorVisible)) && (
        <Html
          position={[unit.centroid_local[0], unit.centroid_local[2] + 2.0, -unit.centroid_local[1]]}
          center
          distanceFactor={55}
        >
          <div className="pointer-events-none px-3 py-1 rounded-xl bg-[var(--color-surface-1)]/95 border border-[var(--color-accent-primary)] text-[10px] font-mono theme-text-primary shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-2 animate-in fade-in zoom-in-90 duration-150">
            <span className={`w-2 h-2 rounded-full ${isViolating ? 'bg-rose-500' : 'bg-[var(--color-accent-primary)]'} animate-ping`} />
            <span className="font-bold theme-accent">{unit.name}</span>
            <span className="theme-text-muted">({unit.owner})</span>
          </div>
        </Html>
      )}
    </group>
  )
}

// ─── Adaptive Camera Controller ─────────────────────────────────────────────
function AdaptiveCameraController({ selectedUnit, cameraPreset, flyTarget }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  const animTargetPos = useRef(new THREE.Vector3(0, 8, 0))
  const animCamPos = useRef(new THREE.Vector3(55, 60, 65))
  const isTransitioning = useRef(false)
  const lastSelectedId = useRef(null)
  const lastPreset = useRef(cameraPreset)

  useEffect(() => {
    if (selectedUnit) {
      if (selectedUnit.unit_id !== lastSelectedId.current) {
        lastSelectedId.current = selectedUnit.unit_id
        isTransitioning.current = true

        const tx = selectedUnit.centroid_local[0]
        const ty = selectedUnit.centroid_local[2] !== undefined ? selectedUnit.centroid_local[2] : (selectedUnit.level * 2.0)
        const tz = -selectedUnit.centroid_local[1]

        animTargetPos.current.set(tx, ty, tz)
        animCamPos.current.set(tx + 22, ty + 18, tz + 26)
      }
    } else {
      lastSelectedId.current = null
    }
  }, [selectedUnit])

  useEffect(() => {
    if (flyTarget && flyTarget.targetPosition) {
      isTransitioning.current = true
      const [fx, fy, fz] = flyTarget.targetPosition
      animTargetPos.current.set(fx, fy !== undefined ? fy : 8, fz !== undefined ? -fz : 0)
      animCamPos.current.set(fx + 30, (fy || 8) + 24, (fz ? -fz : 0) + 36)
    }
  }, [flyTarget])

  useEffect(() => {
    if (cameraPreset !== lastPreset.current) {
      lastPreset.current = cameraPreset
      isTransitioning.current = true

      if (cameraPreset === 'TOP_DOWN') {
        animCamPos.current.set(0, 95, 0.001)
        animTargetPos.current.set(0, 0, 0)
      } else if (cameraPreset === 'FRONT_ELEVATION') {
        animCamPos.current.set(0, 15, 80)
        animTargetPos.current.set(0, 10, 0)
      } else if (cameraPreset === 'OVERVIEW') {
        animCamPos.current.set(55, 60, 65)
        animTargetPos.current.set(0, 8, 0)
      } else if (cameraPreset === 'SUBSURFACE' || cameraPreset === 'UNDERGROUND') {
        animCamPos.current.set(32, -14, 40)
        animTargetPos.current.set(0, -5, 0)
      }
    }
  }, [cameraPreset])

  useFrame((state, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      const t = 1 - Math.exp(-delta * 4.8)

      camera.position.lerp(animCamPos.current, t)
      controlsRef.current.target.lerp(animTargetPos.current, t)
      controlsRef.current.update()

      if (
        camera.position.distanceTo(animCamPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(animTargetPos.current) < 0.05
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
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI - 0.01}
      minDistance={4}
      maxDistance={250}
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
  showBounds = true,
  measureMode = false
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null)
  const isLight = theme === 'LIGHT'
  const palette = isLight ? VIEWER_PALETTES.LIGHT : VIEWER_PALETTES.CYBER

  const units = societyData?.units || []
  const violatingUnitIds = useMemo(() => {
    const ids = new Set()
    units.filter((u) => u.violation?.has_violation).forEach((v) => ids.add(v.unit_id))
    return ids
  }, [units])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden transition-colors duration-500 ${isLight ? 'bg-[#edf4ef]' : 'bg-[#071216]'}`}>
      <Canvas
        camera={{ position: [55, 60, 65], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={[palette.bg]} />
        <fog attach="fog" args={[palette.fog, 80, 260]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={palette.ambientIntensity} color={palette.ambientLight} />
        <directionalLight
          position={[50, 80, 45]}
          intensity={palette.dirLight1Intensity}
          color={palette.dirLight1}
          castShadow
        />
        <directionalLight
          position={[-40, 35, -40]}
          intensity={palette.dirLight2Intensity}
          color={palette.dirLight2}
        />
        <pointLight
          position={[0, 20, 0]}
          intensity={palette.pointLightIntensity}
          color={palette.pointLight}
          distance={100}
          decay={2}
        />

        {/* Ground Coordinates Grid */}
        <gridHelper
          args={[300, 150, palette.gridPrimary, palette.gridSecondary]}
          position={[0, -0.05, 0]}
        />

        {/* Sector 10 Road Network */}
        <SectorRoadNetwork palette={palette} viewMode={viewMode} />

        {/* Subsurface Blue Line Metro Tube & Utility Network */}
        <SubsurfaceCorridor viewMode={viewMode} palette={palette} />

        {/* Optional 3D Measurement Visual Grid Guide */}
        {measureMode && (
          <gridHelper
            args={[60, 60, palette.measureGrid, palette.measureGrid]}
            position={[0, 0.04, 0]}
          />
        )}

        {/* GPU LiDAR Point Cloud Layer (points.laz source) */}
        <LidarPointCloud visible={viewMode === 'LIDAR' || viewMode === 'HYBRID'} isLight={isLight} />

        {/* Volumetric Building Units across All Blocks */}
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
        </group>

        {/* Adaptive Dynamic Camera Orbit Controls */}
        <AdaptiveCameraController
          selectedUnit={selectedUnit}
          cameraPreset={cameraPreset}
          flyTarget={flyTarget}
        />
      </Canvas>
    </div>
  )
}
