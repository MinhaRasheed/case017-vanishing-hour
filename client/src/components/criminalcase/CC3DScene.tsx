import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  Camera,
  Sparkles,
  Search,
  CheckCircle,
  Eye,
  Zap,
  Clock,
  Compass,
  Maximize2
} from 'lucide-react';

export interface ClueDef3D {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  found: boolean;
}

interface Props {
  foundItemIds: string[];
  onItemFound: (id: string, name: string) => void;
  hintItemId: string | null;
  isUVMode: boolean;
  onToggleUV: () => void;
}

export const CC3DScene: React.FC<Props> = ({
  foundItemIds,
  onItemFound,
  hintItemId,
  isUVMode,
  onToggleUV
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [cameraView, setCameraView] = useState<'overview' | 'table' | 'desk' | 'door' | 'hearth'>('overview');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const clueMeshesRef = useRef<{ id: string; name: string; mesh: THREE.Object3D; originalColor?: number }[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.5, 7));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 7);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 11.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go under floor
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 5. Procedural Room Construction
    build3DRoom(scene, isUVMode);

    // 6. Interactive Raycasting setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveObjects = clueMeshesRef.current.map(c => c.mesh);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topMesh = intersects[0].object;
        while (topMesh.parent && topMesh.parent !== scene && !topMesh.userData.clueId) {
          topMesh = topMesh.parent;
        }
        if (topMesh.userData.clueName) {
          setHoveredName(topMesh.userData.clueName);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredName(null);
      container.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveObjects = clueMeshesRef.current.map(c => c.mesh);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topMesh = intersects[0].object;
        while (topMesh.parent && topMesh.parent !== scene && !topMesh.userData.clueId) {
          topMesh = topMesh.parent;
        }

        const clueId = topMesh.userData.clueId;
        const clueName = topMesh.userData.clueName;
        if (clueId && clueName) {
          onItemFound(clueId, clueName);

          // Animate small pulse on the mesh
          const origScale = topMesh.scale.clone();
          topMesh.scale.multiplyScalar(1.3);
          setTimeout(() => topMesh.scale.copy(origScale), 200);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera position transitions
      if (camera && controls) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        controls.update();
      }

      // Animate hint pulse
      if (hintItemId) {
        const hinted = clueMeshesRef.current.find(c => c.id === hintItemId);
        if (hinted) {
          const s = 1 + Math.sin(Date.now() * 0.008) * 0.15;
          hinted.mesh.scale.set(s, s, s);
        }
      }

      // Rotate found markers
      clueMeshesRef.current.forEach(c => {
        const badge = c.mesh.getObjectByName(`found_badge_${c.id}`);
        if (badge) {
          badge.rotation.y += 0.025;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Update UV Lighting and Material Glow when toggled
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const ambientLight = scene.getObjectByName('ambientLight') as THREE.AmbientLight;
    const uvLight = scene.getObjectByName('uvLight') as THREE.PointLight;
    const deskLight = scene.getObjectByName('deskLight') as THREE.PointLight;

    if (ambientLight && uvLight && deskLight) {
      if (isUVMode) {
        ambientLight.color.setHex(0x1e1b4b);
        ambientLight.intensity = 0.4;
        uvLight.intensity = 4.0;
        deskLight.intensity = 0.4;
      } else {
        ambientLight.color.setHex(0x1e293b);
        ambientLight.intensity = 0.8;
        uvLight.intensity = 0.0;
        deskLight.intensity = 2.2;
      }
    }
  }, [isUVMode]);

  // Update found item visual markers (Spinning glowing green beacons)
  useEffect(() => {
    if (!sceneRef.current) return;

    foundItemIds.forEach(id => {
      const clue = clueMeshesRef.current.find(c => c.id === id);
      if (clue && !clue.mesh.getObjectByName(`found_badge_${id}`)) {
        const markerGroup = new THREE.Group();
        markerGroup.name = `found_badge_${id}`;

        const ringGeo = new THREE.RingGeometry(0.12, 0.16, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        markerGroup.add(ring);

        const diaGeo = new THREE.OctahedronGeometry(0.06);
        const diaMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.8 });
        const dia = new THREE.Mesh(diaGeo, diaMat);
        dia.position.y = 0.08;
        markerGroup.add(dia);

        markerGroup.position.set(0, 0.35, 0);
        clue.mesh.add(markerGroup);
      }
    });
  }, [foundItemIds]);

  // Handle camera preset view switches
  const handleSetView = (view: 'overview' | 'table' | 'desk' | 'door' | 'hearth') => {
    setCameraView(view);
    audio.playCardFlip();

    switch (view) {
      case 'overview':
        targetCamPosRef.current.set(0, 4.5, 7);
        targetLookAtRef.current.set(0, 1.2, 0);
        break;
      case 'table': // Coffee table with whiskey & sedative
        targetCamPosRef.current.set(0.6, 2.2, 2.4);
        targetLookAtRef.current.set(0.5, 0.7, 0.2);
        break;
      case 'desk': // Laptop, access card, phone
        targetCamPosRef.current.set(-2.2, 2.5, 1.5);
        targetLookAtRef.current.set(-2.8, 1.1, -1.0);
        break;
      case 'door': // Deadbolt & alarm keypad
        targetCamPosRef.current.set(2.8, 2.6, 2.0);
        targetLookAtRef.current.set(3.8, 1.6, -1.0);
        break;
      case 'hearth': // Fireplace with torn will
        targetCamPosRef.current.set(-0.2, 1.8, -1.2);
        targetLookAtRef.current.set(0.0, 0.8, -3.2);
        break;
    }
  };

  /**
   * PROCEDURAL 3D ROOM GENERATOR
   * Creates wood parquet floor, wainscoting, french windows, furniture, and 20+ props
   */
  const build3DRoom = (scene: THREE.Scene, uvActive: boolean) => {
    clueMeshesRef.current = [];

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);

    // Moonlight through window
    const moonLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    moonLight.position.set(0, 6, -8);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    scene.add(moonLight);

    // Warm Amber Desk Lamp Point Light
    const deskLight = new THREE.PointLight(0xf59e0b, 2.2, 7, 1.5);
    deskLight.position.set(-2.8, 2.0, -1.0);
    deskLight.castShadow = true;
    deskLight.name = 'deskLight';
    scene.add(deskLight);

    // Deep Violet UV Blacklight (toggled)
    const uvLight = new THREE.PointLight(0xa855f7, 0, 9, 1);
    uvLight.position.set(0, 3.5, 0);
    uvLight.name = 'uvLight';
    scene.add(uvLight);

    // Fireplace warm embers glow
    const fireLight = new THREE.PointLight(0xef4444, 1.0, 5, 2);
    fireLight.position.set(0, 0.8, -3.2);
    scene.add(fireLight);

    // 1. HARDWOOD PARQUET FLOOR
    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x271912,
      roughness: 0.25,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Parquet Floor Grid Planks overlay
    const gridHelper = new THREE.GridHelper(12, 24, 0x150d09, 0x150d09);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 2. WALLS
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.8 });

    // Back Wall with Fireplace & French Window
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 0.4), wallMat);
    backWall.position.set(0, 2.5, -4.5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 10), wallMat);
    leftWall.position.set(-5.5, 2.5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall (with entrance door)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 10), wallMat);
    rightWall.position.set(5.5, 2.5, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // 3. FRENCH WINDOW TO NIGHT SKYLINE
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 3.2, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    windowFrame.position.set(0, 3.0, -4.3);
    scene.add(windowFrame);

    // Distant skyscraper silhouettes through window
    const buildingMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    [-2, -0.8, 0.6, 1.8].forEach((bx, i) => {
      const bHeight = 4 + (i % 3) * 1.5;
      const building = new THREE.Mesh(new THREE.BoxGeometry(0.9, bHeight, 0.5), buildingMat);
      building.position.set(bx, bHeight / 2 - 1, -7.0);
      scene.add(building);
    });

    // 4. LARGE PERSIAN CARPET
    const carpetGeo = new THREE.PlaneGeometry(5.5, 4.0);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x6b1d1d,
      roughness: 0.9
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0.5, 0.01, 0.5);
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Gold carpet trim
    const trim = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 3.7),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 })
    );
    trim.rotation.x = -Math.PI / 2;
    trim.position.set(0.5, 0.015, 0.5);
    scene.add(trim);

    // Modern Framed Art on Left Wall
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.7, emissive: 0x0c4a6e, emissiveIntensity: 0.3 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 2.4), frameMat);
    frame.position.set(-5.3, 2.8, 1.2);
    scene.add(frame);
    const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.6, 2.2), canvasMat);
    canvas.position.set(-5.28, 2.8, 1.2);
    scene.add(canvas);

    // Potted Luxury Plant (Back-right corner)
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.6, 16), potMat);
    pot.position.set(4.2, 0.3, -3.8);
    pot.castShadow = true;
    scene.add(pot);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    for (let l = 0; l < 6; l++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), leafMat);
      leaf.scale.set(1.4, 0.2, 0.8);
      leaf.rotation.x = 0.2 + (l * 0.4);
      leaf.rotation.y = (l * Math.PI) / 3;
      leaf.position.set(4.2 + Math.cos(l) * 0.15, 0.7 + l * 0.15, -3.8 + Math.sin(l) * 0.15);
      scene.add(leaf);
    }

    // Ceiling Pendant Chandelier
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.8), lampMat);
    cord.position.set(0.5, 4.1, 0.3);
    scene.add(cord);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.3, 16, 1, true), lampMat);
    shade.position.set(0.5, 3.2, 0.3);
    shade.rotation.x = Math.PI;
    scene.add(shade);

    // Leather Briefcase tipped over near the desk
    const briefcaseMat = new THREE.MeshStandardMaterial({ color: 0x271912, roughness: 0.5 });
    const briefcase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.15), briefcaseMat);
    briefcase.position.set(-2.0, 0.1, -1.8);
    briefcase.rotation.x = Math.PI / 2;
    briefcase.rotation.z = 0.3;
    briefcase.castShadow = true;
    scene.add(briefcase);

    // Yellow Forensic Evidence Marker Cones (#1, #2, #3, #4)
    const createEvidenceCone = (num: number, x: number, y: number, z: number) => {
      const coneGroup = new THREE.Group();
      const coneGeo = new THREE.ConeGeometry(0.09, 0.18, 4);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.y = Math.PI / 4;
      coneGroup.add(cone);
      coneGroup.position.set(x, y, z);
      scene.add(coneGroup);
    };
    createEvidenceCone(1, 0.08, 0.69, 0.3); // near whiskey tumbler
    createEvidenceCone(2, 5.15, 1.25, -0.6); // near deadbolt
    createEvidenceCone(3, 0.35, 0.25, -3.6); // near hearth
    createEvidenceCone(4, -4.1, 0.65, -3.1); // near magnet

    // =========================================================================
    // 5. FURNITURE & CRIME SCENE PROPS
    // =========================================================================

    // --- COFFEE TABLE (CENTER) ---
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.08, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.6 })
    );
    tableTop.position.set(0.5, 0.6, 0.3);
    tableTop.castShadow = true;
    scene.add(tableTop);

    // Table legs
    [[-0.9, -0.4], [-0.9, 0.4], [0.9, -0.4], [0.9, 0.4]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8, roughness: 0.3 })
      );
      leg.position.set(0.5 + lx, 0.3, 0.3 + lz);
      scene.add(leg);
    });

    // --- EXECUTIVE DESK (LEFT SIDE) ---
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 1.1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.4 })
    );
    desk.position.set(-3.2, 0.55, -1.0);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    // Overturned Office Armchair (sign of struggle)
    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 })
    );
    chairSeat.position.set(-1.8, 0.4, -0.6);
    chairSeat.rotation.z = Math.PI / 3; // knocked over on side
    chairSeat.castShadow = true;
    scene.add(chairSeat);

    // --- BRICK FIREPLACE & HEARTH (BACK WALL) ---
    const mantle = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 })
    );
    mantle.position.set(0, 0.9, -4.0);
    scene.add(mantle);

    const hearthHole = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.1, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 })
    );
    hearthHole.position.set(0, 0.6, -3.8);
    scene.add(hearthHole);

    // --- BOOKSHELF WITH COLORFUL BOOKS ---
    const bookcase = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3.6, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x271912, roughness: 0.5 })
    );
    bookcase.position.set(-4.5, 1.8, -3.2);
    scene.add(bookcase);

    // Rows of 3D Books
    [-0.5, 0, 0.5, 1.0].forEach((shelfY, row) => {
      const bookColors = [0x991b1b, 0x1e3a8a, 0x065f46, 0x854d0e, 0x475569];
      for (let b = -0.6; b <= 0.6; b += 0.12) {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.35, 0.4),
          new THREE.MeshStandardMaterial({ color: bookColors[Math.abs(Math.floor(b * 10)) % bookColors.length] })
        );
        book.position.set(-4.5 + b, 1.8 + shelfY, -3.1);
        scene.add(book);
      }
    });

    // --- ENTRANCE DOOR & BRASS DEADBOLT (RIGHT WALL) ---
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 3.4, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.3 })
    );
    door.position.set(5.3, 1.7, -1.0);
    scene.add(door);

    // Door Number "4B"
    const doorSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.25, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8, roughness: 0.2 })
    );
    doorSign.position.set(5.25, 2.2, -1.0);
    scene.add(doorSign);

    // =========================================================================
    // 6. THE 10 INTERACTIVE CLUE OBJECTS (RAYCASTABLE TARGETS)
    // =========================================================================

    const registerClue = (id: string, name: string, mesh: THREE.Object3D) => {
      mesh.userData = { clueId: id, clueName: name, isClue: true };
      scene.add(mesh);
      clueMeshesRef.current.push({ id, name, mesh });
    };

    // CLUE 1: WHISKEY TUMBLER (Containing Midazolam on Coffee Table)
    const glassGroup = new THREE.Group();
    const tumbler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.6 })
    );
    tumbler.position.y = 0.1;
    glassGroup.add(tumbler);
    // Amber liquor inside
    const liquor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.07, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, transparent: true, opacity: 0.85 })
    );
    liquor.position.y = 0.07;
    glassGroup.add(liquor);
    glassGroup.position.set(0.3, 0.65, 0.3);
    registerClue('whiskey_tumbler', 'Whiskey Tumbler (Midazolam)', glassGroup);

    // CLUE 2: SEDATIVE AMPOULE (Discarded by Glass)
    const ampoule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.09, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.4 })
    );
    ampoule.rotation.z = Math.PI / 2;
    ampoule.position.set(0.6, 0.65, 0.45);
    registerClue('prescrip_vial', 'Clinical Sedative Ampoule', ampoule);

    // CLUE 3: THINKPAD LAPTOP (Open with glowing screen on Desk)
    const laptopGroup = new THREE.Group();
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.03, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 })
    );
    laptopGroup.add(laptopBase);
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.34, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, emissive: 0x0369a1, emissiveIntensity: 0.7 })
    );
    laptopScreen.position.set(0, 0.17, -0.19);
    laptopScreen.rotation.x = -0.15;
    laptopGroup.add(laptopScreen);
    laptopGroup.position.set(-2.8, 1.12, -1.0);
    registerClue('thinkpad_laptop', 'ThinkPad Laptop (Spreadsheets)', laptopGroup);

    // CLUE 4: ACCESS KEYCARD (On Desk corner)
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.01, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    card.position.set(-2.2, 1.11, -0.7);
    registerClue('access_card', 'Access Card #047B', card);

    // CLUE 5: ROLEX GOLD WATCH (On Desk)
    const watch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    watch.position.set(-3.6, 1.11, -0.9);
    registerClue('gold_watch', 'Timothy\'s Gold Rolex Watch', watch);

    // CLUE 6: HONEYWELL DIGITAL ALARM KEYPAD (On Wall beside Door)
    const keypadGroup = new THREE.Group();
    const keypadBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    keypadGroup.add(keypadBox);
    const keypadLCD = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.1, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x022c22, emissive: 0x22c55e, emissiveIntensity: 0.9 })
    );
    keypadLCD.position.set(0, 0.08, 0);
    keypadGroup.add(keypadLCD);
    keypadGroup.position.set(5.2, 1.8, 0.2);
    registerClue('alarm_keypad', 'Honeywell Keypad (11:47 Decoy)', keypadGroup);

    // CLUE 7: SCUFFED DEADBOLT LOCK (On Door Frame)
    const deadbolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.3 })
    );
    deadbolt.rotation.z = Math.PI / 2;
    deadbolt.position.set(5.24, 1.4, -0.6);
    registerClue('deadbolt_lock', 'Scuffed Deadbolt Cylinder', deadbolt);

    // CLUE 8: 180-LB NEODYMIUM MAGNET (Sitting on Lower Bookshelf)
    const magnet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.95, roughness: 0.1 })
    );
    magnet.position.set(-4.5, 0.6, -3.1);
    registerClue('neodymium_magnet', '180-lb Neodymium Recovery Magnet', magnet);

    // CLUE 9: TORN WILL FRAGMENT (Inside Fireplace Hearth)
    const willPaper = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.01, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 })
    );
    willPaper.rotation.y = 0.4;
    willPaper.position.set(0.1, 0.25, -3.7);
    registerClue('torn_will', 'Torn Will Codicil Scraps', willPaper);

    // CLUE 10: MUDDY SHOE IMPRESSION (On Persian Rug)
    const footprint = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9, transparent: true, opacity: 0.85 })
    );
    footprint.rotation.x = -Math.PI / 2;
    footprint.position.set(0.8, 0.02, 1.2);
    registerClue('muddy_footprint', 'Shoe Traction Impression', footprint);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', borderRadius: '10px', overflow: 'hidden', background: '#050811' }}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* 3D Viewport HUD: Camera Controls & Presets */}
      <div style={{
        position: 'absolute',
        top: 12,
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
          gap: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
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
            🏢 Overview
          </button>

          <button
            onClick={() => handleSetView('table')}
            style={{
              background: cameraView === 'table' ? '#3b82f6' : 'transparent',
              color: cameraView === 'table' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🥃 Coffee Table
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
            💻 Executive Desk
          </button>

          <button
            onClick={() => handleSetView('door')}
            style={{
              background: cameraView === 'door' ? '#3b82f6' : 'transparent',
              color: cameraView === 'door' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🚪 Door & Deadbolt
          </button>

          <button
            onClick={() => handleSetView('hearth')}
            style={{
              background: cameraView === 'hearth' ? '#3b82f6' : 'transparent',
              color: cameraView === 'hearth' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🧱 Fireplace
          </button>
        </div>
      </div>

      {/* UV Blacklight Toggle & 3D Orbit Tip */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 20
      }}>
        {/* UV Button */}
        <button
          onClick={onToggleUV}
          style={{
            background: isUVMode ? 'linear-gradient(135deg, #7e22ce, #a855f7)' : 'rgba(10, 15, 26, 0.85)',
            color: isUVMode ? '#fff' : '#c084fc',
            border: isUVMode ? '1px solid #e9d5ff' : '1px solid #9333ea',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isUVMode ? '0 0 16px rgba(168, 85, 247, 0.6)' : undefined
          }}
        >
          <Sparkles size={14} />
          <span>{isUVMode ? 'UV FORENSICS [ON]' : 'ENABLE UV BLACKLIGHT'}</span>
        </button>

        <div style={{
          background: 'rgba(10, 15, 26, 0.8)',
          border: '1px solid #1e293b',
          borderRadius: '6px',
          padding: '6px 12px',
          color: '#94a3b8',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Compass size={14} color="#38bdf8" />
          <span>DRAG TO ROTATE 3D // SCROLL TO ZOOM</span>
        </div>
      </div>

      {/* Interactive Hover Tooltip */}
      {hoveredName && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.9)',
          border: '2px solid #38bdf8',
          borderRadius: '24px',
          padding: '8px 20px',
          color: '#fff',
          fontWeight: '800',
          fontSize: '0.95rem',
          letterSpacing: '0.05em',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <Search size={16} color="#38bdf8" />
          <span>CLICK TO EXAMINE: {hoveredName.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
