import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { SuspectProfile, DialogueTopic } from '../game/state/types';
import { ContradictionModal } from './ContradictionModal';
import { CharacterPortrait } from './graphics/CharacterPortraits';
import {
  Users,
  MessageSquare,
  AlertOctagon,
  ShieldAlert,
  User,
  CheckCircle,
  HelpCircle,
  Lock,
  ChevronRight
} from 'lucide-react';

export const SuspectInterrogation: React.FC = () => {
  const { gameState, caseBundle, setSuspect, unlockDialogueTopic } = useGame();
  const [activeTopic, setActiveTopic] = useState<DialogueTopic | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const activeSuspectId = gameState.currentSuspectId || caseBundle.suspects[0].id;
  const currentSuspect: SuspectProfile =
    caseBundle.suspects.find(s => s.id === activeSuspectId) || caseBundle.suspects[0];

  const dialogueTree = (caseBundle.dialogue as any)[currentSuspect.id];

  const solvedContradictions = currentSuspect.contradictions.filter(c =>
    gameState.revealedContradictionIds.includes(c.id)
  );

  const handleSelectSuspect = (suspectId: string) => {
    setSuspect(suspectId);
    setActiveTopic(null);
  };

  const handleSelectTopic = (topic: DialogueTopic) => {
    setActiveTopic(topic);
    unlockDialogueTopic(topic.id);
  };

  return (
    <div className="case-content">
      {/* Suspect Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {caseBundle.suspects.map(suspect => {
          const isSelected = suspect.id === currentSuspect.id;
          const contrasCount = suspect.contradictions.filter(c =>
            gameState.revealedContradictionIds.includes(c.id)
          ).length;

          return (
            <button
              key={suspect.id}
              onClick={() => handleSelectSuspect(suspect.id)}
              style={{
                background: isSelected ? 'var(--accent-red)' : 'var(--bg-card)',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                border: isSelected ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Users size={16} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{suspect.name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{suspect.occupation}</div>
              </div>
              {contrasCount > 0 && (
                <span className="stamp stamp-red" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                  {contrasCount} LIES EXPOSED
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interrogation Screen Grid */}
      <div className="grid-2">
        {/* Left Column: Suspect Dossier & Sworn Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Suspect Profile Card */}
          <div className="detective-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
            <div className="card-header-styled">
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
                SUSPECT DOSSIER // INTERROGATION ROOM 03
              </span>
              <span className="stamp stamp-amber">Age {currentSuspect.age}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
              <CharacterPortrait
                id={currentSuspect.id}
                size={120}
                statusBadge={solvedContradictions.length > 0 ? 'ALIBI SHATTERED' : 'UNDER INQUIRY'}
              />
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: '800' }}>{currentSuspect.name}</h2>
                <div style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>
                  {currentSuspect.occupation}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  Relation: {currentSuspect.relation}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '12px' }}>
              <strong>Personality / Demeanor:</strong> {currentSuspect.personality}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              <strong>Background:</strong> {currentSuspect.background}
            </p>

            <div style={{
              background: '#0a0d14',
              border: '1px solid #1e293b',
              padding: '12px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}>
              <strong style={{ color: 'var(--accent-amber)' }}>Potential Motive:</strong>
              <p style={{ color: '#cbd5e1', marginTop: '4px' }}>{currentSuspect.motive}</p>
            </div>
          </div>

          {/* Sworn Alibi Statement */}
          <div className="detective-card">
            <div className="card-header-styled">
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                SWORN DEPOSITION // ALIBI STATEMENT
              </span>
              <span className="stamp stamp-cyan">RECORDED 12:10 AM</span>
            </div>

            <blockquote style={{
              borderLeft: '3px solid var(--accent-cyan)',
              paddingLeft: '14px',
              fontStyle: 'italic',
              color: '#e2e8f0',
              lineHeight: 1.6,
              fontSize: '0.95rem',
              marginBottom: '18px'
            }}>
              "{currentSuspect.initialStatement}"
            </blockquote>

            {/* Prominent Challenge Button */}
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
              onClick={() => setShowChallengeModal(true)}
            >
              <AlertOctagon size={18} />
              <span>Challenge Statement with Evidence</span>
            </button>
          </div>

          {/* Solved Contradictions / Confessions List */}
          {solvedContradictions.length > 0 && (
            <div className="detective-card" style={{ border: '1px solid var(--accent-red)' }}>
              <div className="card-header-styled">
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
                  EXPOSED LIES & REVISED CONFESSIONS ({solvedContradictions.length})
                </span>
                <CheckCircle size={16} color="var(--accent-red)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {solvedContradictions.map(contra => (
                  <div key={contra.id} style={{ background: '#0a0d14', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
                    <div style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                      Disproved Claim: "{contra.statementQuote}"
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      "{contra.responseConfession}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Dialogue Console */}
        <div className="detective-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '520px' }}>
          <div>
            <div className="card-header-styled">
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
                TRANSCRIPTION CONSOLE // RECORDING ACTIVE
              </span>
              <MessageSquare size={16} color="var(--accent-amber)" />
            </div>

            {/* Suspect Greeting */}
            <div style={{
              background: '#0a0d14',
              border: '1px solid #1e293b',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                {currentSuspect.name.toUpperCase()}:
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{dialogueTree?.greeting || 'I have nothing further to state without legal counsel.'}"
              </p>
            </div>

            {/* Active Dialogue Response Box */}
            {activeTopic && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                animation: 'fadeInModal 0.2s ease-out'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '6px' }}>
                  Detective: "{activeTopic.label}"
                </div>
                <div style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {currentSuspect.name}: "{activeTopic.response}"
                </div>
              </div>
            )}
          </div>

          {/* Dialogue Tree Options */}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '10px' }}>
              Interrogation Inquiries:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dialogueTree?.topics.map((topic: DialogueTopic) => {
                const isLocked = topic.requiresClueId && !gameState.discoveredEvidenceIds.includes(topic.requiresClueId);
                const isSelected = activeTopic?.id === topic.id;

                if (isLocked) {
                  return (
                    <div
                      key={topic.id}
                      style={{
                        padding: '10px 14px',
                        background: '#0d111a',
                        border: '1px dashed #273142',
                        borderRadius: '6px',
                        color: 'var(--text-faint)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={14} /> Topic locked (Requires investigating related crime scene)
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-primary)',
                      color: isSelected ? '#000' : '#e2e8f0',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{topic.label}</span>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contradiction Modal */}
      {showChallengeModal && (
        <ContradictionModal
          suspect={currentSuspect}
          onClose={() => setShowChallengeModal(false)}
        />
      )}
    </div>
  );
};
