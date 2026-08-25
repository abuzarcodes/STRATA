import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html, Center, Float } from '@react-three/drei'
import * as THREE from 'three'

// Stylized 3D Tree for Society Landscaping
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Foliage (Low-poly stylized cones) */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[1.2, 1.6, 7]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.9, 1.4, 7]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Street Light with Warm Point Light
function StreetLight({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.4, 4.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[0.7, 4.5, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Bulb Glow */}
      <mesh position={[0.7, 4.42, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <pointLight position={[0.7, 4.2, 0]} color="#fef08a" intensity={0.8} distance={12} decay={2} />
    </group>
  )
}

// Vertical Elevation Gauge (Digital Cadastral Ruler on Building Corner)
function ElevationGauge({ position = [-13, 0, 10] }) {
  const levels = [
    { z: -3.5, label: '-3.5m B1' },
    { z: 0.0, label: '±0.0m GRD (215.0m MSL)' },
    { z: 3.0, label: '+3.0m L1' },
    { z: 6.0, label: '+6.0m L2' },
    { z: 9.0, label: '+9.0m L3' },
    { z: 12.0, label: '+12.0m L4' },
    { z: 15.0, label: '+15.0m ROOF' }
  ]

  return (
    <group position={position}>
      {/* Vertical Mast */}
      <mesh position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 20, 6]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>

      {/* Level Ticks & Text */}
      {levels.map((lvl, idx) => (
        <group key={idx} position={[0, lvl.z, 0]}>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Text
            position={[0.8, 0, 0]}
            fontSize={0.45}
            color="#38bdf8"
            anchorX="left"
          >
            {lvl.label}
          </Text>
        </group>
      ))}
    </group>
  )
}

// Volumetric Unit Polyhedron Component with High-Fidelity Shading
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

  // Material calculation with theme awareness
  const materialProps = useMemo(() => {
    if (viewMode === 'ENCROACHMENT' && isViolating) {
      return {
        color: '#ef4444',
        opacity: isSelected ? 0.95 : 0.88,
        transparent: true,
        roughness: 0.1,
        metalness: 0.2,
        emissive: '#ef4444',
        emissiveIntensity: 0.7
      }
    }

    if (viewMode === 'XRAY') {
      return {
        color: isSelected ? '#38bdf8' : unit.color || '#3b82f6',
        opacity: isSelected ? 0.7 : 0.15,
        transparent: true,
        roughness: 0.1,
        metalness: 0.5
      }
    }

    // Standard Cadastral Mode
    let baseColor = unit.color || '#3b82f6'
    if (theme === 'DAYLIGHT') {
      if (unit.type === 'PRIVATE_RESIDENTIAL') baseColor = unit.name.includes('3BHK') ? '#2563eb' : '#0284c7'
      else if (unit.type.includes('PARKING')) baseColor = '#0d9488'
      else if (unit.type.includes('COMMON')) baseColor = '#64748b'
    }

    if (isSelected) baseColor = '#38bdf8'
    else if (isHovered) baseColor = '#60a5fa'

    let opacity = 0.82
    if (isFloorDimmed) opacity = 0.06
    else if (isSelected) opacity = 0.96
    else if (isHovered) opacity = 0.92

    return {
      color: baseColor,
      opacity: opacity,
      transparent: true,
      roughness: theme === 'DAYLIGHT' ? 0.2 : 0.25,
      metalness: theme === 'DAYLIGHT' ? 0.3 : 0.4,
      emissive: isSelected ? '#0284c7' : '#000000',
      emissiveIntensity: isSelected ? 0.5 : 0.0
    }
  }, [viewMode, isViolating, isSelected, isHovered, isFloorDimmed, unit, theme])

  // Pulsing animation for violations & float for selection
  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = verticalExplode + Math.sin(state.clock.elapsedTime * 3) * 0.1
      } else if (isViolating && viewMode === 'ENCROACHMENT') {
        const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) / 2
        meshRef.current.material.emissiveIntensity = 0.3 + pulse * 0.7
        meshRef.current.position.y = verticalExplode
      } else {
        meshRef.current.position.y = verticalExplode
      }
    }
  })

  const labelPos = useMemo(() => {
    const c = unit.centroid_local
    return [c[0], c[2] + 0.4 + verticalExplode, -c[1]]
  }, [unit, verticalExplode])

  return (
    <group position={[0, verticalExplode, 0]}>
      {/* 3D Polyhedron Mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          onSelectUnit(unit)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHoverUnit(unit)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHoverUnit(null)
        }}
      >
        <meshStandardMaterial {...materialProps} side={THREE.DoubleSide} />
      </mesh>

      {/* CAD Outlines */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial
          color={
            isViolating && viewMode === 'ENCROACHMENT'
              ? '#ff1111'
              : isSelected
              ? '#38bdf8'
              : isFloorDimmed
              ? '#1e293b'
              : theme === 'DAYLIGHT'
              ? '#334155'
              : '#0f172a'
          }
          linewidth={isSelected ? 3 : 1}
          transparent
          opacity={isFloorDimmed ? 0.08 : 0.85}
        />
      </lineSegments>

      {/* Floating 3D Badge on hover/select or violation */}
      {(isSelected || (isViolating && viewMode === 'ENCROACHMENT') || (isHovered && !isFloorDimmed)) && (
        <Html position={labelPos} center distanceFactor={26}>
          <div
            className={`pointer-events-none px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-2xl transition-all whitespace-nowrap ${
              isViolating && viewMode === 'ENCROACHMENT'
                ? 'bg-red-600/95 text-white border border-red-400 ring-4 ring-red-500/50 animate-bounce'
                : isSelected
                ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-300/60 font-black'
                : 'bg-slate-900/90 text-sky-400 border border-slate-700 backdrop-blur-md'
            }`}
          >
            {isViolating && viewMode === 'ENCROACHMENT' ? '🚨 ENCROACHMENT: ' : ''}
            {unit.unit_id} ({unit.name.split(' ')[0]})
          </div>
        </Html>
      )}
    </group>
  )
}

// Concrete Floor Slabs & Structural Columns
function StructuralFrame({ activeFloor, explodedOffset = 0 }) {
  const slabGeometry = useMemo(() => {
    // 24.4m x 18.4m concrete slab with central core cutout
    return new THREE.BoxGeometry(24.4, 0.22, 18.4)
  }, [])

  // Slabs at Z = 0.0, 3.0, 6.0, 9.0, 12.0, 15.0
  const floorLevels = [0, 1, 2, 3, 4, 5]

  return (
    <group>
      {floorLevels.map((lvl) => {
        const isDimmed = activeFloor !== 'ALL' && activeFloor !== lvl
        const yPos = lvl * 3.0 + (lvl > 0 ? lvl * explodedOffset : 0)

        return (
          <mesh
            key={lvl}
            geometry={slabGeometry}
            position={[0, yPos + 0.1, 0]}
            receiveShadow
          >
            <meshStandardMaterial
              color="#334155"
              roughness={0.8}
              metalness={0.2}
              transparent
              opacity={isDimmed ? 0.05 : 0.85}
            />
          </mesh>
        )
      })}

      {/* Central Core Elevator Tower & Stairwell Shaft */}
      <mesh position={[0, 7.5 + 2.5 * explodedOffset, 0]}>
        <boxGeometry args={[6.2, 15.5 + 5 * explodedOffset, 6.2]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={activeFloor === 'ALL' ? 0.35 : 0.1}
        />
      </mesh>
    </group>
  )
}

// Delhi Urban Society Grounds, Road Markings, Trees, and Setback Boundaries
function DelhiContextScene({ contextLayers, parcelBoundary, activeFloor, theme = 'CYBER' }) {
  // Surface Parcel Ground Plane
  const parcelGeom = useMemo(() => {
    const shape = new THREE.Shape()
    const pts = parcelBoundary.local_coordinates
    shape.moveTo(pts[0][0], -pts[0][1])
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i][0], -pts[i][1])
    }
    return new THREE.ShapeGeometry(shape)
  }, [parcelBoundary])

  // Parcel boundary line loop
  const boundaryLineGeom = useMemo(() => {
    const pts = parcelBoundary.local_coordinates.map((p) => new THREE.Vector3(p[0], 0.06, -p[1]))
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [parcelBoundary])

  // Approved Setback Boundary Line (24m x 18m inner box)
  const setbackLineGeom = useMemo(() => {
    const pts = [
      new THREE.Vector3(-12, 0.08, -9),
      new THREE.Vector3(12, 0.08, -9),
      new THREE.Vector3(12, 0.08, 9),
      new THREE.Vector3(-12, 0.08, 9),
      new THREE.Vector3(-12, 0.08, -9)
    ]
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  // North Road Mesh
  const northRoadGeom = useMemo(() => {
    const shape = new THREE.Shape()
    const pts = contextLayers.north_road_local
    shape.moveTo(pts[0][0], -pts[0][1])
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i][0], -pts[i][1])
    }
    return new THREE.ShapeGeometry(shape)
  }, [contextLayers])

  // East Road Mesh
  const eastRoadGeom = useMemo(() => {
    const shape = new THREE.Shape()
    const pts = contextLayers.east_road_local
    shape.moveTo(pts[0][0], -pts[0][1])
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i][0], -pts[i][1])
    }
    return new THREE.ShapeGeometry(shape)
  }, [contextLayers])

  return (
    <group>
      {/* 2D Surface Cadastral Parcel Base (Landscaped Society Garden & Courtyard) */}
      <mesh geometry={parcelGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial
          color={theme === 'DAYLIGHT' ? '#14532d' : '#0c1a2e'}
          roughness={0.9}
        />
      </mesh>

      {/* Luminous Legal Parcel Outer Boundary Line */}
      <lineLoop geometry={boundaryLineGeom}>
        <lineBasicMaterial color="#38bdf8" linewidth={3} />
      </lineLoop>

      {/* Approved Building Setback Envelope Line (Yellow Dashed feel) */}
      <lineLoop geometry={setbackLineGeom}>
        <lineBasicMaterial color="#f59e0b" linewidth={2} />
      </lineLoop>

      {/* North Road (Dwarka Sector 10 Municipal Road) */}
      <mesh geometry={northRoadGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color={theme === 'DAYLIGHT' ? '#334155' : '#111c30'} roughness={0.8} />
      </mesh>

      {/* East Access Road */}
      <mesh geometry={eastRoadGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color={theme === 'DAYLIGHT' ? '#334155' : '#111c30'} roughness={0.8} />
      </mesh>

      {/* Road Markings / Center Dashed Lines */}
      <mesh position={[0, 0.03, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 0.3]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* Pedestrian Zebra Crossing */}
      {[-4, -2, 0, 2, 4].map((offset) => (
        <mesh key={offset} position={[offset, 0.04, -14.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 2.2]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Road Labels */}
      <Text position={[0, 0.1, -22]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#94a3b8">
        DWARKA SECTOR 10 MUNICIPAL ROAD (12M ROW)
      </Text>

      <Text position={[22, 0.1, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={1.0} color="#64748b">
        EAST SERVICE ACCESS ROAD (8M)
      </Text>

      {/* Landscaping: Society Boundary Trees */}
      <Tree position={[-16, 0, -11]} scale={1.2} />
      <Tree position={[-16, 0, 0]} scale={1.3} />
      <Tree position={[-16, 0, 11]} scale={1.1} />
      <Tree position={[15, 0, 11]} scale={1.2} />
      <Tree position={[-8, 0, 12]} scale={1.0} />
      <Tree position={[8, 0, 12]} scale={1.0} />

      {/* Street Lighting Along Road */}
      <StreetLight position={[-18, 0, -15]} rotation={[0, Math.PI, 0]} />
      <StreetLight position={[0, 0, -15]} rotation={[0, Math.PI, 0]} />
      <StreetLight position={[18, 0, -15]} rotation={[0, Math.PI, 0]} />
      <StreetLight position={[19, 0, 10]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Vertical Digital Elevation Gauge */}
      <ElevationGauge position={[-14, 0, 10]} />

      {/* Surrounding Context Buildings (LoD1 Extrusions) */}
      {/* West Neighbor Society Block */}
      <mesh position={[-28, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 12, 22]} />
        <meshStandardMaterial
          color={theme === 'DAYLIGHT' ? '#cbd5e1' : '#1e293b'}
          transparent
          opacity={theme === 'DAYLIGHT' ? 0.7 : 0.4}
          roughness={0.5}
        />
      </mesh>
      <lineSegments position={[-28, 6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(14, 12, 22)]} />
        <lineBasicMaterial color={theme === 'DAYLIGHT' ? '#64748b' : '#334155'} />
      </lineSegments>

      {/* South Neighbor Society Block */}
      <mesh position={[0, 7.5, 24]} castShadow receiveShadow>
        <boxGeometry args={[28, 15, 12]} />
        <meshStandardMaterial
          color={theme === 'DAYLIGHT' ? '#cbd5e1' : '#1e293b'}
          transparent
          opacity={theme === 'DAYLIGHT' ? 0.7 : 0.4}
          roughness={0.5}
        />
      </mesh>
      <lineSegments position={[0, 7.5, 24]}>
        <edgesGeometry args={[new THREE.BoxGeometry(28, 15, 12)]} />
        <lineBasicMaterial color={theme === 'DAYLIGHT' ? '#64748b' : '#334155'} />
      </lineSegments>

      {/* North Opposite Commercial Complex */}
      <mesh position={[0, 10, -38]} castShadow receiveShadow>
        <boxGeometry args={[48, 20, 16]} />
        <meshStandardMaterial
          color={theme === 'DAYLIGHT' ? '#94a3b8' : '#162035'}
          transparent
          opacity={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Ground Grid Helper */}
      <gridHelper
        args={[180, 90, theme === 'DAYLIGHT' ? '#94a3b8' : '#1e293b', theme === 'DAYLIGHT' ? '#e2e8f0' : '#0f172a']}
        position={[0, -0.02, 0]}
      />
    </group>
  )
}

// Camera Preset Controller
function CameraController({ cameraPreset }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    if (!camera) return

    switch (cameraPreset) {
      case 'OVERVIEW':
        camera.position.set(38, 28, 42)
        camera.lookAt(0, 5, 0)
        break
      case 'TOPDOWN':
        camera.position.set(0, 60, 0.01)
        camera.lookAt(0, 0, 0)
        break
      case 'STREET':
        camera.position.set(0, 2.5, -26)
        camera.lookAt(0, 8, 0)
        break
      case 'UNDERGROUND':
        camera.position.set(24, -9, 24)
        camera.lookAt(0, -2, 0)
        break
      case 'ENCROACHMENT':
        camera.position.set(12, 11, -19)
        camera.lookAt(7.5, 7.5, -9)
        break
      default:
        break
    }
  }, [cameraPreset, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 + 0.3}
      minDistance={6}
      maxDistance={140}
    />
  )
}

export default function Viewer3D({
  societyData,
  selectedUnit,
  onSelectUnit,
  activeFloor,
  viewMode,
  cameraPreset,
  explodedOffset = 0,
  theme = 'CYBER'
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null)

  const violatingUnitIds = useMemo(() => {
    if (!societyData?.audit_summary) return []
    const airViolations = societyData.audit_summary.air_rights_violations.map((v) => v.unit_id)
    const subViolations = societyData.audit_summary.subsurface_violations.map((v) => v.unit_id)
    return [...airViolations, ...subViolations]
  }, [societyData])

  if (!societyData || !societyData.units) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono">
        Loading 3D Cadastral Digital Twin...
      </div>
    )
  }

  const bgColor = theme === 'DAYLIGHT' ? '#0f172a' : '#080c17'

  return (
    <div className="w-full h-full relative bg-[#080c17]">
      <Canvas
        camera={{ position: [38, 28, 42], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 50, 160]} />

        {/* Dynamic Studio Lighting Rig */}
        <ambientLight intensity={theme === 'DAYLIGHT' ? 0.9 : 0.65} />
        
        {/* Sun Key Light with Crisp Shadows */}
        <directionalLight
          position={[35, 55, 30]}
          intensity={theme === 'DAYLIGHT' ? 1.8 : 1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={120}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />

        {/* Cool Fill & Rim Lights */}
        <directionalLight position={[-30, 25, -25]} intensity={0.6} color="#93c5fd" />
        <pointLight position={[0, -6, 0]} intensity={1.2} color="#38bdf8" distance={30} />
        <pointLight position={[0, 18, 0]} intensity={0.8} color="#a855f7" distance={35} />

        <CameraController cameraPreset={cameraPreset} />

        {/* Delhi Surrounding Geodata & Base Parcel */}
        <DelhiContextScene
          contextLayers={societyData.context_layers}
          parcelBoundary={societyData.parcel_boundary}
          activeFloor={activeFloor}
          theme={theme}
        />

        {/* Concrete Slabs & Structural Core */}
        <StructuralFrame activeFloor={activeFloor} explodedOffset={explodedOffset} />

        {/* Volumetric 3D Cadastral Units */}
        {societyData.units.map((unit) => (
          <VolumetricUnit
            key={unit.unit_id}
            unit={unit}
            selectedUnit={selectedUnit}
            onSelectUnit={onSelectUnit}
            hoveredUnit={hoveredUnit}
            onHoverUnit={setHoveredUnit}
            activeFloor={activeFloor}
            viewMode={viewMode}
            isViolating={violatingUnitIds.includes(unit.unit_id)}
            explodedOffset={explodedOffset}
            theme={theme}
          />
        ))}
      </Canvas>
    </div>
  )
}
