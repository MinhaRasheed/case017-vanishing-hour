import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  Compass,
  Search,
  Pipette,
  Users,
  MessageSquare,
  Scale,
  Sparkles,
  Phone,
  FolderOpen
} from 'lucide-react';

interface Props {
  onNavigate: (tab: 'scene' | 'lab' | 'profile' | 'interrogate' | 'lineup') => void;
  stars: number;
  score: number;
  discoveredTraitsCount: number;
}

export const CC3DOffice: React.FC<Props> = ({
  onNavigate,
  stars,
  score,
  discoveredTraitsCount
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [cameraView, setCameraView] = useState<'overview' | 'desk' | 'board'>('overview');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const interactiveObjectsRef = useRef<{ id: string; label: string; action: () => void; mesh: THREE.Object3D }[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.8, 6.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.05);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 5. Build 3D Detective Office
    buildOfficeScene(scene);

    // 6. Raycasting
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
      const meshes = interactiveObjectsRef.current.map(o => o.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.interactiveId) {
          top = top.parent;
        }
        if (top.userData.interactiveLabel) {
          setHoveredLabel(top.userData.interactiveLabel);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredLabel(null);
      container.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 8) return; // Ignore drag/orbit

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = interactiveObjectsRef.current.map(o => o.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.interactiveId) {
          top = top.parent;
        }
        const hit = interactiveObjectsRef.current.find(o => o.id === top.userData.interactiveId);
        if (hit) {
          audio.playCardFlip();
          hit.action();
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

  const handleSetView = (view: 'overview' | 'desk' | 'board') => {
    setCameraView(view);
    audio.playCardFlip();
    if (view === 'overview') {
      targetCamPosRef.current.set(0, 3.8, 6.2);
      targetLookAtRef.current.set(0, 1.2, 0);
    } else if (view === 'desk') {
      targetCamPosRef.current.set(0, 2.3, 2.0);
      targetLookAtRef.current.set(0, 0.9, 0.2);
    } else if (view === 'board') {
      targetCamPosRef.current.set(0, 2.4, 0.5);
      targetLookAtRef.current.set(0, 2.2, -3.8);
    }
  };

  const registerInteractive = (id: string, label: string, action: () => void, mesh: THREE.Object3D) => {
    mesh.userData = { interactiveId: id, interactiveLabel: label };
    mesh.traverse(child => {
      child.userData = { interactiveId: id, interactiveLabel: label };
    });
    interactiveObjectsRef.current.push({ id, label, action, mesh });
    sceneRef.current?.add(mesh);
  };

  const buildOfficeScene = (scene: THREE.Scene) => {
    interactiveObjectsRef.current = [];

    // Ambient light
    const ambient = new THREE.AmbientLight(0x1e293b, 0.9);
    scene.add(ambient);

    // Warm Banker's Lamp Light on Desk
    const deskLampLight = new THREE.PointLight(0x22c55e, 2.4, 5, 1.5);
    deskLampLight.position.set(-0.8, 1.8, 0.2);
    deskLampLight.castShadow = true;
    scene.add(deskLampLight);

    // Ceiling Warm Light
    const ceilingLight = new THREE.PointLight(0xf59e0b, 1.5, 9, 1.5);
    ceilingLight.position.set(0, 4.0, 0);
    scene.add(ceilingLight);

    // Moonlight through window
    const moonLight = new THREE.DirectionalLight(0x60a5fa, 1.0);
    moonLight.position.set(-6, 5, -2);
    moonLight.castShadow = true;
    scene.add(moonLight);

    // 1. FLOOR & CARPET
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: 0x181310, roughness: 0.4 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Navy Blue Precinct Rug with Gold Star Trim
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 4.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0.4);
    rug.receiveShadow = true;
    scene.add(rug);

    // 2. WALLS
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 0.3), wallMat);
    backWall.position.set(0, 2.5, -4.0);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    leftWall.position.set(-5.5, 2.5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    rightWall.position.set(5.5, 2.5, 0);
    scene.add(rightWall);

    // 3. VENETIAN BLINDS WINDOW ON LEFT WALL
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.2, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    windowFrame.position.set(-5.35, 2.7, 0);
    scene.add(windowFrame);

    // Venetian horizontal blind slats
    for (let s = -1.3; s <= 1.3; s += 0.14) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.02, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      );
      slat.position.set(-5.3, 2.7 + s, 0);
      slat.rotation.z = 0.2;
      scene.add(slat);
    }

    // 4. LARGE WOODEN DETECTIVE DESK
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.35 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.8), deskMat);
    desk.position.set(0, 1.0, 0.2);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    // Desk Drawers / Pedestals
    [[-1.4, 0.2], [1.4, 0.2]].forEach(([px, pz]) => {
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.95, 1.6), deskMat);
      pedestal.position.set(px, 0.48, pz);
      pedestal.castShadow = true;
      scene.add(pedestal);
    });

    // Detective Leather Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.5 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.8), chairMat);
    chairSeat.position.set(0, 0.65, -0.9);
    chairSeat.castShadow = true;
    scene.add(chairSeat);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.12), chairMat);
    chairBack.position.set(0, 1.15, -1.3);
    chairBack.castShadow = true;
    scene.add(chairBack);

    // 5. CORK INVESTIGATION BOARD ON BACK WALL
    const boardGroup = new THREE.Group();
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 2.5, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );
    boardGroup.add(boardFrame);
    const cork = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 2.3, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
    );
    boardGroup.add(cork);

    // Suspect Mugshots on the Corkboard with Pins
    const photoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
    [-1.5, -0.5, 0.5, 1.5].forEach((px, i) => {
      const photo = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.8, 0.02), photoMat);
      photo.position.set(px, 0.3, 0.08);
      boardGroup.add(photo);

      // Red push pin
      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      pin.position.set(px, 0.72, 0.1);
      boardGroup.add(pin);
    });

    // Red String Connectors (Tangled web of evidence)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const points = [
      new THREE.Vector3(-1.5, 0.3, 0.09),
      new THREE.Vector3(0, -0.4, 0.09),
      new THREE.Vector3(0.5, 0.3, 0.09),
      new THREE.Vector3(-0.5, 0.3, 0.09),
      new THREE.Vector3(1.5, 0.3, 0.09)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    boardGroup.add(line);

    boardGroup.position.set(0, 2.7, -3.8);
    registerInteractive(
      'board',
      'KILLER PROFILE BOARD (Review Traits & Eliminations)',
      () => onNavigate('profile'),
      boardGroup
    );

    // 6. BANKER'S EMERALD DESK LAMP
    const lampGroup = new THREE.Group();
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 })
    );
    lampGroup.add(lampBase);
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 })
    );
    lampStem.position.y = 0.2;
    lampGroup.add(lampStem);
    const emeraldShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.18, 0.32, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.1, emissive: 0x10b981, emissiveIntensity: 0.6 })
    );
    emeraldShade.rotation.z = Math.PI / 2;
    emeraldShade.position.set(0, 0.4, 0);
    lampGroup.add(emeraldShade);
    lampGroup.position.set(-0.8, 1.05, 0.3);
    scene.add(lampGroup);

    // 7. INTERACTIVE 3D OBJECTS ON DESK:

    // A. CASE 017 MANILA DOSSIER (Click to enter crime scene)
    const folderGroup = new THREE.Group();
    const folderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 })
    );
    folderGroup.add(folderMesh);
    const caseLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    );
    caseLabel.rotation.x = -Math.PI / 2;
    caseLabel.position.set(0, 0.025, 0.1);
    folderGroup.add(caseLabel);
    folderGroup.position.set(0.1, 1.07, 0.4);
    registerInteractive(
      'case_folder',
      'CASE #017 CRIME SCENE (Penthouse 4B Investigation)',
      () => onNavigate('scene'),
      folderGroup
    );

    // B. CHEMICAL FORENSIC BEAKER & CENTRIFUGE FLASK (Click to enter Lab)
    const labGroup = new THREE.Group();
    const flask = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.24, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.75 })
    );
    labGroup.add(flask);
    const liquid = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1, transparent: true, opacity: 0.9 })
    );
    liquid.position.y = -0.05;
    labGroup.add(liquid);
    labGroup.position.set(1.2, 1.18, 0.2);
    registerInteractive(
      'lab_flask',
      'FORENSICS LAB (Spectrometry & Chemical Analysis)',
      () => onNavigate('lab'),
      labGroup
    );

    // C. TAPE RECORDER & MICROPHONE (Click to enter Interrogations)
    const tapeGroup = new THREE.Group();
    const tapeBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    tapeGroup.add(tapeBox);
    const reel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    reel1.position.set(-0.1, 0.01, 0);
    tapeGroup.add(reel1);
    const reel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    reel2.position.set(0.1, 0.01, 0);
    tapeGroup.add(reel2);
    tapeGroup.position.set(-1.2, 1.09, 0.5);
    registerInteractive(
      'tape_recorder',
      'INTERROGATION TAPES (Interrogate Suspects B)',
      () => onNavigate('interrogate'),
      tapeGroup
    );

    // D. STEEL POLICE HANDCUFFS (Click to enter Arrest Lineup)
    const cuffGroup = new THREE.Group();
    const cuff1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.02, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
    );
    cuff1.rotation.x = Math.PI / 2;
    cuffGroup.add(cuff1);
    const cuff2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.02, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
    );
    cuff2.rotation.x = Math.PI / 2;
    cuff2.position.set(0.2, 0, 0);
    cuffGroup.add(cuff2);
    cuffGroup.position.set(0.9, 1.07, 0.7);
    registerInteractive(
      'handcuffs',
      'ARREST LINEUP (Handcuff the Culprit & Trial)',
      () => onNavigate('lineup'),
      cuffGroup
    );

    // E. ROTARY TELEPHONE
    const phoneGroup = new THREE.Group();
    const phoneBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.15, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 })
    );
    phoneGroup.add(phoneBase);
    const handset = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 })
    );
    handset.rotation.z = Math.PI / 2;
    handset.position.set(0, 0.12, 0);
    phoneGroup.add(handset);
    phoneGroup.position.set(-1.2, 1.12, -0.3);
    registerInteractive(
      'phone',
      'COMMISSIONER HOTLINE (District Attorney Updates)',
      () => {
        audio.playContradiction();
        alert("COMMISSIONER CALL: 'Detective! Mayor's office wants this solved by midnight. Check the lab traits, find that magnetic deadbolt trick, and nail the doctor!'");
      },
      phoneGroup
    );

    // 8. PARTNER OFFICER JACK VANCE (3D Stylized Character Model)
    const partnerGroup = new THREE.Group();
    // Torso / Suit Jacket
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.25, 1.0, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    torso.position.y = 1.6;
    partnerGroup.add(torso);
    // Gold Police Badge on Chest
    const badge = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.1, 5),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    badge.rotation.x = Math.PI;
    badge.position.set(0.16, 1.8, 0.28);
    partnerGroup.add(badge);
    // Head / Face
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.7 })
    );
    head.position.y = 2.25;
    partnerGroup.add(head);
    // Detective Fedora Hat
    const fedoraBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    fedoraBrim.position.y = 2.4;
    partnerGroup.add(fedoraBrim);
    const fedoraCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    fedoraCrown.position.y = 2.52;
    partnerGroup.add(fedoraCrown);
    // Legs
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 1.1), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    leftLeg.position.set(-0.15, 0.55, 0);
    partnerGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 1.1), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    rightLeg.position.set(0.15, 0.55, 0);
    partnerGroup.add(rightLeg);

    partnerGroup.position.set(2.4, 0, -0.4);
    partnerGroup.rotation.y = -0.4;
    registerInteractive(
      'partner_jack',
      'OFFICER JACK VANCE (Ask for Detective Advice)',
      () => {
        audio.playStamp();
        alert("OFFICER JACK: 'Partner! Remember that Penthouse 4B had the deadbolt locked from the inside. Normal keys couldn't turn it without leaving scratches! Let's examine the evidence!'");
      },
      partnerGroup
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: '12px', overflow: 'hidden', background: '#060913', border: '2px solid #1e3a8a', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
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
          border: '1px solid #1e3a8a',
          borderRadius: '8px',
          padding: '4px',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => handleSetView('overview')}
            style={{
              background: cameraView === 'overview' ? '#3b82f6' : 'transparent',
              color: cameraView === 'overview' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🏢 Office Overview
          </button>

          <button
            onClick={() => handleSetView('desk')}
            style={{
              background: cameraView === 'desk' ? '#3b82f6' : 'transparent',
              color: cameraView === 'desk' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📁 Case Desk
          </button>

          <button
            onClick={() => handleSetView('board')}
            style={{
              background: cameraView === 'board' ? '#3b82f6' : 'transparent',
              color: cameraView === 'board' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📌 Investigation Board
          </button>
        </div>
      </div>

      {/* Top Right Quick Action Buttons */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 20
      }}>
        <button
          onClick={() => onNavigate('scene')}
          style={{
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)'
          }}
        >
          <Search size={14} />
          <span>INVESTIGATE SCENE</span>
        </button>

        <button
          onClick={() => onNavigate('lab')}
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Pipette size={14} />
          <span>CRIME LAB ({discoveredTraitsCount}/4)</span>
        </button>

        <button
          onClick={() => onNavigate('lineup')}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
          }}
        >
          <Scale size={14} />
          <span>ARREST LINEUP</span>
        </button>
      </div>

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
        <Compass size={12} color="#38bdf8" />
        <span>CLICK 3D OBJECTS TO ENTER // DRAG TO ROTATE</span>
      </div>

      {/* 3D Hover Tooltip */}
      {hoveredLabel && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.95)',
          border: '2px solid #38bdf8',
          borderRadius: '24px',
          padding: '8px 22px',
          color: '#fff',
          fontWeight: '800',
          fontSize: '0.9rem',
          letterSpacing: '0.04em',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <Sparkles size={16} color="#38bdf8" />
          <span>{hoveredLabel}</span>
        </div>
      )}
    </div>
  );
};
