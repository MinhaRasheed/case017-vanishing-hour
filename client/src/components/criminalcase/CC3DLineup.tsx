import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  Scale,
  ShieldCheck,
  AlertOctagon,
  Award,
  Star,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Compass
} from 'lucide-react';

interface Props {
  discoveredTraits: string[];
  totalScore: number;
  onReplay: () => void;
}

export const CC3DLineup: React.FC<Props> = ({ discoveredTraits, totalScore, onReplay }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('dr_eleanor_sterling');
  const [arrestStage, setArrestStage] = useState<'lineup' | 'cuffed' | 'confession' | 'courtroom' | 'closed'>('lineup');
  const [cameraView, setCameraView] = useState<'lineup' | 'close' | 'judge'>('lineup');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const suspectsGroupRef = useRef<THREE.Group | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 6.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.4, 0));
  const gavelMeshRef = useRef<THREE.Group | null>(null);

  const SUSPECTS = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      role: 'Chief Neurologist',
      isCulprit: true,
      color: 0x0284c7,
      x: -2.1
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      role: 'Building Superintendent',
      isCulprit: false,
      color: 0x1d4ed8,
      x: -0.7
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      role: 'Foundation Director',
      isCulprit: false,
      color: 0x9333ea,
      x: 0.7
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      role: 'Paparazzo Photographer',
      isCulprit: false,
      color: 0xd97706,
      x: 2.1
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060812);
    scene.fog = new THREE.FogExp2(0x060812, 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.2);
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
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 1.4, 0);
    controlsRef.current = controls;

    // 5. Build 3D Lineup Stage
    buildLineupScene(scene);

    // 6. Raycast click to select suspects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (arrestStage !== 'lineup') return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = suspectsGroupRef.current ? suspectsGroupRef.current.children : [];
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let top = intersects[0].object;
        while (top.parent && top.parent !== scene && !top.userData.suspectId) {
          top = top.parent;
        }
        if (top.userData.suspectId) {
          audio.playCardFlip();
          setSelectedSuspectId(top.userData.suspectId);
        }
      }
    };
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

      // Animate gavel strike in courtroom stage
      if (gavelMeshRef.current && arrestStage === 'courtroom') {
        const t = (Date.now() * 0.003) % Math.PI;
        gavelMeshRef.current.rotation.x = -Math.abs(Math.sin(t)) * 0.6;
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
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, []);

  // Update Spotlight focus on selected suspect
  useEffect(() => {
    if (!sceneRef.current) return;
    const spot = sceneRef.current.getObjectByName('lineupSpot') as THREE.SpotLight;
    const active = SUSPECTS.find(s => s.id === selectedSuspectId);
    if (spot && active) {
      spot.target.position.set(active.x, 1.4, 0);
    }
  }, [selectedSuspectId]);

  const handleArrest = () => {
    audio.playStamp();
    setArrestStage('cuffed');

    // Camera zooms close onto the accused suspect
    const accused = SUSPECTS.find(s => s.id === selectedSuspectId);
    if (accused) {
      targetCamPosRef.current.set(accused.x, 1.8, 2.4);
      targetLookAtRef.current.set(accused.x, 1.5, 0);
    }

    setTimeout(() => {
      if (selectedSuspectId === 'dr_eleanor_sterling') {
        audio.playContradiction();
        setArrestStage('confession');
      } else {
        alert("WRONGFUL ARREST! This suspect does not match the killer profile traits! Re-examine the traits in the Profile tab.");
        setArrestStage('lineup');
        targetCamPosRef.current.set(0, 2.5, 6.2);
        targetLookAtRef.current.set(0, 1.4, 0);
      }
    }, 1200);
  };

  const handleProceedToCourt = () => {
    audio.playStamp();
    setArrestStage('courtroom');
    // Pan camera to judge's courtroom view
    targetCamPosRef.current.set(0, 2.6, 3.4);
    targetLookAtRef.current.set(0, 1.6, -1.0);
  };

  const handleCaseClosed = () => {
    audio.playEvidenceFound();
    setArrestStage('closed');
  };

  const buildLineupScene = (scene: THREE.Scene) => {
    // Ambient
    const ambient = new THREE.AmbientLight(0x0f172a, 0.7);
    scene.add(ambient);

    // Dynamic Police Spotlight on suspect
    const spot = new THREE.SpotLight(0xef4444, 4.5, 12, Math.PI / 6, 0.2, 1.2);
    spot.name = 'lineupSpot';
    spot.position.set(0, 5, 3);
    spot.castShadow = true;
    scene.add(spot);
    scene.add(spot.target);

    // Fill Stage Lights
    const stageLight = new THREE.DirectionalLight(0xdbeafe, 1.0);
    stageLight.position.set(0, 4, 4);
    scene.add(stageLight);

    // 1. STAGE FLOOR
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. HEIGHT SCALE WALL IN BACKGROUND
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.2), wallMat);
    wall.position.set(0, 2.5, -0.6);
    scene.add(wall);

    // Height measurement lines on wall (5'0", 5'6", 6'0", 6'6")
    for (let h = 1.0; h <= 2.2; h += 0.15) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.02, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x334155 })
      );
      line.position.set(0, h, -0.48);
      scene.add(line);
    }

    // 3. NUMBERED PODIUMS ON FLOOR [1], [2], [3], [4]
    SUSPECTS.forEach((s, idx) => {
      const podium = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.44, 0.12, 24),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 })
      );
      podium.position.set(s.x, 0.06, 0);
      scene.add(podium);

      // Yellow number tile
      const numTile = new THREE.Mesh(
        new THREE.PlaneGeometry(0.2, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      numTile.rotation.x = -Math.PI / 2;
      numTile.position.set(s.x, 0.125, 0.2);
      scene.add(numTile);
    });

    // 4. SUSPECTS 3D MODELS GROUP
    const sGroup = new THREE.Group();
    suspectsGroupRef.current = sGroup;
    scene.add(sGroup);

    SUSPECTS.forEach((s, idx) => {
      const singleGroup = new THREE.Group();
      singleGroup.userData = { suspectId: s.id, suspectName: s.name };

      // Torso
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.22, 1.05, 16),
        new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.5 })
      );
      torso.position.y = 1.1;
      torso.castShadow = true;
      singleGroup.add(torso);

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 })
      );
      head.position.y = 1.82;
      head.castShadow = true;
      singleGroup.add(head);

      // Legs
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.9), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      leftLeg.position.set(-0.12, 0.45, 0);
      singleGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.9), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      rightLeg.position.set(0.12, 0.45, 0);
      singleGroup.add(rightLeg);

      // Suspect Number Placard held in front
      const placard = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.25, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
      );
      placard.position.set(0, 1.1, 0.28);
      singleGroup.add(placard);

      singleGroup.position.set(s.x, 0.12, 0);
      sGroup.add(singleGroup);
    });

    // 5. COURTROOM BENCH & 3D GAVEL (Behind Lineup Stage, revealed in court stage)
    const courtGroup = new THREE.Group();
    courtGroup.name = 'courtroomBench';
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x3b1d11, roughness: 0.3 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.3, 1.2), benchMat);
    bench.position.set(0, 0.65, -1.8);
    courtGroup.add(bench);

    // 3D Wooden Gavel
    const gavel = new THREE.Group();
    gavelMeshRef.current = gavel;
    const gHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 })
    );
    gHandle.position.y = 0.22;
    gavel.add(gHandle);
    const gHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.24, 16),
      new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.3 })
    );
    gHead.rotation.z = Math.PI / 2;
    gHead.position.y = 0.42;
    gavel.add(gHead);
    gavel.position.set(0.4, 1.35, -1.5);
    courtGroup.add(gavel);

    // Sound Block for Gavel
    const block = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.16, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0x451a03 })
    );
    block.position.set(0.4, 1.32, -1.5);
    courtGroup.add(block);

    scene.add(courtGroup);
  };

  const selectedSuspect = SUSPECTS.find(s => s.id === selectedSuspectId) || SUSPECTS[0];

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: '12px', overflow: 'hidden', background: '#060812', border: '2px solid #ef4444', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Banner */}
      <div style={{
        position: 'absolute',
        top: 14,
        left: 14,
        background: 'rgba(2, 6, 23, 0.9)',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '6px 16px',
        color: '#fca5a5',
        fontWeight: '900',
        fontSize: '0.85rem',
        letterSpacing: '0.04em',
        zIndex: 20
      }}>
        CRIMINAL DIVISION // POLICE SUSPECT LINEUP
      </div>

      {/* Suspect Selector Buttons across top */}
      {arrestStage === 'lineup' && (
        <div style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          gap: '8px',
          zIndex: 20
        }}>
          {SUSPECTS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSuspectId(s.id);
                audio.playCardFlip();
              }}
              style={{
                background: selectedSuspectId === s.id ? '#ef4444' : 'rgba(10, 15, 26, 0.85)',
                color: selectedSuspectId === s.id ? '#fff' : '#94a3b8',
                border: selectedSuspectId === s.id ? '1px solid #fecaca' : '1px solid #334155',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              #{idx + 1} {s.name}
            </button>
          ))}
        </div>
      )}

      {/* STAGE 1: ACCUSATION DOCK */}
      {arrestStage === 'lineup' && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.95)',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '16px 28px',
          textAlign: 'center',
          maxWidth: '650px',
          boxShadow: '0 0 32px rgba(239, 68, 68, 0.5)',
          zIndex: 30
        }}>
          <div style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
            SELECTED ACCUSED SUSPECT
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', margin: '2px 0 4px' }}>
            {selectedSuspect.name}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 12px' }}>
            {selectedSuspect.role} • Accuse this suspect based on the 4 forensics profile traits!
          </p>

          <button
            onClick={handleArrest}
            style={{
              background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
              color: '#fff',
              border: '2px solid #fecaca',
              borderRadius: '50px',
              padding: '10px 32px',
              fontSize: '1rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)'
            }}
          >
            <span>🔒 SLAM THE HANDCUFFS!</span>
          </button>
        </div>
      )}

      {/* STAGE 2: DR. STERLING'S CONFESSION BREAKDOWN */}
      {arrestStage === 'confession' && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.96)',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '20px 30px',
          maxWidth: '750px',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.7)',
          zIndex: 30
        }}>
          <div style={{ color: '#ef4444', fontWeight: '900', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            CRIMINAL CONFESSION // DR. ELEANOR STERLING
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '900', margin: '4px 0 8px' }}>
            "DAMN YOU, DETECTIVE! HE HAD NO RIGHT TO CANCEL MY RESEARCH!"
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 14px' }}>
            "I slipped Midazolam into Timothy's scotch at 11:30 PM. Once he lost consciousness, I loaded him into my motorized surgical gurney and slipped out via Gregory's service elevator. To make it a locked-room illusion, I used my 180-lb industrial recovery magnet from the hallway to pull the brass deadbolt into the locked position from outside! You figured out every single step..."
          </p>

          <button
            onClick={handleProceedToCourt}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '0.9rem',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            <span>Proceed to Courtroom Trial & Judge's Sentencing →</span>
          </button>
        </div>
      )}

      {/* STAGE 3: COURTROOM SENTENCING */}
      {arrestStage === 'courtroom' && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(2, 6, 23, 0.96)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '20px 30px',
          maxWidth: '750px',
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.5)',
          zIndex: 30
        }}>
          <div style={{ color: '#f59e0b', fontWeight: '900', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            SUPERIOR COURT OF JUSTICE // JUDGE THEODORE HALL PRESIDING
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '900', margin: '4px 0 8px' }}>
            "THE DEFENDANT IS FOUND GUILTY ON ALL COUNTS!"
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 14px', lineHeight: 1.5 }}>
            "Dr. Eleanor Sterling: In light of the irrefutable forensic evidence—including the magnetic deadbolt flux, Midazolam spectrometry, and codicil destruction—you are hereby sentenced to **Life Imprisonment without Parole**! Detective, exceptional work on this case!"
          </p>

          <button
            onClick={handleCaseClosed}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            <span>*GAVEL STRIKE* — CASE 017 CLOSED! →</span>
          </button>
        </div>
      )}

      {/* STAGE 4: CASE CLOSED CELEBRATION */}
      {arrestStage === 'closed' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '3px solid #10b981',
          borderRadius: '16px',
          padding: '28px 36px',
          textAlign: 'center',
          maxWidth: '550px',
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.6)',
          zIndex: 40
        }}>
          <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <Award size={64} style={{ filter: 'drop-shadow(0 0 16px #10b981)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', color: '#fff', fontWeight: '900', margin: 0 }}>
            CASE 017: SOLVED!
          </h2>
          <div style={{ color: '#fef08a', fontSize: '1.1rem', fontWeight: '800', margin: '8px 0 16px' }}>
            PERFECT POLICE COMMENDATION — GRADE S
          </div>
          <div style={{
            background: '#090d16',
            border: '1px solid #1e3a8a',
            borderRadius: '8px',
            padding: '12px 18px',
            marginBottom: '20px',
            color: '#38bdf8',
            fontSize: '1.2rem',
            fontWeight: '900',
            fontFamily: 'monospace'
          }}>
            TOTAL CASE SCORE: {totalScore.toLocaleString()} PTS
          </div>

          <button
            onClick={onReplay}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 28px',
              fontSize: '1rem',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            <span>Play Case Again / Return to HQ</span>
          </button>
        </div>
      )}

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
        <Compass size={12} color="#ef4444" />
        <span>CLICK SUSPECT IN 3D TO SELECT // DRAG TO ROTATE</span>
      </div>
    </div>
  );
};
