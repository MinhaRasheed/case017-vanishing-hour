import React, { useState, useRef } from 'react';
import { useGame } from '../../game/state/GameStateContext';
import { CharacterPortrait } from '../graphics/CharacterPortraits';
import { audio } from '../../services/audioService';
import {
  Sparkles,
  CheckCircle,
  X,
  Scan,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const FingerprintDustingModal: React.FC<Props> = ({ onClose }) => {
  const { gameState, completeMiniGame, completeTask } = useGame();
  const [dustProgress, setDustProgress] = useState<number>(gameState.miniGamesCompleted?.fingerprint ? 100 : 0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [matchedSuspect, setMatchedSuspect] = useState<string | null>(
    gameState.miniGamesCompleted?.fingerprint ? 'dr_eleanor_sterling' : null
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dustProgress >= 100 || isScanning || matchedSuspect) return;
    if (e.buttons === 1) { // Left click held and dragged
      audio.playDropperSound();
      setDustProgress(prev => {
        const next = Math.min(100, prev + 5);
        if (next >= 100) {
          triggerBiometricScan();
        }
        return next;
      });
    }
  };

  const triggerBiometricScan = () => {
    audio.playStamp();
    setIsScanning(true);
    setTimeout(() => {
      audio.playContradiction();
      setIsScanning(false);
      setMatchedSuspect('dr_eleanor_sterling');
      completeMiniGame('fingerprint');
      completeTask('task_dust_fingerprint');
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '780px', background: '#0a0d14', border: '2px solid #38bdf8' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scan size={24} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                FORENSICS LAB: LATENT FINGERPRINT DUSTING
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                Item #01B: Deadbolt Exterior Brass Escutcheon (Penthouse 4B)
              </p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Instructions banner */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid #0284c7',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#bae6fd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span>
            {matchedSuspect
              ? '✓ Fingerprint dusted and matched against City Biometrics Database.'
              : 'CLICK AND DRAG across the brass cylinder plate to dust charcoal powder and reveal latent ridges!'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#38bdf8' }}>
            DUST PROGRESS: {dustProgress}%
          </span>
        </div>

        {/* Dusting Canvas & Lock Plate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Interactive Surface */}
          <div
            onMouseMove={handleMouseMove}
            onMouseDown={() => {
              if (dustProgress < 100) {
                setDustProgress(prev => Math.min(100, prev + 10));
                audio.playDropperSound();
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '280px',
              background: '#1c1917',
              border: '3px solid #78350f',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: dustProgress >= 100 ? 'default' : 'crosshair',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)'
            }}
          >
            {/* Brass Plate Illustration */}
            <svg width="100%" height="100%" viewBox="0 0 300 240">
              {/* Heavy Brass escutcheon cylinder */}
              <circle cx="150" cy="120" r="90" fill="#b45309" stroke="#d97706" strokeWidth="6" />
              <circle cx="150" cy="120" r="75" fill="#78350f" stroke="#92400e" strokeWidth="2" />
              {/* Keyway */}
              <circle cx="150" cy="110" r="18" fill="#1c1917" />
              <rect x="146" y="110" width="8" height="35" fill="#1c1917" />

              {/* Latent Fingerprint (Opacifies as dusted) */}
              <g opacity={dustProgress / 100} filter="drop-shadow(0 0 6px #38bdf8)">
                {/* Whorl and loop ridges */}
                <ellipse cx="145" cy="85" rx="14" ry="18" fill="none" stroke="#e0f2fe" strokeWidth="2.5" />
                <ellipse cx="145" cy="85" rx="22" ry="26" fill="none" stroke="#e0f2fe" strokeWidth="2" />
                <ellipse cx="145" cy="85" rx="30" ry="34" fill="none" stroke="#e0f2fe" strokeWidth="1.8" />
                <path d="M 125 105 Q 145 130 165 105" fill="none" stroke="#e0f2fe" strokeWidth="1.8" />
                <path d="M 118 112 Q 145 142 172 112" fill="none" stroke="#e0f2fe" strokeWidth="1.8" />
              </g>

              {/* Carbon Dust Layer covering */}
              <rect
                width="300"
                height="240"
                fill="#0c0a09"
                opacity={Math.max(0, 0.85 - dustProgress / 120)}
                pointerEvents="none"
              />
            </svg>

            {dustProgress < 100 && (
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#facc15',
                fontFamily: 'var(--font-mono)'
              }}>
                [SWIPE BRUSH HERE]
              </div>
            )}
          </div>

          {/* Biometric Scanner / Result Panel */}
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: isScanning ? '#eab308' : matchedSuspect ? '#10b981' : '#94a3b8',
                marginBottom: '10px'
              }}>
                <Zap size={16} />
                <span>
                  {isScanning
                    ? 'AFIS DATABASE SCANNING...'
                    : matchedSuspect
                    ? 'BIOMETRIC MATCH IDENTIFIED (99.8%)'
                    : 'AWAITING RIDGE REVELATION'}
                </span>
              </div>

              {isScanning && (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    margin: '0 auto 12px',
                    border: '4px solid #38bdf8',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spinReel 0.8s linear infinite'
                  }} />
                  <p style={{ color: '#bae6fd', fontSize: '0.85rem' }}>Comparing whorl minituae against 4 suspect profiles...</p>
                </div>
              )}

              {matchedSuspect && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '6px',
                  padding: '14px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  animation: 'fadeInModal 0.3s ease-out'
                }}>
                  <CharacterPortrait id="dr_eleanor_sterling" size={65} showBadge={false} />
                  <div>
                    <span className="stamp stamp-red" style={{ fontSize: '0.65rem' }}>CRITICAL PROOF</span>
                    <h4 style={{ color: '#fff', margin: '4px 0 2px', fontSize: '0.95rem' }}>Dr. Eleanor Sterling</h4>
                    <p style={{ color: '#a7f3d0', fontSize: '0.75rem', margin: 0, lineHeight: 1.4 }}>
                      Right Index Finger whorl matched. Confirms she touched the exterior lock collar after the apartment was locked!
                    </p>
                  </div>
                </div>
              )}

              {!isScanning && !matchedSuspect && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  The perpetrator supposedly vanished from a room locked from the inside. Dust the deadbolt to find who touched the exterior lock mechanism!
                </p>
              )}
            </div>

            {/* Quick button to auto-reveal if on tablet/touch */}
            {dustProgress < 100 && (
              <button
                className="btn-secondary"
                style={{ fontSize: '0.8rem', marginTop: '10px' }}
                onClick={() => {
                  setDustProgress(100);
                  triggerBiometricScan();
                }}
              >
                Dust Automatically →
              </button>
            )}

            {matchedSuspect && (
              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '12px' }}
                onClick={onClose}
              >
                <span>Add Latent Print to Evidence Locker</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
