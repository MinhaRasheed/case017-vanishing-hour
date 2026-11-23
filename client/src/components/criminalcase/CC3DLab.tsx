import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  Pipette,
  Star,
  CheckCircle,
  Scan,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Zap
} from 'lucide-react';

interface Props {
  stars: number;
  onSpendStar: (amount: number) => boolean;
  discoveredTraits: string[];
  onTraitDiscovered: (traitId: string) => void;
  onGoToProfile: () => void;
}

interface SampleItem {
  id: string;
  name: string;
  desc: string;
  traitReveal: string;
  category: string;
}

export const CC3DLab: React.FC<Props> = ({
  stars,
  onSpendStar,
  discoveredTraits,
  onTraitDiscovered,
  onGoToProfile
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredSample, setHoveredSample] = useState<SampleItem | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [starWarning, setStarWarning] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'overview' | 'tray' | 'microscope' | 'spectrometer'>('overview');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sampleMeshesRef = useRef<{ id: string; name: string; desc: string; mesh: THREE.Object3D }[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.4, 5.8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.1, 0));

  const SAMPLES = [
    {
      id: 'trait_gender_female',
      name: 'Carpet Footprint & Shoe Traction',
      desc: 'Muddy tread recovered from Penthouse 4B Persian rug.',
      traitReveal: 'Gender: Female (Women\'s Size 7.5 Italian Leather Pump)',
      category: 'Orthotics & Tread Analysis'
    },
    {
      id: 'trait_medical_access',
      name: 'Scotch Tumbler Chemical Residue',
      desc: 'Spectrometry analysis of white crystalline rim deposit.',
      traitReveal: 'Profession: Doctor with Hospital Sedative Access (Midazolam)',
      category: 'Mass Spectrometry'
    },
    {
      id: 'trait_neodymium_magnet',
      name: 'Deadbolt Brass Collar Abrasion',
      desc: 'Magnetic flux analysis of the exterior lock face.',
      traitReveal: 'Method: Possesses 180-lb Neodymium Recovery Magnet',
      category: 'Metallurgical Flux'
    },
    {
      id: 'trait_revoked_will',
      name: 'Torn Codicil Document Recovery',
      desc: 'Assembling charred paper scraps found in fireplace.',
      traitReveal: 'Motive: Disinherited of $40,000,000 Research Grant',
      category: 'Document Forensics'
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040810);
    scene.fog = new THREE.FogExp2(0x040810, 0.05);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 5.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 1.1, 0);
    controlsRef.current = controls;

    // 5. Build 3D Forensic Lab
    buildLabScene(scene);

    // 6. Raycast detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = sampleMeshesRef.current.map(s => s.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.sampleId) {
          top = top.parent;
        }
        const sampleId = top.userData.sampleId;
        const hit = SAMPLES.find(s => s.id === sampleId);
        if (hit) {
          setHoveredSample(hit);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredSample(null);
      container.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 8) return; // Ignore drag/orbit

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = sampleMeshesRef.current.map(s => s.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.sampleId) {
          top = top.parent;
        }
        const sampleId = top.userData.sampleId;
        if (sampleId) {
          triggerSampleAnalysis(sampleId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 7. Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (camera && controls) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        controls.update();
      }

      // Rotate centrifuge vials
      const centrifuge = scene.getObjectByName('centrifugeRotor');
      if (centrifuge) {
        centrifuge.rotation.y += 0.08;
      }

      // Pulse microscope laser scanner
      const laser = scene.getObjectByName('laserBeam');
      if (laser) {
        laser.position.y = 1.35 + Math.sin(Date.now() * 0.006) * 0.12;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  const handleSetView = (view: 'overview' | 'tray' | 'microscope' | 'spectrometer') => {
    setCameraView(view);
    audio.playCardFlip();
    if (view === 'overview') {
      targetCamPosRef.current.set(0, 3.4, 5.8);
      targetLookAtRef.current.set(0, 1.1, 0);
    } else if (view === 'tray') {
      targetCamPosRef.current.set(0, 2.0, 1.8);
      targetLookAtRef.current.set(0, 0.95, 0.2);
    } else if (view === 'microscope') {
      targetCamPosRef.current.set(-1.6, 1.8, 1.2);
      targetLookAtRef.current.set(-1.8, 1.3, -0.4);
    } else if (view === 'spectrometer') {
      targetCamPosRef.current.set(0, 2.2, -1.0);
      targetLookAtRef.current.set(0, 2.0, -3.8);
    }
  };

  const triggerSampleAnalysis = (id: string) => {
    if (discoveredTraits.includes(id)) {
      audio.playDullClick();
      return;
    }

    if (!onSpendStar(1)) {
      audio.playDullClick();
      setStarWarning(true);
      setTimeout(() => setStarWarning(false), 3500);
      return;
    }

    setAnalyzingId(id);
    audio.playDropperSound();

    // Focus camera onto the sample tray
    targetCamPosRef.current.set(0, 2.0, 1.8);
    targetLookAtRef.current.set(0, 0.95, 0.2);

    setTimeout(() => {
      audio.playStamp();
      audio.playEvidenceFound();
      setAnalyzingId(null);
      onTraitDiscovered(id);
    }, 2400);
  };

  const registerSample = (id: string, name: string, desc: string, mesh: THREE.Object3D) => {
    mesh.userData = { sampleId: id, sampleName: name };
    mesh.traverse(c => { c.userData = { sampleId: id, sampleName: name }; });
    sampleMeshesRef.current.push({ id, name, desc, mesh });
    sceneRef.current?.add(mesh);
  };

  const buildLabScene = (scene: THREE.Scene) => {
    sampleMeshesRef.current = [];

    // Ambient Lighting
    const ambient = new THREE.AmbientLight(0x0f172a, 0.9);
    scene.add(ambient);

    // Overhead Clean Clinical Fluorescent Lights
    const overheadLight = new THREE.DirectionalLight(0xdbeafe, 1.4);
    overheadLight.position.set(0, 6, 2);
    overheadLight.castShadow = true;
    scene.add(overheadLight);

    // Cyan High-Tech Microscope Spotlight
    const cyanLight = new THREE.PointLight(0x38bdf8, 2.8, 6, 2);
    cyanLight.position.set(-1.8, 1.6, -0.2);
    cyanLight.castShadow = true;
    scene.add(cyanLight);

    // Emerald Green Centrifuge Light
    const greenLight = new THREE.PointLight(0x10b981, 2.0, 5, 2);
    greenLight.position.set(1.8, 1.5, -0.2);
    scene.add(greenLight);

    // 1. HIGH-TECH LAB FLOOR (Polished Ceramic Tile Grid)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.15 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(12, 24, 0x1e3a8a, 0x1e293b);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 2. STAINLESS STEEL WALLS
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.6 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 0.3), wallMat);
    backWall.position.set(0, 2.5, -4.0);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    leftWall.position.set(-5.5, 2.5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    rightWall.position.set(5.5, 2.5, 0);
    scene.add(rightWall);

    // 3. SPECTROMETER CRT TERMINAL (Back wall)
    const monitorGroup = new THREE.Group();
    const monitorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.6, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    monitorGroup.add(monitorFrame);
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x022c22, emissive: 0x10b981, emissiveIntensity: 0.85 })
    );
    screen.position.set(0, 0, 0.1);
    monitorGroup.add(screen);
    monitorGroup.position.set(0, 2.2, -3.8);
    scene.add(monitorGroup);

    // 4. MAIN STAINLESS STEEL EXAMINATION ISLAND TABLE
    const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 2.0), tableTopMat);
    tableTop.position.set(0, 1.0, 0.2);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Metallic Base Pedestals
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    [[-1.6, 0.2], [1.6, 0.2]].forEach(([px, pz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.95, 16), baseMat);
      leg.position.set(px, 0.48, pz);
      scene.add(leg);
    });

    // 5. FORENSIC ELECTRON MICROSCOPE (Left on island table)
    const microGroup = new THREE.Group();
    const mBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), baseMat);
    microGroup.add(mBase);
    const mPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), baseMat);
    mPillar.position.set(0, 0.25, -0.1);
    microGroup.add(mPillar);
    const mEyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.25), baseMat);
    mEyepiece.rotation.x = 0.5;
    mEyepiece.position.set(0, 0.48, 0.05);
    microGroup.add(mEyepiece);
    const mTurret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
    );
    mTurret.position.set(0, 0.28, 0.05);
    microGroup.add(mTurret);
    microGroup.position.set(-1.6, 1.05, 0.3);
    scene.add(microGroup);

    // 6. CENTRIFUGE ROTOR (Right on table)
    const centGroup = new THREE.Group();
    const centChamber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 })
    );
    centGroup.add(centChamber);
    // Rotor carousel
    const rotor = new THREE.Group();
    rotor.name = 'centrifugeRotor';
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const vial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.12),
        new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xef4444 : 0x38bdf8, transparent: true, opacity: 0.9 })
      );
      vial.position.set(Math.cos(angle) * 0.18, 0.04, Math.sin(angle) * 0.18);
      rotor.add(vial);
    }
    centGroup.add(rotor);
    centGroup.position.set(1.6, 1.16, 0.3);
    scene.add(centGroup);

    // 7. DR. GRACE HARPER 3D STYLIZED MODEL (Standing beside desk in lab coat)
    const docGroup = new THREE.Group();
    // White Lab Coat
    const docTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.28, 1.0, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    );
    docTorso.position.y = 1.6;
    docGroup.add(docTorso);
    // Stethoscope
    const steth = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.02, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    steth.rotation.x = Math.PI / 2;
    steth.position.set(0, 1.9, 0.14);
    docGroup.add(steth);
    // Head / Face
    const docHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 })
    );
    docHead.position.y = 2.22;
    docGroup.add(docHead);
    // Hair Bun
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 })
    );
    hair.position.set(0, 2.3, -0.05);
    docGroup.add(hair);

    docGroup.position.set(-2.5, 0, -0.6);
    docGroup.rotation.y = 0.5;
    scene.add(docGroup);

    // 8. THE STAINLESS STEEL EVIDENCE TRAY WITH 4 SAMPLES IN CENTER
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.1 })
    );
    tray.position.set(0, 1.07, 0.3);
    scene.add(tray);

    // --- SAMPLE 1: SHOE IMPRESSION TREAD PLASTER (trait_gender_female) ---
    const shoeGroup = new THREE.Group();
    const plaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.04, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 })
    );
    shoeGroup.add(plaster);
    const treadMark = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
    );
    treadMark.rotation.x = -Math.PI / 2;
    treadMark.position.y = 0.025;
    shoeGroup.add(treadMark);
    shoeGroup.position.set(-0.9, 1.11, 0.3);
    registerSample('trait_gender_female', 'Shoe Tread Impression', 'Plaster orthotic analysis', shoeGroup);

    // --- SAMPLE 2: SCOTCH TUMBLER (trait_medical_access) ---
    const glassGroup = new THREE.Group();
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.1 })
    );
    glass.position.y = 0.08;
    glassGroup.add(glass);
    const sediment = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xa855f7, emissiveIntensity: 0.6 })
    );
    sediment.position.y = 0.03;
    glassGroup.add(sediment);
    glassGroup.position.set(-0.3, 1.1, 0.3);
    registerSample('trait_medical_access', 'Whiskey Tumbler Residue', 'Spectrometry chemical test', glassGroup);

    // --- SAMPLE 3: SCUFFED DEADBOLT (trait_neodymium_magnet) ---
    const deadboltGroup = new THREE.Group();
    const boltCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 })
    );
    boltCylinder.rotation.z = Math.PI / 2;
    deadboltGroup.add(boltCylinder);
    deadboltGroup.position.set(0.3, 1.13, 0.3);
    registerSample('trait_neodymium_magnet', 'Scuffed Deadbolt Cylinder', 'Magnetic abrasion test', deadboltGroup);

    // --- SAMPLE 4: CHARRED WILL PARCHMENT (trait_revoked_will) ---
    const docGroupItem = new THREE.Group();
    const scrap1 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 })
    );
    scrap1.rotation.x = -Math.PI / 2;
    scrap1.position.y = 0.01;
    docGroupItem.add(scrap1);
    const scrap2 = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 })
    );
    scrap2.rotation.x = -Math.PI / 2;
    scrap2.rotation.z = 0.4;
    scrap2.position.set(0.08, 0.015, 0.04);
    docGroupItem.add(scrap2);
    docGroupItem.position.set(0.9, 1.1, 0.3);
    registerSample('trait_revoked_will', 'Torn Will Parchment Fragments', 'UV ink recovery test', docGroupItem);
  };

  // Add green spinning beacons for discovered traits
  useEffect(() => {
    if (!sceneRef.current) return;
    discoveredTraits.forEach(traitId => {
      const sample = sampleMeshesRef.current.find(s => s.id === traitId);
      if (sample && !sample.mesh.getObjectByName(`beacon_${traitId}`)) {
        const beacon = new THREE.Group();
        beacon.name = `beacon_${traitId}`;

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.14, 16),
          new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
        );
        ring.rotation.x = -Math.PI / 2;
        beacon.add(ring);

        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.05),
          new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.9 })
        );
        gem.position.y = 0.06;
        beacon.add(gem);

        beacon.position.set(0, 0.25, 0);
        sample.mesh.add(beacon);
      }
    });
  }, [discoveredTraits]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: '12px', overflow: 'hidden', background: '#040810', border: '2px solid #10b981', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Left Camera Presets */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 14,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 20
      }}>
        <div style={{
          background: 'rgba(10, 15, 26, 0.85)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '4px',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => handleSetView('overview')}
            style={{
              background: cameraView === 'overview' ? '#10b981' : 'transparent',
              color: cameraView === 'overview' ? '#000' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔬 Lab Overview
          </button>

          <button
            onClick={() => handleSetView('tray')}
            style={{
              background: cameraView === 'tray' ? '#10b981' : 'transparent',
              color: cameraView === 'tray' ? '#000' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🧪 Evidence Tray
          </button>

          <button
            onClick={() => handleSetView('microscope')}
            style={{
              background: cameraView === 'microscope' ? '#10b981' : 'transparent',
              color: cameraView === 'microscope' ? '#000' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔎 Electron Microscope
          </button>

          <button
            onClick={() => handleSetView('spectrometer')}
            style={{
              background: cameraView === 'spectrometer' ? '#10b981' : 'transparent',
              color: cameraView === 'spectrometer' ? '#000' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🖥️ Spectrometer
          </button>
        </div>
      </div>

      {/* Top Right Available Stars & Profile Button */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 20
      }}>
        <div style={{
          background: 'rgba(2, 6, 23, 0.9)',
          border: '2px solid #f59e0b',
          borderRadius: '8px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#fef08a',
          fontWeight: '900',
          fontSize: '0.9rem'
        }}>
          <Star size={18} fill="#f59e0b" color="#fef08a" />
          <span>{stars} STARS AVAILABLE</span>
        </div>

        <button
          onClick={onGoToProfile}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 16px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          <span>VIEW KILLER PROFILE ({discoveredTraits.length}/4) →</span>
        </button>
      </div>

      {/* Star Warning Toast */}
      {starWarning && (
        <div style={{
          position: 'absolute',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          border: '2px solid #fecaca',
          borderRadius: '8px',
          padding: '10px 20px',
          fontWeight: '800',
          fontSize: '0.85rem',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Star size={16} fill="#fef08a" color="#f59e0b" />
          <span>YOU NEED AT LEAST 1 POLICE STAR! SEARCH PENTHOUSE 4B IN CRIME SCENE TO EARN STARS.</span>
        </div>
      )}

      {/* Analyzing Laser Animation Indicator */}
      {analyzingId && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(2, 6, 23, 0.95)',
          border: '2px solid #10b981',
          borderRadius: '16px',
          padding: '20px 32px',
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)',
          zIndex: 40
        }}>
          <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Scan size={36} className="animate-spin" />
          </div>
          <div style={{ color: '#fff', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '0.05em' }}>
            SPECTRAL FORENSIC SCAN IN PROGRESS...
          </div>
          <div style={{ color: '#93c5fd', fontSize: '0.85rem', fontFamily: 'monospace', marginTop: '4px' }}>
            Analyzing molecular bonds & metallurgical signatures with Dr. Grace...
          </div>
        </div>
      )}

      {/* 3D Hover Tooltip / Action Card */}
      {hoveredSample && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.95)',
          border: '2px solid #10b981',
          borderRadius: '16px',
          padding: '12px 24px',
          color: '#fff',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)',
          zIndex: 30
        }}>
          <div style={{ color: '#6ee7b7', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
            {hoveredSample.category.toUpperCase()}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '900', margin: '2px 0 4px', color: '#fff' }}>
            {hoveredSample.name}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 8px' }}>
            {hoveredSample.desc}
          </p>

          {discoveredTraits.includes(hoveredSample.id) ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#34d399',
              fontWeight: '800',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={16} />
              <span>TRAIT REVEALED: {hoveredSample.traitReveal}</span>
            </div>
          ) : (
            <button
              onClick={() => triggerSampleAnalysis(hoveredSample.id)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: '0.85rem',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)'
              }}
            >
              <Star size={16} fill="#fef08a" color="#f59e0b" />
              <span>SPEND 1 STAR TO RUN FORENSIC ANALYSIS</span>
            </button>
          )}
        </div>
      )}

      {/* Orbit Tip Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 14,
        background: 'rgba(10, 15, 26, 0.8)',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        padding: '5px 10px',
        color: '#94a3b8',
        fontSize: '0.7rem',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <Compass size={12} color="#10b981" />
        <span>CLICK SAMPLES ON TRAY TO ANALYZE // DRAG TO ROTATE 3D</span>
      </div>
    </div>
  );
};
