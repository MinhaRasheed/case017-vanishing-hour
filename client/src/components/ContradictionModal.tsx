import React, { useState } from 'react';
import { useGame } from '../game/state/GameStateContext';
import { SuspectProfile, EvidenceItem } from '../game/state/types';
import {
  AlertOctagon,
  Search,
  CheckCircle,
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ContradictionModalProps {
  suspect: SuspectProfile;
  onClose: () => void;
}

export const ContradictionModal: React.FC<ContradictionModalProps> = ({ suspect, onClose }) => {
  const { gameState, caseBundle, presentEvidence } = useGame();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [outcome, setOutcome] = useState<{
    tested: boolean;
    isContradiction: boolean;
    response: string;
    unlockedClueId?: string;
  } | null>(null);

  const discoveredEvidence = caseBundle.evidence.filter(e =>
    gameState.discoveredEvidenceIds.includes(e.id)
  );

  const handleChallenge = () => {
    if (!selectedEvidenceId) return;
    const res = presentEvidence(suspect.id, selectedEvidenceId);
    setOutcome({
      tested: true,
      isContradiction: res.isContradiction,
      response: res.response,
      unlockedClueId: res.unlockedClueId
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <AlertOctagon size={18} /> FORMAL CONTRADICTION CHALLENGE
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800', marginTop: '4px' }}>
              Challenge Sworn Testimony: {suspect.name}
            </h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Suspect's Sworn Claim */}
        <div style={{
          background: '#0a0d14',
          borderLeft: '4px solid var(--accent-red)',
          padding: '16px 20px',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginBottom: '4px' }}>
            SUSPECT'S CURRENT SWORN ALIBI STATEMENT:
          </div>
          <p style={{ fontStyle: 'italic', color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6 }}>
            "{suspect.initialStatement}"
          </p>
        </div>

        {/* Outcome Display if already challenged */}
        {outcome && (
          <div style={{
            background: outcome.isContradiction ? 'rgba(230, 57, 70, 0.15)' : 'rgba(30, 41, 59, 0.5)',
            border: outcome.isContradiction ? '2px solid var(--accent-red)' : '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '18px 20px',
            marginBottom: '24px',
            animation: 'fadeInModal 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={`stamp ${outcome.isContradiction ? 'stamp-red' : 'stamp-amber'}`}>
                {outcome.isContradiction ? 'CONTRADICTION EXPOSED!' : 'CHALLENGE DEFLECTED'}
              </span>
            </div>

            <div style={{ fontSize: '1rem', lineHeight: 1.6, color: '#f8fafc', whiteSpace: 'pre-line' }}>
              {outcome.response}
            </div>

            {outcome.isContradiction && outcome.unlockedClueId && (
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '6px',
                color: 'var(--accent-emerald)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                <span>New sworn admission cataloged in your Evidence Locker!</span>
              </div>
            )}
          </div>
        )}

        {/* Evidence Selection Locker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600', marginBottom: '10px' }}>
            Select corroborating evidence to present against this statement:
          </label>

          {discoveredEvidence.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              You have not discovered any evidence yet. Investigate crime scenes first!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '10px',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '4px'
            }}>
              {discoveredEvidence.map(ev => {
                const isSelected = selectedEvidenceId === ev.id;
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setSelectedEvidenceId(ev.id);
                      setOutcome(null);
                    }}
                    style={{
                      background: isSelected ? 'var(--accent-red)' : 'var(--bg-primary)',
                      border: isSelected ? '1px solid #fff' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{
                      fontSize: '0.7rem',
                      color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase'
                    }}>
                      {ev.category}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: isSelected ? '#fff' : '#e2e8f0',
                      marginTop: '2px'
                    }}>
                      {ev.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose}>
            {outcome?.isContradiction ? 'Conclude Inquiry' : 'Cancel'}
          </button>
          <button
            className="btn-primary"
            disabled={!selectedEvidenceId}
            onClick={handleChallenge}
            style={{ opacity: selectedEvidenceId ? 1 : 0.5 }}
          >
            <span>Confront Suspect with Evidence</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
