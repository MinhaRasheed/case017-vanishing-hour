import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../game/state/GameStateContext';
import { audio } from '../../services/audioService';
import {
  Search,
  Star,
  CheckCircle,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

interface HiddenItem {
  id: string;
  name: string;
  x: number; // percentage X in scene
  y: number; // percentage Y in scene
  radius: number; // click radius in percentage
  clueReward?: string;
  revealedEvidenceId?: string;
}

const SCENE_ITEMS: HiddenItem[] = [
  { id: 'whiskey_tumbler', name: 'Whiskey Tumbler', x: 67, y: 76, radius: 6, revealedEvidenceId: 'ev_whiskey_sedative' },
  { id: 'thinkpad_laptop', name: 'ThinkPad Laptop', x: 67, y: 49, radius: 8, revealedEvidenceId: 'ev_laptop_spreadsheets' },
  { id: 'alarm_keypad', name: 'Honeywell Keypad', x: 23.5, y: 44, radius: 5, revealedEvidenceId: 'ev_alarm_timer' },
  { id: 'deadbolt_lock', name: 'Scuffed Deadbolt', x: 12, y: 56, radius: 5, revealedEvidenceId: 'ev_deadbolt_scuff' },
  { id: 'closet_hatch', name: 'Closet Hatch', x: 88, y: 46, radius: 8 },
  { id: 'torn_will', name: 'Torn Will Fragment', x: 48, y: 84, radius: 5, revealedEvidenceId: 'ev_torn_will' },
  { id: 'access_card', name: 'Access Keycard', x: 74, y: 55, radius: 4, revealedEvidenceId: 'ev_damaged_access_card' },
  { id: 'prescrip_vial', name: 'Sedative Ampoule', x: 86, y: 70, radius: 4, revealedEvidenceId: 'ev_midazolam_ampoule' },
  { id: 'gold_watch', name: 'Rolex Gold Watch', x: 62, y: 54, radius: 4 },
  { id: 'muddy_footprint', name: 'Shoe Impression', x: 38, y: 78, radius: 6, revealedEvidenceId: 'ev_carpet_wheel_treads' },
];

export const CCCrimeScene: React.FC<{ onComplete: (starsEarned: number, score: number) => void }> = ({ onComplete }) => {
  const { inspectObject } = useGame();
  const [foundItemIds, setFoundItemIds] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [comboTimeLeft, setComboTimeLeft] = useState<number>(100);
  const [floatingScores, setFloatingScores] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [hintItemId, setHintItemId] = useState<string | null>(null);
  const [hintCooldown, setHintCooldown] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Active items in the bottom dock (4 at a time)
  const remainingItems = SCENE_ITEMS.filter(item => !foundItemIds.includes(item.id));
  const activeDockItems = SCENE_ITEMS.slice(0, 8); // show up to 8 targets

  // Elapsed timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Combo decay timer
  useEffect(() => {
    if (isCompleted || combo <= 1) return;
    const interval = setInterval(() => {
      setComboTimeLeft(prev => {
        if (prev <= 0) {
          setCombo(1);
          return 100;
        }
        return prev - 8;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [combo, isCompleted]);

  // Hint cooldown timer
  useEffect(() => {
    if (hintCooldown <= 0) return;
    const t = setInterval(() => setHintCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [hintCooldown]);

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCompleted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked near an unfound target item
    const hitItem = SCENE_ITEMS.find(item => {
      if (foundItemIds.includes(item.id)) return false;
      const dx = clickX - item.x;
      const dy = clickY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= item.radius;
    });

    if (hitItem) {
      // SUCCESS HIT!
      audio.playEvidenceFound();
      const points = 10000 * combo;
      setScore(s => s + points);
      setCombo(c => Math.min(6, c + 1));
      setComboTimeLeft(100);

      const nextFound = [...foundItemIds, hitItem.id];
      setFoundItemIds(nextFound);

      // If this item unlocks clue in game engine
      if (hitItem.revealedEvidenceId) {
        inspectObject(hitItem.id);
      }

      // Add floating score text
      const newFloating = {
        id: Date.now() + Math.random(),
        text: `+${points.toLocaleString()}! ${combo > 1 ? `x${combo} COMBO!` : ''}`,
        x: hitItem.x,
        y: hitItem.y
      };
      setFloatingScores(prev => [...prev, newFloating]);
      setTimeout(() => {
        setFloatingScores(prev => prev.filter(f => f.id !== newFloating.id));
      }, 1200);

      // Clear hint if that item was hinted
      if (hintItemId === hitItem.id) setHintItemId(null);

      // Check win condition
      if (nextFound.length >= SCENE_ITEMS.length) {
        audio.playStamp();
        setIsCompleted(true);
      }
    } else {
      // Misclick penalty
      audio.playDullClick();
      setCombo(1);
      setComboTimeLeft(0);
    }
  };

  const handleUseHint = () => {
    if (hintCooldown > 0 || isCompleted) return;
    const unfound = SCENE_ITEMS.find(i => !foundItemIds.includes(i.id));
    if (unfound) {
      audio.playStamp();
      setHintItemId(unfound.id);
      setHintCooldown(15);
      setTimeout(() => setHintItemId(null), 5000);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Crime Scene Top Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '900', margin: 0 }}>
            CRIME SCENE #01: PENTHOUSE 4B
          </h2>
          <span style={{
            background: '#1e3a8a',
            color: '#93c5fd',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            {foundItemIds.length} / {SCENE_ITEMS.length} CLUES FOUND
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Time Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem', fontFamily: 'monospace' }}>
            <Clock size={16} />
            <span>00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}</span>
          </div>

          {/* Current Scene Score */}
          <div style={{
            background: '#090d16',
            border: '2px solid #38bdf8',
            borderRadius: '20px',
            padding: '4px 16px',
            color: '#38bdf8',
            fontWeight: '900',
            fontFamily: 'monospace',
            fontSize: '1.1rem'
          }}>
            {score.toLocaleString()} PTS
          </div>
        </div>
      </div>

      {/* Main Crime Scene Graphic Canvas */}
      <div className="cc-scene-wrapper" onClick={handleSceneClick} style={{ cursor: 'crosshair', minHeight: '480px' }}>
        {/* Combo Multiplier Bar at Top Center */}
        {combo > 1 && (
          <div className="cc-combo-bar-container">
            <div style={{ color: '#f59e0b', fontWeight: '900', fontSize: '0.9rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={16} /> COMBO x{combo}
            </div>
            <div className="cc-combo-meter">
              <div className="cc-combo-fill" style={{ width: `${comboTimeLeft}%` }} />
            </div>
          </div>
        )}

        {/* Vector Crime Scene SVG */}
        <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: 'block', pointerEvents: 'none' }}>
          <defs>
            <radialGradient id="lampGlowCC" cx="65%" cy="35%" r="45%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="parquetCC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c140e" />
              <stop offset="100%" stopColor="#0a0705" />
            </linearGradient>
          </defs>

          {/* Room Walls & Floor */}
          <rect width="1000" height="350" fill="#111622" />
          <line x1="0" y1="350" x2="1000" y2="350" stroke="#1e293b" strokeWidth="3" />
          <rect y="350" width="1000" height="150" fill="url(#parquetCC)" />

          {/* Floorboard lines */}
          <g stroke="#261c14" strokeWidth="1">
            <line x1="0" y1="350" x2="0" y2="500" />
            <line x1="150" y1="350" x2="100" y2="500" />
            <line x1="300" y1="350" x2="280" y2="500" />
            <line x1="500" y1="350" x2="500" y2="500" />
            <line x1="700" y1="350" x2="720" y2="500" />
            <line x1="850" y1="350" x2="900" y2="500" />
            <line x1="1000" y1="350" x2="1000" y2="500" />
          </g>

          {/* Rain Streaked French Windows with Manhattan View */}
          <rect x="350" y="40" width="220" height="260" fill="#020617" stroke="#334155" strokeWidth="8" rx="4" />
          <line x1="460" y1="40" x2="460" y2="300" stroke="#334155" strokeWidth="4" />
          <line x1="350" y1="170" x2="570" y2="170" stroke="#334155" strokeWidth="4" />
          {/* Distant illuminated city towers */}
          <rect x="370" y="110" width="30" height="180" fill="#0f172a" />
          <rect x="420" y="80" width="45" height="210" fill="#1e293b" />
          <rect x="480" y="130" width="40" height="160" fill="#0f172a" />
          <rect x="530" y="100" width="30" height="190" fill="#1e293b" />

          {/* Locked Solid Oak Door 4B on Left */}
          <rect x="60" y="100" width="120" height="250" fill="#291a10" stroke="#451a03" strokeWidth="6" rx="3" />
          <circle cx="120" cy="280" r="14" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
          <text x="120" y="140" fill="#d97706" fontSize="16" fontFamily="serif" fontWeight="bold" textAnchor="middle">4B</text>

          {/* Honeywell Digital Alarm Panel */}
          <rect x="215" y="190" width="40" height="55" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="3" />
          <rect x="220" y="196" width="30" height="16" fill="#022c22" />
          <text x="235" y="208" fill="#4ade80" fontSize="7" fontFamily="monospace" textAnchor="middle">11:47</text>
          <circle cx="225" cy="220" r="2" fill="#94a3b8" />
          <circle cx="235" cy="220" r="2" fill="#94a3b8" />
          <circle cx="245" cy="220" r="2" fill="#94a3b8" />
          <circle cx="225" cy="230" r="2" fill="#94a3b8" />
          <circle cx="235" cy="230" r="2" fill="#94a3b8" />
          <circle cx="245" cy="230" r="2" fill="#ef4444" />

          {/* Workstation Desk & Open Laptop */}
          <rect x="580" y="270" width="200" height="15" fill="#3b2314" stroke="#54331d" strokeWidth="2" rx="2" />
          <line x1="600" y1="285" x2="600" y2="420" stroke="#26170d" strokeWidth="8" />
          <line x1="760" y1="285" x2="760" y2="420" stroke="#26170d" strokeWidth="8" />
          <polygon points="630,270 710,270 720,282 620,282" fill="#1e293b" />
          <rect x="630" y="210" width="80" height="60" fill="#0f172a" stroke="#334155" strokeWidth="2" rx="2" />
          <rect x="634" y="214" width="72" height="52" fill="#0284c7" opacity="0.85" />
          <circle cx="620" cy="270" r="4" fill="#fbbf24" stroke="#d97706" />

          {/* Access Card on Desk */}
          <rect x="730" y="272" width="20" height="12" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1" rx="2" />

          {/* Coffee Table with Whiskey Glass and Ampoule */}
          <ellipse cx="670" cy="380" rx="90" ry="32" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          {/* Whiskey Tumbler */}
          <path d="M 660 365 L 680 365 L 678 395 L 662 395 Z" fill="#d97706" opacity="0.85" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="664" y="375" width="5" height="5" fill="#fef08a" opacity="0.7" />
          {/* Ampoule */}
          <rect x="690" y="380" width="4" height="14" rx="2" fill="#38bdf8" stroke="#fff" strokeWidth="0.8" />

          {/* Persian Area Rug with Footprint */}
          <ellipse cx="380" cy="400" rx="140" ry="50" fill="#7f1d1d" stroke="#991b1b" strokeWidth="3" />
          <ellipse cx="380" cy="400" rx="120" ry="40" fill="#450a0a" />
          {/* Muddy Shoe Impression on Rug */}
          <ellipse cx="380" cy="390" rx="12" ry="24" fill="#1c1917" opacity="0.8" />
          <ellipse cx="380" cy="415" rx="8" ry="10" fill="#1c1917" opacity="0.8" />

          {/* Hearth with Torn Will Scraps */}
          <rect x="440" y="410" width="80" height="25" fill="#020617" stroke="#334155" strokeWidth="2" rx="4" />
          <polygon points="460,418 475,415 470,428 458,425" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
          <polygon points="480,417 495,419 492,428 478,426" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />

          {/* Closet Panel on Right */}
          <rect x="830" y="120" width="110" height="230" fill="#1e1812" stroke="#382517" strokeWidth="4" />
          <rect x="850" y="270" width="70" height="70" fill="#0f172a" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />

          {/* Found Items Halo Rings */}
          {foundItemIds.map(fId => {
            const it = SCENE_ITEMS.find(i => i.id === fId);
            if (!it) return null;
            return (
              <g key={it.id}>
                <circle cx={it.x * 10} cy={it.y * 5} r={it.radius * 6} fill="none" stroke="#10b981" strokeWidth="3" opacity="0.8" />
                <circle cx={it.x * 10} cy={it.y * 5} r="6" fill="#10b981" />
              </g>
            );
          })}

          {/* Hint Pulsing Halo */}
          {hintItemId && (() => {
            const hItem = SCENE_ITEMS.find(i => i.id === hintItemId);
            if (!hItem) return null;
            return (
              <g>
                <circle cx={hItem.x * 10} cy={hItem.y * 5} r={hItem.radius * 9} fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 4" />
                <circle cx={hItem.x * 10} cy={hItem.y * 5} r={hItem.radius * 5} fill="rgba(245, 158, 11, 0.3)" />
              </g>
            );
          })()}
        </svg>

        {/* Floating Score Popups */}
        {floatingScores.map(f => (
          <div
            key={f.id}
            className="cc-floating-score"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* Criminal Case Item Target Dock */}
      <div className="cc-search-dock" style={{ maxWidth: '1200px', margin: '0 auto', borderRadius: '0 0 12px 12px' }}>
        {/* Active Target Word Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          {activeDockItems.map(item => {
            const isFound = foundItemIds.includes(item.id);
            const isHinted = hintItemId === item.id;
            return (
              <div
                key={item.id}
                className={`cc-item-word-card ${isFound ? 'found' : ''}`}
                style={{
                  border: isHinted ? '2px solid #f59e0b' : undefined,
                  boxShadow: isHinted ? '0 0 14px #f59e0b' : undefined
                }}
              >
                {isFound && <CheckCircle size={16} color="#10b981" />}
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>

        {/* Magnifying Glass Hint Button */}
        <div>
          <button
            onClick={handleUseHint}
            disabled={hintCooldown > 0 || isCompleted}
            style={{
              background: hintCooldown > 0 ? '#334155' : 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
              color: hintCooldown > 0 ? '#94a3b8' : '#000',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 22px',
              fontWeight: '900',
              fontSize: '0.85rem',
              cursor: hintCooldown > 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: hintCooldown > 0 ? 'none' : '0 0 16px rgba(245, 158, 11, 0.5)'
            }}
          >
            <Search size={18} />
            <span>{hintCooldown > 0 ? `${hintCooldown}s` : 'HINT'}</span>
          </button>
        </div>
      </div>

      {/* Victory / Scene Complete Modal */}
      {isCompleted && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              maxWidth: '550px',
              textAlign: 'center',
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
              border: '3px solid #f59e0b',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.4)'
            }}
          >
            <div className="cc-star-earned" style={{ marginBottom: '14px' }}>
              <Star size={64} fill="#f59e0b" color="#fef08a" style={{ filter: 'drop-shadow(0 0 16px #f59e0b)' }} />
            </div>

            <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '900', margin: 0 }}>
              SCENE INVESTIGATION COMPLETE!
            </h2>
            <p style={{ color: '#93c5fd', fontSize: '0.95rem', margin: '6px 0 20px' }}>
              All 10 hidden forensic artifacts cataloged from Penthouse 4B!
            </p>

            {/* Score Tally Board */}
            <div style={{
              background: '#090d16',
              border: '1px solid #1e3a8a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#cbd5e1' }}>
                <span>Base Investigation Score:</span>
                <strong style={{ color: '#fff' }}>100,000 PTS</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#cbd5e1' }}>
                <span>Speed & Combo Bonus:</span>
                <strong style={{ color: '#f59e0b' }}>+{(score).toLocaleString()} PTS</strong>
              </div>
              <div style={{
                borderTop: '1px solid #334155',
                paddingTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: '900',
                color: '#38bdf8'
              }}>
                <span>TOTAL INVESTIGATION SCORE:</span>
                <span>{(100000 + score).toLocaleString()} PTS</span>
              </div>
            </div>

            {/* Police Star Earned */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Star size={24} fill="#f59e0b" color="#fef08a" />
              <span style={{ color: '#fef08a', fontWeight: '800', fontSize: '1.1rem' }}>
                YOU EARNED +2 POLICE STARS!
              </span>
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: '800',
                background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
              }}
              onClick={() => onComplete(2, 100000 + score)}
            >
              <span>Spend Stars on Case Tasks & Crime Lab →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
