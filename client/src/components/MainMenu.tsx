import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import {
  FolderLock,
  Play,
  RotateCcw,
  HelpCircle,
  Clock,
  Shield,
  FileText,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

export const MainMenu: React.FC = () => {
  const {
    gameState,
    caseBundle,
    setScreen,
    restartCase,
    toggleAudioMute,
    toggleAmbientMusic
  } = useGame();

  const [showManual, setShowManual] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);

  const hasProgress = gameState.discoveredEvidenceIds.length > 0;

  const handleStartNew = () => {
    restartCase();
    setScreen('briefing');
  };

  const handleResume = () => {
    setScreen('dashboard');
  };

  const handleToggleMusic = () => {
    toggleAmbientMusic();
    setAmbientActive(!ambientActive);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Top Controls */}
      <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 12 }}>
        <button
          className={`icon-btn ${ambientActive ? 'active' : ''}`}
          onClick={handleToggleMusic}
          title="Toggle Noir Soundscape"
        >
          <Music size={18} />
        </button>
        <button
          className="icon-btn"
          onClick={toggleAudioMute}
          title={gameState.soundMuted ? 'Unmute' : 'Mute'}
        >
          {gameState.soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Main Dossier Folder */}
      <div style={{
        maxWidth: '820px',
        width: '100%',
        background: '#161922',
        border: '1px solid #334155',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(230, 57, 70, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top Folder Tab Header */}
        <div style={{
          background: '#0f172a',
          borderBottom: '2px solid #e63946',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FolderLock color="#e63946" size={24} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: '#f59e0b',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              fontWeight: '700'
            }}>
              METROPOLITAN FORENSIC BUREAU // ACTIVE DOSSIER
            </span>
          </div>
          <span className="stamp stamp-red">RESTRICTED ACCESS</span>
        </div>

        {/* Content Body */}
        <div style={{ padding: '36px 32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-red)',
              fontSize: '0.95rem',
              fontWeight: '700',
              letterSpacing: '0.12em',
              marginBottom: '6px'
            }}>
              CASE: {caseBundle.case.caseNumber}
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#f8fafc',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '10px'
            }}>
              {caseBundle.case.title}
            </h1>
            <h2 style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              fontWeight: '400'
            }}>
              {caseBundle.case.subtitle}
            </h2>
          </div>

          {/* Case Teaser Card */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #1e293b',
            borderLeft: '4px solid var(--accent-amber)',
            padding: '18px 22px',
            borderRadius: '6px',
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#cbd5e1',
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)'
            }}>
              "At approximately 11:47 PM, Timothy Vance vanishes from a 4th-floor penthouse locked from the inside.
              No forced entry. Windows intact. Four persons had access. Contradictions hide in their sworn statements.
              Reconstruct the true timeline, expose the locked-room mechanism, and indict the real mastermind."
            </p>
            <div style={{
              display: 'flex',
              gap: '24px',
              marginTop: '14px',
              fontSize: '0.85rem',
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span>DIFFICULTY: <strong style={{ color: '#f87171' }}>{caseBundle.case.difficulty}</strong></span>
              <span>TIME: <strong>{caseBundle.case.estimatedTime}</strong></span>
              <span>SCENES: <strong>6 Explorable</strong></span>
              <span>SUSPECTS: <strong>4 Persons of Interest</strong></span>
            </div>
          </div>

          {/* Action Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '1.1rem', padding: '14px 28px', justifyContent: 'center' }}
              onClick={handleStartNew}
            >
              <Play size={20} />
              <span>Begin New Investigation</span>
            </button>

            {hasProgress && (
              <button
                className="btn-secondary"
                style={{ fontSize: '1rem', padding: '12px 24px', justifyContent: 'center', borderColor: 'var(--accent-cyan)' }}
                onClick={handleResume}
              >
                <Clock size={18} color="var(--accent-cyan)" />
                <span>Resume Investigation (Time: {Math.floor(gameState.playtimeSeconds / 60)}m, Clues: {gameState.discoveredEvidenceIds.length})</span>
              </button>
            )}

            <button
              className="btn-secondary"
              style={{ fontSize: '0.95rem', padding: '10px 20px', justifyContent: 'center' }}
              onClick={() => setShowManual(true)}
            >
              <HelpCircle size={18} />
              <span>Detective's Operational Manual & Rules</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          background: '#090d16',
          borderTop: '1px solid #1e293b',
          padding: '12px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <span>DATABASE: SQLite WAL Engine Active</span>
          <span>ANTIGRAVITY INVESTIGATION ENGINE v1.0</span>
        </div>
      </div>

      {/* Manual Modal */}
      {showManual && (
        <div className="modal-overlay" onClick={() => setShowManual(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield color="var(--accent-amber)" /> Detective's Operational Manual
              </h2>
              <button className="icon-btn" onClick={() => setShowManual(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: 1.6, color: '#cbd5e1' }}>
              <div>
                <h3 style={{ color: 'var(--accent-red)', fontSize: '1.05rem', marginBottom: '4px' }}>
                  1. Scene Investigation & Inspection
                </h3>
                <p>
                  Explore 6 distinct locations (Apartment 4B, 4th Floor Corridor, Lobby, Security Room, Rooftop Terrace, and Underground Parking).
                  Click on hotspot markers to inspect physical items, documents, and digital terminals.
                  Not every item is relevant; watch out for red herrings!
                </p>
              </div>

              <div>
                <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem', marginBottom: '4px' }}>
                  2. Interrogation & Contradiction System
                </h3>
                <p>
                  Each of the four suspects provides a sworn statement. Some are partially true; some contain carefully hidden lies.
                  When you discover evidence that refutes a suspect's claim (e.g. CCTV logs, parking tickets, chemical analysis),
                  confront them using the <strong>"Challenge Statement with Evidence"</strong> feature.
                  Exposing contradictions forces confessions and unlocks vital testimony clues!
                </p>
              </div>

              <div>
                <h3 style={{ color: 'var(--accent-amber)', fontSize: '1.05rem', marginBottom: '4px' }}>
                  3. Timeline Reconstruction
                </h3>
                <p>
                  The critical hour spans from 10:45 PM to 12:15 AM.
                  The initial 11:47 PM panic alarm is not what it seems. As you uncover evidence,
                  the true sequence of events will fall into place.
                </p>
              </div>

              <div>
                <h3 style={{ color: 'var(--accent-emerald)', fontSize: '1.05rem', marginBottom: '4px' }}>
                  4. The Visual Evidence Board & Detective Notes
                </h3>
                <p>
                  Pin suspects and evidence cards to the conspiracy corkboard. Draw connection strings to map motives,
                  alibis, and physical links. Maintain your own running theories in the built-in Leather Notebook.
                </p>
              </div>

              <div>
                <h3 style={{ color: '#f43f5e', fontSize: '1.05rem', marginBottom: '4px' }}>
                  5. The Final Indictment & Multiple Endings
                </h3>
                <p>
                  When ready, submit your formal case resolution. You must answer:
                  <strong> Who? What happened? How was the locked room bypassed? Why?</strong> and select the supporting evidence.
                  Your deduction is evaluated against the case truth, leading to one of five distinct outcomes.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setShowManual(false)}>
                Understood, Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
