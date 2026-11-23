import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { audio } from '../../services/audioService';
import {
  MessageSquare,
  Scale,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Camera
} from 'lucide-react';

interface Props {
  onGoToLineup: () => void;
}

export const CC3DInterrogation: React.FC<Props> = ({ onGoToLineup }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeSuspectId, setActiveSuspectId] = useState<string>('dr_eleanor_sterling');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [cameraView, setCameraView] = useState<'table' | 'suspect' | 'wide'>('table');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const suspectModelGroupRef = useRef<THREE.Group | null>(null);
  const swingingLampRef = useRef<THREE.Group | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.3, 3.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, -0.4));

  const SUSPECTS = [
    {
      id: 'dr_eleanor_sterling',
      name: 'Dr. Eleanor Sterling',
      role: 'Chief Neurologist & Primary Physician',
      avatarColor: 0x0284c7,
      dialogue: [
        {
          q: 'Detective: "Dr. Sterling, what is your official account of your visit to Penthouse 4B tonight?"',
          a: '"I arrived at 11:10 PM for a private consultation regarding Timothy\'s tremors. We had a brief glass of scotch, reviewed his chart, and I left at 11:30 PM sharp. He was alive and well."'
        },
        {
          q: 'Detective: "Did you know Timothy was executing an amendment revoking your $40M research grant?"',
          a: '"(Clenches jaw) Timothy was eccentric and made impetuous decisions when delirious! But to suggest I would harm him over philanthropy is insulting, Detective."'
        },
        {
          q: 'Detective: "How do you explain the clinical Midazolam sedative discovered in his scotch tumbler?"',
          a: '"Midazolam is a standard clinical sedative. I prescribe it, but I certainly didn\'t administer it into his liquor! Anyone with hospital access could have stolen an ampoule!"'
        }
      ]
    },
    {
      id: 'gregory_vance',
      name: 'Gregory Vance',
      role: 'Building Super & Maintenance Chief',
      avatarColor: 0x1d4ed8,
      dialogue: [
        {
          q: 'Detective: "Mr. Vance, where were you when the 11:47 PM panic alarm was triggered?"',
          a: '"I was down in the basement workshop sorting circuit breakers! I heard the siren on the annunciator panel and took the service lift up immediately. The door was locked from inside!"'
        },
        {
          q: 'Detective: "Why was your master maintenance keycard used at the freight elevator at 11:44 PM?"',
          a: '"Look, I... I might have lent it to someone, okay? Dr. Sterling asked to use the service lift to move some heavy medical monitors down to the loading bay. She slipped me five grand in cash!"'
        }
      ]
    },
    {
      id: 'corinne_blake',
      name: 'Corinne Blake',
      role: 'Philanthropist & Foundation Director',
      avatarColor: 0x9333ea,
      dialogue: [
        {
          q: 'Detective: "Ms. Blake, your monogrammed umbrella was found dripping in the main lobby."',
          a: '"Yes, I arrived at 11:20 PM to receive Timothy\'s executed trust deed for the shelter. But Gregory told me Timothy was in a private medical session and turned me away. I waited in the lobby until the alarm went off."'
        }
      ]
    },
    {
      id: 'toby_ray',
      name: 'Toby Ray',
      role: 'Paparazzo Photographer',
      avatarColor: 0xd97706,
      dialogue: [
        {
          q: 'Detective: "Toby, why were you caught staking out Penthouse 4B from the rooftop fire escape?"',
          a: '"I had a tip that Timothy Vance was signing over forty million dollars tonight! Through my telephoto lens at 11:32 PM, I saw Dr. Sterling handing him a tumbler. Three minutes later, he slumped forward completely limp!"'
        }
      ]
    }
  ];

  const currentSuspect = SUSPECTS.find(s => s.id === activeSuspectId) || SUSPECTS[0];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060a);
    scene.fog = new THREE.FogExp2(0x05060a, 0.05);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.3, 3.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
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
    controls.minDistance = 1.6;
    controls.maxDistance = 8.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 1.2, -0.4);
    controlsRef.current = controls;

    // 5. Build 3D Interrogation Room
    buildInterrogationScene(scene);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (camera && controls) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        controls.update();
      }

      // Gentle swinging of overhead interrogation lamp
      if (swingingLampRef.current) {
        const t = Date.now() * 0.0015;
        swingingLampRef.current.rotation.z = Math.sin(t) * 0.05;
        swingingLampRef.current.rotation.x = Math.cos(t * 0.7) * 0.03;
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
      renderer.dispose();
    };
  }, []);

  // Update suspect 3D model whenever activeSuspectId changes
  useEffect(() => {
    if (!sceneRef.current || !suspectModelGroupRef.current) return;
    updateSuspect3DModel(activeSuspectId);
  }, [activeSuspectId]);

  const handleSetView = (view: 'table' | 'suspect' | 'wide') => {
    setCameraView(view);
    audio.playCardFlip();
    if (view === 'table') {
      targetCamPosRef.current.set(0, 2.3, 3.2);
      targetLookAtRef.current.set(0, 1.2, -0.4);
    } else if (view === 'suspect') {
      targetCamPosRef.current.set(0.4, 1.8, 1.0);
      targetLookAtRef.current.set(0, 1.45, -0.7);
    } else if (view === 'wide') {
      targetCamPosRef.current.set(-2.8, 3.0, 4.2);
      targetLookAtRef.current.set(0, 1.2, 0);
    }
  };

  const handleSelectQuestion = (idx: number) => {
    audio.playTypewriter();
    setCurrentQuestionIdx(idx);
    // Smooth camera cut to suspect's face when questioned
    handleSetView('suspect');
  };

  const buildInterrogationScene = (scene: THREE.Scene) => {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x0f172a, 0.4);
    scene.add(ambient);

    // One-way observation mirror blue back glow
    const mirrorLight = new THREE.DirectionalLight(0x1e3a8a, 1.2);
    mirrorLight.position.set(0, 2.5, -4.0);
    scene.add(mirrorLight);

    // 1. CONCRETE FLOOR
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. CONCRETE CINDERBLOCK WALLS
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x11131a, roughness: 0.95 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.3), wallMat);
    backWall.position.set(0, 2.5, -3.5);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    leftWall.position.set(-4.5, 2.5, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 10), wallMat);
    rightWall.position.set(4.5, 2.5, 0);
    scene.add(rightWall);

    // 3. ONE-WAY OBSERVATION GLASS MIRROR ON BACK WALL
    const mirrorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.2, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 })
    );
    mirrorFrame.position.set(0, 2.4, -3.35);
    scene.add(mirrorFrame);

    const mirrorGlass = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.0, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1, emissive: 0x1e3a8a, emissiveIntensity: 0.25 })
    );
    mirrorGlass.position.set(0, 2.4, -3.3);
    scene.add(mirrorGlass);

    // 4. HEAVY STEEL INTERROGATION TABLE
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.4), tableMat);
    tableTop.position.set(0, 0.95, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Bolted Steel Table Legs
    [[-1.0, -0.5], [-1.0, 0.5], [1.0, -0.5], [1.0, 0.5]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95), tableMat);
      leg.position.set(lx, 0.47, lz);
      scene.add(leg);
    });

    // 5. OVERHEAD SWINGING INDUSTRIAL LAMP
    const lampRig = new THREE.Group();
    swingingLampRef.current = lampRig;
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x020617 })
    );
    cord.position.y = 3.6;
    lampRig.add(cord);

    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.3, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 })
    );
    shade.position.y = 2.6;
    shade.rotation.x = Math.PI;
    lampRig.add(shade);

    // Harsh Warm Interrogation Spotlight
    const spot = new THREE.SpotLight(0xfef08a, 4.0, 8, Math.PI / 4, 0.3, 1.2);
    spot.position.y = 2.5;
    spot.target.position.set(0, 0.95, -0.2);
    spot.castShadow = true;
    lampRig.add(spot);
    lampRig.add(spot.target);

    scene.add(lampRig);

    // 6. PROPS ON INTERROGATION TABLE:
    // Coffee cup for detective
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
    );
    mug.position.set(-0.6, 1.05, 0.4);
    scene.add(mug);

    // Evidence Manila Folder
    const folder = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.02, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 })
    );
    folder.position.set(0.4, 1.0, 0.3);
    folder.rotation.y = 0.2;
    scene.add(folder);

    // Steel Chair on Suspect's Side (back side of table)
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.7), chairMat);
    chairSeat.position.set(0, 0.6, -0.8);
    scene.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.08), chairMat);
    chairBack.position.set(0, 1.05, -1.1);
    scene.add(chairBack);

    // 7. SUSPECT 3D MODEL GROUP
    const suspectGroup = new THREE.Group();
    suspectModelGroupRef.current = suspectGroup;
    scene.add(suspectGroup);
    updateSuspect3DModel(activeSuspectId);
  };

  const updateSuspect3DModel = (id: string) => {
    if (!suspectModelGroupRef.current) return;
    const group = suspectModelGroupRef.current;
    group.clear();

    const suspect = SUSPECTS.find(s => s.id === id) || SUSPECTS[0];

    // Seated Torso
    const torsoColor = id === 'dr_eleanor_sterling' ? 0xf8fafc : id === 'gregory_vance' ? 0x1e3a8a : id === 'corinne_blake' ? 0x581c87 : 0x78350f;
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.26, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: torsoColor, roughness: 0.6 })
    );
    torso.position.set(0, 1.15, -0.75);
    torso.castShadow = true;
    group.add(torso);

    // Head / Face
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 })
    );
    head.position.set(0, 1.75, -0.75);
    head.castShadow = true;
    group.add(head);

    // Suspect Hair
    const hairColor = id === 'dr_eleanor_sterling' ? 0x451a03 : id === 'gregory_vance' ? 0x475569 : id === 'corinne_blake' ? 0xb45309 : 0x18181b;
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 })
    );
    hair.position.set(0, 1.84, -0.8);
    group.add(hair);

    // Glasses for Dr. Sterling
    if (id === 'dr_eleanor_sterling') {
      const glasses = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.015, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 })
      );
      glasses.position.set(0, 1.76, -0.56);
      group.add(glasses);
    }

    // Camera Strap for Toby Ray
    if (id === 'toby_ray') {
      const strap = new THREE.Mesh(
        new THREE.TorusGeometry(0.26, 0.02, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0x09090b })
      );
      strap.rotation.x = Math.PI / 3;
      strap.position.set(0, 1.45, -0.65);
      group.add(strap);
    }

    // Seated Legs
    const legs = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.2, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
    );
    legs.position.set(0, 0.7, -0.55);
    group.add(legs);

    // Arms resting on table
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.6),
      new THREE.MeshStandardMaterial({ color: torsoColor })
    );
    leftArm.rotation.x = Math.PI / 3;
    leftArm.position.set(-0.35, 1.1, -0.4);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.6),
      new THREE.MeshStandardMaterial({ color: torsoColor })
    );
    rightArm.rotation.x = Math.PI / 3;
    rightArm.position.set(0.35, 1.1, -0.4);
    group.add(rightArm);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: '12px', overflow: 'hidden', background: '#05060a', border: '2px solid #ef4444', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Left Camera Angle Switcher */}
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
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '4px',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => handleSetView('table')}
            style={{
              background: cameraView === 'table' ? '#ef4444' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            👥 Interrogation Table
          </button>

          <button
            onClick={() => handleSetView('suspect')}
            style={{
              background: cameraView === 'suspect' ? '#ef4444' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🧐 Suspect Close-Up
          </button>

          <button
            onClick={() => handleSetView('wide')}
            style={{
              background: cameraView === 'wide' ? '#ef4444' : 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📹 Observation Gallery
          </button>
        </div>
      </div>

      {/* Top Suspect Selector Tabs */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 20
      }}>
        {SUSPECTS.map(s => {
          const isActive = s.id === activeSuspectId;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveSuspectId(s.id);
                setCurrentQuestionIdx(0);
                audio.playCardFlip();
                handleSetView('suspect');
              }}
              style={{
                background: isActive ? '#ef4444' : 'rgba(10, 15, 26, 0.85)',
                color: isActive ? '#fff' : '#94a3b8',
                border: isActive ? '1px solid #fecaca' : '1px solid #334155',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {s.name}
            </button>
          );
        })}

        <button
          onClick={onGoToLineup}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: '900',
            cursor: 'pointer',
            marginLeft: '6px'
          }}
        >
          <span>ARREST →</span>
        </button>
      </div>

      {/* Cinematic Dialogue Subtitle Box at Bottom */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '900px',
        background: 'rgba(2, 6, 23, 0.95)',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 0 30px rgba(0,0,0,0.8)',
        zIndex: 30
      }}>
        {/* Suspect Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ color: '#ef4444', fontWeight: '900', fontSize: '0.95rem' }}>
              {currentSuspect.name.toUpperCase()}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px' }}>
              ({currentSuspect.role})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {currentSuspect.dialogue.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuestion(idx)}
                style={{
                  background: currentQuestionIdx === idx ? '#ef4444' : '#1e293b',
                  color: currentQuestionIdx === idx ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Q&A */}
        <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '6px', fontFamily: 'monospace' }}>
          {currentSuspect.dialogue[currentQuestionIdx]?.q}
        </div>
        <div style={{
          color: '#fef08a',
          fontSize: '0.95rem',
          lineHeight: 1.45,
          fontStyle: 'italic',
          background: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '3px solid #ef4444',
          padding: '8px 12px',
          borderRadius: '0 6px 6px 0'
        }}>
          {currentSuspect.dialogue[currentQuestionIdx]?.a}
        </div>
      </div>
    </div>
  );
};
