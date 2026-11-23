import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  Users,
  CheckCircle,
  XCircle,
  Scale,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';

interface Props {
  discoveredTraits: string[];
  onGoToLineup: () => void;
}

export const CC3DProfile: React.FC<Props> = ({ discoveredTraits, onGoToLineup }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('dr_eleanor_sterling');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cardsGroupRef = useRef<THREE.Group | null>(null);

  const SUSPECTS_BASE = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      role: 'Chief Neurologist',
      gender: 'Female',
      job: 'Doctor',
      magnet: 'Yes',
      disinherited: 'Yes',
      isCulprit: true,
      eliminatedBy: [] as string[],
      traitsMatched: ['trait_gender_female', 'trait_medical_access', 'trait_neodymium_magnet', 'trait_revoked_will'],
      color: 0x0284c7,
      x: -2.25
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      role: 'Building Superintendent',
      gender: 'Male',
      job: 'Maintenance Super',
      magnet: 'No',
      disinherited: 'No',
      isCulprit: false,
      eliminatedBy: ['trait_gender_female', 'trait_medical_access'],
      traitsMatched: [] as string[],
      color: 0x1d4ed8,
      x: -0.75
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      role: 'Foundation Director',
      gender: 'Female',
      job: 'Philanthropist',
      magnet: 'No',
      disinherited: 'No',
      isCulprit: false,
      eliminatedBy: ['trait_medical_access', 'trait_revoked_will'],
      traitsMatched: ['trait_gender_female'],
      color: 0x9333ea,
      x: 0.75
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      role: 'Paparazzo Photographer',
      gender: 'Male',
      job: 'Photographer',
      magnet: 'No',
      disinherited: 'No',
      isCulprit: false,
      eliminatedBy: ['trait_gender_female', 'trait_medical_access', 'trait_revoked_will'],
      traitsMatched: [] as string[],
      color: 0xd97706,
      x: 2.25
    }
  ];

  const SUSPECTS = SUSPECTS_BASE.map(s => {
    const isEliminated = s.eliminatedBy.some(t => discoveredTraits.includes(t));
    const matchCount = s.traitsMatched.filter(t => discoveredTraits.includes(t)).length;
    const matchScore = s.isCulprit ? 100 : Math.round((matchCount / Math.max(1, discoveredTraits.length)) * 50);
    return {
      ...s,
      innocent: isEliminated,
      matchScore: s.isCulprit ? 100 : matchScore
    };
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060810);
    scene.fog = new THREE.FogExp2(0x060810, 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0.3, 0);
    controlsRef.current = controls;

    // 5. Build 3D Corkboard Scene
    buildProfileBoard(scene);

    // 6. Raycast click on suspect cards
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 8) return; // Ignore drag/orbit

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = cardsGroupRef.current ? cardsGroupRef.current.children : [];
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.cardId) {
          top = top.parent;
        }
        if (top.userData.cardId) {
          audio.playCardFlip();
          setSelectedSuspectId(top.userData.cardId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('click', onClick);

    // 7. Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
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
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Re-render suspect cards when traits change
  useEffect(() => {
    if (!sceneRef.current || !cardsGroupRef.current) return;
    renderSuspectCards(cardsGroupRef.current);
  }, [discoveredTraits]);

  const renderSuspectCards = (cGroup: THREE.Group) => {
    cGroup.clear();

    SUSPECTS.forEach((s) => {
      const cardGroup = new THREE.Group();
      cardGroup.userData = { cardId: s.id };

      // Paper card backing
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 2.0, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 })
      );
      cardGroup.add(card);

      // Mugshot avatar block
      const mugshot = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.9, 0.03),
        new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.6 })
      );
      mugshot.position.set(0, 0.35, 0.025);
      cardGroup.add(mugshot);

      // Red Push Pin at top
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      );
      pin.position.set(0, 0.92, 0.05);
      cardGroup.add(pin);

      // Red INNOCENT rubber stamp or 100% KILLER stamp
      if (s.innocent) {
        const stamp = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.32, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
        );
        stamp.rotation.z = -0.25;
        stamp.position.set(0, 0.35, 0.04);
        cardGroup.add(stamp);
      } else if (discoveredTraits.length >= 3) {
        const killerTag = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.34, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.6 })
        );
        killerTag.position.set(0, -0.5, 0.03);
        cardGroup.add(killerTag);
      }

      cardGroup.position.set(s.x, 0.3, 0.02);
      cGroup.add(cardGroup);
    });
  };

  const buildProfileBoard = (scene: THREE.Scene) => {
    // Lighting
    const ambient = new THREE.AmbientLight(0x1e293b, 0.9);
    scene.add(ambient);

    const boardSpot = new THREE.DirectionalLight(0xfef08a, 1.2);
    boardSpot.position.set(0, 3, 5);
    scene.add(boardSpot);

    // 1. CORK INVESTIGATION BOARD
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 3.8, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x58240c, roughness: 0.6 })
    );
    boardFrame.position.set(0, 0.3, -0.1);
    scene.add(boardFrame);

    const corkMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.95 });
    const cork = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.6, 0.12), corkMat);
    cork.position.set(0, 0.3, -0.05);
    scene.add(cork);

    // 2. SUSPECT CARDS GROUP
    const cGroup = new THREE.Group();
    cardsGroupRef.current = cGroup;
    scene.add(cGroup);
    renderSuspectCards(cGroup);

    // 3. RED STRING CONNECTORS (Crime yarn connecting clues)
    const stringMat = new THREE.LineBasicMaterial({ color: 0xdc2626, linewidth: 2 });
    const stringPoints = [
      new THREE.Vector3(-2.25, 0.92, 0.08),
      new THREE.Vector3(-1.0, -0.6, 0.08),
      new THREE.Vector3(-0.75, 0.92, 0.08),
      new THREE.Vector3(0.5, -0.6, 0.08),
      new THREE.Vector3(0.75, 0.92, 0.08),
      new THREE.Vector3(-2.25, 0.92, 0.08)
    ];
    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const redYarn = new THREE.Line(stringGeo, stringMat);
    scene.add(redYarn);
  };

  const selectedSuspect = SUSPECTS.find(s => s.id === selectedSuspectId) || SUSPECTS[0];

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: '12px', overflow: 'hidden', background: '#060810', border: '2px solid #3b82f6', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Banner */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 14,
        background: 'rgba(2, 6, 23, 0.9)',
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        padding: '6px 16px',
        color: '#93c5fd',
        fontWeight: '900',
        fontSize: '0.85rem',
        letterSpacing: '0.04em',
        zIndex: 20
      }}>
        CASE #017 // 3D KILLER PROFILE & ELIMINATION BOARD
      </div>

      {/* Top Right Action Button */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 20
      }}>
        <button
          onClick={onGoToLineup}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 18px',
            fontSize: '0.8rem',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 16px rgba(239, 68, 68, 0.5)'
          }}
        >
          <Scale size={16} />
          <span>PROCEED TO ARREST LINEUP →</span>
        </button>
      </div>

      {/* Bottom Suspect Profile Card Inspector */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '850px',
        background: 'rgba(2, 6, 23, 0.95)',
        border: selectedSuspect.innocent ? '2px solid #334155' : '2px solid #ef4444',
        borderRadius: '12px',
        padding: '14px 22px',
        boxShadow: '0 0 30px rgba(0,0,0,0.8)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '900', margin: 0 }}>
              {selectedSuspect.name}
            </h3>
            <span style={{
              background: selectedSuspect.innocent ? '#1e293b' : '#dc2626',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: '900',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {selectedSuspect.innocent ? 'STAMPED INNOCENT' : '100% KILLER PROFILE MATCH'}
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '3px 0 6px' }}>
            {selectedSuspect.role}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
            <span>GENDER: {selectedSuspect.gender}</span>
            <span>PROFESSION: {selectedSuspect.job}</span>
            <span>NEODYMIUM MAGNET: {selectedSuspect.magnet}</span>
            <span>$40M DISINHERITED: {selectedSuspect.disinherited}</span>
          </div>
        </div>

        <div style={{
          background: selectedSuspect.innocent ? '#090d16' : 'rgba(239, 68, 68, 0.2)',
          border: selectedSuspect.innocent ? '1px solid #334155' : '2px solid #ef4444',
          borderRadius: '8px',
          padding: '10px 16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '900', color: selectedSuspect.innocent ? '#94a3b8' : '#ef4444' }}>
            {selectedSuspect.matchScore}%
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            PROFILE MATCH
          </div>
        </div>
      </div>

      {/* Orbit Tip */}
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
        <Compass size={12} color="#38bdf8" />
        <span>CLICK SUSPECT CARD IN 3D TO INSPECT // DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
